"""Claims router — submit, evaluate, and retrieve insurance claims."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone

from database.postgres import get_db
from database.mongodb import disruption_events, claim_audit_logs
from models.worker import Worker
from models.claim import Claim, ClaimCreate, ClaimOut, ClaimStatus
from services.efficiency_engine import is_eligible, calculate_payout
from services.fraud_detection import score_claim, is_fraudulent
import uuid

router = APIRouter()


@router.post("/submit", response_model=ClaimOut, status_code=201)
async def submit_claim(payload: ClaimCreate, db: AsyncSession = Depends(get_db)):
    # 1. Fetch worker
    result = await db.execute(select(Worker).where(Worker.id == payload.worker_id))
    worker = result.scalar_one_or_none()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    # 2. Check for a confirmed disruption in MongoDB (last 4 hours)
    col = disruption_events()
    recent_event = await col.find_one(
        {"type": payload.disruption_type.value, "confirmed": True},
        sort=[("created_at", -1)],
    )
    disruption_confirmed = recent_event is not None
    event_id = recent_event["_id"] if recent_event else None

    # 3. Eligibility check via Efficiency Engine
    eligibility = is_eligible(worker, payload.actual_earnings, disruption_confirmed)

    # 4. Fraud scoring (stub values for route deviation — would come from GPS in production)
    fraud_score = score_claim(
        claim_frequency_ratio=0.1,      # TODO: compute from DB history
        route_deviation_score=0.05,     # TODO: compare GPS vs frozen snapshot
        efficiency_drop_speed=max(0.0, eligibility["threshold"] - eligibility["efficiency"]),
        performance_score=worker.performance_score,
    )

    # 5. Build claim record
    status = ClaimStatus.PENDING
    payout = 0.0

    if not eligibility["eligible"]:
        status = ClaimStatus.REJECTED
    elif is_fraudulent(fraud_score):
        status = ClaimStatus.REJECTED
    else:
        payout = calculate_payout(
            payload.disruption_type.value,
            eligibility["expected"],
            payload.actual_earnings,
        )
        status = ClaimStatus.APPROVED

    claim = Claim(
        id=str(uuid.uuid4()),
        worker_id=payload.worker_id,
        disruption_type=payload.disruption_type,
        disruption_event_id=event_id,
        efficiency_score=eligibility["efficiency"],
        expected_earnings=eligibility["expected"],
        actual_earnings=payload.actual_earnings,
        payout_amount=payout,
        status=status,
        fraud_score=fraud_score,
    )
    if status in (ClaimStatus.APPROVED, ClaimStatus.REJECTED):
        claim.resolved_at = datetime.now(timezone.utc)

    db.add(claim)
    await db.commit()
    await db.refresh(claim)

    # 6. Audit log in MongoDB
    audit_col = claim_audit_logs()
    await audit_col.insert_one({
        "_id": str(uuid.uuid4()),
        "claim_id": claim.id,
        "worker_id": payload.worker_id,
        "eligibility": eligibility,
        "fraud_score": fraud_score,
        "status": status.value,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })

    return claim


@router.get("/{claim_id}", response_model=ClaimOut)
async def get_claim(claim_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Claim).where(Claim.id == claim_id))
    claim = result.scalar_one_or_none()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim


@router.get("/worker/{worker_id}", response_model=list[ClaimOut])
async def get_worker_claims(worker_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Claim).where(Claim.worker_id == worker_id).order_by(Claim.created_at.desc())
    )
    return result.scalars().all()


@router.get("/", response_model=list[ClaimOut])
async def list_claims(status: str = None, limit: int = 50, db: AsyncSession = Depends(get_db)):
    query = select(Claim).order_by(Claim.created_at.desc()).limit(limit)
    if status:
        query = query.where(Claim.status == status)
    result = await db.execute(query)
    return result.scalars().all()

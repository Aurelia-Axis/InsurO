"""Workers router — registration, profile, baseline management."""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from database.postgres import get_db
from models.worker import Worker, WorkerCreate, WorkerOut

router = APIRouter()


@router.post("/", response_model=WorkerOut, status_code=201)
async def register_worker(payload: WorkerCreate, db: AsyncSession = Depends(get_db)):
    worker = Worker(**payload.model_dump())

    # Set weekly premium based on risk zone
    premium_map = {"low": 20.0, "medium": 25.0, "high": 30.0}
    worker.premium_weekly = premium_map.get(worker.risk_zone.value, 25.0)

    db.add(worker)
    await db.commit()
    await db.refresh(worker)
    return worker


@router.get("/{worker_id}", response_model=WorkerOut)
async def get_worker(worker_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Worker).where(Worker.id == worker_id))
    worker = result.scalar_one_or_none()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")
    return worker


@router.get("/", response_model=list[WorkerOut])
async def list_workers(skip: int = 0, limit: int = 50, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Worker).offset(skip).limit(limit))
    return result.scalars().all()


@router.patch("/{worker_id}/baseline")
async def update_baseline(
    worker_id: str,
    baseline_earnings: float,
    db: AsyncSession = Depends(get_db),
):
    """Update worker's personal earnings baseline (called weekly by the system)."""
    result = await db.execute(select(Worker).where(Worker.id == worker_id))
    worker = result.scalar_one_or_none()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    worker.baseline_earnings = baseline_earnings
    worker.weeks_active += 1
    await db.commit()
    return {"message": "Baseline updated", "weeks_active": worker.weeks_active}

"""
Payouts router — triggers Razorpay instant payout for approved claims.
API failures queue the claim rather than reject it.
"""

import os
import razorpay
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from datetime import datetime, timezone
from dotenv import load_dotenv

from database.postgres import get_db
from models.claim import Claim, ClaimStatus

load_dotenv()

router = APIRouter()

razorpay_client = razorpay.Client(
    auth=(
        os.getenv("RAZORPAY_KEY_ID", "rzp_test_placeholder"),
        os.getenv("RAZORPAY_KEY_SECRET", "placeholder"),
    )
)


@router.post("/{claim_id}/trigger")
async def trigger_payout(claim_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Claim).where(Claim.id == claim_id))
    claim = result.scalar_one_or_none()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    if claim.status != ClaimStatus.APPROVED:
        raise HTTPException(status_code=400, detail=f"Claim status is '{claim.status.value}', not approved")

    # Fetch worker for UPI ID
    from models.worker import Worker
    w_result = await db.execute(select(Worker).where(Worker.id == claim.worker_id))
    worker = w_result.scalar_one_or_none()
    if not worker:
        raise HTTPException(status_code=404, detail="Worker not found")

    payout_amount_paise = int(claim.payout_amount * 100)  # Razorpay uses paise

    try:
        payout_response = razorpay_client.payout.create({
            "account_number": "2323230076091915",  # Fund account (set in Razorpay dashboard)
            "fund_account": {
                "account_type": "vpa",
                "vpa": {"address": worker.upi_id},
                "contact": {
                    "name":    worker.name,
                    "contact": worker.phone,
                    "type":    "employee",
                },
            },
            "amount":   payout_amount_paise,
            "currency": "INR",
            "mode":     "UPI",
            "purpose":  "payout",
            "narration": f"InsureO claim {claim_id[:8]}",
        })

        claim.razorpay_payout_id = payout_response.get("id")
        claim.status = ClaimStatus.PAID
        claim.resolved_at = datetime.now(timezone.utc)
        await db.commit()
        return {"status": "paid", "razorpay_id": claim.razorpay_payout_id, "amount": claim.payout_amount}

    except Exception as exc:
        # API failure → queue instead of reject
        claim.status = ClaimStatus.QUEUED
        await db.commit()
        return {
            "status": "queued",
            "message": "Razorpay API error — claim queued for retry.",
            "error": str(exc),
        }


@router.get("/queued")
async def get_queued_payouts(db: AsyncSession = Depends(get_db)):
    """Admin endpoint to view and retry queued payouts."""
    result = await db.execute(select(Claim).where(Claim.status == ClaimStatus.QUEUED))
    return result.scalars().all()

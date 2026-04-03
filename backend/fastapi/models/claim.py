"""ORM + Pydantic schemas for insurance claims."""

from sqlalchemy import Column, String, Float, DateTime, Enum as SAEnum, ForeignKey
from sqlalchemy.sql import func
from database.postgres import Base
from pydantic import BaseModel
from datetime import datetime
from enum import Enum
import uuid


class DisruptionType(str, Enum):
    TRAFFIC    = "traffic"
    WEATHER    = "weather"
    ALGORITHM  = "algorithm"
    RESTAURANT = "restaurant"


class ClaimStatus(str, Enum):
    PENDING   = "pending"
    APPROVED  = "approved"
    REJECTED  = "rejected"
    PAID      = "paid"
    QUEUED    = "queued"  # API failure fallback


# ---------- ORM ----------

class Claim(Base):
    __tablename__ = "claims"

    id                = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    worker_id         = Column(String, ForeignKey("workers.id"), nullable=False)
    disruption_type   = Column(SAEnum(DisruptionType), nullable=False)
    disruption_event_id = Column(String, nullable=True)     # Mongo reference
    efficiency_score  = Column(Float, nullable=False)       # must be < 0.5
    expected_earnings = Column(Float, nullable=False)       # ₹
    actual_earnings   = Column(Float, nullable=False)       # ₹
    payout_amount     = Column(Float, nullable=True)        # ₹ calculated
    status            = Column(SAEnum(ClaimStatus), default=ClaimStatus.PENDING)
    razorpay_payout_id = Column(String, nullable=True)
    fraud_score       = Column(Float, default=0.0)          # 0 = clean, 1 = suspicious
    created_at        = Column(DateTime(timezone=True), server_default=func.now())
    resolved_at       = Column(DateTime(timezone=True), nullable=True)


# ---------- Pydantic ----------

class ClaimCreate(BaseModel):
    worker_id:        str
    disruption_type:  DisruptionType
    actual_earnings:  float


class ClaimOut(BaseModel):
    id:                  str
    worker_id:           str
    disruption_type:     DisruptionType
    efficiency_score:    float
    expected_earnings:   float
    actual_earnings:     float
    payout_amount:       float | None
    status:              ClaimStatus
    fraud_score:         float
    created_at:          datetime
    resolved_at:         datetime | None

    class Config:
        from_attributes = True

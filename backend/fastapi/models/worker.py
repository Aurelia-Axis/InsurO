"""SQLAlchemy ORM model + Pydantic schemas for a gig delivery worker."""

from sqlalchemy import Column, String, Float, Integer, DateTime, Enum as SAEnum
from sqlalchemy.sql import func
from database.postgres import Base
from pydantic import BaseModel, EmailStr
from datetime import datetime
from enum import Enum
import uuid


class RiskZone(str, Enum):
    LOW    = "low"
    MEDIUM = "medium"
    HIGH   = "high"


class Platform(str, Enum):
    SWIGGY  = "swiggy"
    ZOMATO  = "zomato"
    DUNZO   = "dunzo"
    BLINKIT = "blinkit"


# ---------- ORM ----------

class Worker(Base):
    __tablename__ = "workers"

    id                  = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name                = Column(String, nullable=False)
    phone               = Column(String, unique=True, nullable=False)
    upi_id              = Column(String, nullable=False)
    platform            = Column(SAEnum(Platform), nullable=False)
    city                = Column(String, nullable=False, default="Bhubaneswar")
    risk_zone           = Column(SAEnum(RiskZone), nullable=False, default=RiskZone.MEDIUM)
    weeks_active        = Column(Integer, default=0)
    baseline_earnings   = Column(Float, default=0.0)   # expected daily earnings (₹)
    performance_score   = Column(Float, default=1.0)   # fraud scoring baseline
    premium_weekly      = Column(Float, default=25.0)  # ₹20–30 based on risk zone
    created_at          = Column(DateTime(timezone=True), server_default=func.now())


# ---------- Pydantic ----------

class WorkerCreate(BaseModel):
    name:     str
    phone:    str
    upi_id:   str
    platform: Platform
    city:     str = "Bhubaneswar"
    risk_zone: RiskZone = RiskZone.MEDIUM


class WorkerOut(BaseModel):
    id:                 str
    name:               str
    phone:              str
    upi_id:             str
    platform:           Platform
    city:               str
    risk_zone:          RiskZone
    weeks_active:       int
    baseline_earnings:  float
    performance_score:  float
    premium_weekly:     float
    created_at:         datetime

    class Config:
        from_attributes = True

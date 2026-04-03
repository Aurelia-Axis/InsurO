"""Pydantic schemas for disruption events (stored in MongoDB)."""

from pydantic import BaseModel
from datetime import datetime
from enum import Enum


class DisruptionType(str, Enum):
    TRAFFIC    = "traffic"
    WEATHER    = "weather"
    ALGORITHM  = "algorithm"
    RESTAURANT = "restaurant"


class TrafficDisruption(BaseModel):
    city:           str
    zone:           str
    congestion_pct: float          # % of roads affected
    route_frozen:   bool = True    # snapshot locked at dispatch
    timestamp:      datetime = None


class WeatherDisruption(BaseModel):
    city:          str
    rainfall_mm:   float           # >100mm triggers coverage
    alert_level:   str             # advisory / warning / severe
    timestamp:     datetime = None


class AlgorithmDisruption(BaseModel):
    platform:             str
    orders_platform:      int      # orders on affected platform
    orders_competitors:   int      # orders on other platforms
    restaurant_active:    bool     # restaurants are active?
    timestamp:            datetime = None


class RestaurantDisruption(BaseModel):
    restaurant_id:    str
    avg_prep_time:    float        # minutes
    actual_prep_time: float        # minutes
    tolerance_buffer: float = 1.5  # 1.5x avg_prep_time
    timestamp:        datetime = None


class DisruptionOut(BaseModel):
    id:             str
    type:           DisruptionType
    city:           str
    confirmed:      bool
    severity:       str
    created_at:     datetime

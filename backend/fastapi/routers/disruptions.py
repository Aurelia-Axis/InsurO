"""Disruptions router — ingest and validate external disruption events."""

from fastapi import APIRouter
from datetime import datetime, timezone

from database.mongodb import disruption_events
from models.disruption import (
    TrafficDisruption, WeatherDisruption,
    AlgorithmDisruption, RestaurantDisruption, DisruptionType,
)
from services.disruption_detector import (
    check_traffic, check_weather, check_algorithm, check_restaurant,
)
import uuid

router = APIRouter()


async def _store_event(dtype: str, city: str, confirmed: bool, severity: str, detail: str) -> str:
    doc = {
        "_id":       str(uuid.uuid4()),
        "type":      dtype,
        "city":      city,
        "confirmed": confirmed,
        "severity":  severity,
        "detail":    detail,
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    col = disruption_events()
    await col.insert_one(doc)
    return doc["_id"]


@router.post("/traffic")
async def report_traffic(event: TrafficDisruption):
    event.timestamp = event.timestamp or datetime.now(timezone.utc)
    result = check_traffic(event)
    event_id = await _store_event(
        "traffic", event.city, result["confirmed"], result["severity"], result["detail"]
    )
    return {"event_id": event_id, **result}


@router.post("/weather")
async def report_weather(event: WeatherDisruption):
    event.timestamp = event.timestamp or datetime.now(timezone.utc)
    result = check_weather(event)
    event_id = await _store_event(
        "weather", event.city, result["confirmed"], result["severity"], result["detail"]
    )
    return {"event_id": event_id, **result}


@router.post("/algorithm")
async def report_algorithm(event: AlgorithmDisruption):
    event.timestamp = event.timestamp or datetime.now(timezone.utc)
    result = check_algorithm(event)
    event_id = await _store_event(
        "algorithm", event.platform, result["confirmed"], result["severity"], result["detail"]
    )
    return {"event_id": event_id, **result}


@router.post("/restaurant")
async def report_restaurant(event: RestaurantDisruption):
    event.timestamp = event.timestamp or datetime.now(timezone.utc)
    result = check_restaurant(event)
    event_id = await _store_event(
        "restaurant", "N/A", result["confirmed"], result["severity"], result["detail"]
    )
    return {"event_id": event_id, **result}


@router.get("/active")
async def get_active_disruptions(city: str = None, limit: int = 20):
    """Return recent confirmed disruptions (last 100) optionally filtered by city."""
    col = disruption_events()
    query = {"confirmed": True}
    if city:
        query["city"] = city
    cursor = col.find(query).sort("created_at", -1).limit(limit)
    events = await cursor.to_list(length=limit)
    for e in events:
        e["id"] = e.pop("_id")
    return events

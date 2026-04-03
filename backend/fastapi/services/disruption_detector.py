"""
Disruption Detector
===================
Checks each of the 4 disruption types and returns a confirmed/severity verdict.

Real implementations would call:
  - Google Maps / HERE API for traffic
  - OpenWeatherMap for rainfall
  - Platform partner APIs for algorithm signals
  - Internal POS / partner data for restaurant prep times

For hackathon stage, payloads are passed in directly.
"""

from models.disruption import (
    TrafficDisruption, WeatherDisruption,
    AlgorithmDisruption, RestaurantDisruption,
)


def check_traffic(event: TrafficDisruption) -> dict:
    """
    Confirmed if congestion > 40% of zone routes are affected.
    Route snapshot is frozen at dispatch to prevent manipulation.
    """
    confirmed = event.congestion_pct >= 40.0
    severity  = "high" if event.congestion_pct >= 70 else ("medium" if confirmed else "low")
    return {
        "confirmed": confirmed,
        "severity": severity,
        "route_frozen": event.route_frozen,
        "detail": f"Congestion at {event.congestion_pct}% in {event.zone}",
    }


def check_weather(event: WeatherDisruption) -> dict:
    """
    Confirmed if rainfall > 100mm.
    Workers who ignored advisory warnings still qualify if efficiency drops.
    """
    confirmed = event.rainfall_mm >= 100.0
    severity  = "high" if event.rainfall_mm >= 150 else ("medium" if confirmed else "low")
    return {
        "confirmed": confirmed,
        "severity": severity,
        "advisory_only": event.alert_level == "advisory",
        "detail": f"Rainfall {event.rainfall_mm}mm — advisory: {event.alert_level}",
    }


def check_algorithm(event: AlgorithmDisruption) -> dict:
    """
    Two-layer demand validation:
    Layer 1: affected platform orders << competitor orders
    Layer 2: restaurants are still active (so demand exists, platform withheld)
    """
    platform_drop = (
        event.orders_competitors > 0
        and (event.orders_platform / event.orders_competitors) < 0.4
    )
    confirmed = platform_drop and event.restaurant_active
    severity  = "high" if confirmed and (event.orders_platform / max(event.orders_competitors, 1)) < 0.2 else (
                "medium" if confirmed else "low")
    return {
        "confirmed": confirmed,
        "severity": severity,
        "platform_drop": platform_drop,
        "restaurants_active": event.restaurant_active,
        "detail": (
            f"Platform {event.platform}: {event.orders_platform} orders vs "
            f"competitors: {event.orders_competitors}"
        ),
    }


def check_restaurant(event: RestaurantDisruption) -> dict:
    """
    Genuine delay = actual prep time > 1.5× average prep time.
    Buffer separates normal variation from compensable delays.
    """
    tolerance = event.avg_prep_time * event.tolerance_buffer
    confirmed = event.actual_prep_time > tolerance
    severity  = "high" if event.actual_prep_time > tolerance * 1.5 else ("medium" if confirmed else "low")
    return {
        "confirmed": confirmed,
        "severity": severity,
        "tolerance_minutes": round(tolerance, 1),
        "detail": (
            f"Prep time {event.actual_prep_time}min vs tolerance {tolerance:.1f}min "
            f"(avg {event.avg_prep_time}min × {event.tolerance_buffer})"
        ),
    }

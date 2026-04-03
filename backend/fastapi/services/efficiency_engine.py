"""
Earning Efficiency Engine
=========================
Core formula: efficiency = actual_earnings / expected_earnings

Trigger payout when efficiency < threshold AND a disruption is confirmed.

Cold-start thresholds:
  Weeks 1–2 : city-level average baseline, threshold 0.40
  Weeks 3–4 : 60% city avg + 40% personal data, threshold 0.45
  Week  5+  : full personal baseline, threshold 0.50
"""

from models.worker import Worker


COLD_START_THRESHOLDS = {
    "early":  {"weeks": (1, 2), "threshold": 0.40, "blend_city": 1.0},
    "mid":    {"weeks": (3, 4), "threshold": 0.45, "blend_city": 0.60},
    "stable": {"weeks": (5,),   "threshold": 0.50, "blend_city": 0.00},
}

# Rough city-level daily averages (₹) per platform in Bhubaneswar
CITY_AVERAGES = {
    "swiggy":  700.0,
    "zomato":  680.0,
    "dunzo":   650.0,
    "blinkit": 720.0,
}

# Payout ratios per disruption type
PAYOUT_RATIOS = {
    "traffic":    0.70,
    "weather":    0.80,
    "algorithm":  0.65,
    "restaurant": 0.60,
}


def get_threshold_and_expected(worker: Worker) -> tuple[float, float]:
    """Return (efficiency_threshold, expected_earnings) for this worker."""
    weeks = worker.weeks_active
    city_avg = CITY_AVERAGES.get(worker.platform.value, 680.0)

    if weeks <= 2:
        stage = COLD_START_THRESHOLDS["early"]
        expected = city_avg
    elif weeks <= 4:
        stage = COLD_START_THRESHOLDS["mid"]
        personal = worker.baseline_earnings if worker.baseline_earnings > 0 else city_avg
        expected = 0.60 * city_avg + 0.40 * personal
    else:
        stage = COLD_START_THRESHOLDS["stable"]
        expected = worker.baseline_earnings if worker.baseline_earnings > 0 else city_avg

    return stage["threshold"], expected


def calculate_efficiency(actual: float, expected: float) -> float:
    """Return efficiency score (0–1). Clamped to [0, 1]."""
    if expected <= 0:
        return 1.0
    return min(max(actual / expected, 0.0), 1.0)


def calculate_payout(disruption_type: str, expected: float, actual: float) -> float:
    """Calculate payout in ₹ based on disruption type and loss magnitude."""
    loss = max(expected - actual, 0.0)
    ratio = PAYOUT_RATIOS.get(disruption_type, 0.65)
    return round(loss * ratio, 2)


def is_eligible(worker: Worker, actual_earnings: float, disruption_confirmed: bool) -> dict:
    """
    Returns eligibility dict:
      { eligible, efficiency, threshold, expected, payout_amount, reason }
    """
    threshold, expected = get_threshold_and_expected(worker)
    efficiency = calculate_efficiency(actual_earnings, expected)

    if not disruption_confirmed:
        return {
            "eligible": False,
            "efficiency": efficiency,
            "threshold": threshold,
            "expected": expected,
            "payout_amount": 0.0,
            "reason": "No confirmed external disruption.",
        }

    if efficiency >= threshold:
        return {
            "eligible": False,
            "efficiency": efficiency,
            "threshold": threshold,
            "expected": expected,
            "payout_amount": 0.0,
            "reason": f"Efficiency {efficiency:.2f} is above threshold {threshold}.",
        }

    return {
        "eligible": True,
        "efficiency": efficiency,
        "threshold": threshold,
        "expected": expected,
        "payout_amount": 0.0,   # set by caller after fraud check
        "reason": "Eligible: disruption confirmed and efficiency below threshold.",
    }

"""
Fraud Detection Service
=======================
Uses scikit-learn Isolation Forest on worker behavioral features.
Trained incrementally as new claims arrive.

Signals used:
  - claim_frequency_ratio : claims / disruptions in last 30 days
  - route_deviation_score : deviation from frozen snapshot (0–1)
  - efficiency_drop_speed : how fast efficiency fell
  - performance_score     : worker's long-term behavior baseline

Score output: 0.0 = clean, 1.0 = highly suspicious
"""

import numpy as np
from sklearn.ensemble import IsolationForest


# Singleton model — in production, persist with joblib
_model: IsolationForest = None


def _build_default_model() -> IsolationForest:
    """
    Initialize with synthetic clean baseline data.
    Replace with real historical data in production.
    """
    rng = np.random.default_rng(42)
    X_clean = np.column_stack([
        rng.uniform(0.0, 0.3, 500),   # claim_frequency_ratio
        rng.uniform(0.0, 0.2, 500),   # route_deviation_score
        rng.uniform(0.1, 0.5, 500),   # efficiency_drop_speed
        rng.uniform(0.7, 1.0, 500),   # performance_score
    ])
    model = IsolationForest(n_estimators=200, contamination=0.05, random_state=42)
    model.fit(X_clean)
    return model


def get_model() -> IsolationForest:
    global _model
    if _model is None:
        _model = _build_default_model()
    return _model


def score_claim(
    claim_frequency_ratio: float,
    route_deviation_score: float,
    efficiency_drop_speed: float,
    performance_score: float,
) -> float:
    """
    Returns a fraud score 0.0 (clean) to 1.0 (suspicious).
    Isolation Forest anomaly_score is in [-0.5, 0.5]; we normalize.
    """
    model = get_model()
    features = np.array([[
        claim_frequency_ratio,
        route_deviation_score,
        efficiency_drop_speed,
        performance_score,
    ]])
    raw_score = model.decision_function(features)[0]  # more negative = more anomalous
    # Normalize: raw ∈ [-0.5, 0.5] → fraud ∈ [0, 1]
    fraud_score = float(np.clip(0.5 - raw_score, 0.0, 1.0))
    return round(fraud_score, 4)


def is_fraudulent(fraud_score: float, threshold: float = 0.75) -> bool:
    return fraud_score >= threshold


def update_model(new_features: list[list[float]]):
    """
    Retrain the model with new legitimate data points (call periodically).
    In production, use a proper ML pipeline / MLflow.
    """
    global _model
    X = np.array(new_features)
    _model = IsolationForest(n_estimators=200, contamination=0.05, random_state=42)
    _model.fit(X)

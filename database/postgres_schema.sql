-- InsureO PostgreSQL Schema
-- Run against: insureo database
-- Usage: psql -U postgres -d insureo -f postgres_schema.sql

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── Workers ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workers (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name                VARCHAR(100)  NOT NULL,
    phone               VARCHAR(15)   NOT NULL UNIQUE,
    upi_id              VARCHAR(100)  NOT NULL,
    platform            VARCHAR(20)   NOT NULL CHECK (platform IN ('swiggy','zomato','dunzo','blinkit')),
    city                VARCHAR(60)   NOT NULL DEFAULT 'Bhubaneswar',
    risk_zone           VARCHAR(10)   NOT NULL DEFAULT 'medium' CHECK (risk_zone IN ('low','medium','high')),
    weeks_active        INT           NOT NULL DEFAULT 0,
    baseline_earnings   NUMERIC(10,2) NOT NULL DEFAULT 0.00,
    performance_score   NUMERIC(5,4)  NOT NULL DEFAULT 1.0000,
    premium_weekly      NUMERIC(6,2)  NOT NULL DEFAULT 25.00,
    created_at          TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- ─── Claims ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS claims (
    id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    worker_id             UUID          NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    disruption_type       VARCHAR(20)   NOT NULL CHECK (disruption_type IN ('traffic','weather','algorithm','restaurant')),
    disruption_event_id   VARCHAR(100),                  -- MongoDB _id reference
    efficiency_score      NUMERIC(6,4)  NOT NULL,
    expected_earnings     NUMERIC(10,2) NOT NULL,
    actual_earnings       NUMERIC(10,2) NOT NULL,
    payout_amount         NUMERIC(10,2),
    status                VARCHAR(15)   NOT NULL DEFAULT 'pending'
                              CHECK (status IN ('pending','approved','rejected','paid','queued')),
    razorpay_payout_id    VARCHAR(100),
    fraud_score           NUMERIC(6,4)  NOT NULL DEFAULT 0.0,
    created_at            TIMESTAMPTZ   NOT NULL DEFAULT NOW(),
    resolved_at           TIMESTAMPTZ
);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_claims_worker_id  ON claims(worker_id);
CREATE INDEX IF NOT EXISTS idx_claims_status     ON claims(status);
CREATE INDEX IF NOT EXISTS idx_claims_created_at ON claims(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_workers_platform  ON workers(platform);
CREATE INDEX IF NOT EXISTS idx_workers_city      ON workers(city);

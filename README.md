<div align="center">

<img src="InsurO.png" width="400px" alt="InsureO Logo" />

# InsureO

### AI-Powered Parametric Insurance for India's Gig Delivery Workers

*"Where Disruption Meets Protection, and Hustle Never Breaks"*

![Status](https://img.shields.io/badge/Status-Hackathon%20Build-blueviolet?style=flat-square)
![Category](https://img.shields.io/badge/Category-InsurTech%20%2F%20FinTech-orange?style=flat-square)
![Pilot](https://img.shields.io/badge/Pilot%20City-Bhubaneswar-green?style=flat-square)

</div>

---

## The Problem

> **50M+ gig delivery workers in India earn daily with zero financial safety net.**

Every shift, things outside their control silently destroy their income:

| What Hits Them | Real Earning Loss |
|---|---|
| Traffic Jam | 4 deliveries/hr → 1/hr = **Rs.120/hr gone** |
| Heavy Rain | Work stops completely = **Rs.300+ per event** |
| Platform Algorithm Change | Orders drop 75% overnight, no explanation |
| Restaurant Delay | 30-min wait = 1 missed delivery = **Rs.60–80 lost** |

**No insurance product in India addresses this. InsureO does.**

---

## What InsureO Does

InsureO **auto-detects disruptions, verifies the actual earning loss, and triggers instant payouts** — no manual claims, no paperwork, no waiting.

```
Disruption Happens  →  System Detects  →  Loss Verified  →  Payout Sent
```

The system does not ask workers to prove their loss. **It detects it, verifies it, and pays it.**

---

## The Core Engine: Earning Efficiency Model

Most systems ask *"Is there traffic?"* — InsureO asks **"Has this worker's earning ability dropped?"**

```
efficiency = current_earnings / expected_earnings
```

**Payout fires only when BOTH conditions are true:**
1. External disruption confirmed (traffic / weather / algorithm / delay)
2. Worker efficiency drops below **0.5**

| Metric | Normal Day | During Disruption |
|---|---|---|
| Orders/hour | 4 | 1 |
| Earnings/hour | Rs.160 | Rs.40 |
| Efficiency Score | 1.0 | **0.25 → Payout Triggered** |

> This dual-condition model is what separates InsureO from simple traffic-based insurance — it measures **real income impact**, not just road conditions.

---

## Cold Start: New Worker Onboarding

*New workers have zero history. Here's how InsureO handles it:*

| Stage | Baseline Used | Threshold |
|---|---|---|
| Week 1–2 | City-level zone averages | Efficiency < 0.4 (stricter) |
| Week 3–4 | 60% city avg + 40% personal data | Efficiency < 0.45 |
| Week 5+ | Full personal historical baseline | Efficiency < 0.5 (standard) |

Thresholds are stricter during cold start to offset lower baseline confidence — genuine disruptions are still fully covered.

---

## Four Disruptions Covered

### 1. Traffic Congestion

**Detection Logic:**
```
delay_ratio = current_delivery_time / normal_delivery_time

IF delay_ratio > 1.5
AND traffic_level = HIGH
AND efficiency < 0.5
AND route_deviation < 1.3
→ PAYOUT TRIGGERED
```

**Route Snapshot Integrity** *(prevents retroactive fraud)*
At dispatch, the system freezes an immutable route snapshot — origin, destination, optimal path, estimated time, and timestamp. Fraud checks always compare against this frozen record, never a live recalculation.

```
route_snapshot = { delivery_id, optimal_path, estimated_time, dispatched_at }  ← FROZEN

route_deviation = actual_route_time / snapshot.estimated_time
IF deviation > 1.3 AND route was suggested → payout reduced or flagged
```

| Expected | Actual | Loss | Coverage | Payout |
|---|---|---|---|---|
| Rs.160/hr | Rs.40/hr | Rs.120 | 70% | **Rs.84** |

---

### 2. Weather Disruption

**Detection Logic:**
```
IF rainfall > 100mm OR weather alert active
AND worker was active in the affected zone
→ loss = hourly_income × hours_lost
→ payout = loss × 80%
```

**Predictive Alert** *(advisory only — never a condition for payout)*
```
Warning: Heavy rain expected at 7 PM (70% probability)
Predicted income drop: 25% | Suggested: Work early or move to Zone B
```

> A worker who ignores a suggestion and still suffers a real efficiency drop is **fully eligible** for compensation. Alerts exist to help workers earn more — not to create reasons to deny claims.

**API Fallback:** If Weather API goes down → last cached data (30-min window) is used → beyond 30 min, claim enters a **pending queue**, not rejection. Workers are always notified of status.

| Rainfall | Hours Lost | Loss | Coverage | Payout |
|---|---|---|---|---|
| 130mm | 3 hrs | Rs.300 | 80% | **Rs.240** |

---

### 3. Platform Algorithm Disruption

*The invisible disruption. No existing system detects this.*

Zomato, Swiggy, Zepto silently update allocation algorithms. A worker's orders can drop 75% overnight with zero explanation.

**Data Source** *(no platform partnership needed)*
Detection uses worker-side behavioral data — orders received, idle time, earnings per hour — shared through the app. Same principle as fintech apps inferring spending patterns without direct bank API access.

**Detection:**
```python
z_score = (current_orders - historical_mean) / std_dev
IF z_score < -2 AND no weather/traffic active AND demand_signal = CONFIRMED_DROP
→ ALGORITHM DISRUPTION DETECTED
```

**Two-Layer Demand Validation** *(solves the zone-wide drop problem)*

A naive cross-worker check fails when an entire zone is penalised — everyone drops together, so the check sees it as "normal." InsureO uses two layers:

| Layer | What It Checks | What It Confirms |
|---|---|---|
| Cross-platform | Swiggy vs Zomato order volume, same zone/time | If only one platform drops → algorithm change, not demand drop |
| Consumer demand proxy | Restaurant order timestamps + zone activity | If restaurants get orders but workers don't → platform is withholding assignments |

**Isolation Forest Training:** Pre-trained on synthetic data modelled on real gig worker patterns. Retrained weekly as real data accumulates. Below 50 workers per zone, the system falls back to individual Z-score detection with a higher anomaly threshold.

| Historical Avg | After Algorithm Change | Drop | Status |
|---|---|---|---|
| 12 orders/hr | 3 orders/hr | 75% | Flagged |

---

### 4. Restaurant Preparation Delay

*Not every slow order is a disruption. The tolerance buffer separates noise from genuine delay.*

```
tolerance_threshold = avg_prep_time × 1.5   ← natural variation, no payout
delay_threshold     = avg_prep_time × 2.0   ← confirmed delay, compensation begins
compensable_wait    = current_prep_time - tolerance_threshold
```

**If average prep time = 10 min:**

| Prep Time | Status | Action |
|---|---|---|
| Up to 15 min | Normal variation | No payout |
| 15 – 20 min | Borderline | Partial compensation |
| Beyond 20 min | Confirmed delay | Full payout applies |

```
loss   = (compensable_wait / avg_delivery_time) × earning_per_delivery
payout = loss × coverage_factor (70–80%)
```

| Avg Prep | Buffer | Actual Prep | Compensable Wait | Loss | Coverage | Payout |
|---|---|---|---|---|---|---|
| 10 min | 15 min | 30 min | 15 min | Rs.60 | 75% | **Rs.45** |

---

## Payout Model

```
Income Loss = Expected Earnings − Actual Earnings
Payout      = Coverage % × Income Loss
```

**Weekly Premiums** *(aligned to gig worker pay cycles)*

| Risk Zone | Premium/Week |
|---|---|
| Low | Rs.20 |
| Medium | Rs.25 |
| High | Rs.30 |

**Dynamic Coverage** *(based on worker reliability score)*

| Reliability Score | Coverage |
|---|---|
| 90–100 | 80% |
| 70–89 | 70% |
| Below 70 | 60% |

**Premium Collection:** UPI AutoPay recurring mandate, auto-debited weekly. Failed payment → 48-hour grace period → coverage **paused** (not cancelled) → reinstated instantly on payment.

**Financial Sustainability:** The pilot premium is intentionally low to drive adoption. Actuarial viability is maintained through the efficiency threshold (0.5), restaurant tolerance buffer, and route deviation check — these together substantially reduce claim frequency. At scale, a licensed IRDAI insurer underwrites the risk pool. InsureO is the **technology and distribution layer**, not the direct risk-bearer.

**Legal Framework (Pilot):** Payouts in the pilot are structured as income protection disbursements under a tech service agreement — outside IRDAI insurance classification. Path to IRDAI aggregator registration or Bima Sugam sandbox formalises this at commercial launch.

---

## Worker Performance Matrix

*Normal-day behaviour is an additional fraud signal — and a fairness safeguard.*

Workers are scored against **their own past behaviour**, not against other workers. A consistent part-time worker scores the same as a consistent full-time worker.

| Parameter | What It Detects |
|---|---|
| Avg orders/hour on normal days | Productivity baseline |
| Active hours vs login hours | Real working effort |
| On-time delivery rate | Reliability |
| Claim frequency vs disruption frequency | Abuse pattern |

```
IF claim_frequency spikes while normal_day_activity drops → flagged
IF pattern is consistent (even at low volume)             → no penalty
```

> Part-time workers, workers recovering from illness, or those who selectively accept orders for safety reasons are **not penalised** for low volume — only for sudden inconsistency.

---

## Data Privacy & Consent

*Workers own their data. InsureO processes it under a data agreement, not as an owner.*

**Granular consent at onboarding** — workers accept or decline each data category individually (GPS, earnings, order history, activity logs) in their preferred language.

**Opt-out with transparent tradeoffs:**

| Opt Out Of | Coverage Impact |
|---|---|
| GPS tracking | Traffic + restaurant delay claims excluded. Weather + algorithm claims still active. |
| Order history | Algorithm disruption detection disabled for that worker. |
| Earnings data | Efficiency model cannot run — full coverage paused until reinstated. |

**Data rules:**
- No data sold or shared with Zomato, Swiggy, or any third party
- All data encrypted at rest
- GPS data auto-deleted after 90 days
- Workers can export or delete their data at any time

---

## AI Risk Assessment

Every worker gets a daily predictive score:

| Output | Example |
|---|---|
| Earnings Score | 78 / 100 |
| Predicted Earnings Today | Rs.1,200 |
| Disruption Probability | 35% |

Computed from: historical orders + live weather + traffic trends + restaurant prep history + Performance Matrix.

---

## Smart Features

| Feature | What It Does |
|---|---|
| Predictive Traffic Avoidance | Alerts 15 min before congestion builds — worker repositions before getting stuck |
| Smart Zone Switching | Real-time suggestion: "Move to Zone B — 25% higher earning potential now" |
| Loss Heatmap | Live city map — red (loss zones), yellow (moderate), green (high earning) |
| Micro-Compensation | Credits every 15 min during confirmed disruption — no hourly wait |
| Community Reporting | Workers report accidents/delays; counts only if 3+ independent workers report within 15 min in same zone. False reporters lose trust score. |
| Voice Alerts | All critical events spoken aloud — no screen needed while driving |

**Voice alert logic:**
- Activates at GPS speed > 5 km/h — covers workers stuck in slow traffic
- Fully stopped workers get screen notification instead
- Max 1 alert per 2 minutes — no distraction overload
- Languages: English, Hindi, Odia

---

## Fraud Detection

| Disruption | Key Signals |
|---|---|
| Traffic | Frozen route snapshot + GPS path + deviation score + nearby worker speeds |
| Weather | Cached API data + zone alerts + area-wide activity drop |
| Algorithm | Two-layer demand signal (cross-platform + restaurant activity) |
| Restaurant | Tolerance buffer + GPS confirmation + multi-worker corroboration |
| All claims | Performance Matrix + genuineness score + claim vs activity pattern |

> **API failure rule:** Claims are always **queued**, never rejected due to outage. Auto-processed when data restores. Worker notified of pending status throughout.

---

## Go-To-Market

| | |
|---|---|
| Pilot City | Bhubaneswar — strong delivery density, low CAC vs metros |
| First Cohort | Swiggy + Zomato delivery partners |
| Acquisition | Delivery partner WhatsApp communities + first month free + peer referral |
| Underwriting | Licensed IRDAI insurer underwrites risk pool at scale. Pilot runs as fintech payout service under tech service agreement. |
| Path to Scale | IRDAI aggregator registration before commercial launch |

---

## System Architecture

```
+-----------------------------------------------+
|   External APIs  (with 30-min fallback cache)  |
|   OpenWeather · Google Traffic · Maps · Mock   |
+-----------------------------------------------+
                       |
+-----------------------------------------------+
|           Backend  (Node.js / FastAPI)         |
|  Event Detection · Parametric Trigger Engine   |
|  Route Snapshot Store · Two-Layer Demand Check |
|  Fraud Engine · Claim Queue · API Fallback     |
+-----------------------------------------------+
          |                       |
+-----------------+     +--------------------+
|   AI Engine     |     |   Real-Time Layer  |
|   Python        |     |   WebSocket        |
|   scikit-learn  |     |   Socket.io        |
|   Isolation     |     |   Live Map         |
|   Forest        |     |   Voice Push       |
+-----------------+     +--------------------+
          |                       |
+-----------------------------------------------+
|                  Database                      |
|   PostgreSQL — worker data, route snapshots    |
|   MongoDB    — logs, alerts, claim queue       |
+-----------------------------------------------+
                       |
          +------------+------------+
          |                         |
+------------------+   +----------------------------+
|    Razorpay      |   |       Mobile App           |
|    UPI AutoPay   |   |   React Native             |
|    Instant       |   |   Dashboard · Map          |
|    Payout        |   |   TTS Engine · Voice       |
+------------------+   +----------------------------+
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend / Mobile | React, React Native, Leaflet / Google Maps |
| Backend | Node.js (Express) + Python (FastAPI) |
| AI / ML | scikit-learn — Isolation Forest, Z-score, Random Forest |
| Real-time | WebSockets (Socket.io) |
| Voice | Google TTS API / Expo Speech |
| Database | PostgreSQL + MongoDB |
| External APIs | OpenWeather, Google Maps Traffic, Mock Delivery API |
| Payments | Razorpay + UPI AutoPay |

---

## End-to-End Flow

```
 1  Worker logs in
    → consent verified → baseline loaded (cold-start or personal)

 2  Shift starts
    → real-time monitoring: GPS, orders, traffic, weather
    → route snapshot frozen and stored at every dispatch

 3  Disruption signal detected
    → efficiency score calculated
    → IF efficiency < 0.5 → proceed

 4  Cause validation
    → API called (fallback cache if down)
    → route deviation checked (traffic)
    → two-layer demand signal checked (algorithm)

 5  Fraud check
    → genuineness score + claim frequency + Performance Matrix

 6  Claim auto-triggered if valid
    → payout = coverage % × loss
    → Razorpay instant payment
    → Voice alert: "Compensation initiated."
```

---

## Impact

| | |
|---|---|
| Target Users | 50M+ gig workers across India |
| Monthly Income Loss (unprotected) | Rs.2,000 – Rs.4,000 / worker |
| Weekly Premium | Rs.20 – Rs.30 |
| Payout per Event | Rs.45 – Rs.240 |

**InsureO turns gig worker insurance from a reactive payout into a proactive earnings shield.**

---

## Roadmap

| Phase | What Gets Built | Status |
|---|---|---|
| 1 | Core setup · baseline tracking · efficiency model · weather + traffic APIs · route snapshot store | In Progress |
| 2 | Algorithm disruption (two-layer) · restaurant delay · fraud layer · consent framework · databases | Planned |
| 3 | Razorpay + UPI AutoPay · auto-claim pipeline · reliability scoring · claim queue · WebSockets | Planned |
| 4 | Heatmap · zone switching · predictive alerts · micro-compensation · community reporting | Planned |
| 5 | Voice alerts · multi-language · mobile UX polish · worker privacy dashboard | Planned |
| 6 | End-to-end testing · fraud stress tests · Isolation Forest retraining pipeline · beta launch | Planned |

---

## Team

Built at **[Hackathon Name]**

---

*This project was built for hackathon purposes. All rights reserved by the team.*

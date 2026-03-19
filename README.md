<p align="center">
  <img src="InsurO.png" width="600px" alt="InsurO Logo">
</p>

<h1 align="center">InsurO</h1>

<p align="center">
  <strong>AI-Powered Parametric Insurance for India's Gig Delivery Workers</strong>
</p>

<p align="center">
  <em>"Where Disruption Meets Protection, and Hustle Never Breaks"</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Hackathon%20Project-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Category-FinTech%20%2F%20InsurTech-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Impact-Gig%20Economy-green?style=for-the-badge" />
</p>

---

## 🚨 The Problem

India has **50+ million gig delivery workers** on platforms like Swiggy, Zomato, and Blinkit. They earn daily, live shift to shift, and have **zero financial safety net**.

Every day, things outside their control destroy their income:

| Disruption | Real Impact |
|---|---|
| 🚦 Traffic Jam | 4 deliveries/hour → 1 delivery/hour → **₹120/hour lost** |
| 🌧️ Heavy Rain | Work stops entirely → **₹300+ lost per event** |
| 📱 Platform Algorithm Change | Orders drop 75% overnight → **invisible income shock** |
| 🍳 Restaurant Delay | 30-min wait = 1 missed delivery → **₹60–₹80 lost** |

> **There is currently no insurance product in India that protects gig workers from these uncontrollable, real-time income shocks.**

---

## 💡 Our Solution — InsurO

InsurO is an **AI-driven parametric insurance platform** that:

- 🔍 **Automatically detects** income-impacting disruptions in real time
- 📊 **Measures actual earning loss** — not just traffic or weather conditions
- 💸 **Triggers instant payouts** without any manual claim filing
- 🧠 **Predicts disruptions before they happen** so workers can avoid income loss proactively

> InsurO doesn't ask workers to prove their loss. The system detects it, verifies it, and pays it — automatically.

---

## 🧠 The Core Innovation: Earning Efficiency Model

Most systems ask: *"Is there traffic?"* — InsurO asks: **"Has the worker's earning ability actually dropped?"**

```
efficiency = current_earnings / expected_earnings
```

**Example (Bhubaneswar Delivery Partner):**

| Metric | Normal | During Disruption |
|---|---|---|
| Orders/hour | 4 | 1 |
| Earnings/hour | ₹160 | ₹40 |
| Efficiency Score | 1.0 | **0.25** |

InsurO triggers a payout only when:
1. An external disruption is confirmed (traffic / weather / algorithm / delay)
2. **AND** the worker's efficiency drops below `0.5`

This prevents fraud and ensures payouts are genuinely warranted.

---

## 🔐 Three Core Pillars

```
┌────────────────────────────────────────────────────────────┐
│  1. Income Protection        Parametric auto-payout        │
│     with Automation          when disruption confirmed     │
├────────────────────────────────────────────────────────────┤
│  2. Smart Earnings           AI predicts risks, suggests   │
│     Intelligence             better zones & routes         │
├────────────────────────────────────────────────────────────┤
│  3. Transparent &            Data-verified payouts with    │
│     Fraud-Resistant          multi-layer fraud detection   │
└────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Disruptions Covered

### 1. 🚦 Traffic Congestion

**The Problem:** Heavy traffic reduces deliveries from 4/hour to 1/hour. Workers are active but inefficient — this is still income loss.

**InsurO's Detection Logic:**
```
delay_ratio = current_delivery_time / normal_delivery_time

IF delay_ratio > 1.5
AND traffic_level = HIGH
AND efficiency < 0.5
→ DISRUPTION TRIGGERED
```

**Payout Example:**

| Metric | Value |
|---|---|
| Expected Earnings | ₹160/hour |
| Actual Earnings | ₹40/hour |
| Loss | ₹120 |
| Coverage | 70% |
| **Final Payout** | **₹84** |

**Fraud Guard:** GPS routes are cross-checked against live traffic data. If a worker is slow but traffic is normal → claim rejected.

---

### 2. 🌧️ Weather Disruption

**The Problem:** Heavy rain, extreme heat, or storms reduce delivery activity or make roads unsafe.

**InsurO's Detection Logic:**
```
Fetch real-time weather data
IF rainfall > threshold (e.g., 100mm) OR weather alert active
→ Validate: worker in affected zone + was active
→ Calculate: loss = hourly_income × hours_lost
→ Apply payout policy (80% coverage)
→ Run fraud checks (GPS + activity)
→ Auto payout
```

**Payout Example:**

| Metric | Value |
|---|---|
| Rainfall | 130mm |
| Work Hours Lost | 3 hrs |
| Estimated Loss | ₹300 |
| Coverage | 80% |
| **Final Payout** | **₹240** |

**Predictive Alert Feature:**
```
⚠️ Heavy rain expected at 7 PM (70% probability)
   Predicted income drop: 25%
   Suggested action: Work early hours / Switch to Zone B
```

---

### 3. 📱 Platform Algorithm Disruption

**The Problem:** Zomato, Swiggy, and Zepto update their order allocation algorithms silently. A worker's orders can drop 75% overnight with no explanation — this is **invisible income shock**.

**InsurO's Detection Logic (AI-Powered):**
```python
# Anomaly Detection using Z-score
z_score = (current_orders - historical_mean) / std_dev

IF z_score < -2          # Statistically abnormal drop
AND no weather event
AND zone demand is normal
→ ALGORITHM DISRUPTION DETECTED
```

Advanced approach uses **Isolation Forest** (scikit-learn) for behavioral anomaly detection across worker order history.

**Real Example:**

| Metric | Value |
|---|---|
| Historical Avg Orders | 12/hour |
| Orders After Update | 3/hour |
| Drop Percentage | **75%** |
| Threshold | 70% |
| Status | 🚩 Flagged |

> *"Our system goes beyond visible disruptions like weather by detecting invisible income shocks caused by platform algorithm changes using real-time behavioral anomaly detection."*

---

### 4. 🍳 Restaurant Preparation Delay

**The Problem:** Riders wait 20–30 minutes at restaurants for orders to be prepared — time they could have used for another delivery.

**InsurO's Detection Logic:**
```
IF current_prep_time > 2 × avg_prep_time
AND rider GPS confirms location at restaurant
AND waiting_time > minimum threshold
→ DELAY DETECTED
```

**Loss Formula:**
```
loss = (waiting_time / avg_delivery_time) × earning_per_delivery
payout = loss × coverage_factor (70–80%)
```

**Payout Example:**

| Metric | Value |
|---|---|
| Average Prep Time | 10 min |
| Current Prep Time | 30 min |
| Waiting Time | 20 min |
| Estimated Loss | ₹80 |
| Coverage | 75% |
| **Final Payout** | **₹60** |

---

## 💰 Smart Payout Model

InsurO uses **dynamic parametric payouts**, not fixed amounts.

```
Income Loss = Expected Earnings − Actual Earnings
Insurance Payout = Coverage % × Income Loss
```

**Weekly Premium Structure (Aligned to Gig Worker Pay Cycles):**

| Zone Risk Level | Weekly Premium |
|---|---|
| Low Risk | ₹20/week |
| Medium Risk | ₹25/week |
| High Risk | ₹30/week |

**Dynamic Coverage based on Reliability Score:**

| Reliability Score | Coverage |
|---|---|
| 90–100 | 80% |
| 70–89 | 70% |
| Below 70 | 60% |

> Workers with clean claim histories earn higher coverage — this discourages fraud and rewards honesty.

---

## 🤖 AI-Powered Risk Assessment

InsurO continuously scores every worker:

| Output | Value |
|---|---|
| Smart Earnings Score | 78 / 100 |
| Predicted Earnings Today | ₹1,200 |
| Disruption Probability | 35% |

This score is computed using:
- Historical order patterns
- Live weather conditions
- Traffic congestion trends
- Restaurant preparation history
- Worker activity patterns

---

## 🚀 Next-Level Features

### 1. Predictive Traffic Avoidance
> *"Traffic likely to increase in 15 minutes in Area A — move now"*

InsurO predicts congestion **before** it hits using forecast APIs and historical patterns, allowing workers to reposition proactively.

### 2. Smart Zone Switching
```
📍 Current Zone: Low demand + High traffic
💡 Suggestion: Move to Zone B → +25% earning potential
```

### 3. Loss Heatmap (Visual)
- 🔴 Red zones = heavy income loss areas
- 🟡 Yellow zones = moderate risk
- 🟢 Green zones = high earning potential

Workers see the city's earning landscape at a glance.

### 4. Micro-Compensation Engine
Instead of waiting for hourly payouts — workers receive **real-time credits every 15 minutes** during confirmed disruptions.

### 5. Community Disruption Reporting
Workers can report accidents, restaurant glitches, and platform issues. Multiple reports from the same zone strengthen AI detection accuracy.

---

## 🛡️ Intelligent Fraud Detection

Every payout goes through a multi-layer fraud check:

| Disruption Type | Fraud Signals Monitored |
|---|---|
| Traffic | GPS route + speed + nearby worker speeds |
| Weather | Weather API + city alerts + zone activity |
| Algorithm | Cross-worker order distribution + login patterns |
| Restaurant Delay | Restaurant timestamps + multi-worker corroboration |

**Key Rule:** If only one worker shows an anomaly while all nearby workers are normal → claim is flagged and held for review.

---

## 🏗️ System Architecture

```
┌─────────────────────────────────────┐
│        Frontend (React)             │
│  Worker Dashboard + Map + Alerts    │
└────────────────┬────────────────────┘
                 │
┌────────────────▼────────────────────┐
│       Backend (Node.js / FastAPI)   │
│  API Gateway + Business Logic       │
└──────┬──────────────────┬───────────┘
       │                  │
┌──────▼──────┐   ┌───────▼────────┐
│  AI Engine  │   │  External APIs │
│  (Python)   │   │  Weather       │
│  scikit-    │   │  Traffic       │
│  learn,     │   │  Maps          │
│  pandas     │   │  Mock Delivery │
└──────┬──────┘   └───────┬────────┘
       │                  │
┌──────▼──────────────────▼─────────┐
│       Database Layer              │
│  PostgreSQL (structured data)     │
│  MongoDB (logs + activity)        │
└────────────────┬──────────────────┘
                 │
┌────────────────▼──────────────────┐
│     Payment Gateway (Razorpay)    │
│     Instant payout to worker      │
└───────────────────────────────────┘
```

**Real-Time Layer:** WebSockets (Socket.io) for live map updates and alerts.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Leaflet / Google Maps API |
| Backend | Node.js (Express) + Python (FastAPI) |
| AI / ML | scikit-learn (Isolation Forest, Logistic Regression, Random Forest) |
| Data Processing | pandas, numpy |
| Real-time | WebSockets (Socket.io) |
| Database | PostgreSQL + MongoDB |
| External APIs | OpenWeather API, Google Maps Traffic API, Mock Delivery API |
| Payments | Razorpay |
| ML Models | ARIMA / LSTM (time series), Z-score (anomaly baseline) |

---

## 🔄 End-to-End Workflow

```
1. Worker logs in and starts shift
         ↓
2. InsurO builds/updates baseline profile
   (avg speed, orders/hour, earnings/hour)
         ↓
3. Real-time monitoring begins
   (GPS, order rate, traffic, weather)
         ↓
4. Disruption signal detected
         ↓
5. Earning efficiency score calculated
   IF efficiency < 0.5 → PROCEED
         ↓
6. External cause validated
   (weather API / traffic API / cross-worker data)
         ↓
7. Fraud checks run
   (GPS, activity logs, zone demand)
         ↓
8. If valid → Claim auto-triggered
         ↓
9. Payout calculated dynamically
         ↓
10. Instant payment → Worker notified
```

---

## 📊 Impact & Vision

InsurO is not just insurance — it is an **earnings intelligence platform** for India's gig workers.

| Metric | Estimate |
|---|---|
| Target Users | 50M+ gig delivery workers in India |
| Avg Monthly Income Loss (unprotected) | ₹2,000–₹4,000/worker |
| Avg Weekly Premium | ₹20–₹30 |
| Avg Payout per Disruption Event | ₹60–₹240 |

> **InsurO transforms gig worker insurance from a reactive compensation system into a proactive financial shield — protecting income before, during, and after every disruption.**

---

## 👥 Team

> *Built with purpose by Aurelia Axis*

---

## 📄 License

This project was built for hackathon purposes. All rights reserved by the team.

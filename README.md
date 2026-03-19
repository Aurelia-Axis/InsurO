<p align="center">
  <img src="InsurO.png" width="600px" alt="InsureO Logo">
</p>

<h1 align="center">InsureO</h1>

<p align="center">
  <strong>AI-Powered Parametric Insurance for India's Gig Delivery Workers</strong>
</p>

<p align="center">
  <em>"Where Disruption Meets Protection, and Hustle Never Breaks"</em>
</p>

---

## The Problem

India has **50+ million gig delivery workers** on platforms like Swiggy, Zomato, and Blinkit. They earn daily, live shift to shift, and have zero financial safety net.

Every day, things outside their control destroy their income:

| Disruption | Real Impact |
|---|---|
| Traffic Jam | 4 deliveries/hour to 1 delivery/hour — Rs.120/hour lost |
| Heavy Rain | Work stops entirely — Rs.300+ lost per event |
| Platform Algorithm Change | Orders drop 75% overnight — invisible income shock |
| Restaurant Delay | 30-min wait = 1 missed delivery — Rs.60 to Rs.80 lost |

There is currently no insurance product in India that protects gig workers from these uncontrollable, real-time income shocks.

---

## Our Solution

InsureO is an AI-driven parametric insurance platform that automatically detects income-impacting disruptions in real time, measures the actual earning loss, and triggers instant payouts without any manual claim filing. It also predicts disruptions before they happen so workers can avoid income loss proactively.

InsureO does not ask workers to prove their loss. The system detects it, verifies it, and pays it — automatically.

---

## The Core Idea: Earning Efficiency Model

Most systems just ask "Is there traffic?" — InsureO asks "Has the worker's earning ability actually dropped?"

```
efficiency = current_earnings / expected_earnings
```

Example — Bhubaneswar delivery partner:

| Metric | Normal | During Disruption |
|---|---|---|
| Orders/hour | 4 | 1 |
| Earnings/hour | Rs.160 | Rs.40 |
| Efficiency Score | 1.0 | 0.25 |

InsureO only triggers a payout when:
1. An external disruption is confirmed (traffic / weather / algorithm / delay)
2. AND the worker's efficiency drops below 0.5

This prevents fraud and makes sure payouts are genuinely warranted.

---

## Three Core Pillars

```
+------------------------------------------------------------+
|  1. Income Protection        Parametric auto-payout        |
|     with Automation          when disruption confirmed     |
+------------------------------------------------------------+
|  2. Smart Earnings           AI predicts risks, suggests   |
|     Intelligence             better zones and routes       |
+------------------------------------------------------------+
|  3. Transparent and          Data-verified payouts with    |
|     Fraud-Resistant          multi-layer fraud detection   |
+------------------------------------------------------------+
```

---

## Disruptions Covered

### 1. Traffic Congestion

Heavy traffic reduces deliveries from 4/hour to 1/hour. Workers are active but inefficient — and that still causes income loss.

Detection logic:
```
delay_ratio = current_delivery_time / normal_delivery_time

IF delay_ratio > 1.5
AND traffic_level = HIGH
AND efficiency < 0.5
AND route_optimality = ACCEPTABLE
-> DISRUPTION TRIGGERED
```

Payout example:

| Metric | Value |
|---|---|
| Expected Earnings | Rs.160/hour |
| Actual Earnings | Rs.40/hour |
| Loss | Rs.120 |
| Coverage | 70% |
| Final Payout | Rs.84 |

Fraud check: GPS routes are cross-checked against live traffic data. If a worker is slow but traffic is normal, the claim is rejected.

Intentional route misuse handling: The system compares the worker's actual GPS route against the recommended optimal route available at the time of delivery. If the worker knowingly took a longer or heavier traffic route when a reasonable alternative was available and they had already been alerted about it, the claim is flagged. A route deviation score is calculated, and if it crosses the acceptable threshold, the payout is reduced proportionally or rejected based on the severity of the deviation.

```
route_deviation = actual_route_time / optimal_route_time

IF route_deviation > 1.3
AND optimal_route_was_suggested = true
-> claim reduced or flagged for review
```

This ensures the system only compensates workers who were genuinely stuck, not those who deliberately chose a high traffic path.

---

### 2. Weather Disruption

Heavy rain, extreme heat, or storms reduce delivery activity or make roads unsafe.

Detection logic:
```
Fetch real-time weather data
IF rainfall > threshold (e.g. 100mm) OR weather alert active
-> Validate: worker in affected zone + was active
-> Calculate: loss = hourly_income x hours_lost
-> Apply payout policy (80% coverage)
-> Run fraud checks (GPS + activity)
-> Auto payout
```

Payout example:

| Metric | Value |
|---|---|
| Rainfall | 130mm |
| Work Hours Lost | 3 hrs |
| Estimated Loss | Rs.300 |
| Coverage | 80% |
| Final Payout | Rs.240 |

Predictive alert example:
```
Warning: Heavy rain expected at 7 PM (70% probability)
Predicted income drop: 25%
Suggested action: Work early hours or switch to Zone B
```

Note on alert compliance: Voice and predictive alerts are advisory in nature. InsureO does not penalise a worker for not acting on a suggestion. The payout is always determined by the actual earning efficiency drop at the time of the disruption, not by whether the worker followed the alert. If a worker ignores a zone switch suggestion and still experiences a genuine efficiency drop due to the disruption, they remain eligible for compensation. The alerts exist to help workers earn more, not to create conditions for denying their claims.

---

### 3. Platform Algorithm Disruption

Zomato, Swiggy, and Zepto update their order allocation algorithms silently. A worker's orders can drop 75% overnight with no explanation — this is invisible income shock.

Detection logic:
```python
# Z-score based anomaly detection
z_score = (current_orders - historical_mean) / std_dev

IF z_score < -2        # Statistically abnormal drop
AND no weather event
AND zone demand is normal
-> ALGORITHM DISRUPTION DETECTED
```

We also use Isolation Forest (scikit-learn) for more advanced behavioral anomaly detection across worker order history.

Real example:

| Metric | Value |
|---|---|
| Historical Avg Orders | 12/hour |
| Orders After Update | 3/hour |
| Drop Percentage | 75% |
| Threshold | 70% |
| Status | Flagged |

Our system goes beyond visible disruptions like weather by detecting invisible income shocks caused by platform algorithm changes using real-time behavioral anomaly detection.

---

### 4. Restaurant Preparation Delay

Riders sometimes wait 20-30 minutes at restaurants for orders to be prepared — time they could have spent completing another delivery.

Not every order that takes longer than average is a disruption. Some items genuinely take more time to prepare. The system accounts for this with a tolerance buffer so workers are not compensated for natural variation in prep time, only for genuinely excessive delays.

Detection logic:
```
tolerance_threshold = avg_prep_time x 1.5   (buffer for natural variation)
delay_threshold     = avg_prep_time x 2.0   (confirmed excessive delay)

IF current_prep_time > delay_threshold
AND rider GPS confirms location at restaurant
AND waiting_time > minimum threshold
-> DELAY DETECTED

Compensable waiting time = current_prep_time - tolerance_threshold
(only the time beyond the tolerance buffer is counted as loss)
```

This means if average prep time is 10 minutes:
- Up to 15 minutes (1.5x) — considered normal, no compensation
- Beyond 15 minutes — counted as delay, compensation starts from this point
- Beyond 20 minutes (2x) — confirmed disruption, full payout logic applies

Loss formula:
```
compensable_wait = current_prep_time - tolerance_threshold
loss = (compensable_wait / avg_delivery_time) x earning_per_delivery
payout = loss x coverage_factor (70-80%)
```

Payout example:

| Metric | Value |
|---|---|
| Average Prep Time | 10 min |
| Tolerance Buffer (1.5x) | 15 min |
| Current Prep Time | 30 min |
| Compensable Waiting Time | 15 min (30 - 15) |
| Estimated Loss | Rs.60 |
| Coverage | 75% |
| Final Payout | Rs.45 |

This approach gives fair leverage to restaurants for items that naturally take longer, while still protecting riders from genuinely unreasonable waits.

---

## Payout Model

InsureO uses dynamic parametric payouts, not fixed amounts.

```
Income Loss = Expected Earnings - Actual Earnings
Insurance Payout = Coverage % x Income Loss
```

Weekly premium structure (aligned to gig worker pay cycles):

| Zone Risk Level | Weekly Premium |
|---|---|
| Low Risk | Rs.20/week |
| Medium Risk | Rs.25/week |
| High Risk | Rs.30/week |

Dynamic coverage based on reliability score:

| Reliability Score | Coverage |
|---|---|
| 90-100 | 80% |
| 70-89 | 70% |
| Below 70 | 60% |

Workers with clean claim histories earn higher coverage. This discourages fraud and rewards consistent, honest participation.

---

## AI Risk Assessment

InsureO continuously scores every worker based on:
- Historical order patterns
- Live weather conditions
- Traffic congestion trends
- Restaurant preparation history
- Worker activity patterns
- Worker Performance Matrix (normal scenario baseline)

Sample output:

| Output | Value |
|---|---|
| Smart Earnings Score | 78 / 100 |
| Predicted Earnings Today | Rs.1,200 |
| Disruption Probability | 35% |

---

## Worker Performance Matrix

This is an additional layer introduced to measure a worker's genuineness and consistency in normal working conditions — days with no disruption, no bad weather, and no traffic issues.

The idea is simple. If a worker performs well on regular days, it shows they are actively working and not trying to game the system. This performance record becomes an additional parameter that influences claim eligibility and payout coverage.

What is tracked during normal scenarios:

| Parameter | What It Measures |
|---|---|
| Avg orders/hour on normal days | Baseline delivery productivity |
| Avg speed on normal days | Active movement, not idle |
| Acceptance rate | Willingness to take orders |
| Login hours vs active hours | Actual working effort |
| On-time delivery rate | Reliability as a worker |
| Claim frequency vs disruption frequency | Whether claims match real events |

How it affects payouts:

A worker with a strong normal-day performance record gets a higher Genuineness Score. This score works alongside the reliability score and directly influences how claims are processed.

```
genuineness_score = weighted average of normal-day performance metrics

IF genuineness_score is HIGH
-> claim processed faster, coverage at upper range (80%)

IF genuineness_score is LOW
-> claim sent for additional review, coverage at lower range (60%)
```

Example:

| Worker | Avg Orders/hr (Normal) | Acceptance Rate | Genuineness Score | Coverage Applied |
|---|---|---|---|---|
| Worker A | 5.2 | 92% | High | 80% |
| Worker B | 2.1 | 54% | Low | 60% + manual review |

This matrix ensures that workers who are genuinely active and productive on normal days are rewarded with faster and higher payouts when a real disruption hits. Workers who show low activity even on normal days face more scrutiny before their disruption claims are approved.

---

## Additional Features

### 1. Predictive Traffic Avoidance

InsureO predicts congestion before it hits using forecast APIs and historical patterns, so workers can reposition early instead of getting stuck.

Example alert: "Traffic likely to increase in 15 minutes in Area A. Consider moving now."

### 2. Smart Zone Switching

Based on real-time traffic and demand data, the app suggests better working zones.

Example: "Move to Zone B — 25% higher earning potential right now."

### 3. Loss Heatmap

A visual map of the city showing where workers are earning well and where they are losing money:
- Red zones — heavy income loss areas
- Yellow zones — moderate risk
- Green zones — high earning potential

### 4. Micro-Compensation Engine

Instead of waiting for hourly payouts, workers receive real-time credits every 15 minutes during confirmed disruptions.

### 5. Community Disruption Reporting

Workers can report accidents, restaurant glitches, and platform issues directly from the app. Multiple reports from the same zone help strengthen the AI detection system.

### 6. Voice Alerts — Hands-Free Assistance

Delivery workers are always on the move. Reading notifications while driving is unsafe. InsureO's voice alert system converts every critical event into a short, clear spoken message — delivered through the phone speaker or earphones.

Types of voice alerts:

| Type | Example |
|---|---|
| Risk Alert | "Heavy traffic ahead. Expect delay." |
| Opportunity Alert | "High demand in nearby zone. Move for better earnings." |
| Guidance Alert | "You have been waiting too long. Consider switching location." |
| System Alert | "Disruption detected. Compensation will be processed." |

How it works:
```
Traffic API / Weather API / Parametric Trigger
          |
  Event Detection Engine (Backend)
          |
  Alert Generation
          |
  Priority and Filtering (max 1 alert per 2 minutes)
          |
  WebSocket -> Mobile App
          |
  Text-to-Speech Engine (Google TTS / Expo Speech)
          |
  Audio output through speaker or earphones
```

Extra capabilities:
- Priority-based volume — critical alerts play louder than informational ones
- Context-aware — voice only activates when the worker is moving (GPS speed > 10 km/h)
- Multi-language support — English, Hindi, Odia, and other regional languages
- Alert throttling — no repeated alerts within 60 seconds
- Replay option — worker can replay the last alert with one tap

Voice alert data structure:
```json
{
  "message": "Heavy traffic ahead",
  "priority": "high",
  "type": "risk",
  "zone": "Zone A",
  "timestamp": "2026-03-17T10:00:00"
}
```

---

## Fraud Detection

Every payout goes through a multi-layer fraud check:

| Disruption Type | Fraud Signals Monitored |
|---|---|
| Traffic | GPS route + speed + nearby worker speeds + route deviation from optimal path |
| Weather | Weather API + city alerts + zone activity |
| Algorithm | Cross-worker order distribution + login patterns |
| Restaurant Delay | Restaurant timestamps + compensable wait (beyond tolerance buffer) + multi-worker corroboration |
| All types | Worker Performance Matrix (normal-day baseline) + genuineness score |

If only one worker shows an anomaly while all nearby workers are performing normally, the claim is flagged and held for review.

If a worker's normal-day performance is consistently low and they suddenly file multiple disruption claims, the system flags this pattern and routes it for manual review before processing the payout.

---

## System Architecture

```
+------------------------------------------+
|          External Data Sources           |
|  Weather API, Traffic API, Maps API      |
|  Mock Delivery API, Surge Detection      |
+------------------------------------------+
                    |
+------------------------------------------+
|        Backend (Node.js / FastAPI)       |
|  API Gateway, Event Detection Engine     |
|  Alert Generation, Parametric Triggers   |
|  Fraud Detection, Priority Filtering     |
+------------------------------------------+
        |                    |
+---------------+   +--------------------+
|  AI Engine    |   |  Real-Time Layer   |
|  (Python)     |   |  WebSockets        |
|  scikit-learn |   |  Socket.io         |
|  pandas       |   |  Live map + Voice  |
+---------------+   +--------------------+
        |                    |
+------------------------------------------+
|          Database Layer                  |
|  PostgreSQL (structured data)            |
|  MongoDB (activity logs + alerts)        |
+------------------------------------------+
                    |
        +-----------+------------+
        |                        |
+----------------+   +--------------------------+
| Payment        |   |  Mobile App (Frontend)   |
| Gateway        |   |  React, Dashboard        |
| (Razorpay)     |   |  Map, Alert Handler      |
| Instant payout |   |  TTS Engine, Voice       |
+----------------+   +--------------------------+
```

WebSockets (Socket.io) handle both live map updates and real-time voice alert delivery to the mobile app.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Leaflet / Google Maps API |
| Mobile | React Native (Voice Alerts + GPS) |
| Backend | Node.js (Express) + Python (FastAPI) |
| AI / ML | scikit-learn (Isolation Forest, Logistic Regression, Random Forest) |
| Data Processing | pandas, numpy |
| Real-time | WebSockets (Socket.io) |
| Voice Alerts | Google TTS API / Expo Speech (React Native) |
| Database | PostgreSQL + MongoDB |
| External APIs | OpenWeather API, Google Maps Traffic API, Mock Delivery API |
| Payments | Razorpay |
| ML Models | ARIMA / LSTM (time series), Z-score (anomaly baseline) |

---

## End-to-End Workflow

```
1. Worker logs in and starts shift
         |
2. InsureO builds/updates baseline profile
   (avg speed, orders/hour, earnings/hour)
   + updates Worker Performance Matrix (normal day data)
         |
3. Real-time monitoring begins
   (GPS, order rate, traffic, weather)
         |
4. Disruption signal detected
         |
5. Earning efficiency score calculated
   IF efficiency < 0.5 -> PROCEED
         |
6. External cause validated
   (weather API / traffic API / cross-worker data)
         |
7. Route deviation check (for traffic claims)
   IF worker ignored optimal route -> reduce or flag claim
         |
8. Fraud checks run
   (GPS, activity logs, zone demand, genuineness score)
         |
9. If valid -> Claim auto-triggered
         |
10. Payout calculated dynamically
    (coverage % adjusted based on genuineness score)
         |
11. Instant payment processed (Razorpay)
         |
12. Voice alert played to worker:
    "Disruption detected. Compensation initiated."
```

---

## Impact

InsureO is not just an insurance product — it is an earnings intelligence platform built for India's gig workers.

| Metric | Estimate |
|---|---|
| Target Users | 50M+ gig delivery workers in India |
| Avg Monthly Income Loss (unprotected) | Rs.2,000 to Rs.4,000/worker |
| Avg Weekly Premium | Rs.20 to Rs.30 |
| Avg Payout per Disruption Event | Rs.60 to Rs.240 |

InsureO transforms gig worker insurance from a reactive compensation system into a proactive financial shield — protecting income before, during, and after every disruption.

---

## Development Roadmap

### Phase 1 — Core Foundation
Status: In Progress

- Set up project structure (React frontend, Node.js backend, Python AI service)
- Build worker profile and baseline tracking (orders/hour, speed, earnings/hour)
- Implement the Earning Efficiency Model
- Integrate OpenWeather API for weather disruption detection
- Integrate Traffic API (mock or Google Maps) for congestion detection
- Basic payout calculation engine (loss x coverage %)
- Simple worker dashboard showing current earnings and efficiency score

---

### Phase 2 — AI and Disruption Detection
Status: Planned

- Implement Z-score anomaly detection for platform algorithm disruption
- Integrate Isolation Forest model (scikit-learn) for advanced behavioral anomaly detection
- Build restaurant delay detection using GPS and prep time tracking
- Connect all four disruption types to the parametric trigger engine
- Add fraud detection layer (GPS cross-check, activity logs, cross-worker validation)
- Set up PostgreSQL and MongoDB databases

---

### Phase 3 — Automation and Payouts
Status: Planned

- Integrate Razorpay for instant automated payouts
- Build the auto-claim trigger pipeline (disruption detected -> fraud check -> payout)
- Implement dynamic coverage model based on reliability score
- Add weekly subscription and premium management
- Real-time WebSocket setup for live data updates

---

### Phase 4 — Smart Features
Status: Planned

- Build live loss heatmap (red / yellow / green zones on map)
- Add smart zone switching suggestions based on demand and traffic
- Implement predictive alerts using weather forecast API and historical patterns
- Micro-compensation engine (credits every 15 minutes during disruption)
- Community disruption reporting feature

---

### Phase 5 — Voice and UX
Status: Planned

- Integrate Text-to-Speech engine (Google TTS / Expo Speech)
- Build voice alert system with priority filtering and alert throttling
- Add multi-language support (English, Hindi, Odia)
- Context-aware alerts (activates only when worker is moving)
- Polish mobile UI for field use (large buttons, minimal taps)

---

### Phase 6 — Testing and Launch
Status: Planned

- End-to-end testing of all disruption detection flows
- Fraud detection stress testing with simulated fake claims
- Load testing for real-time WebSocket and payout pipeline
- Beta test with a small group of delivery workers
- Final UI/UX improvements based on feedback
- Hackathon submission and demo preparation

---

## Team

Built at [Hackathon Name]

---

## License

This project was built for hackathon purposes. All rights reserved by the team.

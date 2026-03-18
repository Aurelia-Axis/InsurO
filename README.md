<p align="center">
  <img src="InsurO.png" width="60%">
</p>

<h1 align="center">
<b> InsurO - AI Powered Insurance for Delivery Partners </b>
</h1>

<p align="center">
<i> <b>  "Where Disruption Meets Protection, and Hustle Never Breaks" </b> </i>
</p>

InsurO is an AI-driven parametric insurance platform designed to protect delivery partners from income loss caused by external disruptions such as Traffic congestion, Algorithm changes, Weather or external issues etc.


## Problem Statement 

India’s gig delivery workers depend on daily earnings from platforms like Swiggy, Zomato, and Blinkit. However, external uncontrollable disruptions such as:
* Platform algorithm changes
* Traffic congestion
* Restaurant preparation delays
* Weather disruption 

can significantly reduce their working hours and cause them to lose 20–30% of their monthly income.
Currently, gig workers have no financial protection against these uncontrollable disruptions.


## Solution
We will builda an AI-powered parametric insurance system that automatically detects disruptions, compensates workers for lost income.
Instead of traditional claim-based insurance, InsurO uses real-time data monitoring and AI-driven triggers to automatically detect disruptions and compensate workers for lost income.

The platform also acts as an earnings intelligence system, helping workers identify high-demand zones and reduce income loss before it happens.


## Core System Concepts
InsurO operates on three main pillars:

<table>
<tr><td>1️. </td><td><code>Income Protection with Parametric Automation</code></td><td>Automatically compensates workers when disruptions reduce their delivery earnings</td></tr>
  
<tr><td>2️. </td><td><code>Smart Earnings Intelligence</code></td><td> Uses AI to predict risks and recommend better zones, restaurants or routes for maximizing income</td></tr>

<tr><td>3️. </td><td><code>Transparent & Fraud-Resistant Insurance</code></td><td>Ensures payouts are data-driven and verified using intelligent fraud detection mechanisms</td></tr>
</table>


## Disruptions Covered 
1. **Platform Algorithm Disruption:** Delivery platforms frequently update their order allocation algorithms, which can suddenly reduce order distribution to certain workers.
These algorithms continuously change based on:
- demand-supply ratio
- delivery time optimization
- worker ratings
- acceptance rate
- zone prioritization

Detection Logic :
```bash
    1. Track worker performance (orders/hour, earnings, idle time)
    2. Compare current data with historical average
    3. Detect sudden drop:
       drop % = (historical_avg - current_value) / historical_avg
    4. If drop_percentage > threshold (e.g., >30%) → "possible disruption"
    5. Validate:
       - No weather/traffic issues
       - Zone demand is normal
    6. Calculate income loss:
       loss = expected_earnings - actual_earnings
    7. Run fraud checks (activity logs, GPS)
    8. If valid → Auto-trigger claim & payout
```

Example scenario :                                              
|       Metric         |   Value  |
|----------------------|----------|
| Historical Avg Orders|    12    |
| Orders After Change  |    3     |
| Drop percentage      |    75%   |
| Threshold            |    70%   |
| Status               |🚩Flagged |

**Note: We detect invisible income loss caused by platform changes using behavioral anomaly analysis.**


2. **Weather Disruption:** Extreme weather conditions can reduce delivery activity or make travel unsafe.
  Examples include:
  - Heavy rainfall
  - Extreme heat
  - High AQI
  - Storm conditions
  
  Detection Logic :
```bash
   1. Fetch real-time weather data (rainfall, alerts, etc.)
   2. Detect disruption if conditions exceed threshold (e.g., heavy rain)
   3. Validate impact:
      - Worker in affected area
      - Worker was active
      - Delivery demand reduced
   4. Calculate income loss:
   loss = hourly_income × hours_lost
   5. Apply payout policy (e.g., 80% of loss)
   6. Run fraud checks (GPS, activity, duplicates)
```
Example scenario :
| Metric              | Value |
|--------------------|-------|
| Rainfall           | 130 mm |
| Work Hours Lost    | 3 hrs  |
| Estimated Loss     | ₹300   |
| Coverage           | 80%    |
| Final Payout       | ₹240   |
| Status             | ✅Paid |

**Note: We validate real-world impact before payout, ensuring compensation only when weather truly affects earnings.**

3. **Traffic Congestion:** Heavy traffic can significantly slow down deliveries, reducing the number of orders completed per hour.
   Detection Logic :
   ```bash
    1. Track delivery time, speed, and orders/hour
    2. Fetch traffic level (API/mock)
    3. Compare with normal delivery time:
       delay_ratio = current_time / normal_time
    4. If delay > threshold (e.g., >1.5) AND traffic = HIGH → disruption
    5. Validate worker is active
    6. Calculate income loss based on reduced deliveries
    7. Run fraud checks (GPS, route, traffic mismatch)
    8. If valid → Auto-trigger claim & payout
   ```
  
Example Scenario :
| Metric                | Value |
|----------------------|-------|
| Normal Orders/hour   | 4     |
| Normal Earnings/hour | ₹160  |
| Current Orders/hour  | 1     |
| Current Earnings     | ₹40   |
| Efficiency           | 0.25  |
| Traffic Level        | High  |
| Loss                 | ₹120  |
| Coverage             | 70%   |
| Final Payout         | ₹84   |
| Status               | 🚨 Disruption Detected |

**Note: We measure earning efficiency drop instead of relying on traffic data alone for accurate disruption detection.**

4. **Restaurant Preparation Delay:** Delivery workers often lose time waiting for restaurants to prepare orders.
   Detection Logic :
   ```bash
    1. Track order preparation time:
       - Expected prep time (historical avg)
       - Current prep time
    2. Detect delay:
       - If current_prep_time > 2 × avg_prep_time → Delay detected
    3. Validate rider impact:
       - Rider is at restaurant (GPS check)
       - Waiting time exceeds minimum threshold
       - Order status confirms delay
    4. Calculate income loss:
       loss = (waiting_time / avg_delivery_time) × earning_per_delivery
    5. Apply payout policy:
       payout = loss × coverage_factor (e.g., 70–80%)
    6. Run fraud checks:
       - GPS spoofing detection
       - Fake waiting prevention
       - Duplicate claim check
    7. If valid → Auto-trigger claim & payout
   ```
Example scenario :
| Metric                    | Value |
|---------------------------|-------|
| Avg Prep Time             | 10 min |
| Current Prep Time         | 30 min |
| Delay Condition           | >2× (Triggered) |
| Waiting Time              | 20 min |
| Avg Delivery Time         | 20 min |
| Earnings per Delivery     | ₹80   |
| Estimated Loss            | ₹80   |
| Coverage                  | 75%   |
| Final Payout              | ₹60   |
| Status                    | 🚨Delay Detected |

**Note: We compensate riders only when waiting time directly reduces earning opportunities.**

AI-Powered Risk Assessment

GigShield continuously evaluates worker activity and environmental conditions using AI models.

Smart Earnings Prediction Score

This AI model predicts expected earnings and disruption risk based on:

• historical order patterns
• weather conditions
• traffic congestion trends
• restaurant preparation times
• worker activity patterns

Example output:

Smart Earnings Score: 78 / 100
Predicted Earnings Today: ₹1200
Disruption Probability: 35%
Weekly Dynamic Pricing Model

GigShield follows a weekly insurance pricing model, aligned with the earning cycle of gig workers.

Instead of monthly premiums, workers subscribe to weekly protection plans.

Example pricing:

Low Risk Zone → ₹20/week
Medium Risk Zone → ₹25/week
High Risk Zone → ₹30/week

Premiums are dynamically adjusted using AI predictions.

Dynamic Coverage Model

Coverage percentage is not fixed. It adjusts based on worker reliability and historical behavior.

Example:

Reliability Score	Coverage
90–100	80%
70–89	70%
<70	60%

Example payout:

Income Loss = ₹1000
Coverage = 80%

Payout = ₹800

This encourages honest participation and platform sustainability.

Parametric Insurance Payout

GigShield automatically calculates compensation when disruptions occur.

Formula
Income Loss = Expected Earnings − Actual Earnings
Insurance Payout = Coverage % × Income Loss

Example:

Expected earnings = ₹160/hour
Actual earnings = ₹40/hour

Income Loss = ₹120
Coverage = 70%

Payout = ₹84
Intelligent Fraud Detection

GigShield integrates multiple fraud prevention mechanisms to ensure payouts remain fair.

Algorithm Disruption Fraud Detection

The system verifies:

• worker activity logs
• login time patterns
• platform-wide order distribution

If only one worker shows an order drop while others remain normal, the claim is flagged.

Traffic Congestion Fraud Detection

Traffic claims are validated using:

• GPS tracking
• traffic API data
• average delivery speeds of nearby workers

If traffic conditions are normal but the worker reports slow delivery speeds, the system flags potential fraud.

Restaurant Delay Fraud Detection

Restaurant delay claims are validated using:

• restaurant order timestamps
• arrival and pickup logs
• data from other workers at the same restaurant

If multiple workers report delays at the same location, the claim is verified.

Weather Disruption Fraud Detection

Weather claims are validated through:

• weather API data
• city-wide weather alerts
• delivery activity patterns in nearby zones

Workers cannot falsely claim weather disruptions if conditions remain normal.

Smart Earnings Intelligence Features

GigShield also helps workers increase their earnings, not just protect them.

Real-Time Disruption Map

A city map showing:

• heavy traffic zones
• restaurant delay hotspots
• low-demand areas

Workers can avoid problematic zones.

Route Optimization

Suggests better delivery routes to avoid congestion.

Example alert:

Heavy traffic detected in Koramangala
Suggested route: Indiranagar → MG Road
Surge Opportunity Alerts

The system detects zones with high order demand.

Example:

High demand detected in Downtown
Potential earnings increase: +30%

Workers are guided toward better earning opportunities.

Predictive Risk Alerts

AI predicts disruptions before they occur.

Example:

Heavy rain expected at 7 PM
Predicted income drop: 25%
Recommended zone: Indiranagar
Worker Insights Dashboard

Workers receive real-time insights including:

• income trends
• disruption history
• high-earning zones
• weekly protected earnings

This helps workers optimize their work strategy.

Community Disruption Reporting

Workers can report disruptions such as:

• accidents
• restaurant delays
• platform glitches

Multiple reports strengthen AI detection accuracy.

System Integrations

GigShield integrates with multiple external data sources:

• Weather APIs
• Traffic data APIs
• Delivery platform APIs (mocked)
• Payment gateways for instant payouts

Final Vision

GigShield transforms gig worker insurance from a reactive compensation system into a proactive earnings intelligence platform.

The platform:

• protects workers from income loss
• predicts disruptions using AI
• recommends better working zones
• ensures transparent and fraud-resistant insurance payouts

GigShield ultimately empowers gig workers with financial stability and smarter earning opportunities.









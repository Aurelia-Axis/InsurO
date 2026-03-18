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

**We detect invisible income loss caused by platform changes using behavioral anomaly analysis.**


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

**We validate real-world impact before payout, ensuring compensation only when weather truly affects earnings.**

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

**We measure earning efficiency drop instead of relying on traffic data alone for accurate disruption detection.**

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

**We compensate riders only when waiting time directly reduces earning opportunities.**









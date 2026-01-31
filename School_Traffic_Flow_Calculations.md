# 🚦 RTA NEXUS: Traffic Flow & Congestion Physics
## The Mathematics of School Zone Dynamics

---

## 🎯 Overview
This document details the mathematical framework used by RTA NEXUS to predict, measure, and mitigate traffic congestion. It differentiates between **Free Flow** (the ideal state) and **Congestion/Saturation** (the queue state), providing the formulas required to calculate system capacity and throughput.

---

## 1. Core Variables & Definitions

| Symbol | Definition | Unit | Description |
| :--- | :--- | :--- | :--- |
| **$V$** | **Volume (Demand)** | VEH/hr | Number of vehicles attempting to enter the system. |
| **$C$** | **Capacity** | VEH/hr | Maximum number of vehicles the road segment can handle. |
| **$S$** | **Speed** | km/h | Average speed of the traffic flow. |
| **$S_{ff}$** | **Free Flow Speed** | km/h | Speed when density is near zero (e.g., Speed Limit). |
| **$D$** | **Density** | VEH/km | Number of vehicles occupying a segment of road. |
| **$D_{jam}$** | **Jam Density** | VEH/km | Density when traffic comes to a complete halt ($S = 0$). |
| **$t_{dwell}$** | **Dwell Time** | seconds | Time a car is stationary in a bay (loading/unloading). |
| **$N_{bays}$** | **Number of Bays** | count | Total active drop-off/pick-up spots. |
| **$L_{q}$** | **Queue Length** | meters | Physical length of the backup. |

---

## 2. Drop-Off Zone Physics (The Bottleneck)

The school drop-off zone is treated as a **Multi-Server Queueing System (M/D/c)**, where active bays are "servers" and cars are "customers".

### A. Theoretical Capacity (Service Rate)
The maximum throughput of the drop-off zone in a perfect scenario.

$$ \mu = \frac{3600}{t_{dwell} + t_{maneuver}} \times N_{bays} $$

*   **$\mu$**: Service Rate (Capacity in Cars per Hour)
*   **$3600$**: Seconds in an hour
*   **$t_{dwell}$**: Average time to unload specific to age group (e.g., KG = 45s, Secondary = 15s)
*   **$t_{maneuver}$**: Lost time pulling in/out (avg 10s)

### B. Traffic Intensity (Saturation Ratio)
Determines if the system is holding up or failing.

$$ \rho = \frac{\lambda}{\mu} $$

*   **$\lambda$**: Arrival Rate (Cars arriving per hour)
*   **$\mu$**: Service Rate (Capacity per hour)

| Value | State | NEXUS Action |
| :--- | :--- | :--- |
| $\rho < 0.75$ | **Free Flow** | Green Status usually. |
| $0.75 < \rho < 0.95$ | **Unstable Flow** | Warning: Buffer capacity diminishing. |
| $\rho \ge 1.0$ | **Congestion** | **CRITICAL**: Queue is growing infinitely. |

---

## 3. Road Segment Logic (The Approaches)

Outside the immediate drop-off zone, we use a modified **Greenshields’ Model** to calculate flow on the approach roads.

### A. Speed vs. Density Relationship
As density increases, speed decreases linearly.

$$ S = S_{ff} \left( 1 - \frac{D}{D_{jam}} \right) $$

### B. Flow (Q) Equation
Flow is the product of Speed and Density.

$$ Q = S \times D = S_{ff} \left( D - \frac{D^2}{D_{jam}} \right) $$

*   **Max Flow ($Q_{max}$)** occurs when $D = \frac{D_{jam}}{2}$.
*   **Critical Speed** at max flow is typically $\frac{S_{ff}}{2}$.

---

## 4. Congestion & Queue Buildup Calculation

When Arrival Rate ($\lambda$) exceeds Service Rate ($\mu$), a queue forms. This calculation determines how fast the queue grows (Shockwave Analysis).

### A. Queue Growth Rate
$$ \Delta Q_{rate} = \lambda - \mu \quad (\text{only valid when } \lambda > \mu) $$

*   Result is in **Vehicles per Hour** of accumulation.

### B. Physical Queue Length
$$ L_{q}(t) = (\Delta Q_{rate} \times t) \times L_{avg\_vehicle} $$

*   **$t$**: Duration of the surge (hours).
*   **$L_{avg\_vehicle}$**: Space a car occupies in a queue (avg 7 meters considering gaps).

### C. Time to Dissipate (Recovery)
Once the surge ends (Arrivals drop to $\lambda_{new} < \mu$), how long to clear the backlog?

$$ T_{clear} = \frac{N_{backlog}}{\mu - \lambda_{new}} $$

*   **$N_{backlog}$**: Number of cars currently in queue.

---

## 5. Example Scenario Calculation

**Scenario**:
*   **School**: NEXUS Academy
*   **Input**: 500 cars arriving between 7:30 - 8:00 (Arrival Rate $\lambda = 1000$ veh/hr).
*   **Infrastructure**: 10 Drop-off Bays ($N_{bays} = 10$).
*   **Behavior**: Avg Dwell time 35s + 10s maneuver ($t_{total} = 45s$).

### Step 1: Calculate Service Rate ($\mu$)
$$ \mu = \frac{3600}{45} \times 10 = 80 \times 10 = \mathbf{800 \text{ veh/hr}} $$

### Step 2: Determine Saturation ($\rho$)
$$ \rho = \frac{1000}{800} = \mathbf{1.25} $$
*   **Result**: $\rho > 1.0$. The system is failing. Congestion is occurring.

### Step 3: Calculate Queue Growth
$$ \Delta Q_{rate} = 1000 - 800 = \mathbf{200 \text{ cars/hr}} $$
Over the 30-minute peak ($t = 0.5$):
$$ \text{Backlog} = 200 \times 0.5 = \mathbf{100 \text{ cars}} $$

### Step 4: Calculate Physical Impact
$$ L_{q} = 100 \text{ cars} \times 7 \text{ meters} = \mathbf{700 \text{ meters}} $$
*   **Impact**: The queue extends 0.7 km out of the school gate.

### Step 5: NEXUS Mitigation
NEXUS detects $\rho = 1.25$ ahead of time.
**Action**: Extend arrival window or open 3 overflow bays.
**New Capacity with 13 Bays**:
$$ \mu_{new} = 80 \times 13 = 1040 \text{ veh/hr} $$
$$ \rho_{new} = \frac{1000}{1040} = \mathbf{0.96} $$
*   **Result**: Queue is eliminated (or kept negligible).


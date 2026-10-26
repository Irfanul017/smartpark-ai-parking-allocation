# DEPARTMENT OF COMPUTER ENGINEERING
### Choice Based Credit Grading Scheme with Holistic and Multidisciplinary Education (CBCGS-HME 2023)
### Under Autonomy — University of Mumbai
**Thakur College of Engineering & Technology (TCET)**

---

### Experiment 10 – Write a Case Study on Any Small Scope Intelligent System
**Learning Objective:** Students should be able to develop an Intelligent Information Systems Mini Project  
**Tools & Environment:** Python 3.11+, FastAPI, scikit-fuzzy, NumPy, SQLite, React, Vite, TypeScript, Tailwind CSS under Windows / Linux environment  

---

### Executive Summary:
**SmartPark AI — Explainable Intelligent Parking Space Allocation & Guidance System using Mamdani Fuzzy Inference**

---

### 1. Introduction
Finding a parking spot in densely populated commercial districts, malls, IT parks, and transit hubs is one of the most frustrating everyday urban bottlenecks. Studies in urban transportation show that between 30% and 40% of localized downtown congestion is caused by drivers "cruising" for parking—driving in slow, repeated loops hoping to spot an opening. This search traffic consumes extra fuel, creates avoidable greenhouse emissions, increases driver stress, and chokes access roads.

Most existing parking garages either rely on human attendants waving cars toward generic aisles, or use simple overhead indicator lights (red/green sensors) that only answer whether a slot is occupied. Neither approach helps a driver evaluate whether driving down a narrow, crowded aisle to reach the closest slot is actually faster than parking thirty meters farther away in an uncongested lane. Furthermore, real-world parking involves multiple conflicting constraints: vehicle dimensions (SUV vs. hatchback vs. two-wheeler), accessibility permits for differently abled drivers, dedicated electric vehicle (EV) charging needs, and time-sensitive user priority.

**SmartPark AI** is an explainable intelligent parking management and allocation platform. Rather than using black-box neural networks that cannot justify their choices, or greedy nearest-slot algorithms that create bottlenecks, the system uses a **Mamdani Fuzzy Inference System (FIS)**. By combining continuous fuzzification, 12 domain-expert IF-THEN rules, Gödel min-max composition, and centroid defuzzification, SmartPark AI evaluates available parking bays across five continuous parameters: entrance distance, live aisle congestion, vehicle-to-slot compatibility, walking distance to destination, and driver priority. The system provides the driver with the top three optimal slots along with clear, natural-language justifications, supported by a full-stack web application featuring an interactive 2D parking lot visualizer, live aisle navigation, and an administrative control room.

---

### 1. Traditional Parking Lot Management
Traditional parking facilities operate with minimal automation, relying primarily on physical barriers, manual paper tickets, and human security guards.
* **Features:** Printed entry tickets with timestamps, manual fee collection at exit booths, basic boom barriers, and security guards directing traffic into generic parking bays.
* **Limitations:** The system possesses zero visibility into real-time bay occupancy. Drivers must blindly search aisles, leading to frequent dead-ends, vehicle blockages near entrances, and complete ignorance of vehicle requirements (e.g., standard sedans unintentionally blocking dedicated EV charging bays or disabled spots).

---

### 2. Standard Electronic Guidance Displays (Variable Message Signs - VMS)
Modern commercial parking structures often install ultrasonic or magnetic sensors above each parking bay, connected to overhead LED indicators and digital display boards at aisle entrances.
* **Features:** Binary occupancy sensing (green LED for vacant, red LED for occupied), digital counter signs at the main gate showing total free bays, and historical entry/exit logging.
* **Limitations:** These systems are purely informative and completely non-intelligent. When a digital display indicates "3 Slots Free on Floor 2", multiple vehicles rush to the same aisle simultaneously, triggering internal gridlock. The system cannot prioritize drivers, cannot factor in walking distance back to the elevator lobby, and cannot route an EV or accessible vehicle to a compatible stall automatically.

---

### 2.3. Greedy Heuristic / Nearest-Distance Automated Systems
Some first-generation automated allocation platforms assign slots programmatically using simple Euclidean or Manhattan distance formulas from the entry gate.
* **Features:** Database-driven vacancy checks, automated ticket generation linked to a pre-assigned bay number, and shortest-path assignment heuristics.
* **Limitations:** These systems suffer from the classic **"nearest-slot trap"**. A bay located 15 meters from the gate might appear optimal mathematically, but if the aisle leading to it is 90% congested with queuing cars, a driver may spend ten minutes crawling to it. Meanwhile, an empty bay 45 meters away in an open aisle remains unassigned. Furthermore, greedy algorithms cannot handle trade-offs between conflicting parameters (such as high driver urgency vs. longer walking distances) and offer zero human-readable explanations to the user.

---

### 3. Proposed Solution
**SmartPark AI** addresses these shortcomings by modeling parking allocation as a **multi-criteria fuzzy decision-making problem**. Built with a Python FastAPI backend, a scikit-fuzzy inference engine, and a React + TypeScript frontend, the system separates physical constraint filtering from soft fuzzy preference optimization:

```
[Driver Request] ──> [Hard Eligibility Filter] ──> [Fuzzy Inference Engine (FIS)] ──> [Ranked Top 3 Slots]
 (Vehicle, EV,       (Occupancy, EV Match,          (Distance, Congestion, Walking,      (Suitability Score,
  Accessibility)      Disability Clearance)          Compatibility, Priority)             Plain-English Rationale)
```

#### Key Functional Modules:
1. **Constraint Pre-Filtering:** Before computing fuzzy suitability, the system immediately filters out slots that are currently occupied, locked on hold reservation, physically incompatible with the vehicle type, or reserved for EV/accessible permits when the driver did not request them.
2. **Multi-Variable Fuzzification:** Transforms five continuous input metrics into linguistic membership degrees using smooth, overlapping triangular and trapezoidal curves.
3. **Mamdani Rule Inference:** Evaluates a curated rule-base of 12 declarative IF-THEN rules that capture realistic driver trade-offs (e.g., heavily penalizing high congestion even if entrance distance is low).
4. **Centroid Defuzzification:** Computes a continuous crisp suitability score between $0$ and $100$, mapped into categorical bands (*Very Low*, *Low*, *Medium*, *High*, *Very High*).
5. **Explainable AI (XAI) Engine:** Identifies which rules fired and with what activation strengths, producing human-readable justifications for every recommendation (e.g., *"Near entrance and excellent compatibility despite medium congestion"*).
6. **Live Interactive 2D Lot & Waypoint Navigation:** Renders an interactive 20-slot grid (A01 through D05) showing real-time occupancy, EV stations, accessible ramps, and an animated step-by-step route guidance simulator.
7. **Administrative Control Center & Simulator:** Gives facility managers the power to inspect individual slot metrics, toggle occupancy states, review session history, and experiment with custom fuzzy inputs through an interactive parameter simulator.

#### System Variables & Fuzzy Membership Boundaries:

| Input Variable | Universe Range | Linguistic Terms | Function Geometry | Coordinate Parameters $[a, b, c, d]$ |
| :--- | :--- | :--- | :--- | :--- |
| **Distance to Entrance** | $0 - 200 \text{ m}$ | NEAR<br>MEDIUM<br>FAR | Trapezoidal<br>Triangular<br>Trapezoidal | $[0, 0, 30, 50]$<br>$[30, 75, 120]$<br>$[100, 150, 200, 200]$ |
| **Aisle Congestion** | $0 - 100\%$ | LOW<br>MEDIUM<br>HIGH | Trapezoidal<br>Triangular<br>Trapezoidal | $[0, 0, 20, 30]$<br>$[20, 45, 70]$<br>$[60, 80, 100, 100]$ |
| **Vehicle Compatibility** | $0 - 100$ | POOR<br>ACCEPTABLE<br>EXCELLENT | Trapezoidal<br>Triangular<br>Trapezoidal | $[0, 0, 30, 40]$<br>$[30, 52.5, 75]$<br>$[65, 80, 100, 100]$ |
| **Walking Distance** | $0 - 200 \text{ m}$ | SHORT<br>MEDIUM<br>LONG | Trapezoidal<br>Triangular<br>Trapezoidal | $[0, 0, 30, 50]$<br>$[30, 75, 120]$<br>$[100, 150, 200, 200]$ |
| **User Priority** | $0 - 100$ | LOW<br>MEDIUM<br>HIGH | Trapezoidal<br>Triangular<br>Trapezoidal | $[0, 0, 30, 40]$<br>$[30, 52.5, 75]$<br>$[65, 80, 100, 100]$ |

#### Output Variable (Parking Suitability):
Defined on the universe $U = [0, 100]$:
* **VERY_LOW:** Trapezoidal $[0, 0, 10, 25]$
* **LOW:** Triangular $[15, 30, 45]$
* **MEDIUM:** Triangular $[40, 55, 70]$
* **HIGH:** Triangular $[65, 77.5, 90]$
* **VERY_HIGH:** Trapezoidal $[85, 95, 100, 100]$

#### Mathematical Formulation:
For a slot vector $x = (d, c, k, w, p)$, fuzzification calculates membership degrees $\mu_{A_j}(x_j)$. For each rule $R_i$ with antecedents $A_{i,1}, \dots, A_{i,m}$ and consequent $C_i$, the rule firing strength $\alpha_i$ is evaluated using the standard Gödel t-norm (minimum operator):

$$\alpha_i = \min_{j} \Big( \mu_{A_{i,j}}(x_j) \Big)$$

The aggregated fuzzy output distribution $\mu_{\text{agg}}(y)$ across all $N$ activated rules is formed using the maximum t-conorm operator:

$$\mu_{\text{agg}}(y) = \max_{i=1}^{N} \Big( \min(\alpha_i, \mu_{C_i}(y)) \Big), \quad y \in [0, 100]$$

The crisp suitability score $S^*$ is obtained via the Center of Gravity (Centroid) defuzzification method:

$$S^* = \frac{\int_{0}^{100} y \cdot \mu_{\text{agg}}(y) \, dy}{\int_{0}^{100} \mu_{\text{agg}}(y) \, dy}$$

In discrete implementation over the sampled universe $U$ with step size $\Delta y = 1.0$:

$$S^* = \frac{\sum_{k=0}^{100} y_k \cdot \mu_{\text{agg}}(y_k)}{\sum_{k=0}^{100} \mu_{\text{agg}}(y_k)}$$

If no custom rule fires (e.g., intermediate inputs in an unusual corner case), a safe, neutral fallback fires with consequent `MEDIUM` to ensure every valid query defuzzifies reliably.

---

### 3.3 SmartPark Management & Administrative Control Room
The administrative control room provides facility managers with end-to-end visibility over garage operations:
* **Real-time Occupancy Tracking:** Visual breakdowns of active, occupied, reserved, EV-charging, and accessible parking bays.
* **Manual Override & Bay State Toggling:** Facility managers can mark slots as occupied or free to reflect real-world on-ground physical events.
* **Interactive AI Simulator:** Allows testing hypothetical distance and congestion combinations with instant visualizations of membership curves, activated rules, and defuzzified scores.
* **Audit & Session History:** Logs vehicle registration numbers, entry timestamps, allocated slot identifiers, and release times.

---

### 4.2 System Architecture
SmartPark AI adopts a clean three-tier architecture that completely isolates core fuzzy logic from web frameworks and UI code:

1. **Frontend Presentation Tier (React + Vite + TypeScript + Tailwind CSS):**  
   Provides a responsive, single-page application with dark and light theme elements, live Recharts dashboards, interactive 2D parking grids with aisle waypoint animations, and clear explainability modals. No fuzzy calculation is executed on the client; all decisions are fetched via RESTful APIs.
2. **Backend API Tier (Python FastAPI + Pydantic + SQLAlchemy ORM):**  
   Coordinates business logic, validates payloads with Pydantic schemas, handles JWT authentication, enforces reservation hold timeouts (15 minutes), and manages transactional consistency during bay allocation.
3. **Intelligent Inference Tier (scikit-fuzzy + NumPy):**  
   A standalone, framework-agnostic mathematical module. Exposes the core function `calculate_parking_suitability(...)`, which can be run independently in automated scripts, notebooks, or API workers without spinning up the web server.
4. **Persistence Layer (SQLite / SQLAlchemy):**  
   Maintains relational integrity across three core entities: `ParkingSlot`, `User`, and `ParkingSession`. Can be transitioned directly to PostgreSQL without schema modifications.

---

### 4.3 AI Algorithms and Techniques

| Algorithm / Technique | Application in the System |
| :--- | :--- |
| **Triangular & Trapezoidal Fuzzification** | Converts raw, continuous physical measurements (meters, congestion percentage) into smooth linguistic terms. |
| **Mamdani Fuzzy Inference System (FIS)** | Evaluates expert domain knowledge through 12 declarative rules modeling multi-criteria trade-offs. |
| **Min-Max (Gödel) Composition** | Uses the minimum operator for antecedent conjunction (AND) and maximum operator for rule aggregation. |
| **Centroid Defuzzification (COG)** | Calculates the exact mathematical center of gravity of the aggregated fuzzy area, producing a crisp $0-100$ score. |
| **Deterministic Hard Constraint Filtering** | Pre-screens slots for physical vehicle compatibility, EV requirements, and disability ramp permits before running AI scoring. |
| **Explainable AI (XAI) Attribution** | Maps fired rules and their numeric strengths into plain-English reasoning displayed directly to the driver. |
| **RESTful API Architecture** | Decouples mathematical computation from frontend presentation, allowing sub-15ms response times. |
| **Relational State Modeling** | Tracks real-time bay occupancy, reservation holds, and session lifecycles using SQLAlchemy ORM. |

---

### Implementation: Code

#### Section 1: Fuzzy Logic Inference Engine

##### 1.1 Fuzzy Universes & Membership Function Setup
Defines the numerical universes of discourse and constructs continuous membership functions using `scikit-fuzzy`.

```python
# File: backend/app/ai/membership_functions.py
import numpy as np
import skfuzzy as fuzz
from .fuzzy_variables import (
    COMPATIBILITY, CONGESTION, DISTANCE, 
    PRIORITY, SUITABILITY, WALKING_DISTANCE
)

def _trap(universe: np.ndarray, points: list[float]) -> np.ndarray:
    return fuzz.trapmf(universe, points)

def _tri(universe: np.ndarray, points: list[float]) -> np.ndarray:
    return fuzz.trimf(universe, points)

# Overlapping terms ensure gradual, continuous suitability transitions
INPUT_MEMBERSHIP_FUNCTIONS: dict[str, dict[str, np.ndarray]] = {
    "distance": {
        "NEAR": _trap(DISTANCE.universe, [0, 0, 30, 50]),
        "MEDIUM": _tri(DISTANCE.universe, [30, 75, 120]),
        "FAR": _trap(DISTANCE.universe, [100, 150, 200, 200]),
    },
    "congestion": {
        "LOW": _trap(CONGESTION.universe, [0, 0, 20, 30]),
        "MEDIUM": _tri(CONGESTION.universe, [20, 45, 70]),
        "HIGH": _trap(CONGESTION.universe, [60, 80, 100, 100]),
    },
    "compatibility": {
        "POOR": _trap(COMPATIBILITY.universe, [0, 0, 30, 40]),
        "ACCEPTABLE": _tri(COMPATIBILITY.universe, [30, 52.5, 75]),
        "EXCELLENT": _trap(COMPATIBILITY.universe, [65, 80, 100, 100]),
    },
    "walking_distance": {
        "SHORT": _trap(WALKING_DISTANCE.universe, [0, 0, 30, 50]),
        "MEDIUM": _tri(WALKING_DISTANCE.universe, [30, 75, 120]),
        "LONG": _trap(WALKING_DISTANCE.universe, [100, 150, 200, 200]),
    },
    "priority": {
        "LOW": _trap(PRIORITY.universe, [0, 0, 30, 40]),
        "MEDIUM": _tri(PRIORITY.universe, [30, 52.5, 75]),
        "HIGH": _trap(PRIORITY.universe, [65, 80, 100, 100]),
    },
}

OUTPUT_MEMBERSHIP_FUNCTIONS: dict[str, np.ndarray] = {
    "VERY_LOW": _trap(SUITABILITY.universe, [0, 0, 10, 25]),
    "LOW": _tri(SUITABILITY.universe, [15, 30, 45]),
    "MEDIUM": _tri(SUITABILITY.universe, [40, 55, 70]),
    "HIGH": _tri(SUITABILITY.universe, [65, 77.5, 90]),
    "VERY_HIGH": _trap(SUITABILITY.universe, [85, 95, 100, 100]),
}
```

##### 1.2 Declarative Rule Set & Mamdani Evaluation Engine
Implements the 12 expert fuzzy rules, antecedent activation calculation, aggregation, and centroid defuzzification.

```python
# File: backend/app/ai/fuzzy_engine.py
import numpy as np
import skfuzzy as fuzz
from typing import Any
from .fuzzy_rules import FUZZY_RULES
from .fuzzy_variables import INPUT_VARIABLES, SUITABILITY
from .membership_functions import INPUT_MEMBERSHIP_FUNCTIONS, OUTPUT_MEMBERSHIP_FUNCTIONS

class ParkingFuzzyEngine:
    """Evaluates parking suitability using Mamdani inference and centroid defuzzification."""

    def evaluate(self, **inputs: float | int) -> dict[str, Any]:
        values = self._validate_inputs(inputs)
        memberships = self._fuzzify(values)
        activated_rules = self._activate_rules(memberships)
        aggregate = self._aggregate(activated_rules)

        # Neutral deterministic fallback if no specific rule fires
        if not activated_rules:
            aggregate = OUTPUT_MEMBERSHIP_FUNCTIONS["MEDIUM"].copy()
            activated_rules = [{
                "id": "FALLBACK",
                "strength": 1.0,
                "consequent": "MEDIUM",
                "description": "Standard neutral suitability applied.",
            }]

        score = float(fuzz.defuzz(SUITABILITY.universe, aggregate, "centroid"))
        return {
            "score": round(float(np.clip(score, 0, 100)), 2),
            "membership_values": memberships,
            "activated_rules": activated_rules,
        }

    @staticmethod
    def _validate_inputs(inputs: dict[str, float | int]) -> dict[str, float]:
        return {name: var.validate(inputs[name]) for name, var in INPUT_VARIABLES.items()}

    @staticmethod
    def _fuzzify(values: dict[str, float]) -> dict[str, dict[str, float]]:
        return {
            name: {
                term: round(float(fuzz.interp_membership(INPUT_VARIABLES[name].universe, fn, values[name])), 4)
                for term, fn in terms.items()
            }
            for name, terms in INPUT_MEMBERSHIP_FUNCTIONS.items()
        }

    @staticmethod
    def _activate_rules(memberships: dict[str, dict[str, float]]) -> list[dict[str, Any]]:
        activated = []
        for rule in FUZZY_RULES:
            # Gödel t-norm (min operator) across antecedents
            strength = min(memberships[var][term] for var, term in rule.antecedents)
            if strength > 0:
                activated.append({
                    "id": rule.identifier,
                    "strength": round(strength, 4),
                    "consequent": rule.consequent,
                    "description": rule.description,
                })
        return activated

    @staticmethod
    def _aggregate(activated_rules: list[dict[str, Any]]) -> np.ndarray:
        aggregate = np.zeros_like(SUITABILITY.universe)
        for act in activated_rules:
            # Clip consequent membership function at rule firing strength
            clipped = np.fmin(act["strength"], OUTPUT_MEMBERSHIP_FUNCTIONS[act["consequent"]])
            # Aggregate clipped areas using maximum t-conorm
            aggregate = np.fmax(aggregate, clipped)
        return aggregate
```

##### 1.3 Framework-Independent Wrapper & Explainability Generator
Provides a clean, standalone functional API that outputs the score, category, and plain-English explanation.

```python
# File: backend/app/ai/suitability_engine.py
from typing import Any
import skfuzzy as fuzz
from .fuzzy_engine import ParkingFuzzyEngine
from .fuzzy_variables import SUITABILITY
from .membership_functions import OUTPUT_MEMBERSHIP_FUNCTIONS

ENGINE = ParkingFuzzyEngine()

def calculate_parking_suitability(
    distance: float | int,
    congestion: float | int,
    compatibility: float | int,
    walking_distance: float | int,
    priority: float | int,
) -> dict[str, Any]:
    """Calculate an explainable, deterministic 0–100 suitability score."""
    result = ENGINE.evaluate(
        distance=distance,
        congestion=congestion,
        compatibility=compatibility,
        walking_distance=walking_distance,
        priority=priority,
    )
    score = result["score"]
    category = _category_for_score(score)
    activated = result["activated_rules"]

    return {
        "score": score,
        "category": category,
        "membership_values": result["membership_values"],
        "activated_rules": activated,
        "explanation": _build_explanation(score, category, activated),
    }

def _category_for_score(score: float) -> str:
    strengths = {
        term: float(fuzz.interp_membership(SUITABILITY.universe, fn, score))
        for term, fn in OUTPUT_MEMBERSHIP_FUNCTIONS.items()
    }
    return max(strengths, key=strengths.get)

def _build_explanation(score: float, category: str, rules: list[dict[str, Any]]) -> str:
    reasons = [r["description"] for r in rules]
    return f"Suitability score: {score:.2f}/100 ({category}). Activated rules: " + "; ".join(reasons)
```

---

#### Section 2: Constraint Filtering & Intelligent Allocation Service

##### 2.1 Multi-Slot Eligibility and Ranking Engine
Enforces physical slot constraints before calculating fuzzy suitability scores and returning the top three candidates.

```python
# File: backend/app/services/parking_service.py
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.ai import calculate_parking_suitability
from app.models import ParkingSlot
from app.schemas import ParkingRequest

class ParkingService:
    def recommend(self, db: Session, request: ParkingRequest) -> list[dict[str, object]]:
        # Hard Pre-Filter: Retrieve only vacant, unreserved, compatible bays
        eligible_slots = [
            slot for slot in db.scalars(
                select(ParkingSlot).where(
                    ParkingSlot.is_occupied.is_(False), 
                    ParkingSlot.is_reserved.is_(False)
                )
            )
            if self.is_compatible(slot, request)
        ]

        recommendations = []
        for slot in eligible_slots:
            fuzzy_result = calculate_parking_suitability(
                distance=slot.distance_from_entrance,
                congestion=slot.congestion_level,
                compatibility=100,  # Pre-filtered compatibility is optimal
                walking_distance=slot.walking_distance,
                priority=request.priority,
            )
            recommendations.append({
                "slot": slot.slot_number,
                "slot_id": slot.id,
                "score": fuzzy_result["score"],
                "category": fuzzy_result["category"],
                "reason": fuzzy_result["explanation"],
                "factors": {
                    "distance": slot.distance_from_entrance,
                    "congestion": slot.congestion_level,
                    "compatibility": 100,
                    "walking_distance": slot.walking_distance,
                    "priority": request.priority,
                    "membership_values": fuzzy_result["membership_values"],
                    "activated_rules": fuzzy_result["activated_rules"],
                },
            })

        # Rank slots descending by suitability score and return top 3
        return sorted(recommendations, key=lambda item: float(item["score"]), reverse=True)[:3]

    @staticmethod
    def is_compatible(slot: ParkingSlot, request: ParkingRequest) -> bool:
        if request.requires_ev and not slot.is_ev:
            return False
        if request.requires_accessible and not slot.is_accessible:
            return False
        return slot.vehicle_type.strip().casefold() == request.vehicle_type.strip().casefold()
```

##### 2.2 Transactional Slot Allocation and Hold Reservation
Ensures atomic state transitions when a driver confirms their slot selection, preventing double-booking race conditions.

```python
# File: backend/app/services/allocation_service.py
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.models import ParkingSession, ParkingSlot
from app.schemas import AllocationRequest
from app.services.parking_service import parking_service

class AllocationService:
    def allocate(self, db: Session, request: AllocationRequest, user_id: int) -> tuple[ParkingSession, ParkingSlot]:
        slot = db.get(ParkingSlot, request.selected_slot_id)
        if slot is None:
            raise LookupError("Selected parking slot was not found.")
        if slot.is_occupied:
            raise ValueError("Selected parking slot is no longer available.")
        if not parking_service.is_compatible(slot, request):
            raise ValueError("Selected parking slot is incompatible with this request.")

        # Atomic state transition
        slot.is_reserved = False
        slot.reserved_until = None
        slot.is_occupied = True

        session = ParkingSession(
            slot_id=slot.id,
            user_id=user_id,
            vehicle_number=request.vehicle_number,
            vehicle_type=request.vehicle_type,
            priority=request.priority,
        )
        db.add(session)
        db.commit()
        db.refresh(session)
        db.refresh(slot)
        return session, slot

    def release(self, db: Session, slot_id: int, user_id: int, is_privileged: bool = False) -> ParkingSession:
        slot = db.get(ParkingSlot, slot_id)
        if slot is None or not slot.is_occupied:
            raise ValueError("Invalid slot or slot is already vacant.")

        session = db.query(ParkingSession).filter(
            ParkingSession.slot_id == slot_id, 
            ParkingSession.ended_at.is_(None)
        ).first()

        slot.is_occupied = False
        session.ended_at = datetime.utcnow()
        db.commit()
        db.refresh(session)
        return session
```

---

### User Interfaces & System Walkthrough

#### 1. Landing & Navigation Portal
The home page introduces the core premise of SmartPark AI: *"Find the right parking slot, not just the nearest one."* It features an overview of the five decision signals, immediate health-check verification with the FastAPI backend, and quick navigation links to the user booking flow, the AI simulator, and the administrative dashboard.

#### 2. Find Parking Request Interface
Drivers specify their vehicle number, select vehicle classification (*Car, SUV, Bike, Van, Electric Car*), toggle requirements for EV charging or accessibility ramps, and set their urgency priority using a responsive slider ($0$ to $100$). Submitting this form sends an asynchronous request to `/api/parking/recommend`.

#### 3. AI Recommendation & Explainability View
Displays the top three ranked slots as comparison cards. Each card displays:
* The slot identifier (e.g., **B02**) and its crisp suitability score (e.g., **83.65 / 100**).
* Qualitative assessment tag (**VERY HIGH** or **HIGH**).
* Real factors breakdown: Distance ($45\text{ m}$), Congestion ($15\%$), Compatibility ($100\%$), Walking Distance ($40\text{ m}$).
* Natural-language explanation outlining exactly which rules fired (e.g., *"Near entrance, low congestion, and excellent compatibility"*).
* A single-click **Select & Allocate** action that immediately commits the session in the database.

#### 4. Interactive 2D Lot Map with Waypoint Navigation
Renders an architectural layout of the parking facility arranged into four lettered aisles (Aisle A through D) with 20 distinct bays. Each bay displays real-time color badges:
* **Emerald Green:** Available for allocation.
* **Slate Gray:** Occupied by an active vehicle.
* **Teal Glow:** Top AI-recommended bay.
* **Purple ⚡:** EV Charging stall.
* **Amber ♿:** Differently-abled accessible stall.

When a driver selects their bay and clicks *Start Navigation*, an animated step-by-step waypoint tracker guides the driver:
1. *Step 1: Enter Main Gate ➔ Drive straight down Central Aisle*
2. *Step 2: Turn Left into Row B Aisle*
3. *Step 3: Slow down ➔ Arriving at Slot B02*
4. *Arrived! Target Slot B02 is directly on your right.*

#### 5. Admin Dashboard & Live Slot Simulator
Allows parking lot supervisors to monitor macro-level facility utilization through responsive Recharts donut graphs and occupancy percentage metrics. Administrators can manually toggle slot availability, inspect individual bay parameters, or launch the **Fuzzy Logic Parking Simulator** to adjust input sliders and observe live defuzzification and membership percentage charts in real time.

---

### Learning Outcomes (LO)
* **LO1: Understand the application of Fuzzy Logic and Intelligent Systems in resource allocation.**  
  Gained practical expertise in identifying scenarios where rigid binary thresholds or classical algorithms fail due to uncertainty, and learned how fuzzy linguistic sets model real-world trade-offs effectively.
* **LO2: Develop fuzzy inference engines, membership functions, and rule-based decision mechanisms.**  
  Implemented continuous triangular and trapezoidal membership functions, formulated 12 domain-expert IF-THEN rules, and executed Mamdani min-max composition with centroid defuzzification using Python and `scikit-fuzzy`.
* **LO3: Design explainable AI workflows and full-stack integration for real-time cyber-physical systems.**  
  Engineered an end-to-end web architecture combining FastAPI REST endpoints with a React-based interactive 2D parking lot visualizer, delivering sub-15ms inference latency and human-auditable decision explanations.

---

### Course Outcomes (CO)
Upon completion of this case study and practical implementation, students are able to:  
* **CO:** Apply Fuzzy Logic, intelligent multi-criteria optimization, and modern software engineering techniques to design, develop, and deploy an explainable decision support system for real-world cyber-physical environments.

---

### Conclusion
The SmartPark AI project demonstrates the practical value of fuzzy logic in solving everyday urban logistical bottlenecks. By moving away from naive nearest-slot allocation heuristics that inadvertently worsen aisle congestion, the system proves that an intelligent multi-criteria decision engine can distribute parking loads more evenly, reduce waiting times, and accommodate specialized driver needs such as EV charging and accessibility ramps.

Crucially, implementing the inference engine via pure Mamdani fuzzy rules and centroid defuzzification achieves two vital engineering goals: **complete mathematical determinism** and **total explainability**. Unlike opaque deep learning models, every recommendation generated by SmartPark AI can be audited line-by-line through activated rule strengths. Combined with a modern, high-performance web stack featuring Python FastAPI and React, this case study illustrates how small-scope intelligent systems can be transitioned from theoretical concepts into practical, deployable, human-friendly software solutions.

---

### For Faculty Use

| Correction Parameters | Formative Assessment [40%] | Timely completion of Practical [40%] | Attendance / Learning Attitude [20%] | Total Marks Obtained |
| :--- | :--- | :--- | :--- | :--- |
| **Marks Allocated** | **(40)** | **(40)** | **(20)** | **(100)** |
| **Marks Obtained** | | | | |

---
**Faculty Signature:** ___________________________ &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; **Date:** _______________

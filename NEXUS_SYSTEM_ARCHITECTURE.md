# NEXUS: Comprehensive System Architecture

This content provides a deep technical overview of the NEXUS Traffic & Logistics Command Center, including Data Models and Sequence Interactions.

---

## 1. System Entity Relationship Diagram (ERD)

The following diagram illustrates the core data structure driving the NEXUS applications, Command Center, and Nexus Companion App.

```mermaid
erDiagram
    %% Core Users
    USER {
        string id PK
        string role "parent | student | admin"
        string name
        boolean isAuthenticated
    }
    
    PARENT {
        string id PK
        string userId FK
        float nolBalance
        string phone
    }
    
    STUDENT {
        string id PK
        string parentId FK
        string name
        string grade
        string rfidTag
        string status "in-class | released | waiting | loaded"
    }

    %% Logistics & Operations
    VEHICLE {
        string id PK
        string ownerId FK
        string plateNumber
        string rfidTag
        string color
        string model
        boolean isPrimary
    }

    TRIP {
        string id PK
        string parentId FK
        string studentId FK
        string type "pickup | dropoff"
        string status "idle | en-route | arrived | completed"
        string bookedSlot "nullable"
        datetime startTime
        datetime endTime
        integer durationSeconds
        integer pointsEarned
        float etaMinutes
    }

    %% Infrastructure
    ZONE {
        string id PK "A | B | C"
        string status "NORMAL | SURGE | CRITICAL"
        integer queueLength
        integer vehicleCount
    }

    BAY {
        string id PK
        string zoneId FK
        string status "OPEN | OCCUPIED | CLEARING"
        string phase "ENTRY | ACTION | EXIT"
        string assignedVehicleId FK
    }

    HISTORY_LOG {
        string id PK
        string tripId FK
        datetime timestamp
        string action "DEPART | ZONE_ENTER | GATE_ASSIGN | CHILD_LOAD | CONFIRM"
    }

    %% Relationships
    USER ||--o| PARENT : "is"
    USER ||--o| STUDENT : "is"
    PARENT ||--|{ STUDENT : "has"
    PARENT ||--|{ VEHICLE : "owns"
    PARENT ||--|{ TRIP : "initiates"
    TRIP ||--|{ HISTORY_LOG : "logs"
    TRIP }|--|| VEHICLE : "uses"
    ZONE ||--|{ BAY : "contains"
    BAY |o--o| VEHICLE : "occupies"
```

---

## 2. Sequence Diagrams

### 2.1 Parent Pickup Flow (Happy Path)

This sequence covers the standard "Leave Now" flow from the Parent App to child retrieval.

```mermaid
sequenceDiagram
    autonumber
    actor Parent
    participant App as Companion App
    participant Context as NexusContext (State)
    participant Cloud as NEXUS Cloud / API
    participant School as School System
    participant Gate as Gate Controller

    %% Phase 1: Initiation
    Parent->>App: Opens App
    App->>Context: Check Auth & Balance
    Context-->>App: State { idle, wallet: 450 }
    
    Parent->>App: Tap "I'M LEAVING NOW"
    App->>Context: startTrip()
    Context->>Context: Update tripStatus: 'en-route'
    Context->>Cloud: POST /trip/start { parentId }
    
    %% Phase 2: En Route
    Cloud->>School: Notify "Parent En Route"
    School->>School: Update Student Status: "Preparing"
    
    loop Every Minute
        Context->>Context: Decrease ETA
        Context-->>App: Update Progress Bar
    end

    %% Phase 3: Arrival Simulation
    Parent->>App: Tap "Simulate Arrival (Geofence)"
    App->>Context: triggerGeofenceEntry()
    Context->>Context: Update tripStatus: 'arrived'
    Context->>Cloud: Event: Geofence Enter
    
    Cloud->>Gate: Request Bay Assignment
    Gate-->>Cloud: Assign Bay #3 (Zone A)
    Cloud-->>Context: Gate: "A-3"
    
    Context-->>App: Display "Proceed to Bay A-3"
    School->>School: Release Student -> Gate

    %% Phase 4: Pickup
    Parent->>App: Arrive at Bay
    Gate->>Gate: LPR Scan (Verify Plate)
    School->>Gate: Student Scans RFID
    
    Gate->>Context: Child Detected at Bay
    App-->>Parent: "Child at Gate - Confirm Load"
    
    Parent->>App: Tap "CONFIRM CHILD LOADED"
    App->>Context: confirmPickup()
    Context->>Context: Update status: 'completed'
    Context->>Context: Add 50 Points to NOL Balance
    Context->>Context: Add to Trip History

    %% Phase 5: Feedback
    App-->>Parent: "Have a Safe Trip! (+50 pts)"
```

### 2.2 Scheduled Pickup Flow (Timeslot Booking)

This sequence illustrates the new "Timeslot" feature logic.

```mermaid
sequenceDiagram
    autonumber
    actor Parent
    participant App as Companion App
    participant Context as NexusContext
    participant Scheduler as Scheduling Engine

    Parent->>App: View Dashboard
    App->>Context: Check 'bookedSlot'
    Context-->>App: null
    
    Parent->>App: Tap "14:15" Slot
    App->>Context: bookSlot("14:15")
    Context->>Scheduler: RSV Pickup Slot { 14:15, parentId }
    Scheduler-->>Context: Confirmed
    Context-->>App: Update Button: "START SCHEDULED TRIP"
    
    %% On Departure Time
    Parent->>App: Tap "START SCHEDULED TRIP"
    App->>Context: startTrip()
    Context->>Scheduler: Validate On-Time Departure
    
    alt is On Time
        Scheduler-->>Context: Priority Routing: High
        Context->>Context: Set Priority Badge
    else is Late
        Scheduler-->>Context: Priority Routing: Normal
        Context-->>App: "Slot Missed - Moved to Queue"
    end
```

### 2.3 Student Status Updates (School to App)

How the Student App and Parent App stay in sync.

```mermaid
sequenceDiagram
    autonumber
    participant Teacher
    participant SchoolSystem
    participant Cloud as NEXUS Cloud
    participant StudentApp
    participant ParentApp

    %% In Class
    Teacher->>SchoolSystem: Mark Class Dismissed
    SchoolSystem->>Cloud: Update Grade 5 -> Released
    
    par Push to Student
        Cloud->>StudentApp: PUSH: "Pack your bags!"
        StudentApp-->>StudentApp: Show "Released" Badge
    and Push to Parent
        Cloud->>ParentApp: PUSH: "Adam is Released"
        ParentApp-->>ParentApp: Update Child Status
    end

    %% At Gate
    SchoolSystem->>Cloud: Student RFID Scan @ Gate B
    Cloud->>StudentApp: Update Status: "Waiting at Gate"
    Cloud->>ParentApp: Update Status: "AT GATE"
    
    ParentApp-->>ParentApp: Show Green Indicator
```

## 3. Core Logic Flowchart (System Brain)

The central logic governing the `NexusContext` simulation engine.

```mermaid
flowchart TD
    START([Init State]) --> CHECK_AUTH{Auth?}
    CHECK_AUTH -->|No| LOGIN[Show Login]
    CHECK_AUTH -->|Yes| DASH[Dashboard]
    
    DASH -->|Action| INTENT{User Intent}
    
    %% Pickup Logic
    INTENT -->|Book Slot| SLOT[Update bookedSlot]
    SLOT --> DASH
    
    INTENT -->|Start Trip| EN_ROUTE[Set Status: En-Route]
    EN_ROUTE --> LOOP_ETA{ETA > 0?}
    
    LOOP_ETA -->|Yes| TICK[Decr ETA / 1s]
    TICK --> LOOP_ETA
    
    LOOP_ETA -->|No| GEOFENCE[Trigger Geofence]
    INTENT -->|Simulate Arrival| GEOFENCE
    
    GEOFENCE --> GATE_LOGIC[Call Fuzzy Logic]
    GATE_LOGIC --> ASSIGN[Assign Gate A-1...C-5]
    ASSIGN --> ARRIVED[Set Status: Arrived]
    
    ARRIVED --> CONFIRM{User Confirms?}
    CONFIRM -->|Yes| REWARD[Calc Points]
    REWARD --> HISTORY[Append History]
    HISTORY --> COMPLETED[Set Status: Completed]
    
    %% Reset
    COMPLETED --> RESET[Reset to Idle]
```
# NEXUS Companion App: Design Specification

## Overview
The NEXUS Companion App is the mobile interface for Parents and Students, acting as the edge nodes for the NEXUS Command Center. It facilitates real-time coordination for the "Critical Minute" drop-off and "Secure Handoff" pickup protocols.

## User Roles
1.  **Parent/Guardian**: Drivers responsible for drop-off and pickup.
2.  **Student**: Primary users for pickup coordination (older students) or passive status tracking.

---

## 📱 Parent Experience

### 1. Drop-off Mode ("The Critical Minute")
*   **Objective**: Enable "Live Departure Sync" (LDS) to predict arrival and assign bays without queuing.
*   **Key Features**:
    *   **"Leaving Now" Button**: Triggers GPS tracking and ETA calculation.
    *   **Staging Status**:
        *   *State 1*: "Departed" (En route).
        *   *State 2*: "Hold" (If assigned to Staging Zone/Virtual Queue).
        *   *State 3*: "Proceed" (Gate Assigned).
    *   **Bay Guide**: Large, high-contrast display of assigned Bay Number (e.g., "BAY 4").
    *   **Countdown Timer**: A 60-second timer visualization that starts when the vehicle stops in the bay.

### 2. Pickup Mode ("The Secure Handoff")
*   **Objective**: Verify identity and coordinate timing so the child meets the car exactly when it arrives.
*   **Key Features**:
    *   **"I'm Here" / Geo-fencing**: Auto-check-in when crossing the underlying geofence.
    *   **Digital Token**: QR Code for redundant verification at the gate if license plate reading fails.
    *   **Child Status**:
        *   "In Class"
        *   "Released" (RFID scan at school exit)
        *   "At Zone" (Ready for pickup)
        *   "Loaded" (RFID scan at vehicle/gate)

### 3. Incentives (Gamification)
*   **NOL Reward Ticker**: Points for "Perfect Drops" (under 60s) and off-peak arrivals.

---

## 🎓 Student Experience

### 1. Pickup Dashboard
*   **Status Card**:
    *   "Class Dismissed"
    *   "Parent En Route" (ETA displayed)
    *   "Go to Pickup Zone"
*   **Digital ID**:
    *   QR Code/NFC visualization for Gate access.
*   **Safety Alerts**:
    *   "Wrong Car" warning (if trying to enter a vehicle not matched).

---

## 🎨 UI/UX Design System
*   **Theme**: High contrast, large touch targets (for drivers), dark mode default (battery saving/night visibility).
*   **Color Palette**:
    *   *System Green*: #22c55e (Go, On Time, Released)
    *   *System Amber*: #f59e0b (Slowing, Warning, Wait)
    *   *System Red*: #ef4444 (Stop, Late, Error)
    *   *RTA Brand*: Deep Blue/Red accents.
*   **Typography**: Inter (Clean, readable sans-serif).

---

## Technical Architecture (Mockup)
*   **Framework**: React (Vite) + Tailwind CSS
*   **State Management**: Local State (simulating live socket data).
*   **Icons**: Lucide React.

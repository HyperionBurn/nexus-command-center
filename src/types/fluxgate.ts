
// FLUXGATE System Types

export type SimulationMode = 'DROPOFF' | 'PICKUP';

export type BayStatus = 'OPEN' | 'OCCUPIED' | 'CLEARING' | 'BLOCKED';
export type BayPhase = 'IDLE' | 'ENTRY' | 'ACTION' | 'EXIT' | 'HANDOFF' | 'VERIFICATION'; // Expanded for detailed protocols

export type ZoneStatus = 'NORMAL' | 'SURGE' | 'CRITICAL';
export type GateStatus = 'OPEN' | 'CLOSED' | 'TRANSITIONING';

export interface Bay {
  id: string;
  zone: 'A' | 'B' | 'C' | 'BUS';
  status: BayStatus;
  phase: BayPhase;
  phaseProgress: number; // 0-100%
  vehicleId?: string;
  plateNumber?: string;
  dwellTime: number; // seconds
  maxDwell: number; // 60s (Dropoff) or 90s (Pickup)
  childName?: string;
  isAlerted: boolean;
  type?: 'CAR' | 'BUS';
}

export interface Zone {
  id: 'A' | 'B' | 'C' | 'BUS';
  name: string;
  status: ZoneStatus;
  bays: Bay[];
  queueLength: number; // meters
  vehicleCount: number;
  avgDwellTime: number;
  gateStatus: GateStatus;
}

export interface TrafficMetrics {
  timestamp: Date;
  arrivalRate: number; // λ - vehicles per minute
  serviceRate: number; // μ - vehicles served per minute
  queueLength: number;
  avgWaitTime: number;
  throughput: number;
  mode: SimulationMode; // Track which mode metrics belong to
}

export interface FuzzyLogicDecision {
  id: string;
  timestamp: Date;
  gate: string;
  action: 'OPEN' | 'CLOSE' | 'HOLD';
  inputs: {
    queueLength: number;
    zoneOccupancy: number;
    dwellTimeAvg: number;
    timeOfDay: string;
    arrivalRate?: number;
    serviceRate?: number;
  };
  rules: string[];
  confidence: number;
}

export interface NOLReward {
  id: string;
  parentId: string;
  parentName: string;
  credits: number;
  reason: string;
  timestamp: Date;
  dropOffTime: number; // seconds
}

export interface SurgeEvent {
  id: string;
  timestamp: Date;
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  arrivalRate: number;
  serviceRate: number;
  action: string;
  resolved: boolean;
}

export interface SystemHealth {
  overall: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  components: {
    name: string;
    status: 'ONLINE' | 'OFFLINE' | 'WARNING';
    latency?: number;
  }[];
  lastUpdate: Date;
}

export interface Vehicle {
  id: string;
  plateNumber: string;
  rfidTag: string;
  position: { x: number; y: number };
  speed: number;
  heading: number;
  inZone: 'A' | 'B' | 'C' | 'BUS' | 'QUEUE' | 'EXIT';
  type: 'CAR' | 'BUS';
  confidence: number; // YOLO detection confidence
  boundingBox: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  scheduledTime?: Date; // For VQS
  actualTime?: Date;    // For VQS
  punctualityScore?: number;
}

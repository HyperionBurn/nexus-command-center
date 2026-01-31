import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Bay, Zone, TrafficMetrics, FuzzyLogicDecision, 
  NOLReward, SurgeEvent, SystemHealth, Vehicle,
  SimulationMode, BayPhase
} from '@/types/nexus';

// Generate realistic vehicle plates
const generatePlate = () => {
  const letters = 'ABCDEFGHJKLMNPRSTUVWXYZ';
  const nums = '0123456789';
  return `${letters[Math.floor(Math.random() * letters.length)]}${nums[Math.floor(Math.random() * nums.length)]}${nums[Math.floor(Math.random() * nums.length)]}${nums[Math.floor(Math.random() * nums.length)]}${letters[Math.floor(Math.random() * letters.length)]}${letters[Math.floor(Math.random() * letters.length)]}`;
};

const childNames = [
  'Omar Ahmed', 'Fatima Ali', 'Mohammed Hassan', 'Aisha Khalid',
  'Yusuf Ibrahim', 'Mariam Saeed', 'Abdullah Noor', 'Sara Ahmed',
  'Khalid Mohammed', 'Layla Hassan', 'Ahmed Youssef', 'Noor Ali'
];

const parentNames = [
  'Ahmed Al-Rashid', 'Fatima Al-Maktoum', 'Mohammed Al-Suwaidi',
  'Aisha Al-Nuaimi', 'Omar Al-Shamsi', 'Sara Al-Falasi'
];

// Initialize bays for each zone
const initializeBays = (mode: SimulationMode): Zone[] => {
  const zones: Zone[] = [
    { id: 'A', name: 'Zone Alpha', status: 'NORMAL', bays: [], queueLength: 0, vehicleCount: 0, avgDwellTime: 0, gateStatus: 'OPEN' },
    { id: 'B', name: 'Zone Bravo', status: 'NORMAL', bays: [], queueLength: 0, vehicleCount: 0, avgDwellTime: 0, gateStatus: 'OPEN' },
    { id: 'C', name: 'Zone Charlie', status: 'NORMAL', bays: [], queueLength: 0, vehicleCount: 0, avgDwellTime: 0, gateStatus: 'CLOSED' },
    { id: 'BUS', name: 'Priority Bus Lane', status: 'NORMAL', bays: [], queueLength: 0, vehicleCount: 0, avgDwellTime: 0, gateStatus: 'OPEN' },
  ];

  const maxDwell = mode === 'DROPOFF' ? 60 : 90;

  zones.forEach(zone => {
    // Bus zone has 2 large bays, others have 4 standard bays
    const bayCount = zone.id === 'BUS' ? 2 : 4;
    
    for (let i = 1; i <= bayCount; i++) {
        const isBus = zone.id === 'BUS';
        const bayMaxDwell = isBus ? maxDwell * 1.5 : maxDwell; // Buses take 50% longer

      zone.bays.push({
        id: `${zone.id}${i}`,
        zone: zone.id,
        status: Math.random() > 0.6 ? 'OCCUPIED' : 'OPEN',
        phase: 'IDLE',
        phaseProgress: 0,
        dwellTime: 0,
        maxDwell: bayMaxDwell,
        isAlerted: false,
        type: isBus ? 'BUS' : 'CAR',
        ...(Math.random() > 0.6 ? {
          vehicleId: `V${Math.random().toString(36).substr(2, 6)}`,
          plateNumber: isBus ? `BUS-${Math.floor(Math.random() * 99)}` : generatePlate(),
          childName: isBus ? 'School Bus Route 1' : childNames[Math.floor(Math.random() * childNames.length)],
          dwellTime: Math.floor(Math.random() * (bayMaxDwell * 0.7)),
        } : {})
      });
    }
  });

  return zones;
};

// Generate simulated vehicles for the map
const generateVehicles = (count: number): Vehicle[] => {
  return Array.from({ length: count }, (_, i) => {
    // 15% chance of being a bus
    const isBus = i === 0 || Math.random() > 0.85;
    
    // Strict lane positioning - no variance to prevent flying
    let baseY: number;
    if (isBus) {
      baseY = 80; // Bus priority lane (fixed)
    } else {
      // Cars strictly in pickup lanes
      baseY = i % 2 === 0 ? 270 : 310;
    }
    
    return {
      id: `V${i}`,
      plateNumber: isBus ? `BUS-${Math.floor(Math.random() * 99)}` : generatePlate(),
      rfidTag: `RFID${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      position: {
        x: (i * 90) + 50 + Math.random() * 40, // Spaced out along the road
        y: baseY, // No variance - strict lane adherence
      },
      speed: isBus ? 6 + Math.random() * 4 : 8 + Math.random() * 7, // Realistic speed range
      heading: 90, // All facing right (east)
      inZone: (['A', 'B', 'C', 'BUS', 'QUEUE', 'EXIT'] as const)[Math.floor(Math.random() * 6)],
      type: isBus ? 'BUS' : 'CAR',
      confidence: 0.92 + Math.random() * 0.07,
      boundingBox: {
        x: 0,
        y: 0,
        width: isBus ? 80 : 40 + Math.random() * 20,
        height: isBus ? 35 : 25 + Math.random() * 15,
      },
    };
  });
};

// Extended metrics interface for dashboard
export interface ExtendedMetrics {
  rfidScanRate: number; // scans per minute
  lprConfidence: number; // average LPR accuracy %
  predictedArrivalAccuracy: number; // VQS prediction accuracy %
  avgWaitTimeQueue: number; // seconds
  safetyScore: number; // 0-100
  complianceRate: number; // % vehicles following protocol
  peakLoadFactor: number; // current vs max capacity
  energyEfficiency: number; // system optimization score
  parentSatisfactionIndex: number; // computed from rewards
  aiDecisionsPerMin: number; // fuzzy logic decisions
}

export const useNexusSimulation = () => {
  const [isRunning, setIsRunning] = useState(true);
  const [mode, setMode] = useState<SimulationMode>('DROPOFF');
  const [zones, setZones] = useState<Zone[]>(initializeBays('DROPOFF'));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => generateVehicles(8));
  const [trafficHistory, setTrafficHistory] = useState<TrafficMetrics[]>([]);
  const [fuzzyDecisions, setFuzzyDecisions] = useState<FuzzyLogicDecision[]>([]);
  const [nolRewards, setNolRewards] = useState<NOLReward[]>([]);
  const [surgeEvents, setSurgeEvents] = useState<SurgeEvent[]>([]);
  const [activeSurge, setActiveSurge] = useState<SurgeEvent | null>(null);
  const [extendedMetrics, setExtendedMetrics] = useState<ExtendedMetrics>({
    rfidScanRate: 45,
    lprConfidence: 94.5,
    predictedArrivalAccuracy: 87.3,
    avgWaitTimeQueue: 42,
    safetyScore: 98,
    complianceRate: 92.1,
    peakLoadFactor: 0.65,
    energyEfficiency: 88.7,
    parentSatisfactionIndex: 4.2,
    aiDecisionsPerMin: 12,
  });
  const [systemHealth, setSystemHealth] = useState<SystemHealth>({
    overall: 'OPTIMAL',
    components: [
      { name: 'YOLO v8 Detection', status: 'ONLINE', latency: 12 },
      { name: 'RFID Gateway', status: 'ONLINE', latency: 3 },
      { name: 'LPR System', status: 'ONLINE', latency: 45 },
      { name: 'DMS Controller', status: 'ONLINE', latency: 8 },
      { name: 'Bollard Control', status: 'ONLINE', latency: 15 },
      { name: 'NOL Integration', status: 'ONLINE', latency: 120 },
    ],
    lastUpdate: new Date(),
  });

  const simulationRef = useRef<NodeJS.Timeout>();
  const animationFrameRef = useRef<number>();
  const lastFrameTimeRef = useRef<number>(0);
  const TARGET_FPS = 30;
  const FRAME_INTERVAL = 1000 / TARGET_FPS; // ~33ms for 30fps

  const toggleSimulationMode = useCallback(() => {
    const newMode = mode === 'DROPOFF' ? 'PICKUP' : 'DROPOFF';
    setMode(newMode);
    setZones(initializeBays(newMode));
    setTrafficHistory([]);
    setNolRewards([]);
  }, [mode]);

  // Master system toggle
  const toggleSystem = useCallback(() => {
    setIsRunning(prev => !prev);
  }, []);

  // Update extended metrics with realistic fluctuations
  const updateExtendedMetrics = useCallback(() => {
    if (!isRunning) return;
    
    setExtendedMetrics(prev => {
      const occupiedBays = zones.flatMap(z => z.bays).filter(b => b.status === 'OCCUPIED').length;
      const totalBays = zones.flatMap(z => z.bays).length;
      const loadFactor = occupiedBays / totalBays;
      
      return {
        rfidScanRate: Math.max(20, Math.min(80, prev.rfidScanRate + (Math.random() - 0.5) * 8)),
        lprConfidence: Math.max(88, Math.min(99.5, prev.lprConfidence + (Math.random() - 0.5) * 1.5)),
        predictedArrivalAccuracy: Math.max(78, Math.min(96, prev.predictedArrivalAccuracy + (Math.random() - 0.5) * 3)),
        avgWaitTimeQueue: Math.max(15, Math.min(90, prev.avgWaitTimeQueue + (Math.random() - 0.5) * 10)),
        safetyScore: Math.max(90, Math.min(100, prev.safetyScore + (Math.random() - 0.5) * 2)),
        complianceRate: Math.max(82, Math.min(99, prev.complianceRate + (Math.random() - 0.5) * 2)),
        peakLoadFactor: loadFactor,
        energyEfficiency: Math.max(75, Math.min(98, prev.energyEfficiency + (Math.random() - 0.5) * 3)),
        parentSatisfactionIndex: Math.max(3.5, Math.min(5, prev.parentSatisfactionIndex + (Math.random() - 0.5) * 0.2)),
        aiDecisionsPerMin: Math.max(5, Math.min(25, prev.aiDecisionsPerMin + (Math.random() - 0.5) * 4)),
      };
    });
  }, [isRunning, zones]);

  // TFOE: Calculate arrival and service rates
  const calculateRates = useCallback(() => {
    const baseArrival = mode === 'DROPOFF' ? 8 : 6; // vehicles per minute baseline
    const timeMultiplier = 1 + Math.sin(Date.now() / 30000) * 0.5; // Oscillating traffic
    const arrivalRate = baseArrival * timeMultiplier + (Math.random() - 0.5) * 2;
    
    const occupiedBays = zones.flatMap(z => z.bays).filter(b => b.status === 'OCCUPIED').length;
    const serviceRate = Math.max(2, (mode === 'DROPOFF' ? 12 : 8) - occupiedBays * 0.5);

    return { arrivalRate, serviceRate };
  }, [zones, mode]);

  // Fuzzy Logic Gate Control
  const evaluateFuzzyLogic = useCallback((zone: Zone): FuzzyLogicDecision => {
    const inputs = {
      queueLength: zone.queueLength,
      zoneOccupancy: zone.bays.filter(b => b.status === 'OCCUPIED').length / zone.bays.length * 100,
      dwellTimeAvg: zone.avgDwellTime,
      timeOfDay: new Date().toLocaleTimeString(),
    };

    const rules: string[] = [];
    let action: 'OPEN' | 'CLOSE' | 'HOLD' = 'HOLD';
    let confidence = 0.7;

    // Rule evaluation with AI Reasoning
    if (inputs.queueLength > 50 && inputs.zoneOccupancy < 50) {
      rules.push(`High demand detected (${inputs.queueLength.toFixed(0)}m queue). Zone capacity is sufficient (${inputs.zoneOccupancy.toFixed(0)}%).`);
      rules.push('Action: OPEN GATES to release pressure.');
      action = 'OPEN';
      confidence = 0.92;
    } else if (inputs.zoneOccupancy > 80) {
      rules.push(`Safety Threshold Exceeded: Zone occupancy is critical at ${inputs.zoneOccupancy.toFixed(0)}%.`);
      rules.push('Action: CLOSE GATES to prevent gridlock inside zone.');
      action = 'CLOSE';
      confidence = 0.88;
    } else if (inputs.dwellTimeAvg > 45) {
      rules.push('Traffic flow is sluggish. Average dwell time is high (>45s).');
      rules.push('Action: HOLD new entries until flow normalizes.');
      action = 'HOLD';
      confidence = 0.75;
    } else if (inputs.queueLength < 20 && inputs.zoneOccupancy < 30) {
      rules.push(`Low activity detected in Zone ${zone.id}.`);
      rules.push('Action: OPEN GATES for unhindered access.');
      action = 'OPEN';
      confidence = 0.85;
    }

    if (rules.length === 0) {
      rules.push('System Balanced: No critical triggers.');
      rules.push('Action: Maintaining stable configuration.');
    }

    return {
      id: `FLD-${Date.now()}`,
      timestamp: new Date(),
      gate: `Gate ${zone.id}`,
      action,
      inputs,
      rules,
      confidence,
    };
  }, []);

  // Determine standard bay phases based on dwell time and mode
  const determinePhase = (mode: SimulationMode, dwellTime: number): { phase: BayPhase, progress: number } => {
    if (mode === 'DROPOFF') {
      // 60s Protocol: Entry(10s) -> Action(25s) -> Exit(25s)
      if (dwellTime < 10) return { phase: 'ENTRY', progress: (dwellTime / 10) * 100 };
      if (dwellTime < 35) return { phase: 'ACTION', progress: ((dwellTime - 10) / 25) * 100 };
      return { phase: 'EXIT', progress: ((dwellTime - 35) / 25) * 100 };
    } else {
      // 90s Protocol: Ready(20s) -> Approach(40s) -> Handoff(30s)
      if (dwellTime < 20) return { phase: 'VERIFICATION', progress: (dwellTime / 20) * 100 }; // Represents Student Ready
      if (dwellTime < 60) return { phase: 'ENTRY', progress: ((dwellTime - 20) / 40) * 100 }; // Represents Parent Approach/Entry
      return { phase: 'HANDOFF', progress: ((dwellTime - 60) / 30) * 100 };
    }
  };

  // Simulate bay updates
  const updateBays = useCallback(() => {
    if (!isRunning) return;
    
    setZones(prevZones => {
      return prevZones.map(zone => {
        const updatedBays = zone.bays.map(bay => {
          if (bay.status === 'OCCUPIED') {
            const newDwellTime = bay.dwellTime + 1;
            const maxDwell = bay.maxDwell;
            
            // Check for stalled vehicle (> max + 30s)
            if (newDwellTime > maxDwell + 30 && !bay.isAlerted) {
              return { ...bay, dwellTime: newDwellTime, isAlerted: true, status: 'BLOCKED' as const };
            }
            
            // Vehicle departs logic
            const shouldDepart = newDwellTime > maxDwell + 10 || (newDwellTime > maxDwell * 0.7 && Math.random() > 0.95);

            if (shouldDepart) {
              // Generate NOL reward for good drop-off/pickup
              if (newDwellTime <= maxDwell) {
                const reward: NOLReward = {
                  id: `NOL-${Date.now()}`,
                  parentId: bay.vehicleId || 'unknown',
                  parentName: parentNames[Math.floor(Math.random() * parentNames.length)],
                  credits: newDwellTime <= maxDwell * 0.75 ? 5 : 3,
                  reason: newDwellTime <= maxDwell * 0.75 ? `Perfect ${mode} (<${Math.floor(maxDwell * 0.75)}s)` : `Efficient ${mode} (<${maxDwell}s)`,
                  timestamp: new Date(),
                  dropOffTime: newDwellTime,
                };
                setNolRewards(prev => [reward, ...prev].slice(0, 50));
              }
              
              return {
                ...bay,
                status: 'CLEARING' as const,
                phase: 'EXIT',
                phaseProgress: 0,
                dwellTime: 0,
              };
            }
            
            const phaseInfo = determinePhase(mode, newDwellTime);
            return { 
              ...bay, 
              dwellTime: newDwellTime,
              phase: phaseInfo.phase,
              phaseProgress: phaseInfo.progress
            };
          } else if (bay.status === 'CLEARING') {
            // Bay clears after 3 seconds
            if (Math.random() > 0.7) { // 30% chance to clear per tick ~ 3.3s avg
               return {
                ...bay,
                status: 'OPEN' as const,
                phase: 'IDLE',
                phaseProgress: 0,
                vehicleId: undefined,
                plateNumber: undefined,
                childName: undefined,
                isAlerted: false,
              };
            }
            return bay;
          } else if (bay.status === 'OPEN' && Math.random() > 0.97) {
            // New vehicle arrives
            return {
              ...bay,
              status: 'OCCUPIED' as const,
              phase: 'ENTRY',
              phaseProgress: 0,
              vehicleId: `V${Math.random().toString(36).substr(2, 6)}`,
              plateNumber: generatePlate(),
              childName: childNames[Math.floor(Math.random() * childNames.length)],
              dwellTime: 0,
              maxDwell: mode === 'DROPOFF' ? 60 : 90,
            };
          }
          return bay;
        });

        const occupiedBays = updatedBays.filter(b => b.status === 'OCCUPIED');
        const avgDwell = occupiedBays.length > 0 
          ? occupiedBays.reduce((sum, b) => sum + b.dwellTime, 0) / occupiedBays.length 
          : 0;

        // Evaluate fuzzy logic
        const decision = evaluateFuzzyLogic({ ...zone, bays: updatedBays, avgDwellTime: avgDwell });
        
        // Update fuzzy decisions log
        if (Math.random() > 0.9) {
          setFuzzyDecisions(prev => [decision, ...prev].slice(0, 20));
        }

        return {
          ...zone,
          bays: updatedBays,
          avgDwellTime: avgDwell,
          vehicleCount: occupiedBays.length,
          queueLength: Math.max(0, 10 + Math.random() * 40 + (occupiedBays.length * 8)),
          gateStatus: decision.action === 'OPEN' ? 'OPEN' : decision.action === 'CLOSE' ? 'CLOSED' : zone.gateStatus,
          status: occupiedBays.length >= 3 ? 'SURGE' : avgDwell > (mode === 'DROPOFF' ? 50 : 80) ? 'CRITICAL' : 'NORMAL',
        };
      });
    });
  }, [evaluateFuzzyLogic, mode, isRunning]);

  // Update traffic metrics
  const updateTrafficMetrics = useCallback(() => {
    if (!isRunning) return;
    
    const { arrivalRate, serviceRate } = calculateRates();
    
    const newMetric: TrafficMetrics = {
      timestamp: new Date(),
      arrivalRate,
      serviceRate,
      queueLength: zones.reduce((sum, z) => sum + z.queueLength, 0) / zones.length,
      avgWaitTime: Math.max(0, (arrivalRate - serviceRate) * 5 + Math.random() * 10),
      throughput: serviceRate * 0.9,
      mode: mode,
    };

    setTrafficHistory(prev => [...prev, newMetric].slice(-60));

    // Check for surge condition (λ > μ)
    if (arrivalRate > serviceRate * 1.3 && !activeSurge) {
      const surge: SurgeEvent = {
        id: `SURGE-${Date.now()}`,
        timestamp: new Date(),
        severity: arrivalRate > serviceRate * 1.5 ? 'HIGH' : 'MEDIUM',
        arrivalRate,
        serviceRate,
        action: 'Activating Staging Zone Protocol - Directing overflow to Coffee Zone',
        resolved: false,
      };
      setActiveSurge(surge);
      setSurgeEvents(prev => [surge, ...prev].slice(0, 10));
    } else if (arrivalRate <= serviceRate && activeSurge) {
      setActiveSurge(prev => prev ? { ...prev, resolved: true } : null);
      setTimeout(() => setActiveSurge(null), 5000);
    }
  }, [calculateRates, zones, activeSurge, mode, isRunning]);

  // Update vehicle positions - throttled to 30fps for smooth performance
  const updateVehicles = useCallback((currentTime: number) => {
    if (!isRunning) {
      animationFrameRef.current = requestAnimationFrame(updateVehicles);
      return;
    }
    
    // Throttle to target FPS
    const elapsed = currentTime - lastFrameTimeRef.current;
    
    if (elapsed >= FRAME_INTERVAL) {
      lastFrameTimeRef.current = currentTime - (elapsed % FRAME_INTERVAL);
      
      // Delta time factor for consistent speed regardless of frame rate
      const deltaFactor = Math.min(elapsed / 16.67, 2); // Cap delta to prevent jumps
      
      setVehicles(prev => prev.map(v => {
        const isBus = v.plateNumber.startsWith('BUS');
        
        // Determine Target Lane Logic
        let targetY = v.position.y;
        
        if (isBus) {
          // Buses stay in the bus priority lane (Y: 80)
          targetY = 80;
        } else {
          // Cars should stay in pickup lanes (Y: 270 or 310)
          // Ensure they're assigned to a valid lane
          if (v.position.y < 200) {
            // Car somehow in bus lane, move to car lane
            targetY = 270;
          } else {
            const currentLane = Math.abs(v.position.y - 270) < Math.abs(v.position.y - 310) ? 270 : 310;
            
            // Very rare lane switching (0.1% chance per frame)
            if (Math.random() > 0.999) {
              targetY = currentLane === 270 ? 310 : 270;
            } else {
              targetY = currentLane;
            }
          }
        }

        // Move forward (Left to Right) with smooth loop-around
        // Speed scaled appropriately - slower for realism
        const baseSpeed = isBus ? 0.8 : 1.2; // Buses slower than cars
        let newX = v.position.x + (v.speed * baseSpeed * 0.08 * deltaFactor);
        
        // Smooth loop-around instead of teleporting
        if (newX > 850) {
          newX = -60;
        }

        // Very smooth steering towards target lane (easing)
        const lerpFactor = 0.03 * deltaFactor; // Slower lane changes
        const newY = v.position.y + (targetY - v.position.y) * lerpFactor;

        return {
          ...v,
          position: { 
            x: Math.round(newX * 10) / 10, // Reduce floating point jitter
            y: Math.round(newY * 10) / 10 
          },
          speed: v.speed,
          confidence: Math.min(0.99, Math.max(0.85, v.confidence + (Math.random() - 0.5) * 0.002)),
        };
      }));
    }
      
    animationFrameRef.current = requestAnimationFrame(updateVehicles);
  }, [isRunning]);

  // Main simulation loop
  useEffect(() => {
    // Logic Loop (1s interval)
    simulationRef.current = setInterval(() => {
      updateBays();
      updateTrafficMetrics();
      updateExtendedMetrics();
    }, 1000);

    // Animation Loop (throttled to 30fps)
    lastFrameTimeRef.current = performance.now();
    animationFrameRef.current = requestAnimationFrame(updateVehicles);

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateBays, updateTrafficMetrics, updateVehicles, updateExtendedMetrics]);

  // Trigger manual surge for demo
  const triggerSurge = useCallback(() => {
    if (!isRunning) return;
    
    const surge: SurgeEvent = {
      id: `SURGE-${Date.now()}`,
      timestamp: new Date(),
      severity: 'HIGH',
      arrivalRate: 15,
      serviceRate: 8,
      action: 'EMERGENCY: Activating all overflow protocols',
      resolved: false,
    };
    setActiveSurge(surge);
    setSurgeEvents(prev => [surge, ...prev].slice(0, 10));
  }, []);

  // Trigger stalled vehicle scenario
  const triggerStalledVehicle = useCallback(() => {
    setZones(prev => {
      const newZones = [...prev];
      const zoneA = newZones.find(z => z.id === 'A');
      if (zoneA && zoneA.bays[0]) {
        zoneA.bays[0] = {
          ...zoneA.bays[0],
          status: 'BLOCKED',
          dwellTime: 95,
          isAlerted: true,
          vehicleId: 'STALLED-001',
          plateNumber: 'X999ABC',
          childName: 'Emergency Alert',
          phase: 'EXIT',
        };
      }
      return newZones;
    });
  }, []);

  return {
    isRunning,
    toggleSystem,
    mode,
    toggleSimulationMode,
    zones,
    vehicles,
    trafficHistory,
    fuzzyDecisions,
    nolRewards,
    surgeEvents,
    activeSurge,
    systemHealth,
    extendedMetrics,
    triggerSurge,
    triggerStalledVehicle,
  };
};

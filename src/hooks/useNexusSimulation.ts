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
    const isBus = Math.random() > 0.85; // Slightly fewer buses
    
    // Position based on type/lane
    let baseY = 50; // Default Bus lane
    if (!isBus) {
       // Randomly choose Lane 1 (270) or Lane 2 (310) for cars
       baseY = Math.random() > 0.5 ? 270 : 310;
    }
    
    return {
    id: `V${i}`,
    plateNumber: isBus ? `BUS-${Math.floor(Math.random() * 99)}` : generatePlate(),
    rfidTag: `RFID${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    position: {
      x: 100 + Math.random() * 600,
      y: baseY + (Math.random() - 0.5) * 10, // Less variance to stick to lane
    },
    speed: Math.random() * 15,
    heading: Math.random() * 360,
    inZone: (['A', 'B', 'C', 'BUS', 'QUEUE', 'EXIT'] as const)[Math.floor(Math.random() * 6)],
    type: isBus ? 'BUS' : 'CAR',
    confidence: 0.85 + Math.random() * 0.14,
    boundingBox: {
      x: 0,
      y: 0,
      width: isBus ? 80 : 40 + Math.random() * 20,
      height: isBus ? 35 : 25 + Math.random() * 15,
    },
  }});
};

export const useNexusSimulation = () => {
  const [mode, setMode] = useState<SimulationMode>('DROPOFF');
  const [zones, setZones] = useState<Zone[]>(initializeBays('DROPOFF'));
  const [vehicles, setVehicles] = useState<Vehicle[]>(() => generateVehicles(8));
  const [trafficHistory, setTrafficHistory] = useState<TrafficMetrics[]>([]);
  const [fuzzyDecisions, setFuzzyDecisions] = useState<FuzzyLogicDecision[]>([]);
  const [nolRewards, setNolRewards] = useState<NOLReward[]>([]);
  const [surgeEvents, setSurgeEvents] = useState<SurgeEvent[]>([]);
  const [activeSurge, setActiveSurge] = useState<SurgeEvent | null>(null);
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

  const toggleSimulationMode = useCallback(() => {
    const newMode = mode === 'DROPOFF' ? 'PICKUP' : 'DROPOFF';
    setMode(newMode);
    setZones(initializeBays(newMode));
    setTrafficHistory([]);
    setNolRewards([]);
  }, [mode]);

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
  }, [evaluateFuzzyLogic, mode]);

  // Update traffic metrics
  const updateTrafficMetrics = useCallback(() => {
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
  }, [calculateRates, zones, activeSurge, mode]);

  // Update vehicle positions
  const updateVehicles = useCallback(() => {
    setVehicles(prev => prev.map(v => {
      const isBus = v.plateNumber.startsWith('BUS');
      
      // Determine Target Lane Logic
      let targetY = v.position.y;
      
      if (isBus) {
        targetY = 50; // Bus Priority Lane
      } else {
        // Car logic: stick to closest lane (270 or 310)
        // With small chance to lane change
        const currentLane = Math.abs(v.position.y - 270) < Math.abs(v.position.y - 310) ? 270 : 310;
        
        // 0.2% chance to switch lanes per frame (approx 60fps)
        if (Math.random() > 0.998) {
           targetY = currentLane === 270 ? 310 : 270;
        } else {
           targetY = currentLane;
        }
      }

      // Move forward (Left to Right) with loop-around
      // Speed scaled for 60fps (approx 0.05 factor of previous 1s interval)
      let newX = v.position.x + (v.speed * 0.08); 
      if (newX > 800) newX = -50; // Loop back

      // Smooth steering towards target lane
      // Vehicles drift smoothly to lane center
      const newY = v.position.y + (targetY - v.position.y) * 0.05;

      return {
        ...v,
        position: { x: newX, y: newY },
        // Constant speed for smoothness, no jitter
        speed: v.speed, 
         // Slowly varying confidence to simulate sensor noise
        confidence: Math.min(0.99, Math.max(0.85, v.confidence + (Math.random() - 0.5) * 0.005)),
      };
    }));
      
    animationFrameRef.current = requestAnimationFrame(updateVehicles);
  }, []);

  // Main simulation loop
  useEffect(() => {
    // Logic Loop (1s interval)
    simulationRef.current = setInterval(() => {
      updateBays();
      updateTrafficMetrics();
    }, 1000);

    // Animation Loop (60fps)
    animationFrameRef.current = requestAnimationFrame(updateVehicles);

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateBays, updateTrafficMetrics, updateVehicles]);

  // Trigger manual surge for demo
  const triggerSurge = useCallback(() => {
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
    triggerSurge,
    triggerStalledVehicle,
  };
};

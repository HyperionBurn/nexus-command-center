import { useState, useEffect, useCallback, useRef } from 'react';
import { 
  Bay, Zone, TrafficMetrics, FuzzyLogicDecision, 
  NOLReward, SurgeEvent, SystemHealth, Vehicle 
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
const initializeBays = (): Zone[] => {
  const zones: Zone[] = [
    { id: 'A', name: 'Zone Alpha', status: 'NORMAL', bays: [], queueLength: 0, vehicleCount: 0, avgDwellTime: 0, gateStatus: 'OPEN' },
    { id: 'B', name: 'Zone Bravo', status: 'NORMAL', bays: [], queueLength: 0, vehicleCount: 0, avgDwellTime: 0, gateStatus: 'OPEN' },
    { id: 'C', name: 'Zone Charlie', status: 'NORMAL', bays: [], queueLength: 0, vehicleCount: 0, avgDwellTime: 0, gateStatus: 'CLOSED' },
  ];

  zones.forEach(zone => {
    for (let i = 1; i <= 4; i++) {
      zone.bays.push({
        id: `${zone.id}${i}`,
        zone: zone.id,
        status: Math.random() > 0.6 ? 'OCCUPIED' : 'OPEN',
        dwellTime: 0,
        maxDwell: 60,
        isAlerted: false,
        ...(Math.random() > 0.6 ? {
          vehicleId: `V${Math.random().toString(36).substr(2, 6)}`,
          plateNumber: generatePlate(),
          childName: childNames[Math.floor(Math.random() * childNames.length)],
          dwellTime: Math.floor(Math.random() * 45),
        } : {})
      });
    }
  });

  return zones;
};

// Generate simulated vehicles for the map
const generateVehicles = (count: number): Vehicle[] => {
  return Array.from({ length: count }, (_, i) => ({
    id: `V${i}`,
    plateNumber: generatePlate(),
    rfidTag: `RFID${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    position: {
      x: 100 + Math.random() * 600,
      y: 100 + Math.random() * 300,
    },
    speed: Math.random() * 15,
    heading: Math.random() * 360,
    inZone: (['A', 'B', 'C', 'QUEUE', 'EXIT'] as const)[Math.floor(Math.random() * 5)],
    confidence: 0.85 + Math.random() * 0.14,
    boundingBox: {
      x: 0,
      y: 0,
      width: 40 + Math.random() * 20,
      height: 25 + Math.random() * 15,
    },
  }));
};

export const useNexusSimulation = () => {
  const [zones, setZones] = useState<Zone[]>(initializeBays);
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

  // TFOE: Calculate arrival and service rates
  const calculateRates = useCallback(() => {
    const baseArrival = 8; // vehicles per minute baseline
    const timeMultiplier = 1 + Math.sin(Date.now() / 30000) * 0.5; // Oscillating traffic
    const arrivalRate = baseArrival * timeMultiplier + (Math.random() - 0.5) * 2;
    
    const occupiedBays = zones.flatMap(z => z.bays).filter(b => b.status === 'OCCUPIED').length;
    const serviceRate = Math.max(4, 12 - occupiedBays * 0.5);

    return { arrivalRate, serviceRate };
  }, [zones]);

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

    // Rule evaluation based on FLGC from documentation
    if (inputs.queueLength > 50 && inputs.zoneOccupancy < 50) {
      rules.push('Queue > 50m + Zone < 50% = OPEN');
      action = 'OPEN';
      confidence = 0.92;
    } else if (inputs.zoneOccupancy > 80) {
      rules.push('Zone Occupancy > 80% = CLOSE');
      action = 'CLOSE';
      confidence = 0.88;
    } else if (inputs.dwellTimeAvg > 45) {
      rules.push('Avg Dwell > 45s = HOLD (Clearing)');
      action = 'HOLD';
      confidence = 0.75;
    } else if (inputs.queueLength < 20 && inputs.zoneOccupancy < 30) {
      rules.push('Queue < 20m + Zone < 30% = OPEN');
      action = 'OPEN';
      confidence = 0.85;
    }

    if (rules.length === 0) {
      rules.push('Default: Maintain current state');
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

  // Simulate bay updates
  const updateBays = useCallback(() => {
    setZones(prevZones => {
      return prevZones.map(zone => {
        const updatedBays = zone.bays.map(bay => {
          if (bay.status === 'OCCUPIED') {
            const newDwellTime = bay.dwellTime + 1;
            
            // Check for stalled vehicle (>90s)
            if (newDwellTime > 90 && !bay.isAlerted) {
              return { ...bay, dwellTime: newDwellTime, isAlerted: true };
            }
            
            // Vehicle departs (random chance after 40s, guaranteed after 70s)
            if (newDwellTime > 70 || (newDwellTime > 40 && Math.random() > 0.95)) {
              // Generate NOL reward for good drop-off
              if (newDwellTime <= 60) {
                const reward: NOLReward = {
                  id: `NOL-${Date.now()}`,
                  parentId: bay.vehicleId || 'unknown',
                  parentName: parentNames[Math.floor(Math.random() * parentNames.length)],
                  credits: newDwellTime <= 45 ? 5 : 3,
                  reason: newDwellTime <= 45 ? 'Perfect Drop-off (<45s)' : 'Efficient Drop-off (<60s)',
                  timestamp: new Date(),
                  dropOffTime: newDwellTime,
                };
                setNolRewards(prev => [reward, ...prev].slice(0, 50));
              }
              
              return {
                ...bay,
                status: 'CLEARING' as const,
                dwellTime: 0,
              };
            }
            
            return { ...bay, dwellTime: newDwellTime };
          } else if (bay.status === 'CLEARING') {
            // Bay clears after 3 seconds
            return {
              ...bay,
              status: 'OPEN' as const,
              vehicleId: undefined,
              plateNumber: undefined,
              childName: undefined,
              isAlerted: false,
            };
          } else if (bay.status === 'OPEN' && Math.random() > 0.97) {
            // New vehicle arrives
            return {
              ...bay,
              status: 'OCCUPIED' as const,
              vehicleId: `V${Math.random().toString(36).substr(2, 6)}`,
              plateNumber: generatePlate(),
              childName: childNames[Math.floor(Math.random() * childNames.length)],
              dwellTime: 0,
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
          status: occupiedBays.length >= 3 ? 'SURGE' : avgDwell > 50 ? 'CRITICAL' : 'NORMAL',
        };
      });
    });
  }, [evaluateFuzzyLogic]);

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
  }, [calculateRates, zones, activeSurge]);

  // Update vehicle positions
  const updateVehicles = useCallback(() => {
    setVehicles(prev => prev.map(v => ({
      ...v,
      position: {
        x: Math.max(50, Math.min(750, v.position.x + (Math.random() - 0.5) * 10)),
        y: Math.max(50, Math.min(350, v.position.y + (Math.random() - 0.5) * 8)),
      },
      speed: Math.max(0, Math.min(20, v.speed + (Math.random() - 0.5) * 2)),
      confidence: Math.min(0.99, Math.max(0.8, v.confidence + (Math.random() - 0.5) * 0.05)),
    })));
  }, []);

  // Main simulation loop
  useEffect(() => {
    simulationRef.current = setInterval(() => {
      updateBays();
      updateTrafficMetrics();
      updateVehicles();
    }, 1000);

    return () => {
      if (simulationRef.current) {
        clearInterval(simulationRef.current);
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
        };
      }
      return newZones;
    });
  }, []);

  return {
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

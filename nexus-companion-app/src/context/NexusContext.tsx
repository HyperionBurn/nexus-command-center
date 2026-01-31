import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
export type TripStatus = 'idle' | 'en-route' | 'staging' | 'arrived' | 'completed';
export type StudentStatus = 'in-class' | 'released' | 'waiting-at-gate' | 'loaded';
export type GateAssignment = string | null;

export type TripRecord = {
    id: string;
    date: string;
    type: 'pickup' | 'dropoff';
    duration: string; // "45s"
    pointsEarned: number;
    status: 'perfect' | 'standard' | 'delayed';
}

interface NexusState {
  tripStatus: TripStatus;
  studentStatus: StudentStatus;
  eta: number; // in minutes
  gate: GateAssignment;
  isAuthenticated: boolean;
  userRole: 'parent' | 'student' | null;
  nolBalance: number;
  tripHistory: TripRecord[];
  bookedSlot: string | null;
}

interface NexusContextType extends NexusState {
  login: (role: 'parent' | 'student') => void;
  logout: () => void;
  startTrip: () => void;
  updateEta: (minutes: number) => void;
  triggerGeofenceEntry: () => void; // Simulates entering the zone
  checkInAtGate: () => void; // Simulates arriving at the bay
  confirmPickup: () => void; // Simulates child in car
  setStudentReleased: () => void; // Teacher/System action simulation
  bookSlot: (slot: string | null) => void;
}

const NexusContext = createContext<NexusContextType | undefined>(undefined);

// Local Storage Key for persistence across tabs (simulating cloud sync)
const STORAGE_KEY = 'nexus_simulation_state_v1';

export const NexusProvider = ({ children }: { children: ReactNode }) => {
  // Initial State
  const initialState: NexusState = {
    tripStatus: 'idle',
    studentStatus: 'in-class',
    eta: 15,
    gate: null,
    isAuthenticated: false,
    userRole: null,
    nolBalance: 124.50, // Mock starting balance
    tripHistory: [
        { id: 't-1', date: 'Yesterday, 7:55 AM', type: 'dropoff', duration: '42s', pointsEarned: 20, status: 'perfect' },
        { id: 't-2', date: 'Yesterday, 3:10 PM', type: 'pickup', duration: '1m 20s', pointsEarned: 10, status: 'standard' },
        { id: 't-3', date: 'Jan 29, 7:52 AM', type: 'dropoff', duration: '55s', pointsEarned: 20, status: 'perfect' },
    ],
    bookedSlot: null,
  };

  const [state, setState] = useState<NexusState>(initialState);

  // Load from storage on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse state", e);
      }
    }
  }, []);

  // Save to storage on change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Sync across tabs (Simulating real-time WebSocket)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        setState(JSON.parse(e.newValue));
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Actions
  const login = (role: 'parent' | 'student') => {
    setState(prev => ({ ...prev, isAuthenticated: true, userRole: role }));
  };

  const logout = () => {
    setState(initialState);
  };

  const startTrip = () => {
    setState(prev => ({ 
      ...prev, 
      tripStatus: 'en-route', 
      eta: 12,
      // When parent leaves, student status logically remains same until closer, 
      // but for demo flow let's assume class releases around same time
      studentStatus: prev.studentStatus === 'in-class' ? 'released' : prev.studentStatus 
    }));
    
    // Simulate driving (Eta countdown)
    const driveInterval = setInterval(() => {
      setState(prev => {
        if (prev.tripStatus !== 'en-route') {
          clearInterval(driveInterval);
          return prev;
        }
        const newEta = Math.max(0, prev.eta - 1);
        if (newEta === 0) {
            clearInterval(driveInterval);
            // Don't auto-arrive, wait for geofence trigger in UI for demo control,
            // or we could auto-trigger:
            // return { ...prev, tripStatus: 'staging', eta: 0 };
        }
        return { ...prev, eta: newEta };
      });
    }, 2000); // 2 seconds = 1 minute for demo speed
  };

  const updateEta = (minutes: number) => {
    setState(prev => ({ ...prev, eta: minutes }));
  };

  const triggerGeofenceEntry = () => {
    // Logic: Inbound wave detected. Assign gate.
    const assignedGate = "B4"; 
    setState(prev => ({ 
      ...prev, 
      tripStatus: 'arrived', 
      gate: assignedGate,
      studentStatus: 'waiting-at-gate' // Notify student to move
    }));
  };

  const checkInAtGate = () => {
    // Vehicle stopped in bay
    // Start critical minute timer (handled in component, but state updates here)
  };

  const confirmPickup = () => {
    // Add points and history record
    const points = 50; 
    const newRecord: TripRecord = {
        id: `t-${Date.now()}`,
        date: 'Just Now',
        type: 'pickup',
        duration: '58s',
        pointsEarned: points,
        status: 'perfect'
    };

    setState(prev => ({ 
      ...prev, 
      tripStatus: 'completed', 
      studentStatus: 'loaded',
      nolBalance: prev.nolBalance + points, // Award points
      tripHistory: [newRecord, ...prev.tripHistory]
    }));
    // Reset after 5 seconds?
    setTimeout(() => {
        // Optional: reset or keep "Good job" screen
    }, 5000);
  };

  const setStudentReleased = () => {
    setState(prev => ({ ...prev, studentStatus: 'released' }));
  };

  const bookSlot = (slot: string | null) => {
    setState(prev => ({ ...prev, bookedSlot: slot }));
  };

  return (
    <NexusContext.Provider value={{ 
      ...state, 
      login, 
      logout,
      startTrip, 
      updateEta, 
      triggerGeofenceEntry, 
      checkInAtGate,
      confirmPickup,
      setStudentReleased,
      bookSlot
    }}>
      {children}
    </NexusContext.Provider>
  );
};

export const useNexus = () => {
  const context = useContext(NexusContext);
  if (!context) throw new Error('useNexus must be used within NexusProvider');
  return context;
};

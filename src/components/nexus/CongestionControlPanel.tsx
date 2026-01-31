import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  BarChart3, 
  Clock, 
  Gauge, 
  Layers, 
  Lock, 
  ShieldCheck, 
  Sliders,
  Timer
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { TrafficMetrics, SimulationMode } from "@/types/nexus";

interface CongestionControlPanelProps {
  currentMetrics?: TrafficMetrics;
  mode: SimulationMode;
  systemState?: 'FREE_FLOW' | 'UNSTABLE' | 'CONGESTED';
}

export const CongestionControlPanel = ({ 
  currentMetrics, 
  mode,
  systemState = 'FREE_FLOW' 
}: CongestionControlPanelProps) => {
  const arrivalRate = currentMetrics?.arrivalRate ?? 0;
  const serviceRate = currentMetrics?.serviceRate ?? 0;
  // Calculate Rho (Saturation Ratio)
  const rho = serviceRate > 0 ? arrivalRate / serviceRate : 0;
  
  // Determine display state based on rho if not provided
  const derivedState = rho > 1.0 ? 'CONGESTED' : rho > 0.85 ? 'UNSTABLE' : 'FREE_FLOW';
  const displayState = systemState || derivedState;

  const strategies = {
    FREE_FLOW: {
      color: "text-nexus-open",
      bgColor: "bg-nexus-open/10",
      borderColor: "border-nexus-open/20",
      title: "Green State: Free Flow",
      tactic: "Standard Slotting",
      action: "Gates Open • Dwell Time 60s"
    },
    UNSTABLE: {
      color: "text-amber-400",
      bgColor: "bg-amber-400/10",
      borderColor: "border-amber-400/20",
      title: "Yellow State: Throttled",
      tactic: "Demand Spreading",
      action: "Express Mode • Dwell Time 45s"
    },
    CONGESTED: {
      color: "text-nexus-hold",
      bgColor: "bg-nexus-hold/10",
      borderColor: "border-nexus-hold/20",
      title: "Red State: Metering",
      tactic: "Supply Boosting",
      action: "Overflow Bays • Staff Surge [+2]"
    }
  }[displayState];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* 1. Saturation Monitor (The Physics) */}
      <div className={cn("glass-panel p-4 flex flex-col justify-between border-l-4", strategies.borderColor)}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <Gauge className={cn("h-4 w-4", strategies.color)} />
            <h4 className="text-sm font-semibold text-foreground">Saturation Index (ρ)</h4>
          </div>
          <Badge variant="outline" className={cn("font-mono font-bold", strategies.color, strategies.bgColor)}>
            {rho.toFixed(2)}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2 text-xs">
             <div className="flex flex-col">
                <span className="text-muted-foreground">Traffic Input (λ)</span>
                <span className="text-lg font-mono font-bold text-foreground">{arrivalRate.toFixed(1)} <span className="text-[10px] text-muted-foreground">veh/min</span></span>
             </div>
             <div className="flex flex-col text-right">
                <span className="text-muted-foreground">Zone Capacity (μ)</span>
                <span className="text-lg font-mono font-bold text-nexus-cyan">{serviceRate.toFixed(1)} <span className="text-[10px] text-muted-foreground">veh/min</span></span>
             </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Underload</span>
              <span>Optimal</span>
              <span>Overload</span>
            </div>
            <Progress 
              value={Math.min(rho * 100, 100)} 
              className={cn("h-2", rho > 1 ? "bg-red-900/20" : "")}
              // indicatorClassName is not a standard prop, handling color via class on Progress not possible directly without custom component usually, 
              // but standard shadcn Progress uses bg-primary. 
              // We'll rely on the visual indicator of value.
            />
            {/* Visual thresholds */}
            <div className="flex h-1 w-full gap-0.5 mt-0.5">
                <div className="h-full w-[85%] bg-nexus-open/20 rounded-l-sm" />
                <div className="h-full w-[15%] bg-amber-400/20" />
                <div className="h-full w-[5%] bg-red-500/20 rounded-r-sm" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Active Strategy (The Logic) */}
      <div className="glass-panel p-4 flex flex-col justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 p-3 opacity-10">
          <Brain className="h-24 w-24" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Sliders className="h-4 w-4 text-nexus-cyan" />
            <h4 className="text-sm font-semibold text-foreground">Active Logic Protocol</h4>
          </div>
          
          <div className="space-y-3">
            <div>
                <span className={cn("text-xs font-bold uppercase tracking-wider block mb-1", strategies.color)}>
                  {strategies.title}
                </span>
                <h3 className="text-lg font-bold text-foreground leading-none">{strategies.tactic}</h3>
            </div>
            
            <div className="flex items-center gap-2 p-2 rounded bg-background/40 border border-white/5">
               <Activity className="h-4 w-4 text-muted-foreground" />
               <span className="text-xs font-mono text-muted-foreground">{strategies.action}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Slot Management (The Output) */}
      <div className="glass-panel p-4 flex flex-col justify-between">
         <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
               <Layers className="h-4 w-4 text-primary" />
               <h4 className="text-sm font-semibold text-foreground">Time Slot Config</h4>
            </div>
            <div className="flex items-center gap-1 text-[10px] font-mono text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>Cycle: 60s</span>
            </div>
         </div>

         <div className="grid grid-cols-2 gap-2 mt-1">
            <div className="p-2 rounded bg-black/20 border border-white/5 text-center">
                <div className="text-[10px] text-muted-foreground uppercase">Target Dwell</div>
                <div className="text-xl font-bold font-mono text-nexus-cyan">
                    {displayState === 'FREE_FLOW' ? '60s' : displayState === 'UNSTABLE' ? '45s' : '30s'}
                </div>
            </div>
            <div className="p-2 rounded bg-black/20 border border-white/5 text-center">
                <div className="text-[10px] text-muted-foreground uppercase">Slack Time</div>
                <div className="text-xl font-bold font-mono text-nexus-open">
                    {displayState === 'FREE_FLOW' ? '15s' : displayState === 'UNSTABLE' ? '5s' : '0s'}
                </div>
            </div>
         </div>

         <div className="flex items-center justify-between mt-3 text-xs">
            <span className="text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-nexus-open" /> Safety Buffer
            </span>
            <span className="font-mono font-bold">
                 {displayState === 'FREE_FLOW' ? 'OPTIMAL' : displayState === 'UNSTABLE' ? 'REDUCED' : 'CRITICAL'}
            </span>
         </div>
      </div>
    </div>
  );
};

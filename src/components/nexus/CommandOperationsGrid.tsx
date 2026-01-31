import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Bus, 
  ShieldCheck, 
  Video, 
  AlertCircle, 
  Radio, 
  Lock, 
  Activity, 
  Wifi 
} from "lucide-react";
import { motion } from "framer-motion";

export const CommandOperationsGrid = () => {
  const buses = [
    { id: "B-01", route: "Palm Jumeirah", capacity: 30, boarded: 30, status: "DEPARTED", eta: "En Route" },
    { id: "B-04", route: "Marina / JBR", capacity: 45, boarded: 42, status: "BOARDING", eta: "Departs in 5m" },
    { id: "B-07", route: "Springs / Meadows", capacity: 45, boarded: 15, status: "WAITING", eta: "Departs in 15m" },
    { id: "B-09", route: "Arabian Ranches", capacity: 30, boarded: 0, status: "DELAYED", eta: "+10m Delay" },
  ];

  const checkpoints = [
    { id: "G-MAIN", name: "Main Gate", status: "ACTIVE", load: 85 },
    { id: "G-NORTH", name: "North Wing", status: "STANDBY", load: 12 },
    { id: "G-DROP", name: "Drop-off Zone", status: "CONGESTED", load: 94 },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Fleet Operations */}
      <motion.div 
        className="glass-panel p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bus className="h-5 w-5 text-nexus-blue" />
            <h3 className="font-semibold text-foreground">Fleet Operations</h3>
          </div>
          <Badge variant="outline" className="text-xs font-mono">
            SYNC: OK
          </Badge>
        </div>
        
        <div className="space-y-4">
          {buses.map((bus) => (
            <div key={bus.id} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold font-mono text-nexus-blue/80">{bus.id}</span>
                <span className="text-muted-foreground text-xs">{bus.route}</span>
                <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium border
                  ${bus.status === 'DEPARTED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                    bus.status === 'DELAYED' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    bus.status === 'CONGESTED' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                    'bg-secondary text-secondary-foreground border-border'}`}>
                  {bus.status}
                </span>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="w-full bg-secondary/30 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      bus.status === 'DELAYED' ? 'bg-red-500' : 'bg-primary'
                    }`}
                    style={{ width: `${(bus.boarded / bus.capacity) * 100}%` }} 
                  />
                </div>
                <span className="font-mono text-muted-foreground w-12 text-right">
                  {bus.boarded}/{bus.capacity}
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Security & Surveillance */}
      <motion.div 
        className="glass-panel p-4 space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-nexus-success" />
            <h3 className="font-semibold text-foreground">Security Grid</h3>
          </div>
          <div className="flex gap-2">
             <Radio className="h-4 w-4 text-nexus-success animate-pulse" />
             <Wifi className="h-4 w-4 text-nexus-success" />
          </div>
        </div>

        {/* Checkpoint Status */}
        <div className="grid grid-cols-3 gap-2">
            {checkpoints.map(cp => (
                <div key={cp.id} className="bg-secondary/10 border border-border/50 rounded-md p-2 flex flex-col items-center justify-center text-center gap-1">
                    <span className="text-[10px] text-muted-foreground font-mono">{cp.id}</span>
                    <Lock className={`h-4 w-4 ${cp.status === 'ACTIVE' || cp.status === 'CONGESTED' ? 'text-nexus-success' : 'text-muted-foreground'}`} />
                    <span className="text-[10px] font-bold">{cp.load}%</span>
                </div>
            ))}
        </div>

        {/* Live Feeds */}
        <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                <Video className="h-3 w-3" />
                <span>Live Feed Monitoring</span>
            </div>
            <div className="grid grid-cols-2 gap-2 h-24">
                <div className="relative bg-black/40 rounded border border-border/30 overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/20 group-hover:text-muted-foreground/40 transition-colors">
                        <Activity className="h-8 w-8" />
                    </div>
                    <div className="absolute top-1 left-1 bg-red-500/80 text-white text-[9px] px-1 rounded flex items-center gap-1">
                        <span className="w-1 h-1 bg-white rounded-full animate-blink"></span> LIVE
                    </div>
                    <div className="absolute bottom-1 right-1 text-[9px] font-mono text-muted-foreground">CAM-01</div>
                </div>
                <div className="relative bg-black/40 rounded border border-border/30 overflow-hidden group">
                     {/* Simulated static/noise or grid */}
                     <div className="absolute inset-0 opacity-10 bg-[linear-gradient(45deg,transparent_25%,#fff_25%,#fff_50%,transparent_50%,transparent_75%,#fff_75%,#fff_100%)] bg-[length:4px_4px]"></div>
                     <div className="absolute top-1 left-1 bg-red-500/80 text-white text-[9px] px-1 rounded flex items-center gap-1">
                        <span className="w-1 h-1 bg-white rounded-full animate-blink"></span> REC
                    </div>
                    <div className="absolute bottom-1 right-1 text-[9px] font-mono text-muted-foreground">CAM-02</div>
                </div>
            </div>
        </div>
      </motion.div>
    </div>
  );
};

import { AlertTriangle, CheckCircle, Clock, Info, XCircle } from "lucide-react";
import { motion } from "framer-motion";

interface Incident {
  id: string;
  time: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  zone?: string;
}

export const IncidentLogFeed = () => {
  const incidents: Incident[] = [
    { id: '1', time: '21:15:42', type: 'warning', message: 'Bay A3 dwell time exceeded 90s', zone: 'Zone A' },
    { id: '2', time: '21:14:58', type: 'success', message: 'Surge event resolved - normal flow', zone: 'Zone B' },
    { id: '3', time: '21:14:21', type: 'info', message: 'VQS prediction updated: +12 arrivals', zone: 'Global' },
    { id: '4', time: '21:13:45', type: 'error', message: 'RFID reader timeout - reconnecting', zone: 'Gate C' },
    { id: '5', time: '21:12:33', type: 'success', message: 'Perfect dropoff streak: 5 consecutive', zone: 'Zone A' },
    { id: '6', time: '21:11:18', type: 'warning', message: 'Queue length threshold approaching', zone: 'Zone C' },
    { id: '7', time: '21:10:02', type: 'info', message: 'Shift change: Marshal rotation complete', zone: 'Global' },
  ];

  const getIcon = (type: Incident['type']) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="h-3 w-3 text-amber-400" />;
      case 'error': return <XCircle className="h-3 w-3 text-red-400" />;
      case 'success': return <CheckCircle className="h-3 w-3 text-emerald-400" />;
      default: return <Info className="h-3 w-3 text-cyan-400" />;
    }
  };

  const getColor = (type: Incident['type']) => {
    switch (type) {
      case 'warning': return 'border-l-amber-400/50';
      case 'error': return 'border-l-red-400/50';
      case 'success': return 'border-l-emerald-400/50';
      default: return 'border-l-cyan-400/50';
    }
  };

  return (
    <div className="glass-panel p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground text-sm">Incident Log</h3>
        </div>
        <span className="text-[10px] font-mono text-muted-foreground bg-secondary/30 px-2 py-0.5 rounded">
          LIVE FEED
        </span>
      </div>
      
      <div className="space-y-2 max-h-[280px] overflow-y-auto scrollbar-thin">
        {incidents.map((incident, index) => (
          <motion.div
            key={incident.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-black/20 rounded p-2 border-l-2 ${getColor(incident.type)}`}
          >
            <div className="flex items-start gap-2">
              <div className="mt-0.5">{getIcon(incident.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-foreground truncate">{incident.message}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] font-mono text-muted-foreground">{incident.time}</span>
                  {incident.zone && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-secondary/30 text-muted-foreground">
                      {incident.zone}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

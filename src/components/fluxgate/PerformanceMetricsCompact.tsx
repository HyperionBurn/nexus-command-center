import { Timer, Trophy, Zap, Target, Award, Flame } from "lucide-react";
import { motion } from "framer-motion";

export const PerformanceMetricsCompact = () => {
  const metrics = [
    { label: 'Avg Cycle Time', value: '47s', target: '60s', icon: Timer, status: 'good' },
    { label: 'Throughput Rate', value: '2.4/min', target: '2.0/min', icon: Zap, status: 'excellent' },
    { label: 'Zero-Wait Rate', value: '78%', target: '70%', icon: Target, status: 'excellent' },
    { label: 'Golden Minute %', value: '92%', target: '85%', icon: Trophy, status: 'excellent' },
  ];

  const streaks = [
    { label: 'Perfect Dropoffs', value: 12, icon: Award },
    { label: 'On-Time Sequence', value: 8, icon: Flame },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-emerald-400';
      case 'good': return 'text-cyan-400';
      case 'warning': return 'text-amber-400';
      default: return 'text-foreground';
    }
  };

  return (
    <div className="glass-panel p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Trophy className="h-4 w-4 text-yellow-400" />
          <h3 className="font-semibold text-foreground text-sm">Performance</h3>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
          OPTIMAL
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="bg-black/20 rounded p-2 border border-white/5"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <metric.icon className={`h-3 w-3 ${getStatusColor(metric.status)}`} />
              <span className="text-[9px] text-muted-foreground uppercase truncate">{metric.label}</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className={`text-lg font-mono font-bold ${getStatusColor(metric.status)}`}>{metric.value}</span>
              <span className="text-[9px] text-muted-foreground">/ {metric.target}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="border-t border-border/30 pt-3">
        <span className="text-[10px] text-muted-foreground uppercase mb-2 block">Active Streaks</span>
        <div className="flex gap-2">
          {streaks.map((streak, index) => (
            <motion.div
              key={streak.label}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
              className="flex-1 bg-gradient-to-r from-amber-500/10 to-orange-500/10 rounded p-2 border border-amber-500/20"
            >
              <div className="flex items-center gap-1 mb-1">
                <streak.icon className="h-3 w-3 text-amber-400" />
                <span className="text-[9px] text-muted-foreground">{streak.label}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xl font-mono font-bold text-amber-400">{streak.value}</span>
                <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

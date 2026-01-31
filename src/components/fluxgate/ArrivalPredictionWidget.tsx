import { Users, ArrowUpRight, ArrowDownRight, Minus, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export const ArrivalPredictionWidget = () => {
  const predictions = [
    { time: '21:20', expected: 18, trend: 'up' },
    { time: '21:25', expected: 24, trend: 'up' },
    { time: '21:30', expected: 31, trend: 'up' },
    { time: '21:35', expected: 28, trend: 'down' },
    { time: '21:40', expected: 22, trend: 'down' },
    { time: '21:45', expected: 15, trend: 'down' },
  ];

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <ArrowUpRight className="h-3 w-3 text-amber-400" />;
      case 'down': return <ArrowDownRight className="h-3 w-3 text-emerald-400" />;
      default: return <Minus className="h-3 w-3 text-muted-foreground" />;
    }
  };

  const maxExpected = Math.max(...predictions.map(p => p.expected));

  return (
    <div className="glass-panel p-4 h-full">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-FLUXGATE-cyan" />
          <h3 className="font-semibold text-foreground text-sm">Arrival Forecast</h3>
        </div>
        <span className="text-[10px] font-mono text-FLUXGATE-cyan bg-FLUXGATE-cyan/10 px-2 py-0.5 rounded border border-FLUXGATE-cyan/20">
          AI-VQS
        </span>
      </div>

      <div className="space-y-2">
        {predictions.map((pred, index) => (
          <motion.div
            key={pred.time}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center gap-3"
          >
            <span className="text-[10px] font-mono text-muted-foreground w-10">{pred.time}</span>
            <div className="flex-1 h-4 bg-secondary/20 rounded-full overflow-hidden">
              <motion.div
                className={`h-full rounded-full ${pred.trend === 'up' ? 'bg-amber-500/60' : 'bg-emerald-500/60'}`}
                initial={{ width: 0 }}
                animate={{ width: `${(pred.expected / maxExpected) * 100}%` }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              />
            </div>
            <div className="flex items-center gap-1 w-12">
              <Users className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs font-mono font-bold">{pred.expected}</span>
            </div>
            {getTrendIcon(pred.trend)}
          </motion.div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-border/30">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Peak Window</span>
          <span className="font-mono font-bold text-amber-400">21:25 - 21:35</span>
        </div>
        <div className="flex items-center justify-between text-xs mt-1">
          <span className="text-muted-foreground">Total Predicted</span>
          <span className="font-mono font-bold text-foreground">{predictions.reduce((sum, p) => sum + p.expected, 0)} arrivals</span>
        </div>
      </div>
    </div>
  );
};

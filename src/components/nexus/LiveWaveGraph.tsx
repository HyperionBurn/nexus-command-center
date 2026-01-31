import { TrafficMetrics } from '@/types/nexus';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Area, AreaChart } from 'recharts';
import { useMemo } from 'react';

interface LiveWaveGraphProps {
  data: TrafficMetrics[];
  className?: string;
}

export const LiveWaveGraph = ({ data, className }: LiveWaveGraphProps) => {
  const chartData = useMemo(() => {
    return data.map((d, i) => ({
      time: i,
      arrival: d.arrivalRate,
      service: d.serviceRate,
      queue: d.queueLength,
    }));
  }, [data]);

  const currentArrival = data[data.length - 1]?.arrivalRate ?? 0;
  const currentService = data[data.length - 1]?.serviceRate ?? 0;
  const isSurge = currentArrival > currentService * 1.2;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Live Wave Analysis</h3>
          <p className="text-xs text-muted-foreground">Inbound Wave Management (LDS)</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-nexus-cyan" />
            <span className="text-xs text-muted-foreground">
              λ = {currentArrival.toFixed(1)}/min
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-nexus-open" />
            <span className="text-xs text-muted-foreground">
              μ = {currentService.toFixed(1)}/min
            </span>
          </div>
          {isSurge && (
            <span className="px-2 py-1 text-xs font-medium bg-nexus-hold/20 text-nexus-hold rounded animate-pulse">
              SURGE DETECTED
            </span>
          )}
        </div>
      </div>

      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: 0 }}>
            <defs>
              <linearGradient id="arrivalGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(186 100% 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(186 100% 50%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="serviceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(142 100% 50%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(142 100% 50%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))" 
              fontSize={10}
              tickLine={false}
              axisLine={false}
              domain={[0, 'auto']}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(222 47% 8% / 0.95)',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              labelStyle={{ color: 'hsl(var(--foreground))' }}
            />
            <Area
              type="monotone"
              dataKey="arrival"
              stroke="hsl(186 100% 50%)"
              fill="url(#arrivalGradient)"
              strokeWidth={2}
              dot={false}
              name="Arrival Rate (λ)"
            />
            <Area
              type="monotone"
              dataKey="service"
              stroke="hsl(142 100% 50%)"
              fill="url(#serviceGradient)"
              strokeWidth={2}
              dot={false}
              name="Service Rate (μ)"
            />
            {isSurge && (
              <ReferenceLine 
                y={currentService} 
                stroke="hsl(0 100% 60%)" 
                strokeDasharray="5 5"
                label={{ 
                  value: 'Capacity', 
                  fill: 'hsl(0 100% 60%)', 
                  fontSize: 10,
                  position: 'right'
                }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-2 mt-4">
        <div className="p-2 rounded bg-secondary/50 text-center">
          <span className="text-xs text-muted-foreground block">Avg Wait</span>
          <span className="font-mono text-sm font-semibold text-foreground">
            {(data[data.length - 1]?.avgWaitTime ?? 0).toFixed(1)}s
          </span>
        </div>
        <div className="p-2 rounded bg-secondary/50 text-center">
          <span className="text-xs text-muted-foreground block">Queue</span>
          <span className="font-mono text-sm font-semibold text-foreground">
            {(data[data.length - 1]?.queueLength ?? 0).toFixed(0)}m
          </span>
        </div>
        <div className="p-2 rounded bg-secondary/50 text-center">
          <span className="text-xs text-muted-foreground block">Throughput</span>
          <span className="font-mono text-sm font-semibold text-foreground">
            {(data[data.length - 1]?.throughput ?? 0).toFixed(1)}/m
          </span>
        </div>
      </div>
    </div>
  );
};

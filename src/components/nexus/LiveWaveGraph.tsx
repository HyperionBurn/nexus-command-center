import { TrafficMetrics } from '@/types/nexus';
import { XAxis, YAxis, ResponsiveContainer, Tooltip, ReferenceLine, Area, AreaChart, ReferenceArea, TooltipProps } from 'recharts';
import { memo, useMemo, useCallback } from 'react';

interface LiveWaveGraphProps {
  data: TrafficMetrics[];
  className?: string;
}

// Capacity thresholds
const CAPACITY_WARNING = 8; // vehicles/min - yellow threshold
const CAPACITY_CRITICAL = 12; // vehicles/min - red threshold
const MAX_CAPACITY = 15; // absolute maximum

// Custom tooltip component for better formatting
const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (!active || !payload || payload.length === 0) return null;

  const arrival = payload.find(p => p.dataKey === 'arrival')?.value ?? 0;
  const service = payload.find(p => p.dataKey === 'service')?.value ?? 0;
  const queue = payload.find(p => p.dataKey === 'queue')?.value ?? 0;
  const timeAgo = 60 - (label as number);

  return (
    <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-3 shadow-xl">
      <p className="text-xs text-muted-foreground mb-2 font-medium">
        {timeAgo === 0 ? 'Now' : `${timeAgo}s ago`}
      </p>
      <div className="space-y-1.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-nexus-cyan" />
            <span className="text-xs text-muted-foreground">Arrival λ</span>
          </div>
          <span className="text-xs font-mono font-semibold text-nexus-cyan">
            {Number(arrival).toFixed(1)}/min
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-nexus-open" />
            <span className="text-xs text-muted-foreground">Service μ</span>
          </div>
          <span className="text-xs font-mono font-semibold text-nexus-open">
            {Number(service).toFixed(1)}/min
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-nexus-hold" />
            <span className="text-xs text-muted-foreground">Queue</span>
          </div>
          <span className="text-xs font-mono font-semibold text-nexus-hold">
            {Number(queue).toFixed(0)}m
          </span>
        </div>
      </div>
      {Number(arrival) > Number(service) && (
        <div className="mt-2 pt-2 border-t border-border">
          <span className="text-xs text-red-400 font-medium">⚠ Demand exceeds capacity</span>
        </div>
      )}
    </div>
  );
};

export const LiveWaveGraph = memo(({ data, className }: LiveWaveGraphProps) => {
  // Build chart data with time labels (last 60 seconds)
  const chartData = useMemo(() => {
    const now = Date.now();
    return data.map((d, i) => ({
      time: i,
      timeLabel: `-${60 - i}s`,
      arrival: d.arrivalRate,
      service: d.serviceRate,
      queue: d.queueLength,
      // For danger zone shading - only show when arrival > service
      dangerZone: d.arrivalRate > d.serviceRate ? d.arrivalRate : undefined,
    }));
  }, [data]);

  const currentArrival = data[data.length - 1]?.arrivalRate ?? 0;
  const currentService = data[data.length - 1]?.serviceRate ?? 0;
  const currentQueue = data[data.length - 1]?.queueLength ?? 0;
  const isSurge = currentArrival > currentService * 1.2;
  
  // Calculate utilization percentage (ρ = λ/μ)
  const utilization = currentService > 0 ? (currentArrival / currentService) * 100 : 0;

  // Format time axis - show every 15 seconds
  const formatXAxis = useCallback((value: number) => {
    if (value === 0) return '-60s';
    if (value === 15) return '-45s';
    if (value === 30) return '-30s';
    if (value === 45) return '-15s';
    if (value === 60) return 'Now';
    return '';
  }, []);

  // Determine Y-axis domain
  const yMax = useMemo(() => {
    const maxArrival = Math.max(...data.map(d => d.arrivalRate));
    const maxService = Math.max(...data.map(d => d.serviceRate));
    return Math.max(maxArrival, maxService, CAPACITY_WARNING) * 1.2;
  }, [data]);

  return (
    <div className={className}>
      {/* Header with title, subtitle, and legend */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            Live Wave Analysis
            {isSurge && (
              <span className="px-2 py-0.5 text-xs font-medium bg-red-500/20 text-red-400 rounded-full animate-pulse">
                SURGE
              </span>
            )}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Real-time traffic flow showing arrival rate (λ) vs service capacity (μ) over the last 60 seconds
          </p>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-3 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-nexus-cyan rounded" />
          <span className="text-muted-foreground">Arrival Rate (λ)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-nexus-open rounded" />
          <span className="text-muted-foreground">Service Rate (μ)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-amber-500 rounded opacity-50" style={{ borderStyle: 'dashed' }} />
          <span className="text-muted-foreground">Warning ({CAPACITY_WARNING}/min)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-0.5 bg-red-500 rounded opacity-50" style={{ borderStyle: 'dashed' }} />
          <span className="text-muted-foreground">Critical ({CAPACITY_CRITICAL}/min)</span>
        </div>
      </div>

      {/* Main content: Chart + Current Values */}
      <div className="flex gap-4">
        {/* Chart */}
        <div className="flex-1 h-52">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
              <defs>
                {/* Arrival rate gradient - cyan */}
                <linearGradient id="arrivalGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(186 100% 50%)" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="hsl(186 100% 50%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(186 100% 50%)" stopOpacity={0} />
                </linearGradient>
                {/* Service rate gradient - green */}
                <linearGradient id="serviceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(142 100% 50%)" stopOpacity={0.4} />
                  <stop offset="50%" stopColor="hsl(142 100% 50%)" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="hsl(142 100% 50%)" stopOpacity={0} />
                </linearGradient>
                {/* Danger zone gradient - red */}
                <linearGradient id="dangerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0 100% 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(0 100% 50%)" stopOpacity={0.05} />
                </linearGradient>
                {/* Queue gradient - amber */}
                <linearGradient id="queueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(38 100% 50%)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="hsl(38 100% 50%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              
              {/* X-Axis with time labels */}
              <XAxis 
                dataKey="time" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickFormatter={formatXAxis}
                ticks={[0, 15, 30, 45, 60]}
                label={{ 
                  value: 'Time', 
                  position: 'insideBottom', 
                  offset: -10,
                  fontSize: 10,
                  fill: 'hsl(var(--muted-foreground))'
                }}
              />
              
              {/* Y-Axis */}
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                domain={[0, yMax]}
                label={{ 
                  value: 'Vehicles/min', 
                  angle: -90, 
                  position: 'insideLeft',
                  fontSize: 10,
                  fill: 'hsl(var(--muted-foreground))'
                }}
              />
              
              {/* Capacity threshold reference lines */}
              <ReferenceLine 
                y={CAPACITY_WARNING} 
                stroke="hsl(38 100% 50%)" 
                strokeDasharray="4 4"
                strokeOpacity={0.6}
              />
              <ReferenceLine 
                y={CAPACITY_CRITICAL} 
                stroke="hsl(0 100% 50%)" 
                strokeDasharray="4 4"
                strokeOpacity={0.6}
                label={{ 
                  value: 'Max Capacity', 
                  fill: 'hsl(0 100% 60%)', 
                  fontSize: 9,
                  position: 'right'
                }}
              />
              
              {/* Danger zone shading - when arrival > service */}
              <ReferenceArea 
                y1={currentService} 
                y2={yMax}
                fill="hsl(0 100% 50%)"
                fillOpacity={isSurge ? 0.08 : 0}
              />
              
              {/* Custom tooltip */}
              <Tooltip content={<CustomTooltip />} />
              
              {/* Service rate area (behind arrival) */}
              <Area
                type="monotone"
                dataKey="service"
                stroke="hsl(142 100% 50%)"
                fill="url(#serviceGradient)"
                strokeWidth={2}
                dot={false}
                name="Service Rate (μ)"
                animationDuration={300}
              />
              
              {/* Arrival rate area */}
              <Area
                type="monotone"
                dataKey="arrival"
                stroke="hsl(186 100% 50%)"
                fill="url(#arrivalGradient)"
                strokeWidth={2.5}
                dot={false}
                name="Arrival Rate (λ)"
                animationDuration={300}
              />
              
              {/* Current service rate line */}
              <ReferenceLine 
                y={currentService} 
                stroke="hsl(142 100% 50%)" 
                strokeDasharray="2 2"
                strokeOpacity={0.4}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Current Values Panel */}
        <div className="w-28 flex flex-col gap-2">
          {/* Arrival Rate */}
          <div className={`p-3 rounded-lg border transition-colors ${
            isSurge 
              ? 'bg-red-500/10 border-red-500/30' 
              : 'bg-nexus-cyan/10 border-nexus-cyan/30'
          }`}>
            <span className="text-xs text-muted-foreground block">Arrival λ</span>
            <span className={`font-mono text-2xl font-bold ${
              isSurge ? 'text-red-400' : 'text-nexus-cyan'
            }`}>
              {currentArrival.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">/min</span>
          </div>
          
          {/* Service Rate */}
          <div className="p-3 rounded-lg bg-nexus-open/10 border border-nexus-open/30">
            <span className="text-xs text-muted-foreground block">Service μ</span>
            <span className="font-mono text-2xl font-bold text-nexus-open">
              {currentService.toFixed(1)}
            </span>
            <span className="text-xs text-muted-foreground">/min</span>
          </div>
          
          {/* Utilization */}
          <div className={`p-3 rounded-lg border transition-colors ${
            utilization > 100 
              ? 'bg-red-500/10 border-red-500/30' 
              : utilization > 80 
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-secondary/50 border-border'
          }`}>
            <span className="text-xs text-muted-foreground block">Utilization ρ</span>
            <span className={`font-mono text-xl font-bold ${
              utilization > 100 
                ? 'text-red-400' 
                : utilization > 80 
                  ? 'text-amber-400'
                  : 'text-foreground'
            }`}>
              {utilization.toFixed(0)}%
            </span>
          </div>
        </div>
      </div>

      {/* Bottom stats row */}
      <div className="grid grid-cols-4 gap-2 mt-4">
        <div className="p-2 rounded-lg bg-secondary/50 border border-border text-center">
          <span className="text-xs text-muted-foreground block">Queue Length</span>
          <span className="font-mono text-lg font-semibold text-nexus-hold">
            {currentQueue.toFixed(0)}m
          </span>
        </div>
        <div className="p-2 rounded-lg bg-secondary/50 border border-border text-center">
          <span className="text-xs text-muted-foreground block">Avg Wait</span>
          <span className="font-mono text-lg font-semibold text-foreground">
            {(data[data.length - 1]?.avgWaitTime ?? 0).toFixed(1)}s
          </span>
        </div>
        <div className="p-2 rounded-lg bg-secondary/50 border border-border text-center">
          <span className="text-xs text-muted-foreground block">Throughput</span>
          <span className="font-mono text-lg font-semibold text-foreground">
            {(data[data.length - 1]?.throughput ?? 0).toFixed(1)}/m
          </span>
        </div>
        <div className={`p-2 rounded-lg border text-center ${
          isSurge 
            ? 'bg-red-500/10 border-red-500/30' 
            : 'bg-nexus-open/10 border-nexus-open/30'
        }`}>
          <span className="text-xs text-muted-foreground block">Status</span>
          <span className={`font-mono text-sm font-semibold ${
            isSurge ? 'text-red-400' : 'text-nexus-open'
          }`}>
            {isSurge ? 'OVERLOAD' : utilization > 80 ? 'BUSY' : 'NORMAL'}
          </span>
        </div>
      </div>
    </div>
  );
});

LiveWaveGraph.displayName = 'LiveWaveGraph';

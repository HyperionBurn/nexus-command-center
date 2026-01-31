import { useEffect, useState, useMemo } from 'react';
import { Bay } from '@/types/nexus';
import { cn } from '@/lib/utils';

interface GoldenMinuteTimerProps {
  bay: Bay;
  size?: 'sm' | 'md' | 'lg';
}

export const GoldenMinuteTimer = ({ bay, size = 'md' }: GoldenMinuteTimerProps) => {
  const [pulse, setPulse] = useState(false);

  const dimensions = {
    sm: { size: 80, stroke: 4, fontSize: 'text-lg' },
    md: { size: 120, stroke: 6, fontSize: 'text-2xl' },
    lg: { size: 160, stroke: 8, fontSize: 'text-4xl' },
  }[size];

  const radius = (dimensions.size - dimensions.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = bay.status === 'OCCUPIED' ? bay.dwellTime / bay.maxDwell : 0;
  const strokeDashoffset = circumference * (1 - Math.min(progress, 1));
  const remaining = Math.max(0, bay.maxDwell - bay.dwellTime);

  // Determine status color
  const statusColor = useMemo(() => {
    if (bay.status !== 'OCCUPIED') return 'stroke-muted';
    if (bay.dwellTime > 60) return 'stroke-nexus-hold';
    if (bay.dwellTime > 45) return 'stroke-nexus-wait';
    return 'stroke-nexus-open';
  }, [bay.status, bay.dwellTime]);

  const textColor = useMemo(() => {
    if (bay.status !== 'OCCUPIED') return 'text-muted-foreground';
    if (bay.dwellTime > 60) return 'text-nexus-hold text-glow-red';
    if (bay.dwellTime > 45) return 'text-nexus-wait text-glow-amber';
    return 'text-nexus-open text-glow-green';
  }, [bay.status, bay.dwellTime]);

  // Pulse effect when critical
  useEffect(() => {
    if (bay.dwellTime > 50 && bay.dwellTime <= 60) {
      const interval = setInterval(() => setPulse(p => !p), 500);
      return () => clearInterval(interval);
    }
    setPulse(false);
  }, [bay.dwellTime]);

  return (
    <div className={cn('relative flex items-center justify-center', pulse && 'animate-pulse')}>
      <svg
        width={dimensions.size}
        height={dimensions.size}
        className="circular-progress"
      >
        {/* Background circle */}
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--border))"
          strokeWidth={dimensions.stroke}
          className="opacity-30"
        />
        
        {/* Progress circle */}
        <circle
          cx={dimensions.size / 2}
          cy={dimensions.size / 2}
          r={radius}
          fill="none"
          strokeWidth={dimensions.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={cn(statusColor, 'transition-all duration-300')}
          style={{
            filter: bay.dwellTime > 45 ? `drop-shadow(0 0 8px currentColor)` : 'none',
          }}
        />

        {/* Critical zone indicator (last 15 seconds) */}
        {bay.status === 'OCCUPIED' && bay.dwellTime > 45 && (
          <circle
            cx={dimensions.size / 2}
            cy={dimensions.size / 2}
            r={radius - dimensions.stroke - 4}
            fill="none"
            stroke="hsl(var(--nexus-hold) / 0.3)"
            strokeWidth={2}
            strokeDasharray="4 4"
            className="animate-spin"
            style={{ animationDuration: '8s' }}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {bay.status === 'OCCUPIED' ? (
          <>
            <span className={cn('font-mono font-bold', dimensions.fontSize, textColor)}>
              {remaining}
            </span>
            <span className="text-xs text-muted-foreground uppercase tracking-wider">
              {remaining === 1 ? 'sec' : 'secs'}
            </span>
          </>
        ) : bay.status === 'BLOCKED' ? (
          <>
            <span className="text-nexus-hold text-lg font-bold text-glow-red">!</span>
            <span className="text-xs text-nexus-hold">ALERT</span>
          </>
        ) : (
          <>
            <span className="text-nexus-open text-lg font-semibold">✓</span>
            <span className="text-xs text-muted-foreground">READY</span>
          </>
        )}
      </div>
    </div>
  );
};

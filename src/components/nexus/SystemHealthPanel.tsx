import { SystemHealth } from '@/types/nexus';
import { cn } from '@/lib/utils';
import { Activity, Wifi, WifiOff, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';

interface SystemHealthPanelProps {
  health: SystemHealth;
  className?: string;
}

export const SystemHealthPanel = ({ health, className }: SystemHealthPanelProps) => {
  const overallConfig = {
    OPTIMAL: {
      color: 'text-nexus-open',
      bg: 'bg-nexus-open/20',
      icon: Activity,
    },
    DEGRADED: {
      color: 'text-nexus-wait',
      bg: 'bg-nexus-wait/20',
      icon: AlertCircle,
    },
    CRITICAL: {
      color: 'text-nexus-hold',
      bg: 'bg-nexus-hold/20',
      icon: WifiOff,
    },
  }[health.overall];

  const OverallIcon = overallConfig.icon;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">System Health</h3>
            <p className="text-xs text-muted-foreground">
              Last update: {format(health.lastUpdate, 'HH:mm:ss')}
            </p>
          </div>
        </div>
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full',
          overallConfig.bg
        )}>
          <OverallIcon className={cn('h-4 w-4', overallConfig.color)} />
          <span className={cn('text-sm font-semibold', overallConfig.color)}>
            {health.overall}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {health.components.map(component => {
          const statusConfig = {
            ONLINE: { color: 'text-nexus-open', bg: 'bg-nexus-open', icon: Wifi },
            OFFLINE: { color: 'text-nexus-hold', bg: 'bg-nexus-hold', icon: WifiOff },
            WARNING: { color: 'text-nexus-wait', bg: 'bg-nexus-wait', icon: AlertCircle },
          }[component.status];

          return (
            <div
              key={component.name}
              className="flex items-center gap-2 p-2 rounded bg-secondary/30 border border-border/50"
            >
              <div className={cn('w-2 h-2 rounded-full', statusConfig.bg)} />
              <div className="flex-1 min-w-0">
                <span className="text-xs text-foreground truncate block">
                  {component.name}
                </span>
              </div>
              {component.latency !== undefined && (
                <span className="text-xs font-mono text-muted-foreground">
                  {component.latency}ms
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

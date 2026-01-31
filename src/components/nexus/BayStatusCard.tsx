import { Bay } from '@/types/nexus';
import { GoldenMinuteTimer } from './GoldenMinuteTimer';
import { cn } from '@/lib/utils';
import { Car, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface BayStatusCardProps {
  bay: Bay;
}

export const BayStatusCard = ({ bay }: BayStatusCardProps) => {
  const statusConfig = {
    OPEN: {
      bg: 'border-nexus-open/30 bg-nexus-open/5',
      icon: CheckCircle,
      iconColor: 'text-nexus-open',
      label: 'READY',
    },
    OCCUPIED: {
      bg: bay.dwellTime > 50 ? 'border-nexus-wait/50 bg-nexus-wait/10' : 'border-primary/30 bg-primary/5',
      icon: Car,
      iconColor: bay.dwellTime > 50 ? 'text-nexus-wait' : 'text-primary',
      label: 'ACTIVE',
    },
    CLEARING: {
      bg: 'border-nexus-cyan/30 bg-nexus-cyan/5',
      icon: Clock,
      iconColor: 'text-nexus-cyan',
      label: 'CLEARING',
    },
    BLOCKED: {
      bg: 'border-nexus-hold/50 bg-nexus-hold/10 surge-alert',
      icon: AlertTriangle,
      iconColor: 'text-nexus-hold',
      label: 'BLOCKED',
    },
  }[bay.status];

  const StatusIcon = statusConfig.icon;

  return (
    <div className={cn(
      'glass-panel p-4 border transition-all duration-300',
      statusConfig.bg
    )}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-foreground">
              Bay {bay.id}
            </span>
            <span className={cn(
              'px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider',
              bay.status === 'OPEN' && 'bg-nexus-open/20 text-nexus-open',
              bay.status === 'OCCUPIED' && 'bg-primary/20 text-primary',
              bay.status === 'CLEARING' && 'bg-nexus-cyan/20 text-nexus-cyan',
              bay.status === 'BLOCKED' && 'bg-nexus-hold/20 text-nexus-hold',
            )}>
              {statusConfig.label}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">Zone {bay.zone}</span>
        </div>
        <StatusIcon className={cn('h-5 w-5', statusConfig.iconColor)} />
      </div>

      <div className="flex items-center gap-4">
        <GoldenMinuteTimer bay={bay} size="sm" />
        
        <div className="flex-1 space-y-2">
          {bay.plateNumber && (
            <div>
              <span className="text-xs text-muted-foreground">Plate</span>
              <p className="font-mono text-sm font-medium text-foreground">{bay.plateNumber}</p>
            </div>
          )}
          {bay.childName && (
            <div>
              <span className="text-xs text-muted-foreground">Student</span>
              <p className="text-sm font-medium text-foreground">{bay.childName}</p>
            </div>
          )}
          {bay.status === 'OCCUPIED' && (
            <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
              <div 
                className={cn(
                  'h-full transition-all duration-1000',
                  bay.dwellTime <= 45 ? 'bg-nexus-open' : 
                  bay.dwellTime <= 60 ? 'bg-nexus-wait' : 'bg-nexus-hold'
                )}
                style={{ width: `${Math.min((bay.dwellTime / bay.maxDwell) * 100, 100)}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {bay.isAlerted && (
        <div className="mt-3 p-2 rounded bg-nexus-hold/20 border border-nexus-hold/30">
          <div className="flex items-center gap-2 text-nexus-hold text-xs">
            <AlertTriangle className="h-3 w-3" />
            <span>Marshall Alert: Dwell time exceeded</span>
          </div>
        </div>
      )}
    </div>
  );
};

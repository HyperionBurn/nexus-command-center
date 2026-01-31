import { memo } from 'react';
import { Bay, BayPhase } from '@/types/fluxgate';
import { GoldenMinuteTimer } from './GoldenMinuteTimer';
import { cn } from '@/lib/utils';
import { Car, AlertTriangle, CheckCircle, Clock, ShieldCheck, UserCheck, Bus } from 'lucide-react';

interface BayStatusCardProps {
  bay: Bay;
}
const getPhaseConfig = (phase: BayPhase) => {
  switch (phase) {
    case 'ENTRY': return { label: 'ENTRY', color: 'text-blue-400', bg: 'bg-blue-400/20' };
    case 'ACTION': return { label: 'ACTION', color: 'text-amber-400', bg: 'bg-amber-400/20' };
    case 'EXIT': return { label: 'EXIT', color: 'text-emerald-400', bg: 'bg-emerald-400/20' };
    case 'VERIFICATION': return { label: 'VERIFY', color: 'text-purple-400', bg: 'bg-purple-400/20' };
    case 'HANDOFF': return { label: 'HANDOFF', color: 'text-pink-400', bg: 'bg-pink-400/20' };
    default: return { label: 'IDLE', color: 'text-muted-foreground', bg: 'bg-muted/20' };
  }
};

export const BayStatusCard = memo(({ bay }: BayStatusCardProps) => {
  // Generate accessible description for screen readers
  const getAccessibleDescription = () => {
    const status = bay.status.toLowerCase();
    const zone = bay.zone;
    const dwellInfo = bay.status === 'OCCUPIED' 
      ? ` Dwell time: ${bay.dwellTime} of ${bay.maxDwell} seconds.`
      : '';
    const plateInfo = bay.plateNumber ? ` Vehicle: ${bay.plateNumber}.` : '';
    const childInfo = bay.childName ? ` Student: ${bay.childName}.` : '';
    const alertInfo = bay.isAlerted ? ' Alert: Dwell time exceeded.' : '';
    
    return `Bay ${bay.id}, Zone ${zone}, Status: ${status}.${dwellInfo}${plateInfo}${childInfo}${alertInfo}`;
  };

  const statusConfig = {
    OPEN: {
      bg: 'border-FLUXGATE-open/30 bg-FLUXGATE-open/5',
      icon: CheckCircle,
      iconColor: 'text-FLUXGATE-open',
      label: 'READY',
    },
    OCCUPIED: {
      bg: bay.dwellTime > (bay.maxDwell * 0.8) ? 'border-FLUXGATE-wait/50 bg-FLUXGATE-wait/10' : 'border-primary/30 bg-primary/5',
      icon: bay.type === 'BUS' ? Bus : Car,
      iconColor: bay.dwellTime > (bay.maxDwell * 0.8) ? 'text-FLUXGATE-wait' : 'text-primary',
      label: 'ACTIVE',
    },
    CLEARING: {
      bg: 'border-FLUXGATE-cyan/30 bg-FLUXGATE-cyan/5',
      icon: Clock,
      iconColor: 'text-FLUXGATE-cyan',
      label: 'CLEARING',
    },
    BLOCKED: {
      bg: 'border-FLUXGATE-hold/50 bg-FLUXGATE-hold/10',
      icon: AlertTriangle,
      iconColor: 'text-FLUXGATE-hold',
      label: 'BLOCKED',
    },
  }[bay.status];

  const StatusIcon = statusConfig.icon;
  const phaseConfig = getPhaseConfig(bay.phase);

  return (
    <article 
      className={cn(
        'glass-panel p-4 border',
        statusConfig.bg
      )}
      role="region"
      aria-label={getAccessibleDescription()}
      tabIndex={0}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-foreground">
              Bay {bay.id}
            </span>
            <span className={cn(
              'px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider',
              bay.status === 'OPEN' && 'bg-FLUXGATE-open/20 text-FLUXGATE-open',
              bay.status === 'OCCUPIED' && 'bg-primary/20 text-primary',
              bay.status === 'CLEARING' && 'bg-FLUXGATE-cyan/20 text-FLUXGATE-cyan',
              bay.status === 'BLOCKED' && 'bg-FLUXGATE-hold/20 text-FLUXGATE-hold',
            )}>
              {statusConfig.label}
            </span>
            {bay.status === 'OCCUPIED' && (
               <span className={cn(
                'px-2 py-0.5 rounded text-xs font-medium uppercase tracking-wider flex items-center gap-1',
                phaseConfig.bg, phaseConfig.color
              )}>
                {phaseConfig.label}
              </span>
            )}
          </div>
          <span className="text-xs text-muted-foreground">Zone {bay.zone}</span>
        </div>
        <StatusIcon className={cn('h-5 w-5', statusConfig.iconColor)} aria-hidden="true" />
      </div>

      <div className="flex items-center gap-4">
        <GoldenMinuteTimer bay={bay} size="sm" />
        
        <div className="flex-1 space-y-2">
          {bay.plateNumber && (
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                Plate
                {bay.phase === 'VERIFICATION' && <ShieldCheck className="h-3 w-3 text-purple-400" aria-hidden="true" />}
              </span>
              <p className="font-mono text-sm font-medium text-foreground">{bay.plateNumber}</p>
            </div>
          )}
          {bay.childName && (
            <div>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                Student
                {bay.phase === 'HANDOFF' && <UserCheck className="h-3 w-3 text-pink-400" aria-hidden="true" />}
              </span>
              <p className="text-sm font-medium text-foreground">{bay.childName}</p>
            </div>
          )}
          {bay.status === 'OCCUPIED' && (
            <div 
              className="relative h-2 bg-secondary rounded-full overflow-hidden"
              role="progressbar"
              aria-label={`Dwell time progress for Bay ${bay.id}`}
              aria-valuenow={bay.dwellTime}
              aria-valuemin={0}
              aria-valuemax={bay.maxDwell}
              aria-valuetext={`${bay.dwellTime} of ${bay.maxDwell} seconds`}
            >
               {/* Progress Bar Background */}
              <div 
                className={cn(
                  'absolute top-0 left-0 h-full transition-all duration-1000',
                  bay.dwellTime <= bay.maxDwell * 0.75 ? 'bg-FLUXGATE-open' : 
                  bay.dwellTime <= bay.maxDwell ? 'bg-FLUXGATE-wait' : 'bg-FLUXGATE-hold'
                )}
                style={{ width: `${Math.min((bay.dwellTime / bay.maxDwell) * 100, 100)}%` }}
              />
              
              {/* Markers for phases could go here if we knew exact pixel widths, simple bar is clearer for now */}
            </div>
          )}
        </div>
      </div>

      {bay.isAlerted && (
        <div 
          className="mt-3 p-2 rounded bg-FLUXGATE-hold/20 border border-FLUXGATE-hold/30"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-center gap-2 text-FLUXGATE-hold text-xs">
            <AlertTriangle className="h-3 w-3" aria-hidden="true" />
            <span>Marshall Alert: Dwell time exceeded</span>
          </div>
        </div>
      )}
    </article>
  );
});

BayStatusCard.displayName = 'BayStatusCard';

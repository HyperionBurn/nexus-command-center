import { SurgeEvent } from '@/types/nexus';
import { cn } from '@/lib/utils';
import { AlertTriangle, Coffee, ArrowRight, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

interface SurgeAlertBannerProps {
  surge: SurgeEvent | null;
  onDismiss?: () => void;
}

export const SurgeAlertBanner = ({ surge, onDismiss }: SurgeAlertBannerProps) => {
  if (!surge) return null;

  const severityConfig = {
    LOW: {
      bg: 'bg-nexus-wait/10 border-nexus-wait/30',
      text: 'text-nexus-wait',
      icon: AlertTriangle,
    },
    MEDIUM: {
      bg: 'bg-nexus-wait/20 border-nexus-wait/50',
      text: 'text-nexus-wait',
      icon: AlertTriangle,
    },
    HIGH: {
      bg: 'bg-nexus-hold/20 border-nexus-hold/50 surge-alert',
      text: 'text-nexus-hold',
      icon: AlertTriangle,
    },
  }[surge.severity];

  const SeverityIcon = severityConfig.icon;

  return (
    <div className={cn(
      'rounded-lg border p-4 transition-all duration-300',
      severityConfig.bg,
      surge.resolved && 'opacity-60'
    )}>
      <div className="flex items-start gap-4">
        <div className={cn(
          'flex items-center justify-center w-10 h-10 rounded-full',
          surge.resolved ? 'bg-nexus-open/20' : 'bg-nexus-hold/20'
        )}>
          {surge.resolved ? (
            <CheckCircle className="h-5 w-5 text-nexus-open" />
          ) : (
            <SeverityIcon className={cn('h-5 w-5', severityConfig.text)} />
          )}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn(
              'font-semibold',
              surge.resolved ? 'text-nexus-open' : severityConfig.text
            )}>
              {surge.resolved ? 'SURGE RESOLVED' : `SURGE DETECTED - ${surge.severity}`}
            </h4>
            <span className="text-xs text-muted-foreground">
              {format(surge.timestamp, 'HH:mm:ss')}
            </span>
          </div>

          <p className="text-sm text-foreground mb-3">
            {surge.action}
          </p>

          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Arrival Rate:</span>
              <span className="font-mono font-semibold text-nexus-cyan">
                λ = {surge.arrivalRate.toFixed(1)}/min
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Service Rate:</span>
              <span className="font-mono font-semibold text-nexus-open">
                μ = {surge.serviceRate.toFixed(1)}/min
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Overflow:</span>
              <span className={cn(
                'font-mono font-semibold',
                surge.resolved ? 'text-nexus-open' : 'text-nexus-hold'
              )}>
                {((surge.arrivalRate / surge.serviceRate - 1) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {!surge.resolved && (
            <div className="mt-4 flex items-center gap-3 p-3 rounded bg-secondary/50 border border-border">
              <Coffee className="h-5 w-5 text-nexus-wait" />
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">
                  Staging Zone Protocol Active
                </span>
                <p className="text-xs text-muted-foreground">
                  Overflow traffic directed to Coffee Zone holding area
                </p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

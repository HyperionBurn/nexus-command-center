import { Zone } from '@/types/nexus';
import { BayStatusCard } from './BayStatusCard';
import { cn } from '@/lib/utils';
import { MapPin, Users, Clock, ArrowUp } from 'lucide-react';

interface ZoneOverviewProps {
  zones: Zone[];
  className?: string;
}

export const ZoneOverview = ({ zones, className }: ZoneOverviewProps) => {
  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">Zone Control</h3>
          <p className="text-xs text-muted-foreground">Bay status & monitoring</p>
        </div>
      </div>

      <div className="space-y-4">
        {zones.map(zone => (
          <div key={zone.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn(
                  'px-2 py-1 rounded font-mono text-sm font-bold',
                  zone.status === 'NORMAL' && 'bg-nexus-open/20 text-nexus-open',
                  zone.status === 'SURGE' && 'bg-nexus-wait/20 text-nexus-wait',
                  zone.status === 'CRITICAL' && 'bg-nexus-hold/20 text-nexus-hold',
                )}>
                  {zone.name}
                </span>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded',
                  zone.gateStatus === 'OPEN' && 'bg-nexus-open/10 text-nexus-open',
                  zone.gateStatus === 'CLOSED' && 'bg-nexus-hold/10 text-nexus-hold',
                  zone.gateStatus === 'TRANSITIONING' && 'bg-nexus-wait/10 text-nexus-wait',
                )}>
                  Gate {zone.gateStatus}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{zone.vehicleCount}/{zone.bays.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{zone.avgDwellTime.toFixed(0)}s avg</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" />
                  <span>{zone.queueLength.toFixed(0)}m</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2">
              {zone.bays.map(bay => (
                <BayStatusCard key={bay.id} bay={bay} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

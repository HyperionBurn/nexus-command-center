import { memo } from 'react';
import { Zone } from '@/types/fluxgate';
import { BayStatusCard } from './BayStatusCard';
import { cn } from '@/lib/utils';
import { MapPin, Users, Clock, ArrowUp } from 'lucide-react';

interface ZoneOverviewProps {
  zones: Zone[];
  className?: string;
}

export const ZoneOverview = memo(({ zones, className }: ZoneOverviewProps) => {
  return (
    <section 
      className={className}
      aria-labelledby="zone-control-heading"
    >
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="h-5 w-5 text-primary" aria-hidden="true" />
        <div>
          <h3 id="zone-control-heading" className="text-lg font-semibold text-foreground">Zone Control</h3>
          <p className="text-xs text-muted-foreground">Bay status & monitoring</p>
        </div>
      </div>

      <div className="space-y-4" role="list" aria-label="Zones">
        {zones.map(zone => (
          <div 
            key={zone.id} 
            className="space-y-2"
            role="listitem"
            aria-label={`${zone.name} zone, status: ${zone.status.toLowerCase()}, ${zone.vehicleCount} of ${zone.bays.length} bays occupied`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span 
                  className={cn(
                    'px-2 py-1 rounded font-mono text-sm font-bold',
                    zone.status === 'NORMAL' && 'bg-FLUXGATE-open/20 text-FLUXGATE-open',
                    zone.status === 'SURGE' && 'bg-FLUXGATE-wait/20 text-FLUXGATE-wait',
                    zone.status === 'CRITICAL' && 'bg-FLUXGATE-hold/20 text-FLUXGATE-hold',
                  )}
                  role="status"
                  aria-label={`Zone ${zone.name}, status ${zone.status.toLowerCase()}`}
                >
                  {zone.name}
                </span>
                <span 
                  className={cn(
                    'text-xs px-2 py-0.5 rounded',
                    zone.gateStatus === 'OPEN' && 'bg-FLUXGATE-open/10 text-FLUXGATE-open',
                    zone.gateStatus === 'CLOSED' && 'bg-FLUXGATE-hold/10 text-FLUXGATE-hold',
                    zone.gateStatus === 'TRANSITIONING' && 'bg-FLUXGATE-wait/10 text-FLUXGATE-wait',
                  )}
                  role="status"
                  aria-label={`Gate status: ${zone.gateStatus.toLowerCase()}`}
                >
                  Gate {zone.gateStatus}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground" aria-label="Zone statistics">
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" aria-hidden="true" />
                  <span aria-label={`${zone.vehicleCount} of ${zone.bays.length} vehicles`}>{zone.vehicleCount}/{zone.bays.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" aria-hidden="true" />
                  <span aria-label={`Average dwell time: ${zone.avgDwellTime.toFixed(0)} seconds`}>{zone.avgDwellTime.toFixed(0)}s avg</span>
                </div>
                <div className="flex items-center gap-1">
                  <ArrowUp className="h-3 w-3" aria-hidden="true" />
                  <span aria-label={`Queue length: ${zone.queueLength.toFixed(0)} meters`}>{zone.queueLength.toFixed(0)}m</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-2" role="group" aria-label={`Bays in ${zone.name}`}>
              {zone.bays.map(bay => (
                <BayStatusCard key={bay.id} bay={bay} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

ZoneOverview.displayName = 'ZoneOverview';

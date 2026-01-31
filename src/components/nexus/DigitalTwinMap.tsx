import { Zone, Vehicle } from '@/types/nexus';
import { cn } from '@/lib/utils';
import { useMemo } from 'react';

interface DigitalTwinMapProps {
  zones: Zone[];
  vehicles: Vehicle[];
  className?: string;
}

export const DigitalTwinMap = ({ zones, vehicles, className }: DigitalTwinMapProps) => {
  const zonePositions = useMemo(() => ({
    A: { x: 120, y: 120, width: 180, height: 100 },
    B: { x: 340, y: 120, width: 180, height: 100 },
    C: { x: 560, y: 120, width: 180, height: 100 },
  }), []);

  const getZoneColor = (zone: Zone) => {
    if (zone.status === 'CRITICAL') return 'fill-nexus-hold/20 stroke-nexus-hold';
    if (zone.status === 'SURGE') return 'fill-nexus-wait/20 stroke-nexus-wait';
    return 'fill-nexus-open/10 stroke-nexus-open/50';
  };

  const getGateColor = (status: Zone['gateStatus']) => {
    if (status === 'OPEN') return 'fill-nexus-open';
    if (status === 'CLOSED') return 'fill-nexus-hold';
    return 'fill-nexus-wait';
  };

  return (
    <div className={cn('relative', className)}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Digital Twin</h3>
          <p className="text-xs text-muted-foreground">Real-time Zone Visualization</p>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-nexus-open animate-pulse" />
            <span className="text-muted-foreground">YOLO v8 Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-nexus-cyan" />
            <span className="text-muted-foreground">
              {vehicles.length} vehicles tracked
            </span>
          </div>
        </div>
      </div>

      <div className="relative bg-secondary/30 rounded-lg overflow-hidden border border-border">
        <svg viewBox="0 0 800 400" className="w-full h-auto">
          {/* Grid pattern */}
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path 
                d="M 40 0 L 0 0 0 40" 
                fill="none" 
                stroke="hsl(var(--border))" 
                strokeWidth="0.5"
                strokeOpacity="0.3"
              />
            </pattern>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          <rect width="800" height="400" fill="url(#grid)" />

          {/* Road markings */}
          <rect x="50" y="250" width="700" height="80" fill="hsl(var(--secondary))" rx="4" />
          <line x1="50" y1="290" x2="750" y2="290" stroke="hsl(var(--nexus-wait))" strokeWidth="2" strokeDasharray="20 10" />

          {/* Entry/Exit labels */}
          <text x="70" y="295" fill="hsl(var(--muted-foreground))" fontSize="12" fontFamily="JetBrains Mono">
            ENTRY →
          </text>
          <text x="680" y="295" fill="hsl(var(--muted-foreground))" fontSize="12" fontFamily="JetBrains Mono">
            → EXIT
          </text>

          {/* Zones */}
          {zones.map(zone => {
            const pos = zonePositions[zone.id];
            return (
              <g key={zone.id}>
                {/* Zone rectangle */}
                <rect
                  x={pos.x}
                  y={pos.y}
                  width={pos.width}
                  height={pos.height}
                  rx="8"
                  className={cn('transition-all duration-500', getZoneColor(zone))}
                  strokeWidth="2"
                  filter={zone.status !== 'NORMAL' ? 'url(#glow)' : undefined}
                />
                
                {/* Zone label */}
                <text
                  x={pos.x + pos.width / 2}
                  y={pos.y - 10}
                  textAnchor="middle"
                  fill="hsl(var(--foreground))"
                  fontSize="14"
                  fontWeight="600"
                >
                  Zone {zone.id}
                </text>

                {/* Bay indicators */}
                {zone.bays.map((bay, i) => {
                  const bayX = pos.x + 15 + (i * 42);
                  const bayY = pos.y + 30;
                  return (
                    <g key={bay.id}>
                      <rect
                        x={bayX}
                        y={bayY}
                        width="35"
                        height="50"
                        rx="4"
                        className={cn(
                          'transition-all duration-300',
                          bay.status === 'OPEN' && 'fill-nexus-open/20 stroke-nexus-open/50',
                          bay.status === 'OCCUPIED' && 'fill-primary/30 stroke-primary',
                          bay.status === 'CLEARING' && 'fill-nexus-cyan/20 stroke-nexus-cyan',
                          bay.status === 'BLOCKED' && 'fill-nexus-hold/30 stroke-nexus-hold',
                        )}
                        strokeWidth="1"
                      />
                      <text
                        x={bayX + 17.5}
                        y={bayY + 30}
                        textAnchor="middle"
                        fill="hsl(var(--foreground))"
                        fontSize="10"
                        fontFamily="JetBrains Mono"
                      >
                        {bay.id}
                      </text>
                      {bay.status === 'OCCUPIED' && (
                        <circle
                          cx={bayX + 17.5}
                          cy={bayY + 10}
                          r="4"
                          className="fill-nexus-cyan animate-pulse"
                        />
                      )}
                    </g>
                  );
                })}

                {/* Gate indicator */}
                <rect
                  x={pos.x + pos.width / 2 - 20}
                  y={pos.y + pos.height - 5}
                  width="40"
                  height="10"
                  rx="2"
                  className={cn('transition-all duration-300', getGateColor(zone.gateStatus))}
                />
                <text
                  x={pos.x + pos.width / 2}
                  y={pos.y + pos.height + 20}
                  textAnchor="middle"
                  fill="hsl(var(--muted-foreground))"
                  fontSize="9"
                  fontFamily="JetBrains Mono"
                >
                  GATE {zone.gateStatus}
                </text>

                {/* Zone stats */}
                <text
                  x={pos.x + 10}
                  y={pos.y + pos.height + 35}
                  fill="hsl(var(--muted-foreground))"
                  fontSize="9"
                >
                  Queue: {zone.queueLength.toFixed(0)}m
                </text>
              </g>
            );
          })}

          {/* Vehicles with YOLO bounding boxes */}
          {vehicles.map(vehicle => (
            <g key={vehicle.id} className="transition-all duration-500">
              {/* Bounding box */}
              <rect
                x={vehicle.position.x - vehicle.boundingBox.width / 2}
                y={vehicle.position.y - vehicle.boundingBox.height / 2}
                width={vehicle.boundingBox.width}
                height={vehicle.boundingBox.height}
                fill="none"
                stroke="hsl(var(--nexus-cyan))"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                rx="2"
                opacity={0.8}
              />
              {/* Vehicle dot */}
              <circle
                cx={vehicle.position.x}
                cy={vehicle.position.y}
                r="4"
                className="fill-nexus-cyan"
                filter="url(#glow)"
              />
              {/* Confidence label */}
              <text
                x={vehicle.position.x}
                y={vehicle.position.y - vehicle.boundingBox.height / 2 - 5}
                textAnchor="middle"
                fill="hsl(var(--nexus-cyan))"
                fontSize="8"
                fontFamily="JetBrains Mono"
              >
                {(vehicle.confidence * 100).toFixed(0)}%
              </text>
            </g>
          ))}

          {/* Legend */}
          <g transform="translate(620, 340)">
            <rect x="0" y="0" width="160" height="50" fill="hsl(var(--card))" rx="4" opacity="0.8" />
            <circle cx="15" cy="15" r="4" className="fill-nexus-open" />
            <text x="25" y="18" fill="hsl(var(--muted-foreground))" fontSize="9">Open Bay</text>
            <circle cx="85" cy="15" r="4" className="fill-nexus-cyan" />
            <text x="95" y="18" fill="hsl(var(--muted-foreground))" fontSize="9">Occupied</text>
            <circle cx="15" cy="35" r="4" className="fill-nexus-hold" />
            <text x="25" y="38" fill="hsl(var(--muted-foreground))" fontSize="9">Blocked</text>
            <circle cx="85" cy="35" r="4" className="fill-nexus-wait" />
            <text x="95" y="38" fill="hsl(var(--muted-foreground))" fontSize="9">Clearing</text>
          </g>
        </svg>
      </div>
    </div>
  );
};

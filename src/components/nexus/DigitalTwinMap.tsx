import { Zone, Vehicle } from "@/types/nexus";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

interface DigitalTwinMapProps {
  zones: Zone[];
  vehicles: Vehicle[];
  className?: string;
}

export const DigitalTwinMap = ({ zones, vehicles, className }: DigitalTwinMapProps) => {
  // Simplified fixed coordinates for "Campus Loop"
  // A, B, C aligned with vehicle simulation lanes (y=270 & y=310)
  const zoneCoords = {
    "A": { x: 150, y: 220, width: 140, height: 80 },
    "B": { x: 400, y: 350, width: 140, height: 80 },
    "C": { x: 650, y: 220, width: 140, height: 80 },
    "BUS": { x: 350, y: 50, width: 300, height: 60 }
  };

  const getZoneColor = (status: Zone["status"]) => {
      switch(status) {
          case "CRITICAL": return "stroke-red-500 fill-red-500/10"; 
          case "SURGE": return "stroke-amber-500 fill-amber-500/10"; 
          default: return "stroke-emerald-500 fill-emerald-500/10";
      }
  };

  return (
    <div className={cn("relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl", className)}>
        
        {/* Simple Header */}
        <div className="absolute top-4 left-4 z-10">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                DIGITAL TWIN (L2)
            </h3>
        </div>

        {/* SVG Map */}
        <div className="w-full h-full min-h-[400px]">
            <svg viewBox="0 0 800 400" className="w-full h-full">
                
                {/* Background Grid */}
                <defs>
                    <pattern id="simpleGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
                    </pattern>
                </defs>
                <rect width="800" height="400" fill="url(#simpleGrid)" />

                {/* --- ROADS --- */}
                
                {/* Top Bus Lane (Y approx 50) */}
                <rect x="50" y="40" width="700" height="80" rx="10" fill="#0f172a" stroke="#fbbf24" strokeWidth="1" strokeDasharray="10 5" opacity="0.3" />
                <text x="80" y="30" fill="#fbbf24" fontSize="10" opacity="0.5">BUS RAPID TRANSIT LANE</text>

                {/* Main Loop (Lanes at 270 and 310) */}
                {/* Visual road container */}
                <path 
                    d="M -10 290 L 810 290" 
                    stroke="#1e293b" 
                    strokeWidth="120" 
                    strokeLinecap="square"
                />
                
                {/* Lane Dividers */}
                <path 
                    d="M 0 290 L 800 290" 
                    fill="none" 
                    stroke="#334155" 
                    strokeWidth="2" 
                    strokeDasharray="20 20" 
                    opacity="0.5"
                />
                <text x="40" y="240" fill="#94a3b8" fontSize="10" opacity="0.5">PICKUP LANE A</text>
                <text x="40" y="340" fill="#94a3b8" fontSize="10" opacity="0.5">PICKUP LANE B</text>

                {/* --- ZONES --- */}
                {zones.map((zone) => {
                    const coords = zoneCoords[zone.id] || { x: 0, y: 0, width: 0, height: 0};
                    const isBus = zone.id === "BUS";
                    
                    return (
                        <g key={zone.id}>
                            <rect 
                                x={coords.x - coords.width / 2}
                                y={coords.y - coords.height / 2}
                                width={coords.width}
                                height={coords.height}
                                className={cn("transition-colors duration-500", getZoneColor(zone.status))}
                                strokeWidth="1"
                                rx="8"
                            />
                            <text 
                                x={coords.x} 
                                y={coords.y - coords.height/2 - 10} 
                                textAnchor="middle" 
                                fill="white" 
                                fontSize="12" 
                                fontWeight="bold"
                            >
                                {isBus ? "BUS STATION" : `ZONE ${zone.id}`}
                            </text>

                            {/* Bays */}
                            {zone.bays.map((bay, i) => {
                                const bx = (coords.x - coords.width/2 + 20) + (i * 30);
                                const by = coords.y - 10;
                                return (
                                    <rect 
                                        key={bay.id}
                                        x={bx}
                                        y={by}
                                        width="20"
                                        height="30"
                                        rx="2"
                                        fill={bay.status === "OCCUPIED" ? (isBus ? "#fbbf24" : "#60a5fa") : "#1e293b"}
                                        className="transition-colors duration-300"
                                    />
                                );
                            })}
                        </g>
                    )
                })}

                {/* --- VEHICLES --- */}
                {vehicles.map((v) => (
                    <g 
                        key={v.id}
                        className="transition-all duration-300 ease-linear"
                        style={{ transform: `translate(${v.position.x}px, ${v.position.y}px)` }}
                    >
                         {/* Glow */}
                         <circle r="20" fill={v.type === "BUS" ? "#fbbf24" : "#60a5fa"} fillOpacity="0.1" />
                         
                         {/* Body */}
                         {v.type === "BUS" ? (
                             <g>
                                <rect x="-18" y="-8" width="36" height="16" rx="2" fill="#fbbf24" stroke="white" strokeWidth="1" />
                                <rect x="-14" y="-6" width="20" height="12" fill="white" fillOpacity="0.2" rx="1"/>
                             </g>
                         ) : (
                             <g>
                                <rect x="-12" y="-6" width="24" height="12" rx="3" fill="#60a5fa" stroke="white" strokeWidth="1" />
                                <rect x="-8" y="-4" width="10" height="8" rx="1" fill="#1e293b" />
                             </g>
                         )}

                         {/* Tag */}
                         <text y="-12" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" style={{textShadow: "0px 1px 2px black"}}>
                             {v.id.slice(0, 3)}
                         </text>
                    </g>
                ))}

            </svg>
        </div>
    </div>
  );
};

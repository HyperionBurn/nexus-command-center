import { Zone, Vehicle } from "@/types/fluxgate";
import { cn } from "@/lib/utils";
import { memo, useMemo } from "react";
import { AnimatePresence } from "framer-motion";

interface DigitalTwinMapProps {
  zones: Zone[];
  vehicles: Vehicle[];
  className?: string;
}

export const DigitalTwinMap = memo(({ zones, vehicles, className }: DigitalTwinMapProps) => {
  // Combine all zones into one unified zone for display
  const combinedZone = useMemo(() => {
    const allBays = zones.flatMap(z => z.bays);
    const occupiedCount = allBays.filter(b => b.status === "OCCUPIED").length;
    const totalBays = allBays.length;
    
    // Determine overall status based on all zones
    const hasAnyCritical = zones.some(z => z.status === "CRITICAL");
    const hasAnySurge = zones.some(z => z.status === "SURGE");
    const overallStatus: Zone["status"] = hasAnyCritical ? "CRITICAL" : hasAnySurge ? "SURGE" : "NORMAL";
    
    // Separate bus bays from car bays
    const busBays = allBays.filter(b => b.type === "BUS");
    const carBays = allBays.filter(b => b.type !== "BUS");
    
    return {
      allBays,
      busBays,
      carBays,
      occupiedCount,
      totalBays,
      overallStatus,
      avgDwellTime: zones.reduce((sum, z) => sum + z.avgDwellTime, 0) / zones.length,
      totalQueue: zones.reduce((sum, z) => sum + z.queueLength, 0),
    };
  }, [zones]);

  const getZoneColor = (status: Zone["status"]) => {
      switch(status) {
          case "CRITICAL": return "stroke-red-500 fill-red-500/10"; 
          case "SURGE": return "stroke-amber-500 fill-amber-500/10"; 
          default: return "stroke-emerald-500 fill-emerald-500/10";
      }
  };

  const getZoneStrokeColor = (status: Zone["status"]) => {
      switch(status) {
          case "CRITICAL": return "#ef4444"; 
          case "SURGE": return "#f59e0b"; 
          default: return "#10b981";
      }
  };

  return (
    <div className={cn("relative bg-slate-950 rounded-xl border border-slate-800 overflow-hidden shadow-2xl", className)}>
        
        {/* Simple Header */}
        <div className="absolute top-4 left-4 z-10">
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                UNIFIED DIGITAL TWIN
            </h3>
        </div>

        {/* Mini Legend */}
        <div className="absolute top-4 right-4 z-10 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2 border border-slate-700">
            <div className="text-[10px] text-slate-400 font-medium mb-1.5">STATUS LEGEND</div>
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-emerald-500/30 border border-emerald-500" />
                    <span className="text-[10px] text-slate-300">Normal</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-amber-500/30 border border-amber-500" />
                    <span className="text-[10px] text-slate-300">Surge</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-red-500/30 border border-red-500" />
                    <span className="text-[10px] text-slate-300">Critical</span>
                </div>
            </div>
        </div>

        {/* SVG Map */}
        <div className="w-full h-full min-h-[400px]">
            <svg viewBox="0 0 800 400" className="w-full h-full">
                
                {/* Background Grid */}
                <defs>
                    <pattern id="simpleGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#1e293b" strokeWidth="0.5"/>
                    </pattern>
                    {/* Arrow marker for traffic flow */}
                    <marker
                        id="flowArrow"
                        markerWidth="8"
                        markerHeight="8"
                        refX="4"
                        refY="4"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path d="M0,1 L0,7 L6,4 z" fill="#64748b" />
                    </marker>
                    <marker
                        id="flowArrowGreen"
                        markerWidth="8"
                        markerHeight="8"
                        refX="4"
                        refY="4"
                        orient="auto"
                        markerUnits="strokeWidth"
                    >
                        <path d="M0,1 L0,7 L6,4 z" fill="#22c55e" />
                    </marker>
                </defs>
                <rect width="800" height="400" fill="url(#simpleGrid)" />

                {/* --- ENTRY GATE (Left Side) --- */}
                <g transform="translate(15, 270)">
                    {/* Gate structure */}
                    <rect x="-10" y="-30" width="20" height="80" fill="#1e293b" stroke="#3b82f6" strokeWidth="2" rx="3" />
                    <rect x="-6" y="-25" width="12" height="30" fill="#3b82f6" fillOpacity="0.3" rx="2" />
                    {/* Gate barrier arm */}
                    <rect x="5" y="-5" width="40" height="4" fill="#22c55e" rx="2">
                        <animate attributeName="fill" values="#22c55e;#22c55e;#f59e0b;#22c55e" dur="4s" repeatCount="indefinite" />
                    </rect>
                    <circle cx="5" cy="-3" r="4" fill="#1e293b" stroke="#3b82f6" strokeWidth="1.5" />
                    {/* Entry label */}
                    <text x="0" y="60" textAnchor="middle" fill="#3b82f6" fontSize="9" fontWeight="bold">ENTRY</text>
                    <text x="0" y="70" textAnchor="middle" fill="#64748b" fontSize="7">GATE</text>
                </g>

                {/* --- EXIT GATE (Right Side) --- */}
                <g transform="translate(785, 270)">
                    {/* Gate structure */}
                    <rect x="-10" y="-30" width="20" height="80" fill="#1e293b" stroke="#10b981" strokeWidth="2" rx="3" />
                    <rect x="-6" y="-25" width="12" height="30" fill="#10b981" fillOpacity="0.3" rx="2" />
                    {/* Gate barrier arm */}
                    <rect x="-45" y="-5" width="40" height="4" fill="#22c55e" rx="2" />
                    <circle cx="-5" cy="-3" r="4" fill="#1e293b" stroke="#10b981" strokeWidth="1.5" />
                    {/* Exit label */}
                    <text x="0" y="60" textAnchor="middle" fill="#10b981" fontSize="9" fontWeight="bold">EXIT</text>
                    <text x="0" y="70" textAnchor="middle" fill="#64748b" fontSize="7">GATE</text>
                </g>

                {/* --- ROADS --- */}
                
                {/* Top Bus Lane (Y approx 80) */}
                <rect x="80" y="40" width="640" height="90" rx="10" fill="#0f172a" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="10 5" opacity="0.4" />
                <text x="110" y="32" fill="#fbbf24" fontSize="10" opacity="0.6">BUS RAPID TRANSIT LANE</text>

                {/* Main Loop (Lanes at 270 and 310) */}
                {/* Visual road container */}
                <path 
                    d="M 40 290 L 760 290" 
                    stroke="#1e293b" 
                    strokeWidth="120" 
                    strokeLinecap="round"
                />
                
                {/* Lane Dividers - Center line */}
                <path 
                    d="M 60 290 L 740 290" 
                    fill="none" 
                    stroke="#fbbf24" 
                    strokeWidth="2" 
                    strokeDasharray="15 10" 
                    opacity="0.4"
                />
                
                {/* Edge lines */}
                <path d="M 60 230 L 740 230" fill="none" stroke="#475569" strokeWidth="1.5" opacity="0.6" />
                <path d="M 60 350 L 740 350" fill="none" stroke="#475569" strokeWidth="1.5" opacity="0.6" />

                {/* --- TRAFFIC FLOW ARROWS --- */}
                {/* Top lane arrows (left to right) */}
                <path d="M 80 255 L 200 255" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#flowArrow)" opacity="0.7" />
                <path d="M 300 255 L 420 255" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#flowArrow)" opacity="0.7" />
                <path d="M 520 255 L 640 255" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#flowArrow)" opacity="0.7" />
                
                {/* Bottom lane arrows (left to right) */}
                <path d="M 80 325 L 200 325" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#flowArrow)" opacity="0.7" />
                <path d="M 520 325 L 640 325" fill="none" stroke="#64748b" strokeWidth="2" markerEnd="url(#flowArrow)" opacity="0.7" />

                {/* --- ROAD MARKINGS --- */}
                
                {/* Crosswalk near Zone A */}
                {[0, 8, 16, 24, 32, 40].map((offset) => (
                    <rect key={`crosswalk-a-${offset}`} x={78 + offset} y="355" width="5" height="20" fill="#64748b" opacity="0.4" rx="1" />
                ))}
                
                {/* Crosswalk near Zone C */}
                {[0, 8, 16, 24, 32, 40].map((offset) => (
                    <rect key={`crosswalk-c-${offset}`} x={720 - offset} y="355" width="5" height="20" fill="#64748b" opacity="0.4" rx="1" />
                ))}

                {/* Stop lines before zones */}
                <rect x="75" y="250" width="4" height="35" fill="#ef4444" opacity="0.6" rx="1" />
                <text x="62" y="270" fill="#ef4444" fontSize="6" opacity="0.6">STOP</text>
                
                <rect x="280" y="318" width="4" height="35" fill="#ef4444" opacity="0.6" rx="1" />
                <text x="267" y="338" fill="#ef4444" fontSize="6" opacity="0.6">STOP</text>

                <text x="60" y="248" fill="#94a3b8" fontSize="9" opacity="0.6">PARENT PICKUP LANE</text>
                <text x="60" y="368" fill="#94a3b8" fontSize="9" opacity="0.6">PARENT DROPOFF LANE</text>

                {/* --- UNIFIED PICKUP/DROPOFF ZONE --- */}
                <g>
                    {/* Main zone background with glow */}
                    <rect 
                        x="98"
                        y="138"
                        width="604"
                        height="234"
                        fill={getZoneStrokeColor(combinedZone.overallStatus)}
                        fillOpacity="0.05"
                        rx="16"
                    />
                    <rect 
                        x="100"
                        y="140"
                        width="600"
                        height="230"
                        className={getZoneColor(combinedZone.overallStatus)}
                        strokeWidth="2"
                        rx="14"
                        strokeDasharray="8 4"
                    />
                    
                    {/* Zone Title */}
                    <text 
                        x="400" 
                        y="158" 
                        textAnchor="middle" 
                        fill="white" 
                        fontSize="14" 
                        fontWeight="bold"
                    >
                        UNIFIED FLUXGATE ZONE
                    </text>
                    
                    {/* Stats badge */}
                    <g transform="translate(620, 145)">
                        <rect x="0" y="0" width="72" height="22" rx="6" fill="#1e293b" stroke={getZoneStrokeColor(combinedZone.overallStatus)} strokeWidth="1.5" />
                        <text x="36" y="15" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">
                            {combinedZone.occupiedCount}/{combinedZone.totalBays}
                        </text>
                    </g>
                    
                    {/* Status indicator */}
                    <g transform="translate(108, 145)">
                        <rect x="0" y="0" width="60" height="22" rx="6" fill={getZoneStrokeColor(combinedZone.overallStatus)} fillOpacity="0.2" stroke={getZoneStrokeColor(combinedZone.overallStatus)} strokeWidth="1" />
                        <text x="30" y="15" textAnchor="middle" fill={getZoneStrokeColor(combinedZone.overallStatus)} fontSize="9" fontWeight="bold">
                            {combinedZone.overallStatus}
                        </text>
                    </g>

                    {/* --- BUS STATION SECTION --- */}
                    <g>
                        {/* Bus section background */}
                        <rect 
                            x="250"
                            y="50"
                            width="300"
                            height="80"
                            fill="#fbbf24"
                            fillOpacity="0.08"
                            stroke="#fbbf24"
                            strokeWidth="1.5"
                            rx="10"
                        />
                        
                        {/* Bus icon and label */}
                        <g transform="translate(260, 55)">
                            <rect x="0" y="2" width="18" height="10" rx="2" fill="#fbbf24" />
                            <rect x="2" y="4" width="5" height="6" fill="#1e293b" rx="1" />
                            <rect x="9" y="4" width="5" height="6" fill="#1e293b" rx="1" />
                            <circle cx="4" cy="13" r="2" fill="#334155" />
                            <circle cx="14" cy="13" r="2" fill="#334155" />
                        </g>
                        <text x="285" y="67" fill="#fbbf24" fontSize="11" fontWeight="bold">BUS STATION</text>
                        
                        {/* Bus bays */}
                        {combinedZone.busBays.map((bay, i) => {
                            const bx = 280 + (i * 70);
                            const by = 85;
                            return (
                                <g key={bay.id}>
                                    <rect 
                                        x={bx}
                                        y={by}
                                        width="55"
                                        height="35"
                                        rx="4"
                                        fill={bay.status === "OCCUPIED" ? "#fbbf24" : "#1e293b"}
                                        stroke={bay.status === "OCCUPIED" ? "#fbbf24" : "#334155"}
                                        strokeWidth="1.5"
                                        className="transition-colors duration-300"
                                    />
                                    <text x={bx + 27.5} y={by + 22} textAnchor="middle" fill={bay.status === "OCCUPIED" ? "#1e293b" : "#64748b"} fontSize="10" fontWeight="bold">
                                        B{i + 1}
                                    </text>
                                </g>
                            );
                        })}
                    </g>

                    {/* --- CAR PICKUP BAYS (Top Row) --- */}
                    <g>
                        <text x="120" y="195" fill="#60a5fa" fontSize="10" fontWeight="bold">PICKUP BAYS</text>
                        {combinedZone.carBays.slice(0, Math.ceil(combinedZone.carBays.length / 2)).map((bay, i) => {
                            const bx = 120 + (i * 55);
                            const by = 205;
                            return (
                                <g key={bay.id}>
                                    <rect 
                                        x={bx}
                                        y={by}
                                        width="45"
                                        height="35"
                                        rx="4"
                                        fill={bay.status === "OCCUPIED" ? "#60a5fa" : "#1e293b"}
                                        stroke={bay.status === "OCCUPIED" ? "#60a5fa" : "#334155"}
                                        strokeWidth="1.5"
                                        className="transition-colors duration-300"
                                    />
                                    <text x={bx + 22.5} y={by + 22} textAnchor="middle" fill={bay.status === "OCCUPIED" ? "#1e293b" : "#64748b"} fontSize="9" fontWeight="bold">
                                        P{i + 1}
                                    </text>
                                    {bay.status === "BLOCKED" && (
                                        <text x={bx + 22.5} y={by + 32} textAnchor="middle" fill="#ef4444" fontSize="6">BLOCKED</text>
                                    )}
                                </g>
                            );
                        })}
                    </g>

                    {/* --- CAR DROPOFF BAYS (Bottom Row) --- */}
                    <g>
                        <text x="120" y="285" fill="#22c55e" fontSize="10" fontWeight="bold">DROPOFF BAYS</text>
                        {combinedZone.carBays.slice(Math.ceil(combinedZone.carBays.length / 2)).map((bay, i) => {
                            const bx = 120 + (i * 55);
                            const by = 295;
                            return (
                                <g key={bay.id}>
                                    <rect 
                                        x={bx}
                                        y={by}
                                        width="45"
                                        height="35"
                                        rx="4"
                                        fill={bay.status === "OCCUPIED" ? "#22c55e" : "#1e293b"}
                                        stroke={bay.status === "OCCUPIED" ? "#22c55e" : "#334155"}
                                        strokeWidth="1.5"
                                        className="transition-colors duration-300"
                                    />
                                    <text x={bx + 22.5} y={by + 22} textAnchor="middle" fill={bay.status === "OCCUPIED" ? "#1e293b" : "#64748b"} fontSize="9" fontWeight="bold">
                                        D{i + 1}
                                    </text>
                                    {bay.status === "BLOCKED" && (
                                        <text x={bx + 22.5} y={by + 32} textAnchor="middle" fill="#ef4444" fontSize="6">BLOCKED</text>
                                    )}
                                </g>
                            );
                        })}
                    </g>

                    {/* Queue & Dwell Stats */}
                    <g transform="translate(550, 290)">
                        <rect x="0" y="0" width="140" height="60" rx="8" fill="#1e293b" stroke="#334155" strokeWidth="1" />
                        <text x="70" y="18" textAnchor="middle" fill="#94a3b8" fontSize="9">LIVE METRICS</text>
                        <text x="35" y="38" textAnchor="middle" fill="#60a5fa" fontSize="10" fontWeight="bold">{combinedZone.avgDwellTime.toFixed(0)}s</text>
                        <text x="35" y="50" textAnchor="middle" fill="#64748b" fontSize="7">AVG DWELL</text>
                        <text x="105" y="38" textAnchor="middle" fill="#f59e0b" fontSize="10" fontWeight="bold">{combinedZone.totalQueue.toFixed(0)}m</text>
                        <text x="105" y="50" textAnchor="middle" fill="#64748b" fontSize="7">QUEUE</text>
                    </g>
                </g>

                {/* --- VEHICLES --- */}
                <AnimatePresence>
                    {vehicles.map((v) => (
                        <g 
                            key={v.id}
                            transform={`translate(${v.position.x}, ${v.position.y})`}
                            // Removed CSS transition for smoother 60fps JS animation
                        >
                             {/* Static Glow */}
                             <circle 
                                r="18" 
                                fill={v.type === "BUS" ? "#fbbf24" : "#60a5fa"} 
                                fillOpacity="0.15"
                             />
                             
                             {/* Body */}
                             {v.type === "BUS" ? (
                                 <g>
                                    <rect x="-18" y="-8" width="36" height="16" rx="2" fill="#fbbf24" stroke="white" strokeWidth="1" />
                                    {/* Windows */}
                                    <rect x="-14" y="-6" width="8" height="5" fill="#1e293b" rx="1"/>
                                    <rect x="-4" y="-6" width="8" height="5" fill="#1e293b" rx="1"/>
                                    <rect x="6" y="-6" width="8" height="5" fill="#1e293b" rx="1"/>
                                    {/* Wheels */}
                                    <circle cx="-10" cy="6" r="2.5" fill="#334155" />
                                    <circle cx="10" cy="6" r="2.5" fill="#334155" />
                                 </g>
                             ) : (
                                 <g>
                                    <rect x="-12" y="-6" width="24" height="12" rx="3" fill="#60a5fa" stroke="white" strokeWidth="1" />
                                    {/* Windshield */}
                                    <rect x="-8" y="-4" width="8" height="6" rx="1" fill="#1e293b" />
                                    {/* Headlights */}
                                    <rect x="9" y="-3" width="2" height="2" rx="0.5" fill="#fef3c7" />
                                    <rect x="9" y="1" width="2" height="2" rx="0.5" fill="#fef3c7" />
                                 </g>
                             )}

                             {/* Tag */}
                             <text y="-12" textAnchor="middle" fill="white" fontSize="9" fontWeight="bold" style={{textShadow: "0px 1px 2px black"}}>
                                 {v.id.slice(0, 3)}
                             </text>
                        </g>
                    ))}
                </AnimatePresence>

            </svg>
        </div>
    </div>
  );
});

DigitalTwinMap.displayName = 'DigitalTwinMap';

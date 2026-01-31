import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CloudRain, Compass, Thermometer, Wind, Droplets, Gauge } from "lucide-react";

export const EnvironmentalSensorParams = () => {
    // Mock environment data - in a real app this comes from sensors API
    const envData = {
        temp: 24.5,
        humidity: 45,
        windSpeed: 12, // km/h
        aqi: 42, // Air Quality Index
        condition: 'Clear',
        visibility: 10, // km
        roadSurfaceTemp: 28.2
    };

    return (
        <Card className="glass-panel border-FLUXGATE-border/50 bg-secondary/5 h-full">
            <CardHeader className="pb-2 pt-3 px-4">
                <CardTitle className="text-sm font-semibold flex items-center justify-between text-muted-foreground">
                    <span className="flex items-center gap-2">
                        <CloudRain className="h-4 w-4 text-FLUXGATE-cyan" />
                        ENV SENSORS
                    </span>
                    <Badge variant="outline" className="text-[10px] font-mono border-FLUXGATE-cyan/30 text-FLUXGATE-cyan bg-FLUXGATE-cyan/5">
                        DXB-01
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4">
                <div className="grid grid-cols-2 gap-3">
                    {/* Temperature */}
                    <div className="bg-black/20 rounded p-2 border border-white/5 flex flex-col items-center">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Thermometer className="h-3 w-3 text-red-400" />
                            <span className="text-[10px] text-muted-foreground uppercase">T-Ambient</span>
                        </div>
                        <span className="text-lg font-mono font-bold text-foreground">{envData.temp}°C</span>
                    </div>

                    {/* Wind */}
                    <div className="bg-black/20 rounded p-2 border border-white/5 flex flex-col items-center">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Wind className="h-3 w-3 text-cyan-400" />
                            <span className="text-[10px] text-muted-foreground uppercase">Wind Vel</span>
                        </div>
                        <span className="text-lg font-mono font-bold text-foreground">{envData.windSpeed} <span className="text-[9px]">km/h</span></span>
                    </div>

                    {/* Humidity */}
                    <div className="bg-black/20 rounded p-2 border border-white/5 flex flex-col items-center">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Droplets className="h-3 w-3 text-blue-400" />
                            <span className="text-[10px] text-muted-foreground uppercase">Rel. Hum</span>
                        </div>
                        <span className="text-lg font-mono font-bold text-foreground">{envData.humidity}%</span>
                    </div>

                    {/* AQI */}
                    <div className="bg-black/20 rounded p-2 border border-white/5 flex flex-col items-center">
                        <div className="flex items-center gap-1.5 mb-1">
                            <Gauge className="h-3 w-3 text-emerald-400" />
                            <span className="text-[10px] text-muted-foreground uppercase">AQI (PM2.5)</span>
                        </div>
                        <span className="text-lg font-mono font-bold text-FLUXGATE-open">{envData.aqi}</span>
                    </div>
                </div>
                
                {/* Road Surface Status */}
                <div className="mt-3 bg-black/20 rounded p-2 border border-white/5 flex items-center justify-between">
                     <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1.5">
                        <Compass className="h-3 w-3 text-amber-400" /> Road Surface Temp
                     </span>
                     <span className="text-xs font-mono font-bold text-foreground">{envData.roadSurfaceTemp}°C</span>
                </div>
            </CardContent>
        </Card>
    );
};

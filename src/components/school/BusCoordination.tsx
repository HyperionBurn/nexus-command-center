import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Bus, Clock, MapPin } from "lucide-react";

export const BusCoordination = () => {
  const buses = [
    { id: "B-01", route: "Palm Jumeirah", capacity: 30, boarded: 30, status: "DEPARTED", eta: "En Route" },
    { id: "B-04", route: "Marina / JBR", capacity: 45, boarded: 42, status: "BOARDING", eta: "Departs in 5m" },
    { id: "B-07", route: "Springs / Meadows", capacity: 45, boarded: 15, status: "WAITING", eta: "Departs in 15m" },
    { id: "B-09", route: "Arabian Ranches", capacity: 30, boarded: 0, status: "DELAYED", eta: "+10m Delay" },
  ];

  return (
    <Card className="glass-panel border-FLUXGATE-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Bus className="h-5 w-5 text-FLUXGATE-orange" />
          Bus Fleet Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {buses.map((bus) => (
            <div key={bus.id} className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="font-bold font-mono">{bus.id}</span>
                <span className="text-muted-foreground">{bus.route}</span>
                <span className={`text-xs px-2 py-0.5 rounded font-medium 
                  ${bus.status === 'DEPARTED' ? 'bg-FLUXGATE-success/20 text-FLUXGATE-success' : 
                    bus.status === 'DELAYED' ? 'bg-destructive/20 text-destructive' : 'bg-secondary text-secondary-foreground'}`}>
                  {bus.status}
                </span>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="w-full">
                  <Progress value={(bus.boarded / bus.capacity) * 100} className="h-2" />
                </div>
                <div className="whitespace-nowrap w-24 text-right">
                  {bus.boarded}/{bus.capacity}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
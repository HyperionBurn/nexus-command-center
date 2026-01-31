import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Bus, 
  UserCheck, 
  LogOut as Departure, 
  AlertCircle,
  CheckCircle2,
  Clock
} from "lucide-react";
import { useEffect, useState } from "react";

interface ActivityEvent {
  id: string;
  type: "student_loaded" | "bus_departed" | "bus_arrived" | "alert" | "gate_change";
  message: string;
  timestamp: Date;
  details?: string;
}

const getEventIcon = (type: ActivityEvent["type"]) => {
  switch (type) {
    case "student_loaded":
      return <UserCheck className="h-4 w-4 text-nexus-success" />;
    case "bus_departed":
      return <Departure className="h-4 w-4 text-nexus-blue" />;
    case "bus_arrived":
      return <Bus className="h-4 w-4 text-nexus-purple" />;
    case "alert":
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case "gate_change":
      return <CheckCircle2 className="h-4 w-4 text-nexus-orange" />;
    default:
      return <Activity className="h-4 w-4" />;
  }
};

const getEventBadgeVariant = (type: ActivityEvent["type"]) => {
  switch (type) {
    case "student_loaded":
      return "bg-nexus-success/10 text-nexus-success border-nexus-success/30";
    case "bus_departed":
      return "bg-nexus-blue/10 text-nexus-blue border-nexus-blue/30";
    case "bus_arrived":
      return "bg-nexus-purple/10 text-nexus-purple border-nexus-purple/30";
    case "alert":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "gate_change":
      return "bg-nexus-orange/10 text-nexus-orange border-nexus-orange/30";
    default:
      return "";
  }
};

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "Just now";
  if (seconds < 120) return "1 min ago";
  if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
  if (seconds < 7200) return "1 hour ago";
  return `${Math.floor(seconds / 3600)} hours ago`;
};

export const RecentActivity = () => {
  const [events, setEvents] = useState<ActivityEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading recent events
    const timer = setTimeout(() => {
      const now = new Date();
      setEvents([
        {
          id: "1",
          type: "student_loaded",
          message: "15 students loaded onto Bus B-04",
          timestamp: new Date(now.getTime() - 1000 * 60 * 2),
          details: "Marina / JBR Route",
        },
        {
          id: "2",
          type: "bus_departed",
          message: "Bus B-01 departed from Bay 3",
          timestamp: new Date(now.getTime() - 1000 * 60 * 5),
          details: "30 passengers • Palm Jumeirah",
        },
        {
          id: "3",
          type: "bus_arrived",
          message: "Bus B-12 arrived at Bay 5",
          timestamp: new Date(now.getTime() - 1000 * 60 * 8),
          details: "Ready for boarding",
        },
        {
          id: "4",
          type: "gate_change",
          message: "Gate B opened for secondary dismissal",
          timestamp: new Date(now.getTime() - 1000 * 60 * 12),
          details: "Auto-Logic triggered",
        },
        {
          id: "5",
          type: "student_loaded",
          message: "8 students loaded onto Bus B-09",
          timestamp: new Date(now.getTime() - 1000 * 60 * 15),
          details: "Arabian Ranches Route",
        },
      ]);
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Simulate real-time updates
  useEffect(() => {
    if (!isLoading) {
      const interval = setInterval(() => {
        setEvents((prev) => [...prev]); // Force re-render for time updates
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  if (isLoading) {
    return (
      <Card className="glass-panel border-nexus-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-nexus-purple" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/10">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card className="glass-panel border-nexus-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="h-5 w-5 text-nexus-purple" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No recent activity</p>
            <p className="text-xs mt-1">Events will appear here as they occur</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glass-panel border-nexus-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-nexus-purple" />
            Recent Activity
          </span>
          <Badge variant="outline" className="text-xs font-normal">
            Live
            <span className="ml-1 w-2 h-2 rounded-full bg-nexus-success animate-pulse inline-block" />
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {events.map((event, index) => (
            <div
              key={event.id}
              className={`flex items-start gap-3 p-3 rounded-lg bg-secondary/10 border border-border/30 
                transition-all hover:bg-secondary/20 ${index === 0 ? 'ring-1 ring-nexus-blue/30' : ''}`}
            >
              <div className={`p-2 rounded-full ${getEventBadgeVariant(event.type)}`}>
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{event.message}</p>
                {event.details && (
                  <p className="text-xs text-muted-foreground mt-0.5">{event.details}</p>
                )}
              </div>
              <div className="text-xs text-muted-foreground whitespace-nowrap">
                {formatTimeAgo(event.timestamp)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

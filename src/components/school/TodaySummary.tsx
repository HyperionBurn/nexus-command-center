import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Clock, Users, Activity } from "lucide-react";
import { useEffect, useState } from "react";

interface SummaryData {
  totalPickups: number;
  avgWaitTime: number;
  peakHour: string;
  onTimeRate: number;
}

export const TodaySummary = () => {
  const [data, setData] = useState<SummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setData({
        totalPickups: 847,
        avgWaitTime: 2.4,
        peakHour: "3:15 PM - 3:45 PM",
        onTimeRate: 94.2,
      });
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <Card className="glass-panel border-nexus-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-nexus-blue" />
            Today's Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-8 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="glass-panel border-nexus-border/50">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-nexus-blue" />
            Today's Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No data available for today</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const stats = [
    {
      label: "Total Pickups",
      value: data.totalPickups.toLocaleString(),
      icon: Users,
      color: "text-nexus-blue",
      bgColor: "bg-nexus-blue/10",
    },
    {
      label: "Avg Wait Time",
      value: `${data.avgWaitTime} min`,
      icon: Clock,
      color: "text-nexus-success",
      bgColor: "bg-nexus-success/10",
    },
    {
      label: "Peak Hour",
      value: data.peakHour,
      icon: TrendingUp,
      color: "text-nexus-orange",
      bgColor: "bg-nexus-orange/10",
      small: true,
    },
    {
      label: "On-Time Rate",
      value: `${data.onTimeRate}%`,
      icon: Activity,
      color: "text-nexus-purple",
      bgColor: "bg-nexus-purple/10",
    },
  ];

  return (
    <Card className="glass-panel border-nexus-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-nexus-blue" />
          Today's Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`p-4 rounded-lg ${stat.bgColor} border border-border/30 transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-2 mb-2">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  {stat.label}
                </span>
              </div>
              <div className={`font-bold ${stat.small ? 'text-sm' : 'text-2xl'} ${stat.color}`}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

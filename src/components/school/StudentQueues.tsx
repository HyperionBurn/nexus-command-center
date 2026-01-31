import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck, Clock } from "lucide-react";

export const StudentQueues = () => {
  const queues = [
    { id: "Q1", location: "KG Waiting Area", count: 12, status: "Active", staff: "Ms. Sarah" },
    { id: "Q2", location: "Primary Gate A", count: 45, status: "Active", staff: "Mr. Ahmed" },
    { id: "Q3", location: "Secondary Gate B", count: 8, status: "Clearing", staff: "Security" },
    { id: "Q4", location: "Bus Bay", count: 120, status: "Boarding", staff: "Transport Team" },
  ];

  return (
    <Card className="glass-panel border-FLUXGATE-border/50">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" />
          Student Holding Areas
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {queues.map((q) => (
            <div key={q.id} className="flex items-center justify-between p-3 bg-secondary/20 rounded-lg border border-border/30">
              <div className="space-y-1">
                <div className="font-medium">{q.location}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-2">
                  <UserCheck className="h-3 w-3" /> Staff: {q.staff}
                </div>
              </div>
              <div className="flex items-center gap-3">
                 <div className="text-right">
                    <div className="text-xl font-bold">{q.count}</div>
                    <div className="text-[10px] uppercase text-muted-foreground">Students</div>
                 </div>
                 <Badge variant={q.status === 'Boarding' ? 'default' : 'outline'} 
                        className={q.status === 'Active' ? 'bg-FLUXGATE-success/20 text-FLUXGATE-success border-FLUXGATE-success/50' : ''}>
                    {q.status}
                 </Badge>
              </div>
            </div>
          ))}
          
          <div className="pt-2 border-t border-border/50 flex justify-between text-sm">
             <span className="text-muted-foreground">Total Pending:</span>
             <span className="font-bold">185 Students</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
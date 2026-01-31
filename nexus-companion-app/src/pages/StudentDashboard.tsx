import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Clock, CheckCircle2, AlertTriangle, Shield, UserCheck, LogOut, Loader2 } from "lucide-react";
import { useNexus, StudentStatus } from "@/context/NexusContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function StudentDashboard() {
  const { studentStatus, tripStatus, gate, eta, logout } = useNexus();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  // Helper to determine display state
  const getStatusColor = (s: StudentStatus) => {
      switch(s) {
          case 'in-class': return "border-slate-800 bg-slate-900";
          case 'released': return "border-amber-500 bg-amber-950/20";
          case 'waiting-at-gate': return "border-green-500 bg-green-950/20 animate-pulse-slow";
          case 'loaded': return "border-blue-500 bg-blue-950/20";
          default: return "border-slate-800";
      }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 pb-20 font-inter">
      <header className="mb-6 flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold">Hello, Adam</h1>
            <p className="text-slate-400 text-sm">Grade 5-A • ID: 99281</p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-white">
            <LogOut className="h-5 w-5" />
        </Button>
      </header>

      <div className="space-y-6">
        {/* Main Status Card */}
        <Card className={cn("border-2 transition-all duration-500 shadow-2xl", getStatusColor(studentStatus))}>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    {studentStatus === 'waiting-at-gate' && <CheckCircle2 className="text-green-500 h-6 w-6" />}
                    {studentStatus === 'released' && <Clock className="text-amber-500 h-6 w-6" />}
                    {studentStatus === 'in-class' && <Shield className="text-slate-500 h-6 w-6" />}
                    {studentStatus === 'loaded' && <UserCheck className="text-blue-500 h-6 w-6" />}
                    
                    <span className="text-lg">
                        {studentStatus === 'in-class' && "In Class"}
                        {studentStatus === 'released' && "Dismissal Time"}
                        {studentStatus === 'waiting-at-gate' && "Parent Arrived"}
                        {studentStatus === 'loaded' && "Safe & Secure"}
                    </span>
                </CardTitle>
                <CardDescription className="text-slate-300">
                     {studentStatus === 'in-class' && "Focus on your studies. No active pickups."}
                     {studentStatus === 'released' && "Class dismissed. Pack bags. Wait for signal."}
                     {studentStatus === 'waiting-at-gate' && "Go to the pickup zone immediately."}
                     {studentStatus === 'loaded' && "Pickup complete. Have a safe trip!"}
                </CardDescription>
            </CardHeader>
            <CardContent>
                {/* Dynamic Content based on State */}
                
                {studentStatus === 'released' && (
                     <div className="flex flex-col items-center gap-4 py-4">
                        {tripStatus === 'en-route' ? (
                            <div className="flex flex-col items-center">
                                <Loader2 className="h-8 w-8 text-amber-500 animate-spin mb-2" />
                                <p className="text-amber-400 font-bold">Parent En Route</p>
                                <p className="text-xs text-slate-400">ETA: {eta} MINS</p>
                            </div>
                        ) : (
                            <p className="text-sm text-slate-500 italic">Waiting for parent to depart...</p>
                        )}
                     </div>
                )}

                {studentStatus === 'waiting-at-gate' && (
                    <div className="text-center p-6 bg-green-500/20 rounded-xl border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.2)]">
                        <p className="text-sm font-bold text-green-400 uppercase tracking-widest mb-2">Gate Assigned</p>
                        <div className="text-7xl font-black text-white tracking-tight">{gate || 'B4'}</div>
                        <div className="mt-4 flex items-center justify-center gap-2 text-sm text-green-200">
                            <UserCheck className="h-4 w-4" /> Driver Verified: Mom
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

        {/* Digital ID */}
        <Card className="bg-slate-900 border-slate-800 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardHeader className="pb-2">
                <CardTitle className="text-lg">My Digital ID</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
                <div className="w-56 h-56 bg-white p-3 rounded-2xl shadow-lg">
                    <div className="w-full h-full bg-slate-950 rounded-xl flex items-center justify-center relative overflow-hidden">
                        {/* Mock QR Pattern */}
                        <div className="absolute inset-2 border-4 border-white rounded-lg opacity-20"></div>
                        <div className="grid grid-cols-4 gap-2 opacity-80">
                             {[...Array(16)].map((_, i) => (
                                 <div key={i} className={`h-6 w-6 rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`} />
                             ))}
                        </div>
                        <div className="absolute inset-0 bg-blue-500/20 animate-scan"></div>
                    </div>
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center max-w-[200px]">
                    Scan this at the RFID Gate or if asked by a marshal.
                </p>
            </CardContent>
        </Card>

        {/* Safety Tips */}
        <div className="bg-blue-900/10 p-4 rounded-xl border border-blue-900/30 flex gap-4 items-start">
            <AlertTriangle className="text-blue-400 h-6 w-6 flex-shrink-0" />
            <div>
                <h4 className="font-bold text-blue-400 text-sm">Secure Handoff</h4>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Never enter a car unless the Gate Screen shows your name and the car matches the verified plate.
                </p>
            </div>
        </div>
      </div>
    </div>
  );
}

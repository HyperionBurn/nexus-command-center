import { useRef, useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, AlertTriangle, Shield, UserCheck, LogOut, Loader2, Award, Zap, ChevronRight, Backpack } from "lucide-react";
import { useNexus, StudentStatus } from "@/context/NexusContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { use3DTilt } from "@/hooks/use3DTilt";

const TiltCard = ({ children, className }: { children: React.ReactNode, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null!);
    const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt(ref);

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className={cn("relative transition-colors", className)}
        >
            {children}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-inherit" />
        </motion.div>
    );
};

export default function StudentDashboard() {
  const { studentStatus, tripStatus, gate, eta, logout, nolBalance } = useNexus();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  }

  // Status visual config
  const statusConfig = {
      "in-class": {
          icon: Shield,
          label: "Classroom Secure",
          desc: "Academic Session Active",
          gradient: "from-slate-800 to-slate-900",
          iconStyle: "border-slate-500/30 bg-slate-500/10 text-slate-400"
      },
      "released": {
          icon: Backpack,
          label: "Dismissal Initiated",
          desc: "Prepare for Departure",
          gradient: "from-amber-900/40 to-slate-900",
          iconStyle: "border-amber-500/30 bg-amber-500/10 text-amber-400"
      },
      "waiting-at-gate": {
          icon: CheckCircle2,
          label: "Ready for Pickup",
          desc: "Proceed to Loading Zone",
          gradient: "from-emerald-900/40 to-slate-900",
          iconStyle: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      },
      "loaded": {
          icon: UserCheck,
          label: "Mission Complete",
          desc: "Successfully Onboarded",
          gradient: "from-blue-900/40 to-slate-900",
          iconStyle: "border-blue-500/30 bg-blue-500/10 text-blue-400"
      }
  };

  const currentConfig = statusConfig[studentStatus] || statusConfig["in-class"];
  const StatusIcon = currentConfig.icon;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-inter selection:bg-purple-500/30 overflow-x-hidden">
      
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      <div className="fixed top-0 right-0 w-[300px] h-[300px] bg-purple-600/20 blur-[100px] pointer-events-none" />

      <header className="relative z-10 p-6 flex justify-between items-start">
        <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20 font-black text-xl">
                A
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">Adam Smith</h1>
                <p className="text-slate-400 text-xs font-medium uppercase tracking-wider flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse block" /> Grade 5-A
                </p>
            </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-slate-500 hover:text-white hover:bg-white/5 rounded-full">
            <LogOut className="h-5 w-5" />
        </Button>
      </header>

      <main className="relative z-10 px-6 space-y-8">
        
        {/* Main Status HUD */}
        <TiltCard className={cn(
            "rounded-[32px] overflow-hidden border border-white/10 shadow-2xl relative group",
            studentStatus === "waiting-at-gate" ? "shadow-[0_0_50px_rgba(16,185,129,0.2)]" : ""
        )}>
             <div className={cn("absolute inset-0 bg-gradient-to-br opacity-80 transition-colors duration-700", currentConfig.gradient)} />
             <div className="relative p-8 text-center space-y-6">
                 
                 <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    key={studentStatus}
                    className="inline-flex relative"
                 >
                     <div className={cn(
                         "h-24 w-24 rounded-full flex items-center justify-center border-4 backdrop-blur-md transition-colors duration-500",
                         currentConfig.iconStyle
                     )}>
                         <StatusIcon className="h-10 w-10" />
                     </div>
                     {studentStatus === "waiting-at-gate" && (
                         <span className="absolute -top-1 -right-1 flex h-4 w-4">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                        </span>
                     )}
                 </motion.div>

                 <div>
                     <motion.h2 
                        key={`${studentStatus}-title`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-3xl font-black text-white tracking-tight mb-2"
                     >
                         {currentConfig.label}
                     </motion.h2>
                     <motion.p 
                        key={`${studentStatus}-desc`}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-300 font-medium"
                     >
                         {currentConfig.desc}
                     </motion.p>
                 </div>

                 {studentStatus === "waiting-at-gate" && (
                     <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-emerald-500/20 border border-emerald-500/30 p-4 rounded-xl backdrop-blur-md"
                    >
                         <p className="text-xs font-bold text-emerald-300 uppercase tracking-widest mb-1">Assigned Gate</p>
                         <p className="text-4xl font-black text-white">{gate}</p>
                     </motion.div>
                 )}
             </div>
        </TiltCard>

        {/* Gamification Stats */}
        <div className="grid grid-cols-2 gap-4">
            <TiltCard className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-32 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                    <div className="bg-amber-500/20 p-2 rounded-lg text-amber-500">
                        <Zap className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Streak</span>
                </div>
                <div>
                    <span className="text-3xl font-black text-white">12</span>
                    <span className="text-xs text-slate-400 ml-1">Days</span>
                </div>
            </TiltCard>

            <TiltCard className="bg-slate-900/50 border border-white/5 rounded-2xl p-4 flex flex-col justify-between h-32 backdrop-blur-sm">
                <div className="flex justify-between items-start">
                    <div className="bg-purple-500/20 p-2 rounded-lg text-purple-500">
                        <Award className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Points</span>
                </div>
                <div>
                    <span className="text-3xl font-black text-white">{nolBalance.toFixed(0)}</span>
                    <span className="text-xs text-slate-400 ml-1">PTS</span>
                </div>
            </TiltCard>
        </div>

        {/* Recent Achievements */}
        <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">Recent Badges</h3>
            {[
                { name: "Early Bird", desc: "Ready before 2:15 PM", icon: Clock, color: "text-blue-400" },
                { name: "Safety Star", desc: "No incidents this month", icon: Shield, color: "text-emerald-400" }
            ].map((badge, i) => (
                <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    key={badge.name}
                    className="bg-slate-900/40 border border-white/5 p-3 rounded-xl flex items-center gap-4"
                >
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                        <badge.icon className={cn("h-5 w-5", badge.color)} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-white">{badge.name}</p>
                        <p className="text-[10px] text-slate-500">{badge.desc}</p>
                    </div>
                </motion.div>
            ))}
        </div>

      </main>
    </div>
  );
}

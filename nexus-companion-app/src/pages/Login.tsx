import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User, GraduationCap, ChevronRight, Sparkles, Globe } from "lucide-react";
import { useNexus } from "@/context/NexusContext";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { use3DTilt } from "@/hooks/use3DTilt";

// Reuse 3D Tilt Logic for consistency
const TiltCard = ({ children, onClick, className }: { children: React.ReactNode, onClick?: () => void, className?: string }) => {
    const ref = useRef<HTMLDivElement>(null!);
    const { rotateX, rotateY, handleMouseMove, handleMouseLeave } = use3DTilt(ref);

    return (
        <motion.div
            ref={ref}
            onClick={onClick}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn("relative cursor-pointer transition-all duration-500 ease-out", className)}
        >
            {children}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none rounded-inherit" />
        </motion.div>
    );
};

export default function Login() {
  const navigate = useNavigate();
  const { login } = useNexus();
  const [selected, setSelected] = useState<"parent" | "student" | null>(null);

  const handleLogin = (role: "parent" | "student") => {
    setSelected(role);
    setTimeout(() => {
        login(role);
        navigate(role === "parent" ? "/parent" : "/student");
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex items-center justify-center p-4 overflow-hidden relative selection:bg-blue-500/30">
      
      {/* Cinematic Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#020617] to-[#020617] animate-pulse-slow" />
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-50" />
      </div>

      <div className="w-full max-w-5xl z-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Brand Section */}
        <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-center lg:text-left"
        >
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                </span>
                <span className="text-xs font-bold tracking-widest text-slate-300 uppercase">System Online</span>
            </div>

            <div className="relative">
                <h1 className="text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 pb-2">
                    NEXUS
                </h1>
                <p className="text-2xl font-light text-slate-400 tracking-[0.2em] uppercase mt-2">
                    Command Center
                </p>
                {/* Decorative Elements */}
                <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/20 blur-[100px]" />
            </div>

            <p className="text-slate-400 text-lg max-w-md mx-auto lg:mx-0 leading-relaxed">
                Next-generation student logistics and campus synchronization platform. authenticating secure entry for authorized personnel only.
            </p>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                     <Globe className="h-4 w-4" /> Global Node
                 </div>
                 <div className="w-px h-4 bg-slate-800" />
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                     v4.2.0 (Stable)
                 </div>
            </div>
        </motion.div>

        {/* Login Cards */}
        <div className="space-y-6 perspective-1000">
             
             {/* Parent Card */}
             <TiltCard 
                onClick={() => handleLogin("parent")}
                className="group relative bg-slate-900/60 border border-white/10 rounded-3xl p-1 shadow-2xl overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-[#0b1121] rounded-[20px] p-6 flex items-center justify-between border border-white/5 group-hover:border-blue-500/30 transition-colors h-32">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                             <User className="h-8 w-8" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-white group-hover:text-blue-200 transition-colors">Parent Access</h3>
                            <p className="text-sm text-slate-500">Manage pickups, view trips & wallet</p>
                        </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-blue-400" />
                    </div>
                </div>
             </TiltCard>

             {/* Student Card */}
             <TiltCard 
                onClick={() => handleLogin("student")}
                className="group relative bg-slate-900/60 border border-white/10 rounded-3xl p-1 shadow-2xl overflow-hidden"
             >
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative bg-[#0b1121] rounded-[20px] p-6 flex items-center justify-between border border-white/5 group-hover:border-emerald-500/30 transition-colors h-32">
                    <div className="flex items-center gap-6">
                        <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                             <GraduationCap className="h-8 w-8" />
                        </div>
                        <div className="text-left">
                            <h3 className="text-xl font-bold text-white group-hover:text-emerald-200 transition-colors">Student Portal</h3>
                            <p className="text-sm text-slate-500">Check schedule, status & rewards</p>
                        </div>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                        <ChevronRight className="h-5 w-5 text-slate-400 group-hover:text-emerald-400" />
                    </div>
                </div>
             </TiltCard>

        </div>
      </div>
      
      {/* Overlay Transition */}
      <AnimatePresence>
        {selected && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="fixed inset-0 z-50 bg-[#020617] flex items-center justify-center"
            >
                <div className="text-center space-y-4">
                    <div className="relative h-20 w-20 mx-auto">
                        <div className="absolute inset-0 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin" />
                        <div className="absolute inset-0 flex items-center justify-center font-black text-blue-500 animate-pulse">
                            N
                        </div>
                    </div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest animate-pulse">
                        Authenticating {selected}
                    </p>
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

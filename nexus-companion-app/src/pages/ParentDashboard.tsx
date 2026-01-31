import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Clock, MapPin, Navigation, ShieldCheck, LogOut, CheckCheck, Wallet, ChevronRight, Settings, CreditCard, Sparkles, Zap, Map as MapIcon, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNexus, StudentStatus } from "@/context/NexusContext";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from "framer-motion";
import { use3DTilt } from "@/hooks/use3DTilt";

// 3D Card Component for "Masterclass" Feel
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
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none rounded-inherit" />
        </motion.div>
    );
};

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState("pickup");
  const [view, setView] = useState<"trip" | "vehicle" | "history">("trip");
  
  const { 
      tripStatus, 
      eta, 
      gate, 
      studentStatus, 
      startTrip, 
      triggerGeofenceEntry, 
      confirmPickup,
      logout,
      setStudentReleased,
      nolBalance,
      tripHistory,
      bookedSlot,
      bookSlot
  } = useNexus();
  const navigate = useNavigate();
  const [timer, setTimer] = useState(60);

  // Scroll animations for list
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  
  useEffect(() => {
     let interval: any;
     if (tripStatus === "arrived" && timer > 0) {
         interval = setInterval(() => {
             setTimer(prev => prev - 1);
         }, 1000);
     }
     return () => clearInterval(interval);
  }, [tripStatus, timer]);

  const handleLogout = () => {
      logout();
      navigate("/");
  }

  // --- UI Components ---

  const Header = () => (
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="bg-slate-900/80 backdrop-blur-xl border-b border-white/5 p-6 sticky top-0 z-50 shadow-2xl"
      >
          <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-500/20"
                  >
                    N
                  </motion.div>
                  <div>
                    <span className="font-black text-xl tracking-tight text-white block leading-none">NEXUS</span>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">Command Center</span>
                  </div>
              </div>
              <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:bg-white/10 rounded-full" onClick={handleLogout}>
                  <LogOut className="h-5 w-5" />
              </Button>
          </div>
          
          {/* 3D Glass Credit Card */}
          <TiltCard className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="p-4 relative z-10">
                  <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
                                <Sparkles className="h-3 w-3 text-amber-400 animate-pulse" /> NOL Plus Status
                            </p>
                            <motion.p 
                                key={nolBalance}
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                className="text-3xl font-black text-white tracking-tight"
                            >
                                {nolBalance.toFixed(2)} <span className="text-sm font-medium text-slate-500">AED</span>
                            </motion.p>
                        </div>
                        <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm">
                            <Wallet className="h-5 w-5 text-blue-400" />
                        </div>
                  </div>
                  <div className="flex gap-2">
                      <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-500 text-white border-0 shadow-lg shadow-blue-900/20 flex-1">
                          Manage Wallet
                      </Button>
                      <Button size="sm" variant="outline" className="h-8 text-xs border-white/10 bg-white/5 hover:bg-white/10 text-slate-300 flex-1">
                          History
                      </Button>
                  </div>
              </div>
          </TiltCard>
      </motion.header>
  );

  const TripView = () => (
    <motion.div 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        className="space-y-6"
    >
        {/* Child Status Hero */}
        <TiltCard className="bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 to-transparent pointer-events-none" />
            <div className="relative p-6">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <div className="h-16 w-16 rounded-2xl bg-slate-800 border border-white/10 flex items-center justify-center text-3xl shadow-inner">
                                
                            </div>
                            <motion.div 
                                animate={{
                                    scale: [1, 1.2, 1],
                                    boxShadow: studentStatus === "waiting-at-gate" ? "0 0 20px #22c55e" : "none"
                                }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className={cn(
                                    "absolute -bottom-2 -right-2 h-6 w-6 rounded-full border-4 border-slate-950",
                                    studentStatus === "waiting-at-gate" ? "bg-green-500" :
                                    studentStatus === "released" ? "bg-amber-500" : "bg-slate-700"
                                )}
                            />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-white tracking-tight">Adam Smith</h2>
                            <p className="text-sm text-slate-400 flex items-center gap-1.5 font-medium">
                                <MapPin className="h-3.5 w-3.5 text-blue-500" /> 
                                {studentStatus === "in-class" && "Classroom 5A"}
                                {studentStatus === "released" && "Packing Bag"}
                                {studentStatus === "waiting-at-gate" && "Pickup Zone B"}
                                {studentStatus === "loaded" && "In Vehicle"}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-950/50 rounded-xl p-3 border border-white/5">
                        <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Status</p>
                        <Badge variant="outline" className={cn(
                            "border-0 px-2 py-1 font-bold tracking-wide",
                            studentStatus === "in-class" ? "bg-slate-800 text-slate-400" :
                            studentStatus === "released" ? "bg-amber-500/20 text-amber-500" :
                            studentStatus === "waiting-at-gate" ? "bg-green-500/20 text-green-500" : "bg-blue-600/20 text-blue-400"
                        )}>
                            {studentStatus.replace(/-/g, " ").toUpperCase()}
                        </Badge>
                    </div>
                    <div className="bg-slate-900/50 rounded-xl p-3 border border-white/5">
                         <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Est. Release</p>
                         <p className="text-sm font-mono text-white">14:30 PM</p>
                    </div>
                </div>
            </div>
            
            {/* Progress Bar for Trip */}
            {tripStatus === "en-route" && (
                <div className="bg-slate-950/80 p-4 border-t border-white/5 backdrop-blur-md">
                    <div className="flex justify-between text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">
                        <span>En Route</span>
                        <span>{eta} min</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${((15 - eta) / 15) * 100}%` }}
                            className="h-full bg-gradient-to-r from-blue-600 to-cyan-400"
                        />
                    </div>
                </div>
            )}
        </TiltCard>

        {/* Dynamic Action Island */}
        <AnimatePresence mode="wait">
            {tripStatus === "idle" && (
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="space-y-6"
                >
                     {/* Time Slot Selector - Redesigned */}
                    <div className="relative">
                        <div className="flex justify-between items-center px-1 mb-3">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Calendar className="h-3 w-3" /> Select Timeslot
                            </h3>
                            {bookedSlot && (
                                <motion.button 
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => bookSlot(null)}
                                    className="text-[10px] text-red-400 font-bold uppercase hover:bg-red-500/10 px-2 py-1 rounded transition-colors"
                                >
                                    Cancel
                                </motion.button>
                            )}
                        </div>
                        <div className="grid grid-cols-4 gap-3">
                            {["13:45", "14:00", "14:15", "14:30"].map((slot) => (
                                <motion.button
                                    key={slot}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => bookSlot(slot)}
                                    className={cn(
                                        "py-3 rounded-xl text-xs font-black border transition-all relative overflow-hidden",
                                        bookedSlot === slot 
                                            ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/30" 
                                            : "bg-slate-900 border-white/5 text-slate-400 hover:border-slate-700 hover:bg-slate-800"
                                    )}
                                >
                                    {bookedSlot === slot && (
                                        <motion.div 
                                            layoutId="activeSlot"
                                            className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" 
                                        />
                                    )}
                                    {slot}
                                </motion.button>
                            ))}
                        </div>
                    </div>

                    <div className="relative py-2">
                         <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-800"></div></div>
                         <div className="relative flex justify-center"><span className="bg-slate-950 px-3 text-xs font-bold text-slate-600 uppercase">OR</span></div>
                    </div>

                    {/* Masterclass Button */}
                    <motion.button
                         whileHover={{ scale: 1.02 }}
                         whileTap={{ scale: 0.96 }}
                         onClick={startTrip}
                         className="w-full relative group"
                    >
                         <div className={cn(
                             "absolute inset-0 bg-gradient-to-r blur-xl opacity-40 group-hover:opacity-60 transition-opacity",
                             bookedSlot ? "from-blue-600 to-indigo-600" : "from-emerald-500 to-green-600"
                        )} />
                         <div className={cn(
                             "relative h-24 bg-gradient-to-br border rounded-2xl flex items-center justify-between px-8 shadow-2xl transition-all",
                             bookedSlot 
                                ? "from-blue-900 to-slate-900 border-blue-500/50" 
                                : "from-emerald-900 to-slate-900 border-emerald-500/50"
                         )}>
                              <div className="text-left">
                                  <p className={cn("text-xs font-bold uppercase tracking-wider mb-1", bookedSlot ? "text-blue-400" : "text-emerald-400")}>
                                      {bookedSlot ? "Scheduled Departure" : "Express Lane"}
                                  </p>
                                  <h3 className="text-xl font-black text-white italic tracking-tighter">
                                      {bookedSlot ? `START SLOT ${bookedSlot}` : "I'M LEAVING NOW"}
                                  </h3>
                              </div>
                              <div className={cn(
                                  "h-12 w-12 rounded-full flex items-center justify-center border-2 bg-white/5 backdrop-blur-sm",
                                  bookedSlot ? "border-blue-400 text-blue-400" : "border-emerald-400 text-emerald-400"
                            )}>
                                  <Car className="h-6 w-6" />
                              </div>
                         </div>
                    </motion.button>
                </motion.div>
            )}

            {tripStatus === "en-route" && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="grid gap-4"
                >
                    <div className="p-10 rounded-full border-4 border-blue-500/20 bg-blue-950/20 w-64 h-64 mx-auto flex flex-col items-center justify-center relative">
                        <div className="absolute inset-0 border-t-4 border-blue-500 rounded-full animate-spin-slow opacity-50" />
                        <span className="text-6xl font-black text-white tracking-tighter tabular-nums">{eta}</span>
                        <span className="text-blue-400 font-bold uppercase tracking-widest text-sm mt-2">Minutes Away</span>
                    </div>
                    <Button 
                        variant="ghost" 
                        onClick={triggerGeofenceEntry} 
                        className="text-slate-500 hover:text-white hover:bg-slate-800"
                    >
                        <Zap className="h-4 w-4 mr-2" /> Simulate Arrival
                    </Button>
                </motion.div>
            )}

            {(tripStatus === "arrived" || tripStatus === "completed") && (
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gradient-to-br from-green-900/40 to-slate-900 border border-green-500/50 rounded-3xl p-8 text-center space-y-6 relative overflow-hidden"
                >
                    <div className="absolute top-0 left-0 w-full h-1 bg-green-500/30" />
                    
                    <div>
                        <Badge className="bg-green-500 text-slate-900 font-black mb-4 hover:bg-green-400">ACCESS GRANTED</Badge>
                        <h1 className="text-8xl font-black text-white tracking-tighter drop-shadow-2xl">{gate}</h1>
                        <p className="text-green-200 font-medium mt-2">Proceed to Bay {gate}</p>
                    </div>

                    {tripStatus === "arrived" && (
                        <Button 
                            size="lg" 
                            className="w-full bg-green-500 hover:bg-green-400 text-slate-950 font-black h-16 rounded-xl text-lg shadow-[0_0_40px_rgba(34,197,94,0.3)] transition-all hover:scale-[1.02]"
                            onClick={confirmPickup}
                        >
                            <CheckCheck className="mr-2 h-6 w-6" />
                            CONFIRM PICKUP
                        </Button>
                    )}
                    
                     {tripStatus === "completed" && (
                        <div className="bg-green-500/20 p-4 rounded-xl border border-green-500/30">
                            <p className="text-green-300 font-bold">Trip Completed Successfully</p>
                            <p className="text-xs text-green-400/70 mt-1">+50 NOL Points Added</p>
                        </div>
                    )}
                </motion.div>
            )}
        </AnimatePresence>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-inter selection:bg-blue-500/30">
        <Header />

        <div className="p-6 pb-28 min-h-[calc(100vh-100px)] relative z-0">
            {/* Background Ambient Glow */}
            <div className="fixed top-20 left-0 w-full h-[50vh] bg-blue-900/10 blur-[100px] pointer-events-none -z-10" />

            {/* Debug (Hidden in production) */}
            <div className="mb-4 flex gap-2 justify-center opacity-30 hover:opacity-100 transition-opacity">
                 <button onClick={setStudentReleased} className="text-[10px] bg-slate-800 px-2 py-1 rounded">Debug: Release</button>
            </div>

            <AnimatePresence mode="wait">
                {view === "trip" && <TripView key="trip" />}
                
                {view === "vehicle" && (
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                        key="veh"
                    >
                         <div className="relative h-48 bg-gradient-to-b from-slate-800 to-slate-950 rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center group">
                             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617788138017-80ad40651399?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center opacity-40 group-hover:opacity-60 transition-opacity duration-700 transform group-hover:scale-105" />
                             <div className="relative z-10 text-center">
                                 <h2 className="text-3xl font-black text-white italic tracking-tighter">Tesla Model Y</h2>
                                 <Badge className="bg-white/10 backdrop-blur-md border-white/20 mt-2">Primary Vehicle</Badge>
                             </div>
                         </div>
                         
                         {/* Details Grid */}
                         <div className="grid grid-cols-2 gap-4">
                             <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5 data-[active=true]:border-blue-500/50">
                                 <p className="text-[10px] text-slate-500 uppercase font-bold">Plate</p>
                                 <p className="text-xl font-mono text-white">D 58291</p>
                             </div>
                             <div className="bg-slate-900/50 p-4 rounded-2xl border border-white/5">
                                 <p className="text-[10px] text-slate-500 uppercase font-bold">RFID</p>
                                 <p className="text-xl font-mono text-blue-400">#9928-AA</p>
                             </div>
                         </div>
                    </motion.div>
                )}

                {view === "history" && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-4"
                        key="hist"
                    >
                        <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-6 px-6 scrollbar-hide">
                            {[1,2,3].map(i => (
                                <div key={i} className="min-w-[200px] h-32 bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl border border-white/5 p-4 flex flex-col justify-between shadow-lg">
                                    <div className="flex justify-between items-start">
                                        <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center"><Sparkles className="h-4 w-4 text-amber-400" /></div>
                                        <span className="text-xs text-slate-500 font-bold">WEEK {i}</span>
                                    </div>
                                    <div>
                                        <p className="text-2xl font-black text-white">250 PTS</p>
                                        <p className="text-[10px] text-slate-400">Perfect Drops</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest pl-1">Recent Logs</h3>
                        <div className="space-y-3">
                            {tripHistory.map((trip, i) => (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    key={trip.id} 
                                    className="bg-slate-900/50 border border-white/5 p-4 rounded-xl flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn("h-10 w-10 rounded-full flex items-center justify-center border", trip.type === "pickup" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" : "bg-amber-500/10 border-amber-500/20 text-amber-400")}>
                                            {trip.type === "pickup" ? <Car className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm text-white capitalize">{trip.type}</p>
                                            <p className="text-[10px] text-slate-500">{trip.date}</p>
                                        </div>
                                    </div>
                                    <span className="font-mono font-bold text-green-500">+{trip.pointsEarned}</span>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
        
        {/* Cinematic Nav Bar */}
        <div className="fixed bottom-6 left-6 right-6 h-16 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 flex justify-around items-center px-2">
            {[
                { id: "trip", icon: Navigation, label: "Trip" },
                { id: "vehicle", icon: Car, label: "Vehicle" },
                { id: "history", icon: HistoryIcon, label: "History" }
            ].map((item) => {
                const isActive = view === item.id;
                return (
                    <button 
                        key={item.id}
                        onClick={() => setView(item.id as any)}
                        className="relative h-12 w-12 flex items-center justify-center"
                    >
                        {isActive && (
                            <motion.div 
                                layoutId="nav-pill"
                                className="absolute inset-0 bg-blue-500 rounded-xl shadow-lg shadow-blue-500/40"
                                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            />
                        )}
                        <item.icon className={cn("relative z-10 h-5 w-5 transition-colors", isActive ? "text-white" : "text-slate-500")} />
                    </button>
                )
            })}
        </div>
    </div>
  );
}

function HistoryIcon(props: any) {
    return <Clock {...props} />
}

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, Clock, MapPin, Navigation, ShieldCheck, LogOut, CheckCheck, Wallet, ChevronRight, Settings, CreditCard } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNexus, StudentStatus } from "@/context/NexusContext";
import { useNavigate } from "react-router-dom";

export default function ParentDashboard() {
  const [activeTab, setActiveTab] = useState("pickup");
  const [view, setView] = useState<'trip' | 'vehicle' | 'history'>('trip');
  
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

  // Local state for the Critical Minute Timer
  const [timer, setTimer] = useState(60);

  useEffect(() => {
     let interval: any;
     if (tripStatus === 'arrived' && timer > 0) {
         interval = setInterval(() => {
             setTimer(prev => prev - 1);
         }, 1000);
     }
     return () => clearInterval(interval);
  }, [tripStatus, timer]);

  const handleLogout = () => {
      logout();
      navigate('/');
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20 font-inter">
        {/* Header */}
        <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-10 shadow-lg">
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full border-2 border-blue-500 flex items-center justify-center text-blue-500 font-bold bg-blue-950">N</div>
                    <span className="font-bold text-lg tracking-tight">NEXUS</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400" onClick={handleLogout}>
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            
            {/* NOL Credit Bar */}
            <div className="flex items-center justify-between bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-900/50">
                        <Wallet className="h-4 w-4 text-white" />
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">NOL Plus Balance</p>
                        <p className="text-sm font-bold text-white">{nolBalance.toFixed(2)} <span className="text-[10px] font-normal text-slate-400">AED</span></p>
                    </div>
                </div>
                <Button size="sm" variant="outline" className="h-7 text-xs border-slate-700 bg-slate-800 hover:bg-slate-700 hover:text-white">
                    Top Up
                </Button>
            </div>
        </header>

        {/* Debug Controls for Demo */}
        <div className="bg-slate-900/50 p-2 text-xs flex gap-2 justify-center border-b border-slate-800/50">
            <span className="text-slate-500 uppercase font-bold self-center mr-2">Demo:</span>
            <button onClick={setStudentReleased} className="px-2 py-1 bg-slate-800 rounded hover:bg-slate-700 text-slate-300">Run Dismissal</button>
            <button onClick={triggerGeofenceEntry} className="px-2 py-1 bg-slate-800 rounded hover:bg-slate-700 text-slate-300">Force Arrival</button>
        </div>

        <main className="p-4 space-y-6">

            {/* TRIP VIEW */}
            {view === 'trip' && (
                <>
                <div className="grid grid-cols-2 gap-2 bg-slate-900 p-1 rounded-lg border border-slate-800">
                    <button 
                        onClick={() => setActiveTab('pickup')}
                        className={cn(
                            "py-2 rounded-md font-medium transition-all text-sm",
                            activeTab === 'pickup' ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        Pickup
                    </button>
                    <button 
                        onClick={() => setActiveTab('dropoff')}
                        className={cn(
                            "py-2 rounded-md font-medium transition-all text-sm",
                            activeTab === 'dropoff' ? "bg-blue-600 text-white shadow-md shadow-blue-900/20" : "text-slate-400 hover:text-white hover:bg-slate-800"
                        )}
                    >
                        Drop-off
                    </button>
                </div>

                {activeTab === 'pickup' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Status Card */}
                        <Card className="bg-slate-900 border-slate-800 shadow-md">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex justify-between items-center text-base">
                                    <span className="text-slate-200">Child Status</span>
                                    {studentStatus === 'in-class' && <Badge variant="outline" className="text-slate-400">IN CLASS</Badge>}
                                    {studentStatus === 'released' && <Badge variant="warning" className="bg-amber-500/10 text-amber-500 border-amber-500/20">RELEASED</Badge>}
                                    {studentStatus === 'waiting-at-gate' && <Badge variant="success" className="bg-green-500/10 text-green-500 border-green-500/20">AT GATE</Badge>}
                                    {studentStatus === 'loaded' && <Badge className="bg-blue-600">SECURE</Badge>}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <div className="h-14 w-14 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-2xl">👦</div>
                                        {studentStatus === 'waiting-at-gate' && (
                                            <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-500 rounded-full border-2 border-slate-900"></span>
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-bold text-lg text-white">Adam Smith</p>
                                        <p className="text-sm text-slate-400 flex items-center gap-1">
                                            <MapPin className="h-3 w-3" /> 
                                            {studentStatus === 'in-class' ? 'Classroom 5A' : 
                                            studentStatus === 'released' ? 'Packing Bag' : 
                                            studentStatus === 'waiting-at-gate' ? 'Pickup Zone B' : 'In Vehicle'}
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Action Area */}
                        {tripStatus === 'idle' && (
                            <div className="space-y-6 pt-4">
                                {/* Time Slot Selection */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center px-1">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Schedule Pickup</h3>
                                        {bookedSlot && (
                                            <Button variant="ghost" size="sm" className="h-6 text-[10px] text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => bookSlot(null)}>
                                                Clear
                                            </Button>
                                        )}
                                    </div>
                                    <div className="grid grid-cols-4 gap-2">
                                        {['13:45', '14:00', '14:15', '14:30'].map((slot) => (
                                            <button
                                                key={slot}
                                                onClick={() => bookSlot(slot)}
                                                className={cn(
                                                    "py-2 rounded-lg text-sm font-bold border transition-all",
                                                    bookedSlot === slot 
                                                        ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50" 
                                                        : "bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800"
                                                )}
                                            >
                                                {slot}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-slate-800" />
                                    </div>
                                    <div className="relative flex justify-center text-xs uppercase">
                                        <span className="bg-slate-950 px-2 text-slate-500 font-bold">Or Leave Now</span>
                                    </div>
                                </div>

                                <Button 
                                    variant="nexusSuccess" 
                                    size="mega" 
                                    className="w-full py-10 text-xl font-bold flex flex-col gap-2 items-center justify-center h-auto rounded-2xl shadow-green-900/20 hover:scale-[1.02] transition-transform active:scale-95 relative overflow-hidden"
                                    onClick={startTrip}
                                >
                                    {bookedSlot && (
                                        <div className="absolute top-3 right-3 bg-white/20 px-2 py-0.5 rounded text-[10px] text-white font-bold backdrop-blur-sm">
                                            SLOT: {bookedSlot}
                                        </div>
                                    )}
                                    <Car className="h-10 w-10" />
                                    <span>{bookedSlot ? 'START SCHEDULED TRIP' : "I'M LEAVING NOW"}</span>
                                    <span className="text-xs font-normal opacity-80 uppercase tracking-wider bg-green-700/50 px-2 py-0.5 rounded">
                                        {bookedSlot ? 'Confirm On-Time Departure' : 'Sync Traffic Core'}
                                    </span>
                                </Button>
                                <p className="text-xs text-center text-slate-500 max-w-xs mx-auto leading-relaxed">
                                    Tapping this starts the "Live Departure Sync" algorithm to optimize your arrival slot.
                                </p>
                            </div>
                        )}

                        {tripStatus === 'en-route' && (
                            <Card className="bg-blue-950/20 border-blue-900/50 overflow-hidden relative">
                                <div className="absolute top-0 left-0 w-full h-1 bg-blue-900">
                                    <div className="h-full bg-blue-500 animate-pulse" style={{ width: `${((15 - eta) / 15) * 100}%` }}></div>
                                </div>
                                <CardContent className="pt-8 text-center space-y-4">
                                    <div>
                                        <p className="text-blue-400 text-xs uppercase tracking-widest font-bold mb-2">Estimated Arrival</p>
                                        <div className="flex items-baseline justify-center gap-2">
                                            <span className="text-6xl font-black font-mono tracking-tighter text-white">{eta}</span>
                                            <span className="text-xl text-slate-500 font-bold">MIN</span>
                                        </div>
                                        <Badge variant="secondary" className="mt-4 bg-blue-500/10 text-blue-300 border-blue-500/20 px-3 py-1">
                                            Route Optimized
                                        </Badge>
                                    </div>
                                    <div className="bg-slate-900/50 p-4 rounded-lg text-left text-sm text-slate-300 space-y-2 border border-slate-800">
                                        <div className="flex justify-between">
                                            <span>Current Traffic</span>
                                            <span className="text-green-400">Fluid</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Gate Assignment</span>
                                            <span className="text-slate-500">Pending...</span>
                                        </div>
                                    </div>
                                    <Button 
                                        className="w-full bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                                        onClick={triggerGeofenceEntry}
                                    >
                                        Simulate Arrival (Geofence)
                                    </Button>
                                </CardContent>
                            </Card>
                        )}

                        {(tripStatus === 'arrived' || tripStatus === 'completed') && (
                            <div className="space-y-4">
                                <Card className={cn(
                                    "border transition-all duration-500 overflow-hidden",
                                    tripStatus === 'completed' ? "bg-green-950/30 border-green-500/50" : "bg-green-900/20 border-green-500 animate-pulse-slow"
                                )}>
                                    <CardContent className="pt-6 text-center space-y-6">
                                        <div>
                                            <p className="text-green-400 text-xs uppercase tracking-widest font-bold">Access Granted</p>
                                            <div className="text-8xl font-black text-white my-4 tracking-tighter">{gate}</div>
                                            <p className="text-slate-300 text-lg">Proceed to Bay {gate}</p>
                                        </div>
                                        
                                        {tripStatus === 'arrived' && (
                                            <Button 
                                                size="lg" 
                                                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold h-14"
                                                onClick={confirmPickup}
                                            >
                                                <CheckCheck className="mr-2 h-5 w-5" />
                                                CONFIRM CHILD LOADED
                                            </Button>
                                        )}

                                        {tripStatus === 'completed' && (
                                            <div className="bg-green-500/20 p-4 rounded-lg text-green-200 font-bold">
                                                HAVE A SAFE TRIP!
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'dropoff' && (
                    <div className="space-y-6">
                        <Card className="bg-slate-900 border-slate-800">
                            <CardHeader>
                                <CardTitle>Drop-off Protocol</CardTitle>
                                <CardDescription>The "Critical Minute" 60s Timer</CardDescription>
                            </CardHeader>
                            <CardContent className="text-center pb-8">
                                <div className="w-56 h-56 rounded-full border-8 border-slate-800 flex items-center justify-center mx-auto mb-6 relative bg-slate-950 shadow-inner">
                                    <div className={cn(
                                        "text-5xl font-mono tracking-tighter",
                                        timer < 15 ? "text-red-500" : timer < 30 ? "text-amber-500" : "text-slate-300"
                                    )}>
                                        00:{timer.toString().padStart(2, '0')}
                                    </div>
                                    <div className="absolute top-0 left-0 w-full h-full border-t-8 border-blue-500 rounded-full animate-spin-slow opacity-20"></div>
                                </div>
                                
                                <div className="grid grid-cols-3 gap-2 text-xs text-slate-500">
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={cn("w-3 h-3 rounded-full", timer < 50 ? "bg-green-500" : "bg-slate-800")}></div>
                                        Unlock
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={cn("w-3 h-3 rounded-full", timer < 30 ? "bg-green-500" : "bg-slate-800")}></div>
                                        Unload
                                    </div>
                                    <div className="flex flex-col items-center gap-1">
                                        <div className={cn("w-3 h-3 rounded-full", timer < 5 ? "bg-green-500" : "bg-slate-800")}></div>
                                        Depart
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
                </>
            )}

            {/* VEHICLE VIEW */}
            {view === 'vehicle' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <Card className="bg-slate-900 border-slate-800 overflow-hidden">
                        <div className="h-32 bg-slate-800 flex items-center justify-center border-b border-slate-700">
                            <Car className="h-16 w-16 text-slate-600" />
                        </div>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>Tesla Model Y</CardTitle>
                                    <CardDescription>Primary Vehicle</CardDescription>
                                </div>
                                <Badge variant="outline" className="text-green-500 border-green-500/30 bg-green-950/20">Verified</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-1">
                                <p className="text-xs text-slate-500 uppercase font-bold">License Plate</p>
                                <div className="text-2xl font-mono font-black flex gap-2">
                                    <span className="bg-white text-black px-2 rounded">D</span>
                                    <span className="text-white tracking-widest">58291</span>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-500 uppercase font-bold">Color</p>
                                    <p className="text-sm">Pearl White</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-slate-500 uppercase font-bold">RFID Tag</p>
                                    <p className="text-sm font-mono text-blue-400">#9928-AA</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-900 border-slate-800">
                        <CardHeader>
                            <CardTitle className="text-sm uppercase text-slate-500">Authorized Drivers</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
                                 <div className="flex items-center gap-3">
                                     <div className="h-10 w-10 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-200 font-bold border border-blue-800">M</div>
                                     <div>
                                         <p className="font-bold text-sm">Mohammed Al-Fayed</p>
                                         <p className="text-xs text-slate-500">Father (Owner)</p>
                                     </div>
                                 </div>
                                 <Badge className="bg-blue-600 text-[10px]">YOU</Badge>
                             </div>
                             <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 opacity-75">
                                 <div className="flex items-center gap-3">
                                     <div className="h-10 w-10 rounded-full bg-purple-900/50 flex items-center justify-center text-purple-200 font-bold border border-purple-800">S</div>
                                     <div>
                                         <p className="font-bold text-sm">Sarah Al-Fayed</p>
                                         <p className="text-xs text-slate-500">Mother</p>
                                     </div>
                                 </div>
                                 <ChevronRight className="h-4 w-4 text-slate-600" />
                             </div>
                        </CardContent>
                    </Card>
                    
                    <Button variant="outline" className="w-full border-slate-700 hover:bg-slate-800 text-slate-400">
                        <Settings className="mr-2 h-4 w-4" /> Manage Vehicles
                    </Button>
                </div>
            )}

            {/* HISTORY VIEW */}
            {view === 'history' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                         <Card className="min-w-[140px] bg-gradient-to-br from-blue-900 to-slate-900 border-blue-800">
                             <CardContent className="p-4">
                                 <p className="text-xs text-blue-300 uppercase font-bold mb-1">Total Points</p>
                                 <p className="text-2xl font-black text-white">{nolBalance.toFixed(0)}</p>
                                 <p className="text-[10px] text-blue-300 mt-1 flex items-center gap-1">
                                     <Wallet className="h-3 w-3" /> Redeemable
                                 </p>
                             </CardContent>
                         </Card>
                         <Card className="min-w-[140px] bg-slate-900 border-slate-800">
                             <CardContent className="p-4">
                                 <p className="text-xs text-slate-500 uppercase font-bold mb-1">Perfect Drops</p>
                                 <p className="text-2xl font-black text-green-500">12</p>
                                 <p className="text-[10px] text-slate-500 mt-1">Last 30 Days</p>
                             </CardContent>
                         </Card>
                    </div>

                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-1">Recent Activity</h3>
                    
                    <div className="space-y-3">
                        {tripHistory.map((trip) => (
                            <div key={trip.id} className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className={cn(
                                        "h-10 w-10 rounded-full flex items-center justify-center border",
                                        trip.type === 'pickup' ? "bg-blue-950 border-blue-900 text-blue-400" : "bg-amber-950 border-amber-900 text-amber-400"
                                    )}>
                                        {trip.type === 'pickup' ? <Car className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-bold text-sm text-white capitalize">{trip.type}</p>
                                            {trip.status === 'perfect' && <Badge variant="success" className="text-[10px] h-5 px-1.5 bg-green-500/10 text-green-500 border-green-500/20">PERFECT</Badge>}
                                        </div>
                                        <p className="text-xs text-slate-500">{trip.date} • Duration: {trip.duration}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-green-500">+{trip.pointsEarned}</p>
                                    <p className="text-[10px] text-slate-600">PTS</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </main>
        
        {/* Nav Bar */}
        <nav className="fixed bottom-0 w-full bg-slate-900 border-t border-slate-800 p-2 flex justify-around text-[10px] text-slate-500 z-20 pb-safe">
            <button 
                onClick={() => setView('trip')}
                className={cn(
                    "flex flex-col items-center p-2 rounded w-16 transition-colors",
                    view === 'trip' ? "text-blue-500 bg-blue-950/30" : "hover:bg-slate-800"
                )}
            >
                <Navigation className="h-5 w-5 mb-1" />
                <span className="font-medium">Trip</span>
            </button>
            <button 
                onClick={() => setView('vehicle')}
                className={cn(
                    "flex flex-col items-center p-2 rounded w-16 transition-colors",
                    view === 'vehicle' ? "text-blue-500 bg-blue-950/30" : "hover:bg-slate-800"
                )}
            >
                <Car className="h-5 w-5 mb-1" />
                <span className="font-medium">Vehicle</span>
            </button>
            <button 
                onClick={() => setView('history')}
                className={cn(
                    "flex flex-col items-center p-2 rounded w-16 transition-colors",
                    view === 'history' ? "text-blue-500 bg-blue-950/30" : "hover:bg-slate-800"
                )}
            >
                <Clock className="h-5 w-5 mb-1" />
                <span className="font-medium">History</span>
            </button>
        </nav>
    </div>
  );
}

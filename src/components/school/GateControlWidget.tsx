import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lock, Unlock, AlertTriangle, ShieldAlert } from "lucide-react";
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export const GateControlWidget = () => {
  const [gatesLocked, setGatesLocked] = useState(false);
  const [autoMode, setAutoMode] = useState(true);
  const [emergencyLockdown, setEmergencyLockdown] = useState(false);

  const handleEmergencyLockdown = () => {
    setEmergencyLockdown(true);
    setGatesLocked(true);
    setAutoMode(false);
  };

  const handleCancelEmergency = () => {
    setEmergencyLockdown(false);
    setGatesLocked(false);
    setAutoMode(true);
  };

  return (
    <Card className={`glass-panel border-FLUXGATE-border/50 bg-secondary/5 ${emergencyLockdown ? 'ring-2 ring-destructive animate-pulse' : ''}`}>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center justify-between">
          <span className="flex items-center gap-2">
            {emergencyLockdown && <ShieldAlert className="h-5 w-5 text-destructive animate-pulse" />}
            Perimeter Control
          </span>
          <div className="flex items-center space-x-2">
            <Switch 
              id="auto-mode" 
              checked={autoMode} 
              onCheckedChange={setAutoMode} 
              disabled={emergencyLockdown}
            />
            <Label htmlFor="auto-mode" className="text-xs font-normal text-muted-foreground">Auto-Logic</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Button 
              variant={gatesLocked ? "default" : "outline"}
              className="h-24 flex flex-col gap-2 border-dashed"
              onClick={() => setGatesLocked(true)}
              disabled={autoMode || emergencyLockdown}
          >
              <Lock className="h-8 w-8 text-destructive" />
              <span>LOCKDOWN</span>
          </Button>

          <Button 
              variant={!gatesLocked ? "secondary" : "outline"}
              className="h-24 flex flex-col gap-2 bg-FLUXGATE-success/10 hover:bg-FLUXGATE-success/20 border-FLUXGATE-success/30"
              onClick={() => setGatesLocked(false)}
              disabled={autoMode || emergencyLockdown}
          >
              <Unlock className="h-8 w-8 text-FLUXGATE-success" />
              <span>NORMAL OPS</span>
          </Button>
        </div>

        {/* Emergency Lockdown Button */}
        {!emergencyLockdown ? (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="destructive" 
                className="w-full h-12 font-bold uppercase tracking-wider"
              >
                <ShieldAlert className="h-5 w-5 mr-2" />
                Emergency Lockdown
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="border-destructive/50">
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-destructive">
                  <ShieldAlert className="h-6 w-6" />
                  Confirm Emergency Lockdown
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p>
                    This action will immediately:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Lock all perimeter gates</li>
                    <li>Halt all vehicle movements</li>
                    <li>Alert all staff members</li>
                    <li>Notify campus security</li>
                    <li>Disable automatic gate operations</li>
                  </ul>
                  <p className="font-medium text-foreground pt-2">
                    Are you sure you want to initiate an emergency lockdown?
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleEmergencyLockdown}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Confirm Lockdown
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="w-full h-12 font-bold uppercase tracking-wider border-FLUXGATE-success text-FLUXGATE-success hover:bg-FLUXGATE-success/10"
              >
                <Unlock className="h-5 w-5 mr-2" />
                Cancel Emergency Lockdown
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-FLUXGATE-success">
                  <Unlock className="h-6 w-6" />
                  Cancel Emergency Lockdown
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This will restore normal operations and re-enable automatic gate control.
                  Make sure the emergency situation has been resolved before proceeding.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep Lockdown Active</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={handleCancelEmergency}
                  className="bg-FLUXGATE-success text-white hover:bg-FLUXGATE-success/90"
                >
                  Restore Normal Operations
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}

        <div className="text-xs text-center text-muted-foreground bg-secondary/30 p-2 rounded">
            {emergencyLockdown ? (
                <span className="text-destructive flex items-center justify-center gap-2 font-semibold">
                     <ShieldAlert className="h-3 w-3 animate-pulse" /> EMERGENCY LOCKDOWN ACTIVE
                </span>
            ) : !autoMode ? (
                <span className="text-FLUXGATE-orange flex items-center justify-center gap-2">
                     <AlertTriangle className="h-3 w-3" /> Manual Override Active
                </span>
            ) : (
                "System is managing gates based on queue logic."
            )}
        </div>
      </CardContent>
    </Card>
  );
};
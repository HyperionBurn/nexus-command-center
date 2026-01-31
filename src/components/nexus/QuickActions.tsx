import { cn } from '@/lib/utils';
import { AlertTriangle, Zap, RefreshCw, Layers, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SimulationMode } from '@/types/nexus';

interface QuickActionsProps {
  onTriggerSurge: () => void;
  onTriggerStalled: () => void;
  onToggleMode: () => void;
  currentMode: SimulationMode;
  className?: string;
}

export const QuickActions = ({ 
  onTriggerSurge, 
  onTriggerStalled, 
  onToggleMode,
  currentMode,
  className 
}: QuickActionsProps) => {
  return (
    <nav 
      className={cn('flex flex-wrap items-center gap-1.5 sm:gap-2', className)}
      role="toolbar"
      aria-label="Simulation controls"
    >
      <span className="text-[10px] sm:text-xs text-muted-foreground mr-1 sm:mr-2 hidden xs:inline" aria-hidden="true">Simulate:</span>
      
      <Button
         variant="outline"
         size="sm"
         onClick={onToggleMode}
         aria-label={currentMode === 'DROPOFF' ? 'Switch to Pickup mode (90 seconds)' : 'Switch to Drop-off mode (60 seconds)'}
         aria-pressed={currentMode === 'DROPOFF'}
         className="h-9 sm:h-8 min-w-[44px] px-2 sm:px-3 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary transition-colors touch-manipulation text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Layers className="h-3.5 w-3.5 sm:h-3 sm:w-3 sm:mr-1" aria-hidden="true" />
        <span className="hidden sm:inline">{currentMode === 'DROPOFF' ? 'Mode: Drop-off (60s)' : 'Mode: Pickup (90s)'}</span>
        <span className="sm:hidden ml-1">{currentMode === 'DROPOFF' ? 'Drop' : 'Pick'}</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onTriggerSurge}
        aria-label="Trigger surge event simulation"
        className="h-9 sm:h-8 min-w-[44px] px-2 sm:px-3 border-nexus-wait/50 text-nexus-wait hover:bg-nexus-wait/10 hover:text-nexus-wait touch-manipulation text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Zap className="h-3.5 w-3.5 sm:h-3 sm:w-3 sm:mr-1" aria-hidden="true" />
        <span className="hidden sm:inline">Surge Event</span>
        <span className="sm:hidden ml-1">Surge</span>
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onTriggerStalled}
        aria-label="Trigger stalled vehicle simulation"
        className="h-9 sm:h-8 min-w-[44px] px-2 sm:px-3 border-nexus-hold/50 text-nexus-hold hover:bg-nexus-hold/10 hover:text-nexus-hold touch-manipulation text-xs sm:text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <AlertTriangle className="h-3.5 w-3.5 sm:h-3 sm:w-3 sm:mr-1" aria-hidden="true" />
        <span className="hidden sm:inline">Stalled Vehicle</span>
        <span className="sm:hidden ml-1">Stall</span>
      </Button>

      <div className="hidden sm:block h-6 w-px bg-border mx-2" role="separator" aria-orientation="vertical" />

      <Button
        variant="ghost"
        size="sm"
        aria-label="Reset simulation"
        className="h-9 sm:h-8 min-w-[44px] px-2 text-muted-foreground hover:text-foreground touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <RefreshCw className="h-3.5 w-3.5 sm:h-3 sm:w-3 sm:mr-1" aria-hidden="true" />
        <span className="hidden sm:inline">Reset</span>
      </Button>

      <Button
        variant="ghost"
        size="sm"
        aria-label="Toggle alert sounds"
        className="h-9 sm:h-8 min-w-[44px] px-2 text-muted-foreground hover:text-foreground touch-manipulation focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Volume2 className="h-3.5 w-3.5 sm:h-3 sm:w-3 sm:mr-1" aria-hidden="true" />
        <span className="hidden sm:inline">Alerts</span>
      </Button>
    </nav>
  );
};

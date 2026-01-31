import { cn } from '@/lib/utils';
import { AlertTriangle, Zap, RefreshCw, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  onTriggerSurge: () => void;
  onTriggerStalled: () => void;
  className?: string;
}

export const QuickActions = ({ onTriggerSurge, onTriggerStalled, className }: QuickActionsProps) => {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-xs text-muted-foreground mr-2">Simulate:</span>
      
      <Button
        variant="outline"
        size="sm"
        onClick={onTriggerSurge}
        className="border-nexus-wait/50 text-nexus-wait hover:bg-nexus-wait/10 hover:text-nexus-wait"
      >
        <Zap className="h-3 w-3 mr-1" />
        Surge Event
      </Button>

      <Button
        variant="outline"
        size="sm"
        onClick={onTriggerStalled}
        className="border-nexus-hold/50 text-nexus-hold hover:bg-nexus-hold/10 hover:text-nexus-hold"
      >
        <AlertTriangle className="h-3 w-3 mr-1" />
        Stalled Vehicle
      </Button>

      <div className="h-6 w-px bg-border mx-2" />

      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground"
      >
        <RefreshCw className="h-3 w-3 mr-1" />
        Reset
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-foreground"
      >
        <Volume2 className="h-3 w-3 mr-1" />
        Alerts
      </Button>
    </div>
  );
};

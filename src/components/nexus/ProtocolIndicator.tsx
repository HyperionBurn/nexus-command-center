import { SimulationMode } from '@/types/nexus';
import { cn } from '@/lib/utils';
import { Info } from 'lucide-react';

interface ProtocolIndicatorProps {
  mode: SimulationMode;
  className?: string;
}

export const ProtocolIndicator = ({ mode, className }: ProtocolIndicatorProps) => {
  return (
    <div className={cn('glass-panel p-4 text-xs', className)}>
      <div className="flex items-center gap-2 mb-2 text-muted-foreground">
        <Info className="h-4 w-4" />
        <span className="font-semibold uppercase tracking-wider">{mode} Protocol Phases</span>
      </div>
      
      <div className="flex items-center gap-4">
        {mode === 'DROPOFF' ? (
          <>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Entry (0-10s)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Action (10-35s)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Exit (35-60s)</span>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-purple-400" />
              <span>Verify (0-20s)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400" />
              <span>Approach (20-60s)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-pink-400" />
              <span>Handoff (60-90s)</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

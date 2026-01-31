import { FuzzyLogicDecision } from '@/types/nexus';
import { cn } from '@/lib/utils';
import { Brain, CheckCircle, XCircle, Pause } from 'lucide-react';
import { format } from 'date-fns';

interface FuzzyLogicTraceProps {
  decisions: FuzzyLogicDecision[];
  className?: string;
}

export const FuzzyLogicTrace = ({ decisions, className }: FuzzyLogicTraceProps) => {
  const getActionIcon = (action: FuzzyLogicDecision['action']) => {
    switch (action) {
      case 'OPEN': return <CheckCircle className="h-4 w-4 text-nexus-open" />;
      case 'CLOSE': return <XCircle className="h-4 w-4 text-nexus-hold" />;
      case 'HOLD': return <Pause className="h-4 w-4 text-nexus-wait" />;
    }
  };

  const getActionColor = (action: FuzzyLogicDecision['action']) => {
    switch (action) {
      case 'OPEN': return 'border-l-nexus-open bg-nexus-open/5';
      case 'CLOSE': return 'border-l-nexus-hold bg-nexus-hold/5';
      case 'HOLD': return 'border-l-nexus-wait bg-nexus-wait/5';
    }
  };

  return (
    <div className={className}>
      <div className="flex items-center gap-2 mb-4">
        <Brain className="h-5 w-5 text-nexus-purple" />
        <div>
          <h3 className="text-lg font-semibold text-foreground">FLGC Decision Trace</h3>
          <p className="text-xs text-muted-foreground">Fuzzy Logic Gate Control</p>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto scrollbar-thin pr-2">
        {decisions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground text-sm">
            Awaiting fuzzy logic decisions...
          </div>
        ) : (
          decisions.map((decision, index) => (
            <div
              key={decision.id}
              className={cn(
                'p-3 rounded-r border-l-2 transition-all duration-300',
                getActionColor(decision.action),
                index === 0 && 'animate-fade-in'
              )}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  {getActionIcon(decision.action)}
                  <span className="font-mono text-sm font-semibold text-foreground">
                    {decision.gate}
                  </span>
                  <span className={cn(
                    'px-2 py-0.5 rounded text-xs font-medium',
                    decision.action === 'OPEN' && 'bg-nexus-open/20 text-nexus-open',
                    decision.action === 'CLOSE' && 'bg-nexus-hold/20 text-nexus-hold',
                    decision.action === 'HOLD' && 'bg-nexus-wait/20 text-nexus-wait',
                  )}>
                    {decision.action}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {format(decision.timestamp, 'HH:mm:ss')}
                </span>
              </div>

              <div className="space-y-1">
                {decision.rules.map((rule, ruleIndex) => (
                  <div 
                    key={ruleIndex}
                    className="flex items-center gap-2 text-xs"
                  >
                    <span className="text-muted-foreground">→</span>
                    <code className="font-mono text-foreground/80 bg-secondary/50 px-1.5 py-0.5 rounded">
                      {rule}
                    </code>
                  </div>
                ))}
              </div>

              <div className="mt-2 flex items-center gap-4 text-xs text-muted-foreground">
                <span>Confidence: <span className="text-foreground font-mono">{(decision.confidence * 100).toFixed(0)}%</span></span>
                <span>Queue: <span className="text-foreground font-mono">{decision.inputs.queueLength.toFixed(0)}m</span></span>
                <span>Occ: <span className="text-foreground font-mono">{decision.inputs.zoneOccupancy.toFixed(0)}%</span></span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

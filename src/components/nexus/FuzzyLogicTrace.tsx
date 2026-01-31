import { FuzzyLogicDecision } from '@/types/nexus';
import { cn } from '@/lib/utils';
import { Bot, Terminal, CheckCircle, XCircle, Pause, Activity } from 'lucide-react';
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

  const currentDecision = decisions[0];

  return (
    <div className={cn("bg-black/40 border border-nexus-cyan/30 rounded-lg overflow-hidden backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,255,0.05)]", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-nexus-cyan/20 bg-nexus-cyan/5">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-nexus-cyan animate-pulse" />
          <div>
            <h3 className="text-sm font-bold text-nexus-cyan tracking-wider font-mono">NEXUS AI SENTINEL</h3>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-nexus-open opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-nexus-open"></span>
              </span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">System Active • Monitoring</p>
            </div>
          </div>
        </div>
        <Terminal className="h-4 w-4 text-nexus-cyan/50" />
      </div>

      <div className="p-0">
        {decisions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
            <Activity className="h-8 w-8 animate-pulse text-nexus-cyan/30" />
            <span className="text-sm font-mono tracking-widest text-nexus-cyan/50">INITIALIZING NEURAL NET...</span>
          </div>
        ) : (
           <div className="divide-y divide-border/20">
             {/* Latest Decision Main View */}
             {currentDecision && (
               <div className="p-4 bg-nexus-cyan/5 w-full">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-mono text-nexus-cyan/70">
                       [{format(currentDecision.timestamp, 'HH:mm:ss')}] LOGIC_EVENT_{currentDecision.id.split('-')[1]}
                    </span>
                  </div>
                  
                  <div className="space-y-3 pl-2 border-l-2 border-nexus-cyan/30 ml-1">
                    {currentDecision.rules.map((rule, idx) => (
                      <p key={idx} className="text-sm font-mono text-foreground/90 leading-relaxed typewriter-text">
                        <span className="text-nexus-cyan mr-2">›</span>
                        {rule}
                      </p>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-4 bg-background/50 p-2 rounded border border-border/50">
                    <div className="flex items-center gap-2">
                       {getActionIcon(currentDecision.action)}
                       <span className="text-xs font-bold font-mono tracking-wider">{currentDecision.action} PROTOCOL</span>
                    </div>
                    <div className="h-3 w-px bg-border"></div>
                    <span className="text-xs font-mono text-muted-foreground">
                      CONFIDENCE: <span className="text-nexus-cyan">{(currentDecision.confidence * 100).toFixed(0)}%</span>
                    </span>
                  </div>
               </div>
             )}

             {/* History Log (Collapsed) */}
             <div className="max-h-48 overflow-y-auto scrollbar-thin bg-black/20">
               {decisions.slice(1).map((decision) => (
                 <div key={decision.id} className="p-3 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-nexus-cyan/30">
                    <div className="flex items-center justify-between">
                       <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-muted-foreground">{format(decision.timestamp, 'HH:mm:ss')}</span>
                          <span className={cn(
                            "text-[10px] px-1.5 rounded-sm font-bold font-mono",
                            decision.action === 'OPEN' && "text-nexus-open bg-nexus-open/10",
                            decision.action === 'CLOSE' && "text-nexus-hold bg-nexus-hold/10",
                            decision.action === 'HOLD' && "text-nexus-wait bg-nexus-wait/10",
                          )}>{decision.action}</span>
                          <span className="text-xs text-muted-foreground truncate max-w-[200px] font-mono">
                             {decision.rules[0]}
                          </span>
                       </div>
                    </div>
                 </div>
               ))}
             </div>
           </div>
        )}
      </div>
    </div>
  );
};

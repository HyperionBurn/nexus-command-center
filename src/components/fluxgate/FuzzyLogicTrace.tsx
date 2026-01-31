import { FuzzyLogicDecision } from '@/types/fluxgate';
import { cn } from '@/lib/utils';
import { 
  Bot, 
  Terminal, 
  CheckCircle, 
  XCircle, 
  Pause, 
  Activity, 
  DoorOpen, 
  DoorClosed, 
  AlertTriangle,
  Clock,
  Gauge,
  ArrowRight,
  ChevronRight,
  Zap,
  History
} from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface FuzzyLogicTraceProps {
  decisions: FuzzyLogicDecision[];
  className?: string;
}

// Helper to get input value severity (green=low, amber=medium, red=high)
const getInputValueColor = (key: string, value: number | string): string => {
  if (typeof value === 'string') return 'text-FLUXGATE-cyan';
  
  // Different thresholds for different input types
  switch (key) {
    case 'queueLength':
      if (value <= 5) return 'text-FLUXGATE-open';
      if (value <= 15) return 'text-amber-400';
      return 'text-FLUXGATE-hold';
    case 'zoneOccupancy':
      if (value <= 40) return 'text-FLUXGATE-open';
      if (value <= 70) return 'text-amber-400';
      return 'text-FLUXGATE-hold';
    case 'dwellTimeAvg':
      if (value <= 30) return 'text-FLUXGATE-open';
      if (value <= 50) return 'text-amber-400';
      return 'text-FLUXGATE-hold';
    case 'arrivalRate':
      if (value <= 8) return 'text-FLUXGATE-open';
      if (value <= 15) return 'text-amber-400';
      return 'text-FLUXGATE-hold';
    case 'serviceRate':
      // Higher is better for service rate
      if (value >= 12) return 'text-FLUXGATE-open';
      if (value >= 6) return 'text-amber-400';
      return 'text-FLUXGATE-hold';
    default:
      return 'text-FLUXGATE-cyan';
  }
};

// Get background color for input value
const getInputBgColor = (key: string, value: number | string): string => {
  if (typeof value === 'string') return 'bg-FLUXGATE-cyan/10';
  
  switch (key) {
    case 'queueLength':
      if (value <= 5) return 'bg-FLUXGATE-open/10';
      if (value <= 15) return 'bg-amber-400/10';
      return 'bg-FLUXGATE-hold/10';
    case 'zoneOccupancy':
      if (value <= 40) return 'bg-FLUXGATE-open/10';
      if (value <= 70) return 'bg-amber-400/10';
      return 'bg-FLUXGATE-hold/10';
    case 'dwellTimeAvg':
      if (value <= 30) return 'bg-FLUXGATE-open/10';
      if (value <= 50) return 'bg-amber-400/10';
      return 'bg-FLUXGATE-hold/10';
    case 'arrivalRate':
      if (value <= 8) return 'bg-FLUXGATE-open/10';
      if (value <= 15) return 'bg-amber-400/10';
      return 'bg-FLUXGATE-hold/10';
    case 'serviceRate':
      if (value >= 12) return 'bg-FLUXGATE-open/10';
      if (value >= 6) return 'bg-amber-400/10';
      return 'bg-FLUXGATE-hold/10';
    default:
      return 'bg-FLUXGATE-cyan/10';
  }
};

// Format input key to readable label
const formatInputLabel = (key: string): string => {
  const labels: Record<string, string> = {
    queueLength: 'Queue',
    zoneOccupancy: 'Occupancy',
    dwellTimeAvg: 'Avg Dwell',
    timeOfDay: 'Time',
    arrivalRate: 'λ Arrival',
    serviceRate: 'μ Service'
  };
  return labels[key] || key;
};

// Format input value with units
const formatInputValue = (key: string, value: number | string): string => {
  if (typeof value === 'string') return value;
  
  switch (key) {
    case 'queueLength':
      return `${value}m`;
    case 'zoneOccupancy':
      return `${value}%`;
    case 'dwellTimeAvg':
      return `${value}s`;
    case 'arrivalRate':
    case 'serviceRate':
      return `${value}/min`;
    default:
      return String(value);
  }
};

// Generate triggered rule string from inputs and action
const generateTriggeredRule = (decision: FuzzyLogicDecision): string => {
  const { inputs, action } = decision;
  const conditions: string[] = [];
  
  if (inputs.queueLength > 15) conditions.push('queue > 15m');
  else if (inputs.queueLength > 5) conditions.push('queue > 5m');
  
  if (inputs.zoneOccupancy > 70) conditions.push('zone = SURGE');
  else if (inputs.zoneOccupancy > 40) conditions.push('zone = BUSY');
  
  if (inputs.dwellTimeAvg > 50) conditions.push('dwell > 50s');
  
  if (inputs.arrivalRate && inputs.serviceRate) {
    if (inputs.arrivalRate > inputs.serviceRate) conditions.push('λ > μ');
  }
  
  const conditionStr = conditions.length > 0 ? conditions.join(' AND ') : 'conditions normal';
  const actionStr = action === 'OPEN' ? 'open gate' : action === 'CLOSE' ? 'close gate' : 'hold position';
  
  return `IF ${conditionStr} THEN ${actionStr}`;
};

export const FuzzyLogicTrace = ({ decisions, className }: FuzzyLogicTraceProps) => {
  // Get action icon with different icon types
  const getActionIcon = (action: FuzzyLogicDecision['action'], size: 'sm' | 'md' = 'sm') => {
    const sizeClass = size === 'sm' ? 'h-4 w-4' : 'h-5 w-5';
    switch (action) {
      case 'OPEN': return <DoorOpen className={cn(sizeClass, "text-FLUXGATE-open")} />;
      case 'CLOSE': return <DoorClosed className={cn(sizeClass, "text-FLUXGATE-hold")} />;
      case 'HOLD': return <Pause className={cn(sizeClass, "text-FLUXGATE-wait")} />;
    }
  };

  // Get status icon for mini display
  const getStatusIcon = (action: FuzzyLogicDecision['action']) => {
    switch (action) {
      case 'OPEN': return <CheckCircle className="h-3 w-3 text-FLUXGATE-open" />;
      case 'CLOSE': return <XCircle className="h-3 w-3 text-FLUXGATE-hold" />;
      case 'HOLD': return <AlertTriangle className="h-3 w-3 text-FLUXGATE-wait" />;
    }
  };

  const currentDecision = decisions[0];
  const recentHistory = decisions.slice(1, 4); // Last 3 decisions for history

  // Confidence meter component
  const ConfidenceMeter = ({ confidence }: { confidence: number }) => {
    const percentage = confidence * 100;
    const getConfidenceColor = () => {
      if (percentage >= 85) return 'from-FLUXGATE-open to-emerald-400';
      if (percentage >= 60) return 'from-FLUXGATE-cyan to-blue-400';
      return 'from-amber-400 to-orange-400';
    };
    
    const getConfidenceLabel = () => {
      if (percentage >= 85) return 'HIGH';
      if (percentage >= 60) return 'MEDIUM';
      return 'LOW';
    };

    return (
      <div className="flex items-center gap-2">
        <Gauge className="h-4 w-4 text-FLUXGATE-cyan/70" />
        <div className="flex-1 min-w-[80px]">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[9px] font-mono text-muted-foreground uppercase">Certainty</span>
            <span className={cn(
              "text-[9px] font-bold font-mono",
              percentage >= 85 ? 'text-FLUXGATE-open' : percentage >= 60 ? 'text-FLUXGATE-cyan' : 'text-amber-400'
            )}>
              {getConfidenceLabel()}
            </span>
          </div>
          <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
            <motion.div 
              className={cn("h-full rounded-full bg-gradient-to-r", getConfidenceColor())}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>
        <span className="text-xs font-mono font-bold text-foreground">{percentage.toFixed(0)}%</span>
      </div>
    );
  };

  // Decision tree/flowchart component
  const DecisionFlowchart = ({ decision }: { decision: FuzzyLogicDecision }) => {
    const { inputs, action } = decision;
    
    return (
      <div className="bg-black/30 rounded-lg border border-FLUXGATE-cyan/20 p-3">
        <div className="flex items-center gap-1.5 mb-3">
          <Zap className="h-3.5 w-3.5 text-FLUXGATE-cyan" />
          <span className="text-[10px] font-mono font-bold text-FLUXGATE-cyan uppercase tracking-wider">Decision Path</span>
        </div>
        
        {/* Flowchart visualization */}
        <div className="flex items-center gap-1 text-[10px] font-mono overflow-x-auto pb-1">
          {/* Input node */}
          <div className="flex-shrink-0 px-2 py-1.5 bg-FLUXGATE-cyan/10 border border-FLUXGATE-cyan/30 rounded">
            <span className="text-FLUXGATE-cyan font-bold">INPUT</span>
          </div>
          
          <ChevronRight className="h-3 w-3 text-FLUXGATE-cyan/50 flex-shrink-0" />
          
          {/* Condition evaluation */}
          <div 
            className={cn(
              "flex-shrink-0 px-2 py-1.5 border rounded transition-colors duration-300",
              inputs.queueLength > 10 || inputs.zoneOccupancy > 60 
                ? "bg-amber-400/10 border-amber-400/30" 
                : "bg-FLUXGATE-open/10 border-FLUXGATE-open/30"
            )}
          >
            <span className={cn("transition-colors duration-300", inputs.queueLength > 10 || inputs.zoneOccupancy > 60 ? "text-amber-400" : "text-FLUXGATE-open")}>
              {inputs.zoneOccupancy > 70 ? 'SURGE' : inputs.zoneOccupancy > 40 ? 'BUSY' : 'NORMAL'}
            </span>
          </div>
          
          <ChevronRight className="h-3 w-3 text-FLUXGATE-cyan/50 flex-shrink-0" />
          
          {/* Fuzzy logic node */}
          <div className="flex-shrink-0 px-2 py-1.5 bg-purple-500/10 border border-purple-500/30 rounded">
            <span className="text-purple-400">FUZZY</span>
          </div>
          
          <ChevronRight className="h-3 w-3 text-FLUXGATE-cyan/50 flex-shrink-0" />
          
          {/* Output action */}
          <div 
            className={cn(
              "flex-shrink-0 px-2 py-1.5 border rounded flex items-center gap-1.5 transition-colors duration-300",
              action === 'OPEN' && "bg-FLUXGATE-open/10 border-FLUXGATE-open/30",
              action === 'CLOSE' && "bg-FLUXGATE-hold/10 border-FLUXGATE-hold/30",
              action === 'HOLD' && "bg-FLUXGATE-wait/10 border-FLUXGATE-wait/30"
            )}
          >
            {getActionIcon(action, 'sm')}
            <span className={cn(
              "font-bold transition-colors duration-300",
              action === 'OPEN' && "text-FLUXGATE-open",
              action === 'CLOSE' && "text-FLUXGATE-hold",
              action === 'HOLD' && "text-FLUXGATE-wait"
            )}>
              {action}
            </span>
          </div>
        </div>
      </div>
    );
  };

  // Input values display with color-coding
  const InputsDisplay = ({ inputs }: { inputs: FuzzyLogicDecision['inputs'] }) => {
    const inputEntries = Object.entries(inputs).filter(([_, v]) => v !== undefined);
    
    return (
      <div className="grid grid-cols-3 gap-1.5">
        {inputEntries.map(([key, value]) => (
          <div 
            key={key}
            className={cn(
              "px-2 py-1.5 rounded border border-white/5 transition-colors duration-300",
              getInputBgColor(key, value as number | string)
            )}
          >
            <div className="text-[9px] font-mono text-muted-foreground uppercase">{formatInputLabel(key)}</div>
            <div className={cn("text-xs font-mono font-bold transition-colors duration-300", getInputValueColor(key, value as number | string))}>
              {formatInputValue(key, value as number | string)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Triggered rule display
  const TriggeredRuleDisplay = ({ decision }: { decision: FuzzyLogicDecision }) => {
    const rule = generateTriggeredRule(decision);
    
    return (
      <div 
        className="bg-gradient-to-r from-FLUXGATE-cyan/5 to-transparent border-l-2 border-FLUXGATE-cyan px-3 py-2 rounded-r"
      >
        <div className="flex items-center gap-1.5 mb-1">
          <Terminal className="h-3 w-3 text-FLUXGATE-cyan" />
          <span className="text-[9px] font-mono text-FLUXGATE-cyan uppercase tracking-wider">Triggered Rule</span>
        </div>
        <code className="text-xs font-mono text-foreground/90 block">
          <span className="text-purple-400">IF</span>{' '}
          <span className="text-amber-400">{rule.split('IF ')[1]?.split(' THEN ')[0]}</span>{' '}
          <span className="text-purple-400">THEN</span>{' '}
          <span className={cn(
            decision.action === 'OPEN' && "text-FLUXGATE-open",
            decision.action === 'CLOSE' && "text-FLUXGATE-hold",
            decision.action === 'HOLD' && "text-FLUXGATE-wait"
          )}>
            {rule.split('THEN ')[1]}
          </span>
        </code>
      </div>
    );
  };

  // History item component
  const HistoryItem = ({ decision, index }: { decision: FuzzyLogicDecision; index: number }) => (
    <div 
      className="flex items-center gap-2 px-2 py-1.5 bg-black/20 rounded border border-white/5 hover:border-FLUXGATE-cyan/20 transition-colors"
    >
      <Clock className="h-3 w-3 text-muted-foreground flex-shrink-0" />
      <span className="text-[10px] font-mono text-muted-foreground">{format(decision.timestamp, 'HH:mm:ss')}</span>
      <div className="flex items-center gap-1">
        {getStatusIcon(decision.action)}
        <span className={cn(
          "text-[10px] font-mono font-bold",
          decision.action === 'OPEN' && "text-FLUXGATE-open",
          decision.action === 'CLOSE' && "text-FLUXGATE-hold",
          decision.action === 'HOLD' && "text-FLUXGATE-wait"
        )}>
          {decision.action}
        </span>
      </div>
      <span className="text-[9px] text-muted-foreground truncate">{decision.gate}</span>
    </div>
  );

  return (
    <div className={cn("bg-black/40 border border-FLUXGATE-cyan/30 rounded-lg overflow-hidden backdrop-blur-sm shadow-[0_0_15px_rgba(0,255,255,0.05)]", className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-FLUXGATE-cyan/20 bg-FLUXGATE-cyan/5">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-FLUXGATE-cyan" />
          <div>
            <h3 className="text-sm font-bold text-FLUXGATE-cyan tracking-wider font-mono">FLUXGATE AI SENTINEL</h3>
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-FLUXGATE-open opacity-75" style={{ animationDuration: '2s' }}></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-FLUXGATE-open"></span>
              </span>
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest">System Active • Monitoring</p>
            </div>
          </div>
        </div>
        <Terminal className="h-4 w-4 text-FLUXGATE-cyan/50" />
      </div>

      <div className="p-0">
        {decisions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
            <Activity className="h-8 w-8 animate-pulse text-FLUXGATE-cyan/30" />
            <span className="text-sm font-mono tracking-widest text-FLUXGATE-cyan/50">INITIALIZING NEURAL NET...</span>
          </div>
        ) : (
          <div className="divide-y divide-border/20">
              {/* Latest Decision Main View */}
              {currentDecision && (
                <div className="p-4 bg-FLUXGATE-cyan/5 w-full space-y-4">
                  {/* Header with timestamp and event ID */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-FLUXGATE-cyan/70">
                        [{format(currentDecision.timestamp, 'HH:mm:ss')}]
                      </span>
                      <span className="text-xs font-mono text-muted-foreground">
                        LOGIC_EVENT_{currentDecision.id.split('-')[1]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getActionIcon(currentDecision.action, 'md')}
                      <span className={cn(
                        "text-sm font-bold font-mono",
                        currentDecision.action === 'OPEN' && "text-FLUXGATE-open",
                        currentDecision.action === 'CLOSE' && "text-FLUXGATE-hold",
                        currentDecision.action === 'HOLD' && "text-FLUXGATE-wait"
                      )}>
                        {currentDecision.action} GATE
                      </span>
                    </div>
                  </div>

                  {/* Decision Flowchart */}
                  <DecisionFlowchart decision={currentDecision} />

                  {/* Input Values with Color Coding */}
                  <div>
                    <div className="flex items-center gap-1.5 mb-2">
                      <Activity className="h-3.5 w-3.5 text-FLUXGATE-cyan/70" />
                      <span className="text-[10px] font-mono font-bold text-FLUXGATE-cyan/70 uppercase tracking-wider">Input Values</span>
                    </div>
                    <InputsDisplay inputs={currentDecision.inputs} />
                  </div>

                  {/* Triggered Rule */}
                  <TriggeredRuleDisplay decision={currentDecision} />

                  {/* Rules trace */}
                  <div className="space-y-2 pl-2 border-l-2 border-FLUXGATE-cyan/30 ml-1">
                    {currentDecision.rules.map((rule, idx) => (
                      <p 
                        key={idx} 
                        className="text-sm font-mono text-foreground/90 leading-relaxed"
                      >
                        <span className="text-FLUXGATE-cyan mr-2">›</span>
                        {rule}
                      </p>
                    ))}
                  </div>

                  {/* Confidence Meter */}
                  <div className="bg-background/50 p-3 rounded border border-border/50">
                    <ConfidenceMeter confidence={currentDecision.confidence} />
                  </div>
                </div>
              )}

              {/* Recent History (Last 3 Decisions) */}
              {recentHistory.length > 0 && (
                <div className="p-3 bg-black/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <History className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Recent Decisions</span>
                  </div>
                  <div className="space-y-1.5">
                    {recentHistory.map((decision, idx) => (
                      <HistoryItem key={decision.id} decision={decision} index={idx} />
                    ))}
                  </div>
                </div>
              )}

              {/* Extended History Log (Collapsed) */}
              {decisions.length > 4 && (
                <div className="max-h-32 overflow-y-auto scrollbar-thin bg-black/20">
                  {decisions.slice(4).map((decision) => (
                    <div key={decision.id} className="px-3 py-2 hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-FLUXGATE-cyan/30">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-muted-foreground">{format(decision.timestamp, 'HH:mm:ss')}</span>
                        {getStatusIcon(decision.action)}
                        <span className={cn(
                          "text-[10px] px-1.5 rounded-sm font-bold font-mono",
                          decision.action === 'OPEN' && "text-FLUXGATE-open bg-FLUXGATE-open/10",
                          decision.action === 'CLOSE' && "text-FLUXGATE-hold bg-FLUXGATE-hold/10",
                          decision.action === 'HOLD' && "text-FLUXGATE-wait bg-FLUXGATE-wait/10",
                        )}>{decision.action}</span>
                        <span className="text-xs text-muted-foreground truncate max-w-[180px] font-mono">
                          {decision.rules[0]}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
        )}
      </div>
    </div>
  );
};

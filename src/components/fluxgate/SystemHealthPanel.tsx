import { SystemHealth } from '@/types/fluxgate';
import { cn } from '@/lib/utils';
import { 
  Activity, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  RefreshCw,
  Clock,
  Signal,
  Server
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { useState, useMemo } from 'react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface SystemHealthPanelProps {
  health: SystemHealth;
  className?: string;
}

// Simulated uptime data (in a real app, this would come from the backend)
const SYSTEM_START_TIME = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000 - 3 * 60 * 60 * 1000 - 22 * 60 * 1000);

const formatUptime = (startTime: Date): string => {
  const now = Date.now();
  const diff = now - startTime.getTime();
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${days}d ${hours}h ${minutes}m`;
};

const getHealthPercentage = (status: 'ONLINE' | 'OFFLINE' | 'WARNING'): number => {
  switch (status) {
    case 'ONLINE': return 100;
    case 'WARNING': return 65;
    case 'OFFLINE': return 0;
  }
};

const getLatencyColor = (latency: number): string => {
  if (latency <= 50) return 'text-FLUXGATE-open';
  if (latency <= 150) return 'text-FLUXGATE-wait';
  return 'text-FLUXGATE-hold';
};

const getLatencyStatus = (latency: number): string => {
  if (latency <= 50) return 'Excellent';
  if (latency <= 150) return 'Good';
  if (latency <= 300) return 'Fair';
  return 'Poor';
};

// Simulated component details (in a real app, this would come from the backend)
const getComponentDetails = (name: string) => {
  const details: Record<string, { description: string; version: string; lastRestart: string; metrics: { label: string; value: string }[] }> = {
    'RFID Gateway': {
      description: 'Vehicle identification and tracking system',
      version: 'v2.4.1',
      lastRestart: '7 days ago',
      metrics: [
        { label: 'Reads/min', value: '142' },
        { label: 'Error rate', value: '0.02%' },
        { label: 'Queue depth', value: '3' }
      ]
    },
    'Display Network': {
      description: 'Digital signage and bay status displays',
      version: 'v1.8.3',
      lastRestart: '14 days ago',
      metrics: [
        { label: 'Active displays', value: '24/24' },
        { label: 'Refresh rate', value: '60Hz' },
        { label: 'Sync status', value: 'OK' }
      ]
    },
    'Gate Controller': {
      description: 'Automated gate and barrier management',
      version: 'v3.1.0',
      lastRestart: '3 days ago',
      metrics: [
        { label: 'Gates active', value: '4/4' },
        { label: 'Cycles today', value: '847' },
        { label: 'Response time', value: '0.8s' }
      ]
    },
    'Mobile Gateway': {
      description: 'Parent and staff mobile app connectivity',
      version: 'v2.0.5',
      lastRestart: '5 days ago',
      metrics: [
        { label: 'Active sessions', value: '312' },
        { label: 'API calls/min', value: '89' },
        { label: 'Push queue', value: '0' }
      ]
    },
    'Analytics Engine': {
      description: 'Real-time data processing and ML inference',
      version: 'v4.2.0',
      lastRestart: '14 days ago',
      metrics: [
        { label: 'Events/sec', value: '1,247' },
        { label: 'ML latency', value: '12ms' },
        { label: 'Buffer usage', value: '23%' }
      ]
    },
    'NOL Integration': {
      description: 'RTA NOL payment system integration',
      version: 'v1.5.2',
      lastRestart: '10 days ago',
      metrics: [
        { label: 'Transactions/hr', value: '156' },
        { label: 'Success rate', value: '99.8%' },
        { label: 'Pending', value: '2' }
      ]
    }
  };
  
  return details[name] || {
    description: 'System component',
    version: 'v1.0.0',
    lastRestart: 'Unknown',
    metrics: []
  };
};

export const SystemHealthPanel = ({ health, className }: SystemHealthPanelProps) => {
  const [expandedComponents, setExpandedComponents] = useState<Set<string>>(new Set());
  const [isRunningDiagnostics, setIsRunningDiagnostics] = useState(false);
  const [lastDiagnosticRun, setLastDiagnosticRun] = useState<Date | null>(null);

  const overallConfig = {
    OPTIMAL: {
      color: 'text-FLUXGATE-open',
      bg: 'bg-FLUXGATE-open/20',
      borderColor: 'border-FLUXGATE-open/30',
      icon: Activity,
    },
    DEGRADED: {
      color: 'text-FLUXGATE-wait',
      bg: 'bg-FLUXGATE-wait/20',
      borderColor: 'border-FLUXGATE-wait/30',
      icon: AlertCircle,
    },
    CRITICAL: {
      color: 'text-FLUXGATE-hold',
      bg: 'bg-FLUXGATE-hold/20',
      borderColor: 'border-FLUXGATE-hold/30',
      icon: WifiOff,
    },
  }[health.overall];

  const OverallIcon = overallConfig.icon;

  // Calculate average network latency
  const networkStats = useMemo(() => {
    const componentsWithLatency = health.components.filter(c => c.latency !== undefined);
    if (componentsWithLatency.length === 0) return { avgLatency: 0, maxLatency: 0, minLatency: 0 };
    
    const latencies = componentsWithLatency.map(c => c.latency!);
    return {
      avgLatency: Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length),
      maxLatency: Math.max(...latencies),
      minLatency: Math.min(...latencies)
    };
  }, [health.components]);

  // Calculate uptime percentage (simulated based on overall status)
  const uptimePercentage = health.overall === 'OPTIMAL' ? 99.9 : health.overall === 'DEGRADED' ? 98.5 : 95.0;

  const toggleComponent = (name: string) => {
    setExpandedComponents(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  const handleRunDiagnostics = () => {
    setIsRunningDiagnostics(true);
    // Simulate diagnostic run
    setTimeout(() => {
      setIsRunningDiagnostics(false);
      setLastDiagnosticRun(new Date());
    }, 2000);
  };

  const StatusIcon = ({ status }: { status: 'ONLINE' | 'OFFLINE' | 'WARNING' }) => {
    switch (status) {
      case 'ONLINE':
        return <CheckCircle2 className="h-4 w-4 text-FLUXGATE-open" />;
      case 'WARNING':
        return <AlertTriangle className="h-4 w-4 text-FLUXGATE-wait" />;
      case 'OFFLINE':
        return <XCircle className="h-4 w-4 text-FLUXGATE-hold" />;
    }
  };

  return (
    <div className={className}>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">System Health</h3>
            <p className="text-xs text-muted-foreground">
              Last check: {format(health.lastUpdate, 'HH:mm:ss')} ({formatDistanceToNow(health.lastUpdate, { addSuffix: true })})
            </p>
          </div>
        </div>
        <div className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-full',
          overallConfig.bg
        )}>
          <OverallIcon className={cn('h-4 w-4', overallConfig.color)} />
          <span className={cn('text-sm font-semibold', overallConfig.color)}>
            {health.overall}
          </span>
        </div>
      </div>

      {/* Uptime & Network Status Bar */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        {/* Uptime Display */}
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Uptime</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-FLUXGATE-open">{uptimePercentage}%</span>
            <span className="text-xs text-muted-foreground">{formatUptime(SYSTEM_START_TIME)}</span>
          </div>
          <Progress 
            value={uptimePercentage} 
            className="h-1.5 mt-2 bg-secondary"
          />
        </div>

        {/* Network Latency */}
        <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
          <div className="flex items-center gap-2 mb-2">
            <Signal className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Network Latency</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className={cn("text-lg font-bold", getLatencyColor(networkStats.avgLatency))}>
              {networkStats.avgLatency}ms
            </span>
            <span className="text-xs text-muted-foreground">
              {getLatencyStatus(networkStats.avgLatency)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
            <Wifi className="h-3 w-3 text-FLUXGATE-open" />
            <span>Connected</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Min: {networkStats.minLatency}ms</span>
            <span className="text-muted-foreground/50">•</span>
            <span>Max: {networkStats.maxLatency}ms</span>
          </div>
        </div>
      </div>

      {/* Component List with Expandable Details */}
      <div className="space-y-2 mb-4">
        {health.components.map(component => {
          const statusConfig = {
            ONLINE: { color: 'text-FLUXGATE-open', bg: 'bg-FLUXGATE-open', progressColor: 'bg-FLUXGATE-open' },
            OFFLINE: { color: 'text-FLUXGATE-hold', bg: 'bg-FLUXGATE-hold', progressColor: 'bg-FLUXGATE-hold' },
            WARNING: { color: 'text-FLUXGATE-wait', bg: 'bg-FLUXGATE-wait', progressColor: 'bg-FLUXGATE-wait' },
          }[component.status];

          const isExpanded = expandedComponents.has(component.name);
          const details = getComponentDetails(component.name);
          const healthPercent = getHealthPercentage(component.status);

          return (
            <Collapsible
              key={component.name}
              open={isExpanded}
              onOpenChange={() => toggleComponent(component.name)}
            >
              <div className="rounded-lg bg-secondary/30 border border-border/50 overflow-hidden">
                <CollapsibleTrigger className="w-full">
                  <div className="flex items-center gap-3 p-3 hover:bg-secondary/50 transition-colors cursor-pointer">
                    {/* Expand/Collapse Icon */}
                    {isExpanded ? (
                      <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    )}
                    
                    {/* Status Icon */}
                    <StatusIcon status={component.status} />
                    
                    {/* Component Name */}
                    <div className="flex-1 min-w-0 text-left">
                      <span className="text-sm text-foreground font-medium truncate block">
                        {component.name}
                      </span>
                    </div>
                    
                    {/* Health Gauge */}
                    <div className="w-20 flex-shrink-0">
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className={cn("h-full transition-all duration-500", statusConfig.progressColor)}
                          style={{ width: `${healthPercent}%` }}
                        />
                      </div>
                    </div>
                    
                    {/* Latency Badge */}
                    {component.latency !== undefined && (
                      <span className={cn(
                        "text-xs font-mono px-2 py-0.5 rounded-full bg-secondary",
                        getLatencyColor(component.latency)
                      )}>
                        {component.latency}ms
                      </span>
                    )}
                  </div>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <div className="px-3 pb-3 pt-1 border-t border-border/30">
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      {/* Left Column - Info */}
                      <div className="space-y-2">
                        <p className="text-muted-foreground">{details.description}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-muted-foreground">
                            <Server className="h-3 w-3 inline mr-1" />
                            {details.version}
                          </span>
                          <span className="text-muted-foreground">
                            <RefreshCw className="h-3 w-3 inline mr-1" />
                            Restart: {details.lastRestart}
                          </span>
                        </div>
                      </div>
                      
                      {/* Right Column - Metrics */}
                      <div className="flex flex-wrap gap-x-4 gap-y-1 justify-end">
                        {details.metrics.map((metric, idx) => (
                          <div key={idx} className="text-right">
                            <span className="text-muted-foreground">{metric.label}: </span>
                            <span className="font-medium text-foreground">{metric.value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          );
        })}
      </div>

      {/* Run Diagnostics Button */}
      <div className="flex items-center justify-between pt-3 border-t border-border/50">
        <div className="text-xs text-muted-foreground">
          {lastDiagnosticRun ? (
            <span>Last diagnostic: {format(lastDiagnosticRun, 'HH:mm:ss')}</span>
          ) : (
            <span>No diagnostics run this session</span>
          )}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRunDiagnostics}
          disabled={isRunningDiagnostics}
          className="gap-2"
        >
          <RefreshCw className={cn("h-4 w-4", isRunningDiagnostics && "animate-spin")} />
          {isRunningDiagnostics ? 'Running...' : 'Run Diagnostics'}
        </Button>
      </div>
    </div>
  );
};

import { useNexusSimulation } from '@/hooks/useNexusSimulation';
import { CommandHeader } from '@/components/nexus/CommandHeader';
import { QuickActions } from '@/components/nexus/QuickActions';
import { StatCard } from '@/components/nexus/StatCard';
import { LiveWaveGraph } from '@/components/nexus/LiveWaveGraph';
import { DigitalTwinMap } from '@/components/nexus/DigitalTwinMap';
import { ZoneOverview } from '@/components/nexus/ZoneOverview';
import { FuzzyLogicTrace } from '@/components/nexus/FuzzyLogicTrace';
import { NOLRewardTicker } from '@/components/nexus/NOLRewardTicker';
import { SurgeAlertBanner } from '@/components/nexus/SurgeAlertBanner';
import { SystemHealthPanel } from '@/components/nexus/SystemHealthPanel';
import { ProtocolIndicator } from '@/components/nexus/ProtocolIndicator';
import { 
  Car, Users, Clock, TrendingUp, AlertTriangle, CheckCircle 
} from 'lucide-react';
import { useMemo } from 'react';

const Index = () => {
  const {
    zones,
    vehicles,
    trafficHistory,
    fuzzyDecisions,
    nolRewards,
    activeSurge,
    systemHealth,
    triggerSurge,
    triggerStalledVehicle,
    mode,
    toggleSimulationMode,
  } = useNexusSimulation();

  // Calculate stats
  const stats = useMemo(() => {
    const allBays = zones.flatMap(z => z.bays);
    const occupiedBays = allBays.filter(b => b.status === 'OCCUPIED');
    const blockedBays = allBays.filter(b => b.status === 'BLOCKED');
    const avgDwell = occupiedBays.length > 0
      ? occupiedBays.reduce((sum, b) => sum + b.dwellTime, 0) / occupiedBays.length
      : 0;
    const latestMetrics = trafficHistory[trafficHistory.length - 1];
    
    return {
      totalBays: allBays.length,
      occupiedBays: occupiedBays.length,
      blockedBays: blockedBays.length,
      avgDwell,
      throughput: latestMetrics?.throughput ?? 0,
      queueLength: zones.reduce((sum, z) => sum + z.queueLength, 0) / zones.length,
      perfectDropoffs: nolRewards.filter(r => r.dropOffTime <= 45).length,
    };
  }, [zones, trafficHistory, nolRewards]);

  return (
    <div className="min-h-screen bg-background p-4 space-y-4">
      {/* Header */}
      <CommandHeader />

      {/* Quick Actions */}
      <div className="flex items-center justify-between">
        <QuickActions 
          onTriggerSurge={triggerSurge}
          onTriggerStalled={triggerStalledVehicle}
          onToggleMode={toggleSimulationMode}
          currentMode={mode}
        />
        <div className="text-xs text-muted-foreground">
          TFOE Engine Active • Cyber-Physical Sync Enabled • {mode} Protocol
        </div>
      </div>

      {/* Protocol Legend */}
      <ProtocolIndicator mode={mode} />

      {/* Surge Alert */}
      {activeSurge && (
        <SurgeAlertBanner surge={activeSurge} />
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-6 gap-3">
        <StatCard
          title="Active Bays"
          value={`${stats.occupiedBays}/${stats.totalBays}`}
          subtitle="Currently occupied"
          icon={Car}
          variant="default"
        />
        <StatCard
          title="Vehicles Tracked"
          value={vehicles.length}
          subtitle="YOLO v8 detection"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Avg Dwell Time"
          value={`${stats.avgDwell.toFixed(0)}s`}
          subtitle="Golden minute target: 60s"
          icon={Clock}
          variant={stats.avgDwell > 50 ? 'warning' : 'success'}
        />
        <StatCard
          title="Throughput"
          value={`${stats.throughput.toFixed(1)}/m`}
          subtitle="Vehicles processed"
          icon={TrendingUp}
          variant="success"
        />
        <StatCard
          title="Blocked Bays"
          value={stats.blockedBays}
          subtitle="Requiring attention"
          icon={AlertTriangle}
          variant={stats.blockedBays > 0 ? 'danger' : 'default'}
        />
        <StatCard
          title="Perfect Dropoffs"
          value={stats.perfectDropoffs}
          subtitle="<45s completion"
          icon={CheckCircle}
          variant="success"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-4">
        {/* Left Column - Digital Twin & Wave Graph */}
        <div className="col-span-8 space-y-4">
          <div className="glass-panel p-4">
            <DigitalTwinMap zones={zones} vehicles={vehicles} />
          </div>
          
          <div className="glass-panel p-4">
            <LiveWaveGraph data={trafficHistory} />
          </div>
        </div>

        {/* Right Column - Controls & Monitoring */}
        <div className="col-span-4 space-y-4">
          <div className="glass-panel p-4">
            <SystemHealthPanel health={systemHealth} />
          </div>

          <div className="glass-panel p-4">
            <FuzzyLogicTrace decisions={fuzzyDecisions} />
          </div>

          <div className="glass-panel p-4">
            <NOLRewardTicker rewards={nolRewards} />
          </div>
        </div>
      </div>

      {/* Zone Overview */}
      <div className="glass-panel p-4">
        <ZoneOverview zones={zones} />
      </div>

      {/* Footer */}
      <footer className="text-center py-4">
        <p className="text-xs text-muted-foreground">
          RTA NEXUS Command Center • Dubai Roads & Transport Authority • 
          <span className="text-primary ml-1">Cyber-Physical Sync v2.4</span>
        </p>
      </footer>
    </div>
  );
};

export default Index;

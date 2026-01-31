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
import { MasterSystemSwitch } from '@/components/nexus/MasterSystemSwitch';
import { CongestionControlPanel } from '@/components/nexus/CongestionControlPanel';
import { 
  Car, Users, Clock, TrendingUp, AlertTriangle, CheckCircle,
  Scan, Camera, Brain, Timer, Shield, Gauge, Zap, Star
} from 'lucide-react';
import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  staggerContainerVariants, 
  cardVariants, 
  slideUpVariants,
  slideRightVariants,
  alertVariants 
} from '@/lib/animations';

const Index = () => {
  const {
    isRunning,
    toggleSystem,
    zones,
    vehicles,
    trafficHistory,
    fuzzyDecisions,
    nolRewards,
    activeSurge,
    systemHealth,
    extendedMetrics,
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
    <motion.div 
      className="min-h-screen bg-background p-2 sm:p-4 space-y-3 sm:space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Skip to main content link for keyboard users */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
      >
        Skip to main content
      </a>

      {/* Header */}
      <motion.div variants={slideUpVariants} initial="hidden" animate="visible">
        <CommandHeader />
      </motion.div>

      {/* Quick Actions with Master Switch */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full lg:w-auto">
          <MasterSystemSwitch isRunning={isRunning} onToggle={toggleSystem} />
          <QuickActions 
            onTriggerSurge={triggerSurge}
            onTriggerStalled={triggerStalledVehicle}
            onToggleMode={toggleSimulationMode}
            currentMode={mode}
          />
        </div>
        <div className="text-xs text-muted-foreground hidden md:block">
          TFOE Engine {isRunning ? 'Active' : 'Paused'} • Cyber-Physical Sync {isRunning ? 'Enabled' : 'Standby'} • {mode} Protocol
        </div>
      </div>

      {/* Protocol Legend */}
      <ProtocolIndicator mode={mode} />

      {/* Surge Alert */}
      <AnimatePresence mode="wait">
        {activeSurge && (
          <motion.div
            key="surge-alert"
            variants={alertVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            <SurgeAlertBanner surge={activeSurge} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stats Row */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3"
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={cardVariants}>
          <StatCard
            title="Active Bays"
            value={`${stats.occupiedBays}/${stats.totalBays}`}
            subtitle="Currently occupied"
            icon={Car}
            variant="default"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="Vehicles Tracked"
            value={vehicles.length}
            subtitle="YOLO v8 detection"
            icon={Users}
            variant="default"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="Avg Dwell Time"
            value={`${stats.avgDwell.toFixed(0)}s`}
            subtitle="Golden minute target: 60s"
            icon={Clock}
            variant={stats.avgDwell > 50 ? 'warning' : 'success'}
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="Throughput"
            value={`${stats.throughput.toFixed(1)}/m`}
            subtitle="Vehicles processed"
            icon={TrendingUp}
            variant="success"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="Blocked Bays"
            value={stats.blockedBays}
            subtitle="Requiring attention"
            icon={AlertTriangle}
            variant={stats.blockedBays > 0 ? 'danger' : 'default'}
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="Perfect Dropoffs"
            value={stats.perfectDropoffs}
            subtitle="<45s completion"
            icon={CheckCircle}
            variant="success"
          />
        </motion.div>
      </motion.div>

      {/* Extended Metrics Row - AI & System Intelligence */}
      <motion.div 
        className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2 sm:gap-3"
        variants={staggerContainerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={cardVariants}>
          <StatCard
            title="RFID Scan Rate"
            value={`${extendedMetrics.rfidScanRate.toFixed(0)}/min`}
            subtitle="Tag reads"
            icon={Scan}
            variant="default"
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="LPR Accuracy"
            value={`${extendedMetrics.lprConfidence.toFixed(1)}%`}
            subtitle="Plate recognition"
            icon={Camera}
            variant={extendedMetrics.lprConfidence > 92 ? 'success' : 'warning'}
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="VQS Prediction"
            value={`${extendedMetrics.predictedArrivalAccuracy.toFixed(0)}%`}
            subtitle="Arrival forecast"
            icon={Brain}
            variant={extendedMetrics.predictedArrivalAccuracy > 85 ? 'success' : 'default'}
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="Queue Wait"
            value={`${extendedMetrics.avgWaitTimeQueue.toFixed(0)}s`}
            subtitle="Average time"
            icon={Timer}
            variant={extendedMetrics.avgWaitTimeQueue < 60 ? 'success' : 'warning'}
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="Safety Score"
            value={`${extendedMetrics.safetyScore.toFixed(0)}`}
            subtitle="Zone safety index"
            icon={Shield}
            variant={extendedMetrics.safetyScore > 95 ? 'success' : 'warning'}
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="Compliance"
            value={`${extendedMetrics.complianceRate.toFixed(0)}%`}
            subtitle="Protocol adherence"
            icon={CheckCircle}
            variant={extendedMetrics.complianceRate > 90 ? 'success' : 'warning'}
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="Load Factor"
            value={`${(extendedMetrics.peakLoadFactor * 100).toFixed(0)}%`}
            subtitle="Capacity utilization"
            icon={Gauge}
            variant={extendedMetrics.peakLoadFactor < 0.8 ? 'success' : 'danger'}
          />
        </motion.div>
        <motion.div variants={cardVariants}>
          <StatCard
            title="AI Decisions"
            value={`${extendedMetrics.aiDecisionsPerMin.toFixed(0)}/min`}
            subtitle="Fuzzy logic rate"
            icon={Zap}
            variant="default"
          />
        </motion.div>
      </motion.div>

      {/* Parent Satisfaction Card */}
      <motion.div 
        className="glass-panel p-3 sm:p-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
              <Star className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Parent Satisfaction Index</h3>
              <p className="text-xs text-muted-foreground">Real-time feedback aggregation</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star} 
                  className={`h-5 w-5 ${star <= Math.round(extendedMetrics.parentSatisfactionIndex) ? 'text-yellow-400 fill-yellow-400' : 'text-slate-600'}`} 
                />
              ))}
            </div>
            <span className="text-2xl font-bold text-foreground">{extendedMetrics.parentSatisfactionIndex.toFixed(1)}</span>
            <span className="text-sm text-muted-foreground">/5.0</span>
          </div>
        </div>
      </motion.div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4">
        {/* Left Column - Digital Twin & Wave Graph */}
        <motion.div 
          className="col-span-1 lg:col-span-8 space-y-3 sm:space-y-4"
          variants={slideUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <motion.div 
            className="glass-panel p-2 sm:p-4 overflow-x-auto scrollbar-thin"
            whileHover={{ scale: 1.005 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <div className="min-w-[600px] lg:min-w-0">
              <DigitalTwinMap zones={zones} vehicles={vehicles} />
            </div>
          </motion.div>
          
          <motion.div 
            className="glass-panel p-2 sm:p-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <LiveWaveGraph data={trafficHistory} />
          </motion.div>

          {/* Congestion Control Panel - The "Gap" Filler */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
          >
            <CongestionControlPanel 
              currentMetrics={trafficHistory[trafficHistory.length - 1]} 
              mode={mode} 
            />
          </motion.div>
        </motion.div>

        {/* Right Column - Controls & Monitoring */}
        <motion.div 
          className="col-span-1 lg:col-span-4 space-y-3 sm:space-y-4"
          variants={slideRightVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <motion.div 
            className="glass-panel p-2 sm:p-4"
            whileHover={{ scale: 1.01 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <SystemHealthPanel health={systemHealth} />
          </motion.div>

          <motion.div 
            className="glass-panel p-2 sm:p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <FuzzyLogicTrace decisions={fuzzyDecisions} />
          </motion.div>

          <motion.div 
            className="glass-panel p-2 sm:p-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <NOLRewardTicker rewards={nolRewards} />
          </motion.div>
        </motion.div>
      </div>

      {/* Zone Overview */}
      <main id="main-content" className="glass-panel p-2 sm:p-4" role="main" aria-label="Zone control and bay monitoring">
        <ZoneOverview zones={zones} />
      </main>

      {/* Footer */}
      <motion.footer 
        className="text-center py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <p className="text-xs text-muted-foreground">
          RTA NEXUS Command Center • Dubai Roads & Transport Authority • 
          <span className="text-primary ml-1">Cyber-Physical Sync v2.4</span>
        </p>
      </motion.footer>
    </motion.div>
  );
};

export default Index;

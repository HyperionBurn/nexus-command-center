import { SchoolHeader } from "@/components/school/SchoolHeader";
import { StudentQueues } from "@/components/school/StudentQueues";
import { BusCoordination } from "@/components/school/BusCoordination";
import { GateControlWidget } from "@/components/school/GateControlWidget";
import { TodaySummary } from "@/components/school/TodaySummary";
import { RecentActivity } from "@/components/school/RecentActivity";
import { ZoneOverview } from "@/components/nexus/ZoneOverview";
import { DigitalTwinMap } from "@/components/nexus/DigitalTwinMap";
import { useNexusSimulation } from "@/hooks/useNexusSimulation";

const SchoolAdmin = () => {
    // Reuse the simulation hooks for the map data, even if simplified
    const { zones, vehicles } = useNexusSimulation();

    return (
        <div className="min-h-screen bg-background">
            {/* Full-width header */}
            <div className="p-6 pb-0">
                <SchoolHeader />
            </div>

            {/* Main content with proper spacing */}
            <div className="p-6 space-y-6">
                {/* Today's Summary - Full width at top */}
                <TodaySummary />

                {/* Main Grid Layout */}
                <div className="grid grid-cols-12 gap-6">
                    {/* Left Column: Operations & Status (4 cols on lg) */}
                    <div className="col-span-12 lg:col-span-4 space-y-6">
                        {/* Critical Actions - Gate Control */}
                        <GateControlWidget />
                        
                        {/* Student Status */}
                        <StudentQueues />

                        {/* Bus Status */}
                        <BusCoordination />
                    </div>

                    {/* Center/Right Column: Live Map, Zones & Activity (8 cols on lg) */}
                    <div className="col-span-12 lg:col-span-8 space-y-6">
                        {/* Live View */}
                        <div className="glass-panel p-1 rounded-xl overflow-hidden h-[400px] border border-border/50 relative">
                            <DigitalTwinMap zones={zones} vehicles={vehicles} />
                            <div className="absolute top-4 right-4 bg-background/80 backdrop-blur p-2 rounded text-xs font-mono border border-border/50">
                                LIVE FEED: CAM-01 [Main Gate]
                            </div>
                        </div>

                        {/* Two-column layout for Zone Overview and Recent Activity */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                            {/* Zone Status */}
                            <div className="w-full">
                                <ZoneOverview zones={zones} />
                            </div>

                            {/* Recent Activity Feed */}
                            <div className="w-full">
                                <RecentActivity />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SchoolAdmin;
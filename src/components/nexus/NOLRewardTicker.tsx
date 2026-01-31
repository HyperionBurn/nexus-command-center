import { NOLReward } from '@/types/nexus';
import { cn } from '@/lib/utils';
import { Coins, Star, Zap } from 'lucide-react';
import { format } from 'date-fns';

interface NOLRewardTickerProps {
  rewards: NOLReward[];
  className?: string;
}

export const NOLRewardTicker = ({ rewards, className }: NOLRewardTickerProps) => {
  const totalCredits = rewards.reduce((sum, r) => sum + r.credits, 0);
  const perfectDropoffs = rewards.filter(r => r.dropOffTime <= 45).length;

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-nexus-wait" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">NOL Rewards</h3>
            <p className="text-xs text-muted-foreground">Live credit distribution</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-xs text-muted-foreground block">Total</span>
            <span className="font-mono text-lg font-bold text-nexus-wait text-glow-amber">
              {totalCredits}
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs text-muted-foreground block">Perfect</span>
            <span className="font-mono text-lg font-bold text-nexus-open text-glow-green">
              {perfectDropoffs}
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-thin pr-2">
        {rewards.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            No rewards yet today...
          </div>
        ) : (
          rewards.slice(0, 10).map((reward, index) => (
            <div
              key={reward.id}
              className={cn(
                'flex items-center gap-3 p-2 rounded bg-secondary/30 border border-border/50 transition-all',
                index === 0 && 'animate-slide-in-right border-nexus-wait/30'
              )}
            >
              <div className={cn(
                'flex items-center justify-center w-8 h-8 rounded-full',
                reward.credits >= 5 ? 'bg-nexus-open/20' : 'bg-nexus-cyan/20'
              )}>
                {reward.credits >= 5 ? (
                  <Star className="h-4 w-4 text-nexus-open" />
                ) : (
                  <Zap className="h-4 w-4 text-nexus-cyan" />
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-sm text-foreground truncate">
                    {reward.parentName}
                  </span>
                  <span className={cn(
                    'px-1.5 py-0.5 rounded text-xs font-mono',
                    reward.credits >= 5 
                      ? 'bg-nexus-open/20 text-nexus-open' 
                      : 'bg-nexus-cyan/20 text-nexus-cyan'
                  )}>
                    +{reward.credits}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{reward.reason}</span>
                  <span>•</span>
                  <span>{reward.dropOffTime}s</span>
                </div>
              </div>

              <span className="text-xs text-muted-foreground">
                {format(reward.timestamp, 'HH:mm')}
              </span>
            </div>
          ))
        )}
      </div>

      {/* Summary bar */}
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-nexus-wait/10 to-nexus-open/10 border border-nexus-wait/20">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Today's efficiency bonus pool</span>
          <span className="font-mono font-bold text-foreground">
            AED {(totalCredits * 0.5).toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
};

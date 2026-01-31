import { NOLReward } from '@/types/fluxgate';
import { cn } from '@/lib/utils';
import { Coins, Star, Zap, Clock, Flame, CreditCard, Trophy, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { useEffect, useRef, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NOLRewardTickerProps {
  rewards: NOLReward[];
  className?: string;
}

// Reward type classification based on reason
type RewardType = 'on-time' | 'perfect-dropoff' | 'streak-bonus' | 'standard';

const getRewardType = (reason: string, credits: number): RewardType => {
  const lowerReason = reason.toLowerCase();
  if (lowerReason.includes('streak') || lowerReason.includes('consecutive')) return 'streak-bonus';
  if (lowerReason.includes('perfect') || credits >= 10) return 'perfect-dropoff';
  if (lowerReason.includes('on-time') || lowerReason.includes('early') || lowerReason.includes('quick')) return 'on-time';
  return 'standard';
};

const rewardTypeConfig: Record<RewardType, { 
  icon: typeof Star; 
  bgColor: string; 
  textColor: string; 
  borderColor: string;
  label: string;
}> = {
  'streak-bonus': {
    icon: Flame,
    bgColor: 'bg-orange-500/20',
    textColor: 'text-orange-400',
    borderColor: 'border-orange-500/40',
    label: 'Streak'
  },
  'perfect-dropoff': {
    icon: Trophy,
    bgColor: 'bg-FLUXGATE-open/20',
    textColor: 'text-FLUXGATE-open',
    borderColor: 'border-FLUXGATE-open/40',
    label: 'Perfect'
  },
  'on-time': {
    icon: Clock,
    bgColor: 'bg-FLUXGATE-cyan/20',
    textColor: 'text-FLUXGATE-cyan',
    borderColor: 'border-FLUXGATE-cyan/40',
    label: 'On-Time'
  },
  'standard': {
    icon: Zap,
    bgColor: 'bg-secondary/40',
    textColor: 'text-muted-foreground',
    borderColor: 'border-border/50',
    label: 'Reward'
  }
};

// Confetti particle component
const ConfettiParticle = ({ delay, color }: { delay: number; color: string }) => (
  <motion.div
    className={cn('absolute w-2 h-2 rounded-full', color)}
    initial={{ 
      opacity: 1, 
      scale: 0,
      x: 0,
      y: 0,
    }}
    animate={{ 
      opacity: [1, 1, 0],
      scale: [0, 1, 0.5],
      x: (Math.random() - 0.5) * 100,
      y: (Math.random() - 0.5) * 60 - 20,
      rotate: Math.random() * 360
    }}
    transition={{ 
      duration: 0.8, 
      delay,
      ease: 'easeOut'
    }}
  />
);

// Confetti celebration effect
const ConfettiCelebration = () => {
  const colors = [
    'bg-yellow-400', 'bg-green-400', 'bg-cyan-400', 
    'bg-pink-400', 'bg-purple-400', 'bg-orange-400'
  ];
  
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center">
      {Array.from({ length: 20 }).map((_, i) => (
        <ConfettiParticle 
          key={i} 
          delay={i * 0.02} 
          color={colors[i % colors.length]} 
        />
      ))}
    </div>
  );
};

// NOL Card Badge component
const NOLCardBadge = ({ className }: { className?: string }) => (
  <div className={cn(
    'flex items-center gap-1 px-2 py-1 rounded-md bg-gradient-to-r from-FLUXGATE-wait/30 to-amber-500/30 border border-FLUXGATE-wait/40',
    className
  )}>
    <CreditCard className="h-3.5 w-3.5 text-FLUXGATE-wait" />
    <span className="text-xs font-bold text-FLUXGATE-wait">NOL</span>
  </div>
);

export const NOLRewardTicker = ({ rewards, className }: NOLRewardTickerProps) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [celebratingRewardId, setCelebratingRewardId] = useState<string | null>(null);
  
  // Limit to last 10 rewards
  const displayedRewards = useMemo(() => rewards.slice(0, 10), [rewards]);
  
  // Calculate totals
  const totalCredits = rewards.reduce((sum, r) => sum + r.credits, 0);
  const perfectDropoffs = rewards.filter(r => r.dropOffTime <= 45).length;
  
  // Reward type counts for stats
  const rewardTypeCounts = useMemo(() => {
    return displayedRewards.reduce((acc, r) => {
      const type = getRewardType(r.reason, r.credits);
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<RewardType, number>);
  }, [displayedRewards]);

  // Check for large reward celebration
  useEffect(() => {
    if (rewards.length > 0 && rewards[0].credits >= 100) {
      setCelebratingRewardId(rewards[0].id);
      const timer = setTimeout(() => setCelebratingRewardId(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [rewards]);

  // Auto-scroll smoothly when new rewards come in
  useEffect(() => {
    if (scrollContainerRef.current && rewards.length > 0) {
      scrollContainerRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    }
  }, [rewards.length]);

  return (
    <div className={className}>
      {/* Running Total Banner */}
      <div className="mb-4 p-3 rounded-lg bg-gradient-to-r from-FLUXGATE-wait/20 via-amber-500/10 to-FLUXGATE-open/20 border border-FLUXGATE-wait/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-FLUXGATE-wait/5 to-transparent" />
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-FLUXGATE-wait/20 border border-FLUXGATE-wait/30">
              <Coins className="h-5 w-5 text-FLUXGATE-wait" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">Today's Points</h3>
                <NOLCardBadge />
              </div>
              <p className="text-xs text-muted-foreground">Live credit distribution</p>
            </div>
          </div>
          <div className="text-right">
            <motion.div 
              key={totalCredits}
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-mono text-2xl font-bold text-FLUXGATE-wait text-glow-amber"
            >
              {totalCredits.toLocaleString()}
            </motion.div>
            <span className="text-xs text-muted-foreground">credits earned</span>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded bg-FLUXGATE-open/10 border border-FLUXGATE-open/20">
          <Trophy className="h-3.5 w-3.5 text-FLUXGATE-open" />
          <span className="text-xs text-muted-foreground">Perfect:</span>
          <span className="font-mono text-sm font-bold text-FLUXGATE-open">{perfectDropoffs}</span>
        </div>
        <div className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded bg-orange-500/10 border border-orange-500/20">
          <Flame className="h-3.5 w-3.5 text-orange-400" />
          <span className="text-xs text-muted-foreground">Streaks:</span>
          <span className="font-mono text-sm font-bold text-orange-400">{rewardTypeCounts['streak-bonus'] || 0}</span>
        </div>
        <div className="flex-1 flex items-center gap-2 px-2 py-1.5 rounded bg-FLUXGATE-cyan/10 border border-FLUXGATE-cyan/20">
          <Clock className="h-3.5 w-3.5 text-FLUXGATE-cyan" />
          <span className="text-xs text-muted-foreground">On-Time:</span>
          <span className="font-mono text-sm font-bold text-FLUXGATE-cyan">{rewardTypeCounts['on-time'] || 0}</span>
        </div>
      </div>

      {/* Rewards List with smooth auto-scroll */}
      <div 
        ref={scrollContainerRef}
        className="space-y-2 max-h-52 overflow-y-auto scrollbar-thin pr-2 scroll-smooth"
      >
        {displayedRewards.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground text-sm">
            <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-30" />
            No rewards yet today...
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {displayedRewards.map((reward, index) => {
              const rewardType = getRewardType(reward.reason, reward.credits);
              const config = rewardTypeConfig[rewardType];
              const IconComponent = config.icon;
              const isLargeReward = reward.credits >= 100;
              const isCelebrating = celebratingRewardId === reward.id;
              
              return (
                <motion.div
                  key={reward.id}
                  initial={{ opacity: 0, x: 50, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    x: 0, 
                    scale: 1,
                    ...(isLargeReward && index === 0 ? {
                      boxShadow: ['0 0 0 rgba(234,179,8,0)', '0 0 20px rgba(234,179,8,0.4)', '0 0 0 rgba(234,179,8,0)']
                    } : {})
                  }}
                  exit={{ opacity: 0, x: -20, scale: 0.9 }}
                  transition={{ 
                    type: 'spring', 
                    stiffness: 300, 
                    damping: 25,
                    delay: index * 0.03
                  }}
                  className={cn(
                    'relative flex items-center gap-3 p-2.5 rounded-lg bg-secondary/30 border transition-all',
                    config.borderColor,
                    index === 0 && 'ring-1 ring-FLUXGATE-wait/20',
                    isLargeReward && 'bg-gradient-to-r from-amber-500/10 to-yellow-500/5'
                  )}
                >
                  {/* Celebration confetti for large rewards */}
                  {isCelebrating && <ConfettiCelebration />}
                  
                  {/* Reward Type Icon Badge */}
                  <div className={cn(
                    'flex items-center justify-center w-9 h-9 rounded-lg relative',
                    config.bgColor
                  )}>
                    <IconComponent className={cn('h-4 w-4', config.textColor)} />
                    {isLargeReward && (
                      <motion.div
                        animate={{ scale: [1, 1.3, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute -top-1 -right-1"
                      >
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      </motion.div>
                    )}
                  </div>
                  
                  {/* Reward Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-foreground truncate max-w-[120px]">
                        {reward.parentName}
                      </span>
                      <span className={cn(
                        'px-1.5 py-0.5 rounded text-xs font-mono font-bold',
                        config.bgColor, config.textColor
                      )}>
                        +{reward.credits}
                      </span>
                      <span className={cn(
                        'px-1.5 py-0.5 rounded text-[10px] uppercase tracking-wide',
                        config.bgColor, config.textColor
                      )}>
                        {config.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="truncate max-w-[140px]">{reward.reason}</span>
                      <span className="text-border">•</span>
                      <span className="flex-shrink-0">{reward.dropOffTime}s</span>
                    </div>
                  </div>

                  {/* Timestamp */}
                  <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                    <span className="text-xs font-mono text-muted-foreground">
                      {format(reward.timestamp, 'HH:mm')}
                    </span>
                    <span className="text-[10px] text-muted-foreground/60">
                      {format(reward.timestamp, 'ss')}s
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>

      {/* Rewards count indicator */}
      {rewards.length > 10 && (
        <div className="mt-2 text-center">
          <span className="text-xs text-muted-foreground">
            Showing latest 10 of {rewards.length} rewards
          </span>
        </div>
      )}

      {/* Summary bar */}
      <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-FLUXGATE-wait/10 to-FLUXGATE-open/10 border border-FLUXGATE-wait/20">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-FLUXGATE-wait" />
            <span className="text-muted-foreground">Today's efficiency bonus pool</span>
          </div>
          <span className="font-mono font-bold text-foreground">
            AED {(totalCredits * 0.5).toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
};

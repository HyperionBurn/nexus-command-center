import { memo } from 'react';
import { SurgeEvent } from '@/types/nexus';
import { cn } from '@/lib/utils';
import { AlertTriangle, Coffee, ArrowRight, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface SurgeAlertBannerProps {
  surge: SurgeEvent | null;
  onDismiss?: () => void;
}

export const SurgeAlertBanner = memo(({ surge, onDismiss }: SurgeAlertBannerProps) => {
  if (!surge) return null;

  const severityConfig = {
    LOW: {
      bg: 'bg-nexus-wait/10 border-nexus-wait/30',
      text: 'text-nexus-wait',
      icon: AlertTriangle,
      pulseColor: 'rgba(251, 191, 36, 0.3)',
    },
    MEDIUM: {
      bg: 'bg-nexus-wait/20 border-nexus-wait/50',
      text: 'text-nexus-wait',
      icon: AlertTriangle,
      pulseColor: 'rgba(251, 191, 36, 0.4)',
    },
    HIGH: {
      bg: 'bg-nexus-hold/20 border-nexus-hold/50',
      text: 'text-nexus-hold',
      icon: AlertTriangle,
      pulseColor: 'rgba(239, 68, 68, 0.5)',
    },
  }[surge.severity];

  const SeverityIcon = severityConfig.icon;

  return (
    <motion.div 
      className={cn(
        'rounded-lg border p-4 relative overflow-hidden',
        severityConfig.bg,
        surge.resolved && 'opacity-60'
      )}
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        scale: 1,
        boxShadow: surge.resolved 
          ? '0 0 0px transparent'
          : [
              `0 0 20px ${severityConfig.pulseColor}`,
              `0 0 40px ${severityConfig.pulseColor}`,
              `0 0 20px ${severityConfig.pulseColor}`
            ]
      }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ 
        type: 'spring', 
        stiffness: 400, 
        damping: 25,
        boxShadow: surge.resolved ? {} : {
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut"
        }
      }}
    >
      {/* Animated scan line for critical alerts - reduced frequency */}
      {!surge.resolved && surge.severity === 'HIGH' && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-red-500/50 to-transparent"
            animate={{ top: ['0%', '100%', '0%'] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
            style={{ willChange: 'top' }}
          />
        </motion.div>
      )}
      
      <div className="flex items-start gap-4 relative z-10">
        <motion.div 
          className={cn(
            'flex items-center justify-center w-10 h-10 rounded-full',
            surge.resolved ? 'bg-nexus-open/20' : 'bg-nexus-hold/20'
          )}
          animate={surge.resolved ? {} : { 
            scale: [1, 1.08, 1],
          }}
          transition={{ 
            duration: 1.2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ willChange: 'transform' }}
        >
          {surge.resolved ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            >
              <CheckCircle className="h-5 w-5 text-nexus-open" />
            </motion.div>
          ) : (
            <motion.div
              animate={{ rotate: [0, -8, 8, -8, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            >
              <SeverityIcon className={cn('h-5 w-5', severityConfig.text)} />
            </motion.div>
          )}
        </motion.div>

        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className={cn(
              'font-semibold',
              surge.resolved ? 'text-nexus-open' : severityConfig.text
            )}>
              {surge.resolved ? 'SURGE RESOLVED' : `SURGE DETECTED - ${surge.severity}`}
            </h4>
            <span className="text-xs text-muted-foreground">
              {format(surge.timestamp, 'HH:mm:ss')}
            </span>
          </div>

          <p className="text-sm text-foreground mb-3">
            {surge.action}
          </p>

          <div className="flex items-center gap-6 text-xs">
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Arrival Rate:</span>
              <span className="font-mono font-semibold text-nexus-cyan">
                λ = {surge.arrivalRate.toFixed(1)}/min
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Service Rate:</span>
              <span className="font-mono font-semibold text-nexus-open">
                μ = {surge.serviceRate.toFixed(1)}/min
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Overflow:</span>
              <span className={cn(
                'font-mono font-semibold',
                surge.resolved ? 'text-nexus-open' : 'text-nexus-hold'
              )}>
                {((surge.arrivalRate / surge.serviceRate - 1) * 100).toFixed(0)}%
              </span>
            </div>
          </div>

          {!surge.resolved && (
            <motion.div 
              className="mt-4 flex items-center gap-3 p-3 rounded bg-secondary/50 border border-border"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.div
                animate={{ rotate: [0, 12, -12, 0] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Coffee className="h-5 w-5 text-nexus-wait" />
              </motion.div>
              <div className="flex-1">
                <span className="text-sm font-medium text-foreground">
                  Staging Zone Protocol Active
                </span>
                <p className="text-xs text-muted-foreground">
                  Overflow traffic directed to Coffee Zone holding area
                </p>
              </div>
              <motion.div
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
});

SurgeAlertBanner.displayName = 'SurgeAlertBanner';

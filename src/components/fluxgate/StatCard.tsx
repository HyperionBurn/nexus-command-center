import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { memo, useRef, useEffect } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    positive: boolean;
  };
  variant?: 'default' | 'success' | 'warning' | 'danger';
  className?: string;
}

// Animated counter component for smooth number transitions
const AnimatedValue = memo(({ value }: { value: string | number }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const prevValue = useRef<string | number>(value);
  
  useEffect(() => {
    const node = nodeRef.current;
    if (!node) return;
    
    // Only animate if value changed
    if (prevValue.current !== value) {
      // Use CSS animation class for GPU-accelerated transform
      node.classList.add('animate-number-tick');
      
      const cleanup = setTimeout(() => {
        node.classList.remove('animate-number-tick');
      }, 200);
      
      prevValue.current = value;
      return () => clearTimeout(cleanup);
    }
  }, [value]);
  
  return (
    <span 
      ref={nodeRef} 
      className="inline-block" 
      style={{ willChange: 'transform' }}
    >
      {value}
    </span>
  );
});
AnimatedValue.displayName = 'AnimatedValue';

export const StatCard = memo(({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) => {
  const variantStyles = {
    default: {
      iconBg: 'bg-primary/10',
      iconColor: 'text-primary',
      valueColor: 'text-foreground',
    },
    success: {
      iconBg: 'bg-FLUXGATE-open/10',
      iconColor: 'text-FLUXGATE-open',
      valueColor: 'text-FLUXGATE-open text-glow-green',
    },
    warning: {
      iconBg: 'bg-FLUXGATE-wait/10',
      iconColor: 'text-FLUXGATE-wait',
      valueColor: 'text-FLUXGATE-wait text-glow-amber',
    },
    danger: {
      iconBg: 'bg-FLUXGATE-hold/10',
      iconColor: 'text-FLUXGATE-hold',
      valueColor: 'text-FLUXGATE-hold text-glow-red',
    },
  }[variant];

  return (
    <motion.div 
      className={cn('glass-panel p-4 overflow-hidden', className)}
      style={{ willChange: 'transform' }}
      whileHover={{ 
        scale: 1.02,
        boxShadow: variant === 'danger' 
          ? '0 0 30px hsla(0, 100%, 60%, 0.3)' 
          : variant === 'success' 
            ? '0 0 30px hsla(142, 100%, 50%, 0.2)'
            : '0 0 30px hsla(186, 100%, 50%, 0.15)'
      }}
      transition={{ type: 'spring', stiffness: 300, damping: 25 }}
    >
      <div className="flex items-start justify-between">
        <motion.div 
          className={cn('p-2 rounded-lg', variantStyles.iconBg)}
          whileHover={{ rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Icon className={cn('h-5 w-5', variantStyles.iconColor)} />
        </motion.div>
        {trend && (
          <motion.div 
            className={cn(
              'text-xs font-medium px-2 py-0.5 rounded',
              trend.positive ? 'bg-FLUXGATE-open/10 text-FLUXGATE-open' : 'bg-FLUXGATE-hold/10 text-FLUXGATE-hold'
            )}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
          >
            <motion.span
              animate={{ y: trend.positive ? [0, -2, 0] : [0, 2, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
            >
              {trend.positive ? '↑' : '↓'}
            </motion.span>
            {' '}{Math.abs(trend.value)}%
          </motion.div>
        )}
      </div>
      
      <div className="mt-3">
        <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
          {title}
        </h4>
        <p className={cn('text-2xl font-bold font-mono mt-1', variantStyles.valueColor)}>
          <AnimatedValue value={value} />
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

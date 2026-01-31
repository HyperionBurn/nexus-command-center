import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

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

export const StatCard = ({
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
      iconBg: 'bg-nexus-open/10',
      iconColor: 'text-nexus-open',
      valueColor: 'text-nexus-open text-glow-green',
    },
    warning: {
      iconBg: 'bg-nexus-wait/10',
      iconColor: 'text-nexus-wait',
      valueColor: 'text-nexus-wait text-glow-amber',
    },
    danger: {
      iconBg: 'bg-nexus-hold/10',
      iconColor: 'text-nexus-hold',
      valueColor: 'text-nexus-hold text-glow-red',
    },
  }[variant];

  return (
    <div className={cn('glass-panel p-4', className)}>
      <div className="flex items-start justify-between">
        <div className={cn('p-2 rounded-lg', variantStyles.iconBg)}>
          <Icon className={cn('h-5 w-5', variantStyles.iconColor)} />
        </div>
        {trend && (
          <div className={cn(
            'text-xs font-medium px-2 py-0.5 rounded',
            trend.positive ? 'bg-nexus-open/10 text-nexus-open' : 'bg-nexus-hold/10 text-nexus-hold'
          )}>
            {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}%
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <h4 className="text-xs text-muted-foreground uppercase tracking-wider">
          {title}
        </h4>
        <p className={cn('text-2xl font-bold font-mono mt-1', variantStyles.valueColor)}>
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </div>
    </div>
  );
};

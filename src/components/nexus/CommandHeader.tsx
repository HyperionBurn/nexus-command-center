import { cn } from '@/lib/utils';
import { Shield, Radio, Wifi, Clock } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';

interface CommandHeaderProps {
  className?: string;
}

export const CommandHeader = ({ className }: CommandHeaderProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className={cn('glass-panel p-4', className)}>
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-nexus-cyan to-nexus-purple flex items-center justify-center">
              <Shield className="h-6 w-6 text-background" />
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-nexus-open animate-pulse" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              NEXUS <span className="text-primary">Command Center</span>
            </h1>
            <p className="text-xs text-muted-foreground">
              School Zone Orchestration System v2.4.1
            </p>
          </div>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Radio className="h-4 w-4 text-nexus-open animate-pulse" />
            <span className="text-xs text-muted-foreground">LIVE</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4 text-nexus-cyan" />
            <span className="text-xs text-muted-foreground">Connected</span>
          </div>

          <div className="h-8 w-px bg-border" />

          <div className="text-right">
            <div className="font-mono text-2xl font-bold text-foreground text-glow-cyan">
              {format(time, 'HH:mm:ss')}
            </div>
            <div className="text-xs text-muted-foreground">
              {format(time, 'EEEE, dd MMM yyyy')}
            </div>
          </div>
        </div>
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl scan-line" />
    </header>
  );
};

import { School, Bell, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LiveClock } from './LiveClock';

export const SchoolHeader = ({ schoolName = "Horizon International School" }) => {
  return (
    <header className="glass-panel p-4 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-FLUXGATE-blue/20">
            <School className="h-8 w-8 text-FLUXGATE-blue" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{schoolName}</h1>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-FLUXGATE-success animate-pulse" />
              Operations Active • Week 4, Term 2
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Live Clock - Prominent Display */}
          <LiveClock className="hidden md:flex" />

          <div className="h-10 w-px bg-border hidden md:block" />

          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end mr-4">
               <span className="text-sm font-medium">Head of Operations</span>
               <span className="text-xs text-muted-foreground">admin@horizon.edu</span>
            </div>
            <Button variant="outline" size="icon">
              <Bell className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon">
               <LogOut className="h-4 w-4 text-destructive" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
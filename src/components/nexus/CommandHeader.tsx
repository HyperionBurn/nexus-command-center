import { cn } from '@/lib/utils';
import { Shield, Radio, Wifi, Clock, School, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

interface CommandHeaderProps {
  className?: string;
}

export const CommandHeader = ({ className }: CommandHeaderProps) => {
  const [time, setTime] = useState(new Date());
  const [selectedSchool, setSelectedSchool] = useState("horizon");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const schoolOptions = [
    { value: "horizon", label: "Horizon International School" },
    { value: "gems-wellington", label: "GEMS Wellington Academy" },
    { value: "dubai-college", label: "Dubai College" },
    { value: "latifa", label: "Latifa School for Girls" },
    { value: "rashid", label: "Rashid School for Boys" },
  ];

  return (
    <header className={cn('glass-panel p-2 sm:p-4', className)}>
      <div className="flex items-center justify-between">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="relative">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-nexus-cyan to-nexus-purple flex items-center justify-center">
              <Shield className="h-5 w-5 sm:h-6 sm:w-6 text-background" />
            </div>
            <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-nexus-open animate-pulse" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-bold text-foreground tracking-tight">
              NEXUS <span className="text-primary hidden xs:inline">Command Center</span><span className="text-primary xs:hidden">CC</span>
            </h1>
            <p className="text-[10px] sm:text-xs text-muted-foreground hidden sm:block">
              School Zone Orchestration System v2.4.1
            </p>
          </div>
        </div>

        {/* School Selector - Hidden on mobile, shown on md+ */}
        <div className="hidden md:flex items-center gap-2 bg-secondary/30 p-1.5 rounded-lg border border-border/50 backdrop-blur-sm mx-6">
          <School className="h-4 w-4 text-nexus-blue ml-2" />
          <Select value={selectedSchool} onValueChange={setSelectedSchool}>
            <SelectTrigger className="w-[260px] h-8 border-0 bg-transparent focus:ring-0 focus:ring-offset-0 text-sm font-medium">
              <SelectValue placeholder="Select School" />
            </SelectTrigger>
            <SelectContent>
              {schoolOptions.map((school) => (
                <SelectItem key={school.value} value={school.value}>{school.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-8 w-8 p-0"
            onClick={() => navigate('/school-admin')}
            title="Open School Dashboard"
          >
            <Shield className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
          </Button>
        </div>

        {/* Status indicators - simplified on mobile */}
        <div className="flex items-center gap-2 sm:gap-6">
          {/* Live indicator - always visible */}
          <div className="flex items-center gap-1 sm:gap-2">
            <Radio className="h-3 w-3 sm:h-4 sm:w-4 text-nexus-open animate-pulse" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">LIVE</span>
          </div>
          
          {/* Connected - hidden on mobile */}
          <div className="hidden sm:flex items-center gap-2">
            <Wifi className="h-4 w-4 text-nexus-cyan" />
            <span className="text-xs text-muted-foreground">Connected</span>
          </div>

          <div className="hidden sm:block h-8 w-px bg-border" />

          {/* Time - responsive */}
          <div className="text-right hidden sm:block">
            <div className="font-mono text-lg sm:text-2xl font-bold text-foreground text-glow-cyan">
              {format(time, 'HH:mm:ss')}
            </div>
            <div className="text-[10px] sm:text-xs text-muted-foreground">
              {format(time, 'EEEE, dd MMM yyyy')}
            </div>
          </div>
          
          {/* Compact time on mobile */}
          <div className="font-mono text-sm font-bold text-foreground text-glow-cyan sm:hidden">
            {format(time, 'HH:mm')}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-11 w-11 p-0 md:hidden touch-manipulation"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] bg-background/95 backdrop-blur-xl">
              <SheetHeader>
                <SheetTitle className="text-left flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  NEXUS Menu
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                {/* School Selector in mobile menu */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Select School</label>
                  <Select value={selectedSchool} onValueChange={setSelectedSchool}>
                    <SelectTrigger className="w-full h-11 touch-manipulation">
                      <SelectValue placeholder="Select School" />
                    </SelectTrigger>
                    <SelectContent>
                      {schoolOptions.map((school) => (
                        <SelectItem key={school.value} value={school.value} className="h-11">
                          {school.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Navigation */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Navigation</label>
                  <Button 
                    variant="outline" 
                    className="w-full h-11 justify-start touch-manipulation"
                    onClick={() => {
                      navigate('/school-admin');
                      setMobileMenuOpen(false);
                    }}
                  >
                    <School className="h-4 w-4 mr-2" />
                    School Dashboard
                  </Button>
                </div>

                {/* Status info */}
                <div className="space-y-3 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Connection</span>
                    <div className="flex items-center gap-2">
                      <Wifi className="h-4 w-4 text-nexus-cyan" />
                      <span className="text-sm">Connected</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Date</span>
                    <span className="text-sm">{format(time, 'dd MMM yyyy')}</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Scan line effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl scan-line" />
    </header>
  );
};

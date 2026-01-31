import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

interface LiveClockProps {
  className?: string;
  showDate?: boolean;
}

export const LiveClock = ({ className = "", showDate = true }: LiveClockProps) => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="p-2 rounded-lg bg-nexus-blue/10 border border-nexus-blue/20">
        <Clock className="h-5 w-5 text-nexus-blue animate-pulse" />
      </div>
      <div className="text-right">
        <div className="text-2xl font-mono font-bold tracking-wider text-foreground">
          {formatTime(time)}
        </div>
        {showDate && (
          <div className="text-xs text-muted-foreground">
            {formatDate(time)}
          </div>
        )}
      </div>
    </div>
  );
};

import { cn } from '@/lib/utils';
import { Power, Cpu, Activity, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MasterSystemSwitchProps {
  isRunning: boolean;
  onToggle: () => void;
  className?: string;
}

export const MasterSystemSwitch = ({ isRunning, onToggle, className }: MasterSystemSwitchProps) => {
  return (
    <motion.div 
      className={cn(
        "relative inline-flex items-center gap-3 px-3 py-2 rounded-xl border-2 transition-all duration-500 cursor-pointer select-none",
        isRunning 
          ? "bg-gradient-to-r from-emerald-950/80 to-cyan-950/80 border-emerald-500/50 shadow-lg shadow-emerald-500/20" 
          : "bg-gradient-to-r from-slate-950/80 to-slate-900/80 border-slate-600/50",
        className
      )}
      onClick={onToggle}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      role="switch"
      aria-checked={isRunning}
      aria-label={isRunning ? "System is online - Click to shut down" : "System is offline - Click to start"}
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onToggle()}
    >
      {/* Background pulse effect when running */}
      <AnimatePresence>
        {isRunning && (
          <motion.div
            className="absolute inset-0 rounded-xl bg-gradient-to-r from-emerald-500/10 to-cyan-500/10"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
      </AnimatePresence>

      {/* Power Icon with glow */}
      <motion.div 
        className={cn(
          "relative w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-500",
          isRunning 
            ? "bg-gradient-to-br from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/50" 
            : "bg-slate-700"
        )}
        animate={isRunning ? {
          boxShadow: [
            "0 0 20px rgba(16, 185, 129, 0.5)",
            "0 0 35px rgba(16, 185, 129, 0.8)",
            "0 0 20px rgba(16, 185, 129, 0.5)"
          ]
        } : {}}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <Power 
          className={cn(
            "h-5 w-5 transition-all duration-300",
            isRunning ? "text-slate-900" : "text-slate-400"
          )} 
        />
        
        {/* Spinning ring when active */}
        <AnimatePresence>
          {isRunning && (
            <motion.div
              className="absolute inset-0 rounded-lg border-2 border-emerald-400/50"
              initial={{ rotate: 0, opacity: 0 }}
              animate={{ rotate: 360, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ rotate: { duration: 3, repeat: Infinity, ease: "linear" }, opacity: { duration: 0.3 } }}
            />
          )}
        </AnimatePresence>
      </motion.div>

      {/* Status Text and Indicators */}
      <div className="flex flex-col min-w-[140px]">
        <div className="flex items-center gap-2">
          <motion.span 
            className={cn(
              "text-sm font-bold tracking-wide transition-colors duration-300",
              isRunning ? "text-emerald-400" : "text-slate-400"
            )}
            animate={isRunning ? { opacity: [1, 0.7, 1] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {isRunning ? "FLUXGATE ONLINE" : "SYSTEM OFFLINE"}
          </motion.span>
          
          {/* Activity indicators */}
          <AnimatePresence>
            {isRunning && (
              <motion.div 
                className="flex gap-1"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                >
                  <Cpu className="h-3 w-3 text-cyan-400" />
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                >
                  <Activity className="h-3 w-3 text-emerald-400" />
                </motion.div>
                <motion.div
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                >
                  <Zap className="h-3 w-3 text-yellow-400" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Status bar */}
        <div className="flex items-center gap-2 mt-1">
          <div className="h-1.5 flex-1 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className={cn(
                "h-full rounded-full",
                isRunning 
                  ? "bg-gradient-to-r from-emerald-500 via-cyan-500 to-emerald-500" 
                  : "bg-slate-600"
              )}
              initial={{ width: "0%" }}
              animate={{ 
                width: isRunning ? "100%" : "0%",
                backgroundPosition: isRunning ? ["0% 50%", "100% 50%", "0% 50%"] : "0% 50%"
              }}
              transition={{ 
                width: { duration: 0.5 },
                backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" }
              }}
              style={{ backgroundSize: "200% 100%" }}
            />
          </div>
          <span className={cn(
            "text-[10px] font-mono transition-colors",
            isRunning ? "text-emerald-400" : "text-slate-500"
          )}>
            {isRunning ? "ACTIVE" : "STANDBY"}
          </span>
        </div>
      </div>

      {/* Toggle switch visual */}
      <div className={cn(
        "w-14 h-7 rounded-full p-1 transition-all duration-300",
        isRunning 
          ? "bg-gradient-to-r from-emerald-600 to-cyan-600" 
          : "bg-slate-700"
      )}>
        <motion.div
          className={cn(
            "w-5 h-5 rounded-full shadow-md",
            isRunning 
              ? "bg-white" 
              : "bg-slate-500"
          )}
          animate={{ x: isRunning ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </div>
    </motion.div>
  );
};

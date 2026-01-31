// Animated wrapper components for FLUXGATE Command Center
// Provides drop-in animated versions of common layout patterns

import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import {
  fadeVariants,
  slideUpVariants,
  slideDownVariants,
  slideRightVariants,
  scaleVariants,
  popVariants,
  cardVariants,
  listItemVariants,
  alertVariants,
  surgeAlertVariants,
  staggerContainerVariants,
  gridContainerVariants,
  pageVariants,
  pulseVariants,
  glowPulseVariants,
  springPresets,
} from './animations';
import { cn } from './utils';

// ============================================
// BASE MOTION COMPONENTS
// ============================================

interface AnimatedContainerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  className?: string;
}

// Fade In
export const FadeIn = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
FadeIn.displayName = 'FadeIn';

// Slide Up
export const SlideUp = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={slideUpVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
SlideUp.displayName = 'SlideUp';

// Slide Down
export const SlideDown = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={slideDownVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
SlideDown.displayName = 'SlideDown';

// Slide Right
export const SlideRight = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={slideRightVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
SlideRight.displayName = 'SlideRight';

// Scale In
export const ScaleIn = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={scaleVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
ScaleIn.displayName = 'ScaleIn';

// Pop In (bouncy)
export const PopIn = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={popVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
PopIn.displayName = 'PopIn';

// ============================================
// CARD COMPONENTS
// ============================================

interface AnimatedCardProps extends AnimatedContainerProps {
  hover?: boolean;
}

export const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ children, className, hover = true, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={hover ? "hover" : undefined}
      whileTap={hover ? "tap" : undefined}
      className={cn("cursor-pointer", className)}
      {...props}
    >
      {children}
    </motion.div>
  )
);
AnimatedCard.displayName = 'AnimatedCard';

// ============================================
// CONTAINER / GRID COMPONENTS
// ============================================

export const StaggerContainer = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={staggerContainerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
StaggerContainer.displayName = 'StaggerContainer';

export const AnimatedGrid = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={gridContainerVariants}
      initial="hidden"
      animate="visible"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
AnimatedGrid.displayName = 'AnimatedGrid';

// List Item (for use inside stagger containers)
export const AnimatedListItem = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={listItemVariants}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
AnimatedListItem.displayName = 'AnimatedListItem';

// ============================================
// ALERT COMPONENTS
// ============================================

export const AnimatedAlert = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={alertVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
AnimatedAlert.displayName = 'AnimatedAlert';

interface SurgeAlertProps extends AnimatedContainerProps {
  isActive?: boolean;
}

export const AnimatedSurgeAlert = forwardRef<HTMLDivElement, SurgeAlertProps>(
  ({ children, className, isActive = true, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={surgeAlertVariants}
      initial="hidden"
      animate={isActive ? ["visible", "pulse"] : "visible"}
      exit="exit"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
AnimatedSurgeAlert.displayName = 'AnimatedSurgeAlert';

// ============================================
// PAGE TRANSITION WRAPPER
// ============================================

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

export const PageTransition = ({ children, className }: PageTransitionProps) => (
  <motion.div
    variants={pageVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className={className}
  >
    {children}
  </motion.div>
);

// ============================================
// EFFECT COMPONENTS
// ============================================

export const PulseEffect = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={pulseVariants}
      animate="pulse"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
PulseEffect.displayName = 'PulseEffect';

export const GlowEffect = forwardRef<HTMLDivElement, AnimatedContainerProps>(
  ({ children, className, ...props }, ref) => (
    <motion.div
      ref={ref}
      variants={glowPulseVariants}
      animate="glow"
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
);
GlowEffect.displayName = 'GlowEffect';

// ============================================
// ANIMATED VALUE DISPLAY
// ============================================

interface AnimatedNumberProps {
  value: number | string;
  className?: string;
}

export const AnimatedNumber = ({ value, className }: AnimatedNumberProps) => (
  <motion.span
    key={value}
    initial={{ y: 10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    exit={{ y: -10, opacity: 0 }}
    transition={springPresets.snappy}
    className={className}
  >
    {value}
  </motion.span>
);

// ============================================
// ANIMATED PROGRESS BAR
// ============================================

interface AnimatedProgressProps {
  value: number; // 0-100
  className?: string;
  barClassName?: string;
}

export const AnimatedProgress = ({ value, className, barClassName }: AnimatedProgressProps) => (
  <div className={cn("relative h-2 bg-secondary rounded-full overflow-hidden", className)}>
    <motion.div
      className={cn("absolute top-0 left-0 h-full rounded-full", barClassName)}
      initial={{ width: 0 }}
      animate={{ width: `${Math.min(value, 100)}%` }}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    />
  </div>
);

// ============================================
// PRESENCE WRAPPER (for enter/exit)
// ============================================

interface PresenceProps {
  children: ReactNode;
  show: boolean;
  mode?: 'sync' | 'wait' | 'popLayout';
}

export const Presence = ({ children, show, mode = 'sync' }: PresenceProps) => (
  <AnimatePresence mode={mode}>
    {show && children}
  </AnimatePresence>
);

// Re-export AnimatePresence for convenience
export { AnimatePresence, motion } from 'framer-motion';

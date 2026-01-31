// Animation presets for FLUXGATE Command Center
// Provides consistent, professional motion across all components

import { Variants, Transition } from 'framer-motion';

// ============================================
// SPRING CONFIGURATIONS (Physics-based)
// ============================================
export const springPresets = {
  // Snappy UI feedback (buttons, toggles)
  snappy: { type: 'spring', stiffness: 400, damping: 30 } as Transition,
  
  // Smooth entrances (cards, modals)
  smooth: { type: 'spring', stiffness: 200, damping: 25 } as Transition,
  
  // Gentle floating (ambient elements)
  gentle: { type: 'spring', stiffness: 100, damping: 18 } as Transition,
  
  // Bouncy feedback (notifications, alerts) - increased damping to prevent oscillation
  bouncy: { type: 'spring', stiffness: 300, damping: 18 } as Transition,
  
  // Critical/urgent (surge alerts)
  urgent: { type: 'spring', stiffness: 500, damping: 35 } as Transition,
};

// ============================================
// TIMING CONFIGURATIONS (Duration-based)
// ============================================
export const durationPresets = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  glacial: 0.8,
};

// ============================================
// STAGGER CONFIGURATIONS
// ============================================
export const staggerPresets = {
  fast: 0.03,
  normal: 0.05,
  slow: 0.1,
  cascade: 0.08,
};

// ============================================
// FADE VARIANTS
// ============================================
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: durationPresets.normal }
  },
  exit: { 
    opacity: 0,
    transition: { duration: durationPresets.fast }
  }
};

// ============================================
// SLIDE VARIANTS
// ============================================
export const slideUpVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springPresets.smooth
  },
  exit: { 
    opacity: 0, 
    y: -10,
    transition: { duration: durationPresets.fast }
  }
};

export const slideDownVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: springPresets.smooth
  },
  exit: { 
    opacity: 0, 
    y: 10,
    transition: { duration: durationPresets.fast }
  }
};

export const slideRightVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: springPresets.smooth
  },
  exit: { 
    opacity: 0, 
    x: 30,
    transition: { duration: durationPresets.fast }
  }
};

export const slideLeftVariants: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: springPresets.smooth
  },
  exit: { 
    opacity: 0, 
    x: -30,
    transition: { duration: durationPresets.fast }
  }
};

// ============================================
// SCALE VARIANTS
// ============================================
export const scaleVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springPresets.snappy
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: durationPresets.fast }
  }
};

export const popVariants: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springPresets.bouncy
  },
  exit: { 
    opacity: 0, 
    scale: 0.8,
    transition: { duration: durationPresets.fast }
  }
};

// ============================================
// CONTAINER VARIANTS (Staggered children)
// ============================================
export const staggerContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerPresets.normal,
      delayChildren: 0.1,
    }
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: staggerPresets.fast,
      staggerDirection: -1,
    }
  }
};

export const gridContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: staggerPresets.cascade,
      delayChildren: 0.05,
    }
  }
};

// ============================================
// CARD / ITEM VARIANTS
// ============================================
export const cardVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: springPresets.smooth
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: springPresets.snappy
  },
  tap: {
    scale: 0.98,
    transition: { duration: durationPresets.instant }
  }
};

export const listItemVariants: Variants = {
  hidden: { 
    opacity: 0, 
    x: -20 
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: springPresets.smooth
  },
  exit: { 
    opacity: 0, 
    x: 20,
    transition: { duration: durationPresets.fast }
  }
};

// ============================================
// ALERT / NOTIFICATION VARIANTS
// ============================================
export const alertVariants: Variants = {
  hidden: { 
    opacity: 0, 
    y: -50,
    scale: 0.9
  },
  visible: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: springPresets.bouncy
  },
  exit: { 
    opacity: 0, 
    y: -30,
    scale: 0.95,
    transition: { duration: durationPresets.normal }
  }
};

export const surgeAlertVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
    y: -20
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: springPresets.urgent
  },
  pulse: {
    scale: [1, 1.02, 1],
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "easeInOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.9,
    transition: { duration: durationPresets.fast }
  }
};

// ============================================
// DATA VISUALIZATION VARIANTS
// ============================================
export const progressBarVariants: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: (custom: number) => ({
    scaleX: custom / 100,
    transition: {
      type: 'spring',
      stiffness: 100,
      damping: 20,
      delay: 0.2
    }
  })
};

export const numberTickVariants: Variants = {
  initial: { y: 0 },
  tick: {
    y: [0, -3, 0],
    transition: { duration: 0.2 }
  }
};

export const pulseVariants: Variants = {
  pulse: {
    scale: [1, 1.03, 1],
    opacity: [1, 0.85, 1],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export const glowPulseVariants: Variants = {
  glow: {
    boxShadow: [
      "0 0 20px rgba(0, 255, 255, 0.3)",
      "0 0 35px rgba(0, 255, 255, 0.5)",
      "0 0 20px rgba(0, 255, 255, 0.3)"
    ],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// ============================================
// VEHICLE / MAP VARIANTS
// ============================================
export const vehicleVariants: Variants = {
  hidden: { opacity: 0, scale: 0 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: springPresets.bouncy
  },
  moving: {
    x: [0, 5, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: "linear"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0,
    transition: { duration: durationPresets.fast }
  }
};

export const zoneVariants: Variants = {
  normal: {
    stroke: "hsl(142, 100%, 50%)",
    fill: "hsla(142, 100%, 50%, 0.1)",
    transition: { duration: 0.5 }
  },
  surge: {
    stroke: "hsl(38, 100%, 50%)",
    fill: "hsla(38, 100%, 50%, 0.1)",
    transition: { duration: 0.3 }
  },
  critical: {
    stroke: ["hsl(0, 100%, 60%)", "hsl(0, 100%, 40%)", "hsl(0, 100%, 60%)"],
    fill: ["hsla(0, 100%, 60%, 0.1)", "hsla(0, 100%, 60%, 0.2)", "hsla(0, 100%, 60%, 0.1)"],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// ============================================
// PAGE TRANSITION VARIANTS
// ============================================
export const pageVariants: Variants = {
  hidden: { 
    opacity: 0,
    y: 20
  },
  visible: { 
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.25, 0.1, 0.25, 1],
      when: "beforeChildren",
      staggerChildren: staggerPresets.cascade
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 }
  }
};

// ============================================
// TOOLTIP / POPOVER VARIANTS
// ============================================
export const tooltipVariants: Variants = {
  hidden: { 
    opacity: 0, 
    scale: 0.95,
    y: 5
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    y: 0,
    transition: { 
      duration: durationPresets.fast,
      ease: "easeOut"
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95,
    transition: { duration: durationPresets.instant }
  }
};

// ============================================
// SKELETON / LOADING VARIANTS
// ============================================
export const skeletonVariants: Variants = {
  shimmer: {
    backgroundPosition: ["200% 0", "-200% 0"],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const loadingDotsVariants: Variants = {
  animate: {
    y: [0, -8, 0],
    transition: {
      duration: 0.5,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Creates a delay for staggered animations
 */
export const getStaggerDelay = (index: number, preset: keyof typeof staggerPresets = 'normal') => ({
  transition: { delay: index * staggerPresets[preset] }
});

/**
 * Creates custom spring transition
 */
export const createSpring = (stiffness: number, damping: number): Transition => ({
  type: 'spring',
  stiffness,
  damping
});

/**
 * Creates orchestrated animation for complex layouts
 */
export const orchestrate = (delayChildren = 0.1, staggerChildren = 0.05): Transition => ({
  when: "beforeChildren",
  delayChildren,
  staggerChildren
});

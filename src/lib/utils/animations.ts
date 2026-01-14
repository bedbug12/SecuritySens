import { Variants } from 'framer-motion';

/**
 * Animations de base
 */
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

export const fadeInLeft: Variants = {
  initial: {
    opacity: 0,
    x: -20
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4
    }
  }
};

export const fadeInRight: Variants = {
  initial: {
    opacity: 0,
    x: 20
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4
    }
  }
};

export const scaleIn: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3
    }
  }
};

/**
 * Animation de stagger pour les listes
 */
export const staggerContainer: Variants = {
  animate: {
    transition: {
      staggerChildren: 0.05
    }
  }
};

export const staggerItems: Variants = {
  initial: {
    opacity: 0,
    y: 10
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3
    }
  }
};

/**
 * Animation de hover
 */
export const hoverScale: Variants = {
  initial: { scale: 1 },
  hover: { scale: 1.02 },
  tap: { scale: 0.98 }
};

export const hoverLift: Variants = {
  initial: { y: 0 },
  hover: { y: -4 },
  tap: { y: 0 }
};

/**
 * Animation de pulse
 */
export const pulseAnimation: Variants = {
  initial: { scale: 1 },
  animate: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

/**
 * Animation de glow
 */
export const glowAnimation: Variants = {
  initial: { boxShadow: "0 0 0px rgba(59, 130, 246, 0.5)" },
  animate: {
    boxShadow: [
      "0 0 0px rgba(59, 130, 246, 0.5)",
      "0 0 20px rgba(59, 130, 246, 0.8)",
      "0 0 0px rgba(59, 130, 246, 0.5)"
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

/**
 * Animation de chargement
 */
export const loadingSpin: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

/**
 * Animation de progression
 */
export const progressFill = (progress: number): Variants => ({
  initial: { width: "0%" },
  animate: {
    width: `${progress}%`,
    transition: {
      duration: 1,
      ease: "easeOut"
    }
  }
});

/**
 * Animation de notification
 */
export const notificationSlide: Variants = {
  initial: {
    opacity: 0,
    x: 100,
    scale: 0.9
  },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 25
    }
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.9,
    transition: {
      duration: 0.2
    }
  }
};

/**
 * Animation de page transition
 */
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3
    }
  }
};

/**
 * Animation de type cyber
 */
export const cyberScan: Variants = {
  initial: { backgroundPosition: "0% 0%" },
  animate: {
    backgroundPosition: ["0% 0%", "100% 100%"],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

export const binaryFlow: Variants = {
  initial: { y: "-100%" },
  animate: {
    y: "100%",
    transition: {
      duration: 10,
      repeat: Infinity,
      ease: "linear"
    }
  }
};

/**
 * Helper pour créer des animations delayées
 */
export const createDelayedAnimation = (
  baseAnimation: Variants,
  delay: number
): Variants => ({
  ...baseAnimation,
  animate: {
    ...baseAnimation.animate,
    transition: {
      ...(baseAnimation.animate as any)?.transition,
      delay
    }
  }
});
// Premium animation configuration for ultra-smooth effects

// Custom easing curves
export const easing = {
  // Premium ease-in-out curves
  smooth: [0.4, 0, 0.2, 1],
  butter: [0.25, 0.46, 0.45, 0.94],
  elastic: [0.68, -0.6, 0.32, 1.6],
  bounce: [0.68, -0.55, 0.265, 1.55],
  
  // Specific animation easings
  enter: [0.6, 0.01, 0.05, 0.95],
  exit: [0.4, 0, 1, 1],
  spring: [0.34, 1.56, 0.64, 1],
}

// Animation durations (in seconds)
export const duration = {
  instant: 0.1,
  fast: 0.2,
  normal: 0.4,
  smooth: 0.6,
  slow: 0.8,
  verySlow: 1.2,
}

// Delays for staggered animations
export const stagger = {
  fast: 0.05,
  normal: 0.1,
  slow: 0.15,
  verySlow: 0.2,
}

// Framer Motion Variants
export const fadeInUp = {
  hidden: { 
    opacity: 0, 
    y: 40,
    transition: { duration: duration.normal, ease: easing.smooth }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: duration.smooth, ease: easing.enter }
  },
}

export const fadeInDown = {
  hidden: { 
    opacity: 0, 
    y: -40,
    transition: { duration: duration.normal, ease: easing.smooth }
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: duration.smooth, ease: easing.enter }
  },
}

export const fadeInLeft = {
  hidden: { 
    opacity: 0, 
    x: -40,
    transition: { duration: duration.normal, ease: easing.smooth }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: duration.smooth, ease: easing.enter }
  },
}

export const fadeInRight = {
  hidden: { 
    opacity: 0, 
    x: 40,
    transition: { duration: duration.normal, ease: easing.smooth }
  },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: duration.smooth, ease: easing.enter }
  },
}

export const scaleIn = {
  hidden: { 
    opacity: 0, 
    scale: 0.85,
    transition: { duration: duration.normal, ease: easing.smooth }
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: duration.smooth, ease: easing.spring }
  },
}

export const scaleInBounce = {
  hidden: { 
    opacity: 0, 
    scale: 0.8,
  },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { 
      duration: duration.smooth, 
      ease: easing.bounce,
      scale: { type: 'spring', stiffness: 200, damping: 15 }
    }
  },
}

// Container for staggered children
export const staggerContainer = (staggerChildren = stagger.normal, delayChildren = 0) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren,
      delayChildren,
      duration: duration.normal,
      ease: easing.smooth
    },
  },
})

// Hover and tap animations
export const hoverLift = {
  scale: 1.05,
  y: -5,
  transition: { duration: duration.fast, ease: easing.smooth }
}

export const hoverScale = {
  scale: 1.08,
  transition: { duration: duration.fast, ease: easing.spring }
}

export const tapScale = {
  scale: 0.95,
  transition: { duration: duration.instant, ease: easing.smooth }
}

// Scroll animations
export const scrollFadeIn = {
  hidden: { 
    opacity: 0, 
    y: 60,
  },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: duration.slow,
      ease: easing.enter
    }
  },
}

// Special effects
export const shimmer = {
  animate: {
    backgroundPosition: ['0% center', '200% center'],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: 'linear',
  }
}

export const float = {
  animate: {
    y: [0, -10, 0],
  },
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: easing.smooth,
  }
}

export const rotate = {
  animate: {
    rotate: 360,
  },
  transition: {
    duration: 20,
    repeat: Infinity,
    ease: 'linear',
  }
}

export const pulse = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
  },
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: easing.smooth,
  }
}

// Page transitions
export const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: duration.smooth, ease: easing.smooth }
}

// Modal/Overlay transitions
export const modalOverlay = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: duration.fast, ease: easing.smooth }
  },
  exit: { 
    opacity: 0,
    transition: { duration: duration.fast, ease: easing.smooth }
  }
}

export const modalContent = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { duration: duration.normal, ease: easing.spring }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: duration.fast, ease: easing.smooth }
  }
}

// Export all as default for convenience
export default {
  easing,
  duration,
  stagger,
  fadeInUp,
  fadeInDown,
  fadeInLeft,
  fadeInRight,
  scaleIn,
  scaleInBounce,
  staggerContainer,
  hoverLift,
  hoverScale,
  tapScale,
  scrollFadeIn,
  shimmer,
  float,
  rotate,
  pulse,
  pageTransition,
  modalOverlay,
  modalContent,
}

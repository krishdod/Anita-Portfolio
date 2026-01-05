/**
 * Framer Motion Animation Variants Library
 * Reusable animation variants for consistent motion design
 */

// Enhanced easing curves for smoother animations
const EASING = {
  easeOut: [0.6, 0.01, 0.05, 0.95],
  easeInOut: [0.6, -0.05, 0.01, 0.99],
  smooth: [0.4, 0, 0.2, 1],
  smoothOut: [0.16, 1, 0.3, 1],
  spring: [0.68, -0.55, 0.265, 1.55],
}

// Fade animations with smoother transitions
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.7, 
      ease: EASING.smoothOut,
      opacity: { duration: 0.5 }
    }
  }
}

// Stagger animations with smoother timing
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
      ease: EASING.smooth
    }
  }
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { 
      duration: 0.6,
      ease: EASING.smoothOut
    }
  }
}

// Smooth fade in
export const fadeIn = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { 
      duration: 0.5,
      ease: EASING.smooth
    }
  }
}

// Smooth scale in
export const scaleIn = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { 
      duration: 0.5,
      ease: EASING.smoothOut
    }
  }
}

// Smooth slide in from left
export const slideInLeft = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { 
      duration: 0.6,
      ease: EASING.smoothOut
    }
  }
}

// Smooth slide in from right
export const slideInRight = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { 
      duration: 0.6,
      ease: EASING.smoothOut
    }
  }
}

// Export easing for use in components
export { EASING }

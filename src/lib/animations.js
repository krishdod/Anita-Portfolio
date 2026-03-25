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

const SPRING_SOFT = { type: 'spring', stiffness: 380, damping: 28, mass: 0.85 }
const SPRING_SNAPPY = { type: 'spring', stiffness: 420, damping: 32, mass: 0.78 }

// Fade animations with spring easing (modern, less “template”)
export const fadeInUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_SOFT,
  },
}

// Stagger: quicker cascade + spring children
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.055,
      delayChildren: 0.04,
      when: 'beforeChildren',
    },
  },
}

export const staggerItem = {
  hidden: { opacity: 0, y: 26 },
  visible: {
    opacity: 1,
    y: 0,
    transition: SPRING_SNAPPY,
  },
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
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: 'spring', stiffness: 340, damping: 26 },
  },
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

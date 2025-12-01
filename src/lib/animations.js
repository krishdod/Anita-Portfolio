/**
 * Framer Motion Animation Variants Library
 * Reusable animation variants for consistent motion design
 */

// Easing curves
const EASING = {
  easeOut: [0.6, 0.01, 0.05, 0.95],
  easeInOut: [0.6, -0.05, 0.01, 0.99],
}

// Fade animations
export const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASING.easeOut }
  }
}

// Stagger animations
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1
    }
  }
}

export const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 }
  }
}

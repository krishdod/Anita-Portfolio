import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

/**
 * RevealOnScroll component for revealing content on scroll with fade-in and upward movement
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Content to reveal
 * @param {Object} props.variants - Framer Motion variants
 * @param {number} props.delay - Delay before animation starts
 * @param {number} props.threshold - Intersection observer threshold
 * @param {boolean} props.once - Whether to animate only once
 */
export function RevealOnScroll({ 
  children, 
  variants, 
  delay = 0, 
  threshold = 0.1,
  once = true,
  className = ''
}) {
  const [ref, inView] = useInView({
    threshold,
    triggerOnce: once
  })

  const defaultVariants = {
    hidden: {
      opacity: 0,
      y: 36,
      scale: 0.97,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        delay,
        type: 'spring',
        stiffness: 360,
        damping: 30,
        mass: 0.82,
      },
    },
  }

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={variants || defaultVariants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

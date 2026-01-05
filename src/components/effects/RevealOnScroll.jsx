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
      y: 40,
      scale: 0.96
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.7,
        delay,
        ease: [0.4, 0, 0.2, 1],
        opacity: { duration: 0.5 }
      }
    }
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

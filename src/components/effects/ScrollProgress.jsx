import { motion, useScroll, useSpring } from 'framer-motion'
import { useMotionPreference } from '../../hooks/useMotionPreference'

export function ScrollProgress() {
  const { reducedMotion } = useMotionPreference()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 160, damping: 30 })

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
      style={{ scaleX: reducedMotion ? scrollYProgress : progress }}
    />
  )
}

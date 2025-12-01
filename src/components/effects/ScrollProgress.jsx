import { motion } from 'framer-motion'
import { useScrollPosition } from '../../hooks/useScrollPosition'

export function ScrollProgress() {
  const { scrollPercentage } = useScrollPosition()

  return (
    <motion.div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-50"
      style={{ scaleX: scrollPercentage / 100 }}
      initial={{ scaleX: 0 }}
      transition={{ duration: 0.1 }}
    />
  )
}

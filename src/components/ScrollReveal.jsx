import { motion } from 'framer-motion'
import { useMotionPreference } from '../hooks/useMotionPreference'

// One restrained reveal per heading; text remains semantic and screen-reader friendly.
export default function ScrollReveal({ children, containerClassName = '', textClassName = '', as: Heading = 'h2' }) {
  const { reducedMotion } = useMotionPreference()
  return (
    <motion.div
      className={containerClassName}
      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: reducedMotion ? 0 : 0.5 }}
    >
      <Heading className={textClassName}>{children}</Heading>
    </motion.div>
  )
}

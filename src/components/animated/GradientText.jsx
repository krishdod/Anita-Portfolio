import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export function GradientText({ children, className, animate = true }) {
  return (
    <motion.span
      className={cn(
        'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent',
        animate && 'bg-[length:200%_auto] animate-gradient',
        className
      )}
      style={{
        backgroundSize: animate ? '200% auto' : '100% auto',
      }}
    >
      {children}
    </motion.span>
  )
}

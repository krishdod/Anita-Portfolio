import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export const AnimatedGrid = ({ className }) => {
  const gridLines = Array.from({ length: 20 }, (_, i) => i)

  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      {/* Horizontal lines */}
      <div className="absolute inset-0">
        {gridLines.map((line) => (
          <motion.div
            key={`h-${line}`}
            className="absolute w-full h-px bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"
            style={{
              top: `${(line * 100) / gridLines.length}%`,
            }}
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              scaleX: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              delay: line * 0.1,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Vertical lines */}
      <div className="absolute inset-0">
        {gridLines.map((line) => (
          <motion.div
            key={`v-${line}`}
            className="absolute h-full w-px bg-gradient-to-b from-transparent via-purple-500/10 to-transparent"
            style={{
              left: `${(line * 100) / gridLines.length}%`,
            }}
            initial={{ opacity: 0, scaleY: 0 }}
            animate={{
              opacity: [0, 0.5, 0],
              scaleY: [0, 1, 0],
            }}
            transition={{
              duration: 4,
              delay: line * 0.1 + 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  )
}


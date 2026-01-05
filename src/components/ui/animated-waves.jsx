import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export const AnimatedWaves = ({ className }) => {
  return (
    <div className={cn("absolute inset-0 overflow-hidden", className)}>
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 800"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <motion.linearGradient
            id="wave-gradient-1"
            initial={{ x1: '0%', x2: '100%' }}
            animate={{
              x1: ['0%', '100%', '0%'],
              x2: ['100%', '0%', '100%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <stop offset="0%" stopColor="rgba(59, 130, 246, 0.1)" />
            <stop offset="50%" stopColor="rgba(147, 51, 234, 0.15)" />
            <stop offset="100%" stopColor="rgba(236, 72, 153, 0.1)" />
          </motion.linearGradient>

          <motion.linearGradient
            id="wave-gradient-2"
            initial={{ x1: '0%', x2: '100%' }}
            animate={{
              x1: ['100%', '0%', '100%'],
              x2: ['0%', '100%', '0%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 1,
            }}
          >
            <stop offset="0%" stopColor="rgba(236, 72, 153, 0.1)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.15)" />
            <stop offset="100%" stopColor="rgba(147, 51, 234, 0.1)" />
          </motion.linearGradient>
        </defs>

        {/* Wave 1 */}
        <motion.path
          fill="url(#wave-gradient-1)"
          initial={{ d: "M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z" }}
          animate={{
            d: [
              "M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z",
              "M0,400 Q300,350 600,400 T1200,400 L1200,800 L0,800 Z",
              "M0,400 Q300,300 600,400 T1200,400 L1200,800 L0,800 Z",
            ],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />

        {/* Wave 2 */}
        <motion.path
          fill="url(#wave-gradient-2)"
          initial={{ d: "M0,500 Q300,450 600,500 T1200,500 L1200,800 L0,800 Z" }}
          animate={{
            d: [
              "M0,500 Q300,450 600,500 T1200,500 L1200,800 L0,800 Z",
              "M0,500 Q300,500 600,500 T1200,500 L1200,800 L0,800 Z",
              "M0,500 Q300,450 600,500 T1200,500 L1200,800 L0,800 Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 1,
          }}
        />
      </svg>
    </div>
  )
}


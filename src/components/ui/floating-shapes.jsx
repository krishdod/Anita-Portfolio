import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export const FloatingShapes = ({ className }) => {
  const shapes = [
    {
      size: 120,
      initialX: '10%',
      initialY: '20%',
      color: 'from-blue-500/20 to-transparent',
      duration: 20,
      delay: 0,
    },
    {
      size: 80,
      initialX: '80%',
      initialY: '60%',
      color: 'from-purple-500/20 to-transparent',
      duration: 25,
      delay: 2,
    },
    {
      size: 100,
      initialX: '50%',
      initialY: '80%',
      color: 'from-pink-500/20 to-transparent',
      duration: 18,
      delay: 4,
    },
    {
      size: 60,
      initialX: '20%',
      initialY: '70%',
      color: 'from-blue-500/15 to-transparent',
      duration: 22,
      delay: 1,
    },
    {
      size: 90,
      initialX: '70%',
      initialY: '30%',
      color: 'from-purple-500/15 to-transparent',
      duration: 24,
      delay: 3,
    },
  ]

  return (
    <div className={cn("absolute inset-0 overflow-hidden pointer-events-none", className)}>
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute bg-gradient-to-br ${shape.color} rounded-full blur-xl`}
          style={{
            width: `${shape.size}px`,
            height: `${shape.size}px`,
            left: shape.initialX,
            top: shape.initialY,
          }}
          animate={{
            x: [
              '0vw',
              `${Math.random() * 100 - 50}vw`,
              `${Math.random() * 100 - 50}vw`,
              '0vw',
            ],
            y: [
              '0vh',
              `${Math.random() * 100 - 50}vh`,
              `${Math.random() * 100 - 50}vh`,
              '0vh',
            ],
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.4, 0.3],
          }}
          transition={{
            duration: shape.duration,
            delay: shape.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}


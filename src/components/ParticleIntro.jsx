import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ParticleTextEffect from './ui/particle-text-effect'

const SEQUENCE = [
  {
    id: 'anita',
    text: 'ANITA DANTANI',
    gradientClass: 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400',
    duration: 1500,
  },
]

const ParticleIntro = ({ onFinished }) => {
  const [index, setIndex] = React.useState(0)
  const [isComplete, setIsComplete] = React.useState(false)

  React.useEffect(() => {
    if (isComplete && onFinished) {
      // Wait 1 second after text forms, then fade out
      const timer = setTimeout(() => {
        onFinished()
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [isComplete, onFinished])

  const current = SEQUENCE[0] // Only one item now

  const handleTextComplete = () => {
    setIsComplete(true)
  }

  // Animated gradient background orbs
  const gradientOrbs = [
    {
      initial: { scale: 0, opacity: 0 },
      animate: {
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        x: [0, 100, 0],
        y: [0, 50, 0],
      },
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
      className: 'absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-transparent rounded-full blur-[100px]',
    },
    {
      initial: { scale: 0, opacity: 0 },
      animate: {
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.6, 0.3],
        x: [0, -100, 0],
        y: [0, -50, 0],
      },
      transition: {
        duration: 10,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 1,
      },
      className: 'absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-transparent rounded-full blur-[120px]',
    },
    {
      initial: { scale: 0, opacity: 0 },
      animate: {
        scale: [1, 1.4, 1],
        rotate: [0, 180, 360],
        opacity: [0.2, 0.4, 0.2],
      },
      transition: {
        duration: 12,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: 0.5,
      },
      className: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-pink-500/15 via-blue-500/10 to-transparent rounded-full blur-[80px]',
    },
  ]

  return (
    <motion.div 
      className="fixed inset-0 bg-black overflow-hidden" 
      style={{ width: '100vw', height: '100vh', minHeight: '-webkit-fill-available' }}
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      {/* Animated gradient background orbs */}
      {gradientOrbs.map((orb, index) => (
        <motion.div
          key={index}
          className={orb.className}
          initial={orb.initial}
          animate={orb.animate}
          transition={orb.transition}
        />
      ))}

      {/* Main particle text effect container with smooth animations */}
      <motion.div 
        className="absolute inset-0 w-full h-full z-10"
        style={{ width: '100%', height: '100%' }}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          ease: [0.4, 0, 0.2, 1],
          delay: 0.2,
        }}
      >
        <ParticleTextEffect
          text={current.text}
          gradientClass={current.gradientClass}
          onComplete={handleTextComplete}
          className="w-full h-full"
        />
      </motion.div>

      {/* Subtle glow effect that pulses */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{
          background: 'radial-gradient(circle at center, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
        }}
      />
    </motion.div>
  )
}

export default ParticleIntro



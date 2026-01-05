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

  return (
    <div 
      className="fixed inset-0 bg-black" 
      style={{ width: '100vw', height: '100vh', minHeight: '-webkit-fill-available' }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 w-full h-full" style={{ width: '100%', height: '100%' }}>
        <ParticleTextEffect
          text={current.text}
          gradientClass={current.gradientClass}
          onComplete={handleTextComplete}
          className="w-full h-full"
        />
      </div>
    </div>
  )
}

export default ParticleIntro



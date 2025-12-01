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
    <div className="flex h-screen w-screen items-center justify-center bg-black" aria-hidden="true">
      <div className="w-full h-full max-w-6xl max-h-[600px] relative">
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



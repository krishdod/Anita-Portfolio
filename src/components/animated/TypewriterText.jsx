import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

export function TypewriterText({ 
  text, 
  delay = 0, 
  speed = 50,
  className = '',
  showCursor = true,
  onComplete
}) {
  const [displayedText, setDisplayedText] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (currentIndex < text.length) {
        setDisplayedText(prev => prev + text[currentIndex])
        setCurrentIndex(prev => prev + 1)
      } else if (!isComplete) {
        setIsComplete(true)
        if (onComplete) onComplete()
      }
    }, currentIndex === 0 ? delay : speed)

    return () => clearTimeout(timeout)
  }, [currentIndex, text, delay, speed, isComplete, onComplete])

  return (
    <span className={className}>
      {displayedText}
      {showCursor && !isComplete && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
          className="inline-block w-0.5 h-[1em] bg-current ml-1"
        />
      )}
    </span>
  )
}

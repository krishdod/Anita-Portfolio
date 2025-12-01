import React, { useEffect, useState, useRef } from 'react'
import { motion, useSpring, useMotionValue } from 'framer-motion'

const springConfig = {
  mass: 0.5,
  stiffness: 150,
  damping: 20,
}

const fastSpringConfig = {
  mass: 0.3,
  stiffness: 300,
  damping: 25,
}

function DefaultCursor({ isMoving, isHovering, isClicking }) {
  return (
    <div className="relative h-10 w-10">
      {/* Outer animated ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-primary/60"
        animate={{
          scale: isHovering ? 1.5 : isMoving ? 1.2 : 1,
          opacity: isHovering ? 0.8 : isMoving ? 0.6 : 0.4,
        }}
        transition={{ duration: 0.3 }}
        style={{
          boxShadow: isHovering
            ? '0 0 30px rgba(59, 130, 246, 0.8), 0 0 60px rgba(147, 51, 234, 0.4)'
            : '0 0 20px rgba(59, 130, 246, 0.5)',
        }}
      />
      
      {/* Middle pulse ring */}
      <motion.div
        className="absolute inset-[3px] rounded-full border border-primary/40"
        animate={{
          scale: isMoving ? [1, 1.1, 1] : 1,
          opacity: isMoving ? [0.6, 0.8, 0.6] : 0.4,
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
      
      {/* Gradient core */}
      <motion.div
        className="absolute inset-[6px] rounded-full bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500"
        animate={{
          scale: isClicking ? 0.7 : isHovering ? 1.1 : 1,
          opacity: isHovering ? 1 : 0.9,
        }}
        transition={{ duration: 0.2 }}
        style={{
          filter: 'blur(2px)',
          boxShadow: '0 0 15px rgba(59, 130, 246, 0.8)',
        }}
      />
      
      {/* Center dot */}
      <motion.div
        className="absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
        animate={{
          scale: isClicking ? 0.8 : isHovering ? 1.3 : 1,
        }}
        transition={{ duration: 0.15 }}
        style={{
          boxShadow: '0 0 10px rgba(255, 255, 255, 0.9), 0 0 20px rgba(59, 130, 246, 0.6)',
        }}
      />
      
      {/* Sparkle effect on hover */}
      {isHovering && (
        <>
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-white"
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                scale: 0,
              }}
              animate={{
                x: Math.cos((i * Math.PI * 2) / 4) * 20,
                y: Math.sin((i * Math.PI * 2) / 4) * 20,
                opacity: [1, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
            />
          ))}
        </>
      )}
    </div>
  )
}

export function CustomCursor({ cursor, className = '' }) {
  const [isMoving, setIsMoving] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const cursorRef = useRef(null)

  const cursorX = useSpring(-100, fastSpringConfig)
  const cursorY = useSpring(-100, fastSpringConfig)
  const rotation = useSpring(0, { ...springConfig, damping: 30 })
  const scale = useSpring(1, { ...springConfig, damping: 28, stiffness: 400 })

  // Magnetic effect values
  const magneticX = useMotionValue(0)
  const magneticY = useMotionValue(0)
  const magneticXSpring = useSpring(magneticX, springConfig)
  const magneticYSpring = useSpring(magneticY, springConfig)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let lastX = 0
    let lastY = 0
    let currentInteractive = null

    const handleMouseMove = (event) => {
      const targetX = event.clientX
      const targetY = event.clientY

      const currentX = cursorX.get()
      const currentY = cursorY.get()

      const dx = targetX - currentX
      const dy = targetY - currentY
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Calculate angle for rotation
      const angle = Math.atan2(dy, dx) * (180 / Math.PI)
      
      // Dynamic scale based on movement speed
      const speed = Math.sqrt(
        Math.pow(targetX - lastX, 2) + Math.pow(targetY - lastY, 2)
      )
      const speedScale = Math.min(1 + speed / 800, 1.4)

      cursorX.set(targetX)
      cursorY.set(targetY)
      rotation.set(angle)
      scale.set(speedScale)

      lastX = targetX
      lastY = targetY

      setIsMoving(true)
      window.clearTimeout(handleMouseMove._timeoutId)
      handleMouseMove._timeoutId = window.setTimeout(() => setIsMoving(false), 100)
    }

    const handleMouseDown = () => {
      setIsClicking(true)
      scale.set(0.85)
    }

    const handleMouseUp = () => {
      setIsClicking(false)
      scale.set(isHovering ? 1.2 : 1)
    }

    // Magnetic effect on interactive elements
    const handleMouseOver = (e) => {
      const target = e.target
      const interactive = target.closest('a, button, [role="button"], input, textarea, select, [data-cursor="hover"]')
      
      if (interactive && interactive !== currentInteractive) {
        currentInteractive = interactive
        setIsHovering(true)
        scale.set(1.5)
        
        const handleMagneticMove = (e) => {
          const rect = interactive.getBoundingClientRect()
          const centerX = rect.left + rect.width / 2
          const centerY = rect.top + rect.height / 2
          
          const dx = e.clientX - centerX
          const dy = e.clientY - centerY
          const distance = Math.sqrt(dx * dx + dy * dy)
          const maxDistance = 50
          
          if (distance < maxDistance) {
            const force = (maxDistance - distance) / maxDistance
            magneticX.set(dx * force * 0.3)
            magneticY.set(dy * force * 0.3)
          } else {
            magneticX.set(0)
            magneticY.set(0)
          }
        }
        
        const handleMouseLeave = () => {
          currentInteractive = null
          setIsHovering(false)
          scale.set(1)
          magneticX.set(0)
          magneticY.set(0)
          interactive.removeEventListener('mousemove', handleMagneticMove)
          interactive.removeEventListener('mouseleave', handleMouseLeave)
        }
        
        interactive.addEventListener('mousemove', handleMagneticMove)
        interactive.addEventListener('mouseleave', handleMouseLeave)
      }
    }

    const previousCursor = document.body.style.cursor
    document.body.style.cursor = 'none'

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mouseup', handleMouseUp)
    document.addEventListener('mouseover', handleMouseOver)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseover', handleMouseOver)
      window.clearTimeout(handleMouseMove._timeoutId)
      document.body.style.cursor = previousCursor
    }
  }, [cursorX, cursorY, rotation, scale, isHovering, magneticX, magneticY, magneticXSpring, magneticYSpring])

  const CursorContent = cursor ?? (
    <DefaultCursor isMoving={isMoving} isHovering={isHovering} isClicking={isClicking} />
  )

  return (
    <motion.div
      ref={cursorRef}
      className={`pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block ${className}`}
      style={{
        x: cursorX,
        y: cursorY,
        rotate: rotation,
        scale,
        translateX: '-50%',
        translateY: '-50%',
      }}
    >
      <motion.div
        style={{
          x: magneticXSpring,
          y: magneticYSpring,
        }}
      >
        {CursorContent}
      </motion.div>
    </motion.div>
  )
}

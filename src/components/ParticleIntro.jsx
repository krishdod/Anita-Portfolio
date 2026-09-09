import React, { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ParticleTextEffect from './ui/particle-text-effect'

const SEQUENCE = [
  {
    id: 'anita',
    text: 'ANITA DANTANI',
    gradientClass: 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400',
  },
]

function waitForHeroName(maxFrames = 24) {
  return new Promise((resolve) => {
    let frames = 0
    const tick = () => {
      const node = document.getElementById('home-hero-name')
      if (node) {
        const rect = node.getBoundingClientRect()
        if (rect.width > 8 && rect.height > 8) {
          resolve(node)
          return
        }
      }
      frames += 1
      if (frames >= maxFrames) {
        resolve(null)
        return
      }
      requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  })
}

const ParticleIntro = ({ onFormed, onHandoffComplete }) => {
  const particleRef = useRef(null)
  const canvasLayerRef = useRef(null)
  const [backdropOpacity, setBackdropOpacity] = useState(1)
  const [isHandingOff, setIsHandingOff] = useState(false)
  const [canvasMotion, setCanvasMotion] = useState({
    x: 0,
    y: 0,
    scale: 1,
    opacity: 1,
  })
  const [canvasReady, setCanvasReady] = useState(false)
  const handoffStartedRef = useRef(false)
  const finishedRef = useRef(false)
  const safetyTimerRef = useRef(null)

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    if (safetyTimerRef.current) window.clearTimeout(safetyTimerRef.current)
    onHandoffComplete?.()
  }, [onHandoffComplete])

  const runHandoff = useCallback(async () => {
    if (handoffStartedRef.current) return
    handoffStartedRef.current = true
    setIsHandingOff(true)

    onFormed?.()
    setBackdropOpacity(0)

    const heroName = await waitForHeroName()
    const layer = canvasLayerRef.current

    if (!layer) {
      particleRef.current?.dissolve?.()
      safetyTimerRef.current = window.setTimeout(finish, 700)
      return
    }

    if (!heroName) {
      setCanvasMotion((prev) => ({ ...prev, opacity: 0, scale: 0.92 }))
      particleRef.current?.dissolve?.()
      safetyTimerRef.current = window.setTimeout(finish, 700)
      return
    }

    const first = layer.getBoundingClientRect()
    const last = heroName.getBoundingClientRect()
    const firstCenter = { x: first.left + first.width / 2, y: first.top + first.height / 2 }
    const lastCenter = { x: last.left + last.width / 2, y: last.top + last.height / 2 }

    const scale = Math.min(last.width / first.width, last.height / first.height) * 2.35
    const clampedScale = Math.max(0.12, Math.min(scale, 0.55))

    setCanvasMotion({
      x: lastCenter.x - firstCenter.x,
      y: lastCenter.y - firstCenter.y,
      scale: clampedScale,
      opacity: 0.9,
    })

    // After the FLIP settles, dissolve into the real typography.
    window.setTimeout(() => {
      if (finishedRef.current) return
      heroName.setAttribute('data-handoff', 'revealing')
      particleRef.current?.dissolve?.()
      safetyTimerRef.current = window.setTimeout(finish, 1200)
    }, 880)
  }, [finish, onFormed])

  const handleFormed = useCallback(() => {
    runHandoff()
  }, [runHandoff])

  const handleDissolveComplete = useCallback(() => {
    const heroName = document.getElementById('home-hero-name')
    heroName?.setAttribute('data-handoff', 'done')
    setCanvasMotion((prev) => ({ ...prev, opacity: 0 }))
    finish()
  }, [finish])

  useEffect(() => {
    const timer = window.setTimeout(() => setCanvasReady(true), 40)
    return () => {
      window.clearTimeout(timer)
      finishedRef.current = true
      if (safetyTimerRef.current) window.clearTimeout(safetyTimerRef.current)
    }
  }, [])

  const current = SEQUENCE[0]

  const gradientOrbs = [
    {
      animate: {
        scale: [1, 1.2, 1],
        opacity: [0.3, 0.5, 0.3],
        x: [0, 100, 0],
        y: [0, 50, 0],
      },
      transition: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
      className:
        'absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 via-purple-500/15 to-transparent rounded-full blur-[100px]',
    },
    {
      animate: {
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.6, 0.3],
        x: [0, -100, 0],
        y: [0, -50, 0],
      },
      transition: { duration: 10, repeat: Infinity, ease: 'easeInOut', delay: 1 },
      className:
        'absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 via-pink-500/15 to-transparent rounded-full blur-[120px]',
    },
    {
      animate: {
        scale: [1, 1.4, 1],
        rotate: [0, 180, 360],
        opacity: [0.2, 0.4, 0.2],
      },
      transition: { duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
      className:
        'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-pink-500/15 via-blue-500/10 to-transparent rounded-full blur-[80px]',
    },
  ]

  return (
    <div className="particle-intro absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute inset-0 bg-black"
        initial={{ opacity: 1 }}
        animate={{ opacity: backdropOpacity }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      />

      {backdropOpacity > 0.15 &&
        gradientOrbs.map((orb, index) => (
          <motion.div
            key={index}
            className={orb.className}
            initial={{ scale: 0, opacity: 0 }}
            animate={orb.animate}
            transition={orb.transition}
            style={{ opacity: backdropOpacity }}
          />
        ))}

      <motion.div
        ref={canvasLayerRef}
        className="particle-intro-canvas absolute inset-0 z-10 origin-center will-change-transform"
        initial={{ opacity: 0, scale: 0.95, x: 0, y: 0 }}
        animate={{
          opacity: canvasReady ? canvasMotion.opacity : 0,
          scale: canvasReady ? canvasMotion.scale : 0.95,
          x: canvasMotion.x,
          y: canvasMotion.y,
        }}
        transition={{
          duration: isHandingOff ? 0.85 : 0.45,
          ease: [0.22, 1, 0.36, 1],
          delay: isHandingOff ? 0 : 0.08,
        }}
      >
        <ParticleTextEffect
          ref={particleRef}
          text={current.text}
          gradientClass={current.gradientClass}
          onFormed={handleFormed}
          onDissolveComplete={handleDissolveComplete}
          className="w-full h-full"
        />
      </motion.div>

      <motion.div
        className="absolute inset-0 pointer-events-none z-[5]"
        animate={{ opacity: backdropOpacity > 0.4 ? [0.1, 0.2, 0.1] : 0 }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          background:
            'radial-gradient(circle at center, rgba(147, 51, 234, 0.1) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}

export default ParticleIntro

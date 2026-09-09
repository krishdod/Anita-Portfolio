import { useEffect, useState } from 'react'
import { motion, useMotionValue } from 'framer-motion'
import { useMotionPreference } from '../../hooks/useMotionPreference'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export function SmoothCursor() {
  const { reducedMotion } = useMotionPreference()
  const pointer = useMediaQuery('(pointer: fine) and (min-width: 768px)')
  const [visible, setVisible] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const enabled = pointer && !reducedMotion

  useEffect(() => {
    if (!enabled) { setVisible(false); return }
    const move = (event) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
      setVisible(true)
    }
    const hide = () => setVisible(false)
    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
    }
  }, [enabled, mouseX, mouseY])

  if (!enabled || !visible) return null
  return <motion.div aria-hidden="true" className="pointer-events-none fixed top-0 left-0 z-[900] h-6 w-6 rounded-full border border-primary/45" style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }} />
}


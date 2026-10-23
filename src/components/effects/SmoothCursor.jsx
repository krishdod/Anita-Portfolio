import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { useMotionPreference } from '../../hooks/useMotionPreference'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export function SmoothCursor() {
  const { reducedMotion } = useMotionPreference()
  const pointer = useMediaQuery('(pointer: fine) and (min-width: 768px)')
  const [visible, setVisible] = useState(false)
  const [projectHover, setProjectHover] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const x = useSpring(mouseX, { stiffness: 260, damping: 28 })
  const y = useSpring(mouseY, { stiffness: 260, damping: 28 })
  const enabled = pointer && !reducedMotion

  useEffect(() => {
    if (!enabled) { setVisible(false); setProjectHover(false); return }
    const move = (event) => {
      mouseX.set(event.clientX)
      mouseY.set(event.clientY)
      setVisible(true)
    }
    const hide = () => setVisible(false)
    const over = (event) => setProjectHover(Boolean(event.target instanceof Element && event.target.closest('.project-card, .studio-project-portal')))
    window.addEventListener('mousemove', move, { passive: true })
    document.addEventListener('mouseleave', hide)
    window.addEventListener('blur', hide)
    document.addEventListener('pointerover', over, { passive: true })
    return () => {
      window.removeEventListener('mousemove', move)
      document.removeEventListener('mouseleave', hide)
      window.removeEventListener('blur', hide)
      document.removeEventListener('pointerover', over)
    }
  }, [enabled, mouseX, mouseY])

  if (!enabled || !visible) return null
  return <motion.div aria-hidden="true" className="studio-cursor pointer-events-none fixed top-0 left-0 z-[900] rounded-full" data-project-hover={projectHover || undefined}
    style={{ x, y, translateX: '-50%', translateY: '-50%' }} animate={{ width: projectHover ? 70 : 24, height: projectHover ? 70 : 24 }}
    transition={{ duration: .25, ease: [.22, 1, .36, 1] }}><span>{projectHover ? 'View ↗' : ''}</span></motion.div>
}


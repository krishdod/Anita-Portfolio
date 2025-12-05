import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import { HiArrowUpRight } from 'react-icons/hi2'

export function CursorButton() {
  const [isHovering, setIsHovering] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const cursorX = useSpring(mouseX, { stiffness: 500, damping: 28 })
  const cursorY = useSpring(mouseY, { stiffness: 500, damping: 28 })

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Check if user prefers reduced motion or doesn't have a precise pointer
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches

    if (prefersReducedMotion || !hasFinePointer) {
      return
    }

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)

      // Check if hovering over a work card
      const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY)
      const workCard = elementUnderCursor?.closest('[data-work-card]')
      setIsHovering(!!workCard)
    }

    window.addEventListener('mousemove', handleMouseMove)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [mouseX, mouseY])

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null
  }

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      style={{
        x: cursorX,
        y: cursorY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{
        opacity: isHovering ? 1 : 0,
        scale: isHovering ? 1 : 0.8,
      }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-black/90 backdrop-blur-sm px-6 py-2.5 text-[11px] font-semibold text-white shadow-lg shadow-black/40 uppercase tracking-[0.2em] whitespace-nowrap">
        <span>View project</span>
        <HiArrowUpRight size={14} />
      </div>
    </motion.div>
  )
}


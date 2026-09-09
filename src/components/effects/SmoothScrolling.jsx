import { useEffect } from 'react'
import Lenis from 'lenis'
import { useMotionPreference } from '../../hooks/useMotionPreference'
import { useMediaQuery } from '../../hooks/useMediaQuery'

export function SmoothScrolling() {
  const { reducedMotion } = useMotionPreference()
  const finePointer = useMediaQuery('(pointer: fine)')

  useEffect(() => {
    if (reducedMotion || !finePointer) return
    const lenis = new Lenis({ duration: 1.05, smoothWheel: true, wheelMultiplier: 0.9 })
    window.lenis = lenis
    let frame
    const tick = (time) => {
      lenis.raf(time)
      frame = requestAnimationFrame(tick)
    }
    const updateVisibility = () => {
      cancelAnimationFrame(frame)
      if (!document.hidden) frame = requestAnimationFrame(tick)
    }
    // Keep the scrolling engine in sync with intro and dialog scroll locks.
    const syncLock = () => document.body.style.overflow === 'hidden' ? lenis.stop() : lenis.start()
    const observer = new MutationObserver(syncLock)
    observer.observe(document.body, { attributes: true, attributeFilter: ['style'] })
    syncLock()
    updateVisibility()
    document.addEventListener('visibilitychange', updateVisibility)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', updateVisibility)
      cancelAnimationFrame(frame)
      lenis.destroy()
      if (window.lenis === lenis) delete window.lenis
    }
  }, [reducedMotion, finePointer])

  return null
}

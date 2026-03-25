import { useEffect, useRef, useState } from "react"
import { motion, useSpring } from "framer-motion"

export function SmoothCursor() {
  const cursorRef = useRef(null)
  const cursorDotRef = useRef(null)
  const [isHoveringWorkCard, setIsHoveringWorkCard] = useState(false)

  const mouseX = useSpring(0, {
    stiffness: 500,
    damping: 28,
  })
  const mouseY = useSpring(0, {
    stiffness: 500,
    damping: 28,
  })

  const dotX = useSpring(0, {
    stiffness: 700,
    damping: 35,
  })
  const dotY = useSpring(0, {
    stiffness: 700,
    damping: 35,
  })

  useEffect(() => {
    if (typeof window === "undefined") return

    // Check if user prefers reduced motion or doesn't have a precise pointer
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches

    if (prefersReducedMotion || !hasFinePointer) {
      return
    }

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
      dotX.set(e.clientX)
      dotY.set(e.clientY)

      // Check if hovering over a work card
      const elementUnderCursor = document.elementFromPoint(e.clientX, e.clientY)
      const workCard = elementUnderCursor?.closest('[data-work-card]')
      setIsHoveringWorkCard(!!workCard)
    }

    const handleMouseDown = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = "scale(0.8)"
      }
    }

    const handleMouseUp = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = "scale(1)"
      }
    }

    // Hide default cursor
    document.body.style.cursor = "none"

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mouseup", handleMouseUp)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mouseup", handleMouseUp)
      document.body.style.cursor = "auto"
    }
  }, [mouseX, mouseY, dotX, dotY])

  return (
    <>
      {/* Premium cursor ring — subtle gradient + glow, no blend-modes */}
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: isHoveringWorkCard ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="relative h-9 w-9 rounded-full">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-primary/35 via-accent/20 to-transparent blur-[6px] opacity-80" />
          <div className="absolute inset-0 rounded-full bg-background/25 backdrop-blur-md ring-1 ring-foreground/10 shadow-[0_10px_30px_rgba(0,0,0,0.10)] dark:bg-white/[0.06] dark:ring-white/15 dark:shadow-[0_14px_44px_rgba(0,0,0,0.45)]" />
        </div>
      </motion.div>

      <motion.div
        ref={cursorDotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: isHoveringWorkCard ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="h-2 w-2 rounded-full bg-foreground/85 shadow-[0_0_18px_rgba(0,0,0,0.18)] dark:bg-white/90 dark:shadow-[0_0_22px_rgba(255,255,255,0.12)]" />
      </motion.div>
    </>
  )
}


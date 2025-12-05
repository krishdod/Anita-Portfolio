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
      {/* Main cursor ring - hide when hovering over work cards */}
      <motion.div
        ref={cursorRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block mix-blend-difference"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: isHoveringWorkCard ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="h-6 w-6 rounded-full border-2 border-white transition-transform duration-200" />
      </motion.div>

      {/* Inner dot - hide when hovering over work cards */}
      <motion.div
        ref={cursorDotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block mix-blend-difference"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{ opacity: isHoveringWorkCard ? 0 : 1 }}
        transition={{ duration: 0.2 }}
      >
        <div className="h-1.5 w-1.5 rounded-full bg-white transition-transform duration-200" />
      </motion.div>
    </>
  )
}


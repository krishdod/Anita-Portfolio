import { useEffect, useState } from "react"
import {
  motion,
  useMotionValue,
} from "framer-motion"

export function SmoothCursor() {
  const [enabled, setEnabled] = useState(false)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  useEffect(() => {
    if (typeof window === "undefined") return

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches
    if (prefersReducedMotion || !hasFinePointer) return

    setEnabled(true)
    const prevCursor = document.body.style.cursor
    document.body.style.cursor = "none"

    const handleMouseMove = (e) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      document.body.style.cursor = prevCursor || "auto"
    }
  }, [mouseX, mouseY])

  if (!enabled) return null

  return (
    <>
      {/* Lime pointer dot (leader) */}
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <div className="h-2.5 w-2.5 rounded-full bg-lime-400 shadow-[0_0_16px_rgba(163,230,53,0.85)]" />
      </motion.div>
    </>
  )
}


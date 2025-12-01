import React, { useEffect, useRef, useState } from "react"
import { cn } from "../../lib/utils"

export const SparklesCore = ({
  id,
  background,
  minSize,
  maxSize,
  particleDensity,
  className,
  particleColor,
}) => {
  const canvasRef = useRef(null)
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 })
  const canvasContainerRef = useRef(null)

  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasContainerRef.current) {
        setCanvasSize({
          width: canvasContainerRef.current.offsetWidth,
          height: canvasContainerRef.current.offsetHeight,
        })
      }
    }

    updateCanvasSize()
    window.addEventListener("resize", updateCanvasSize)
    return () => window.removeEventListener("resize", updateCanvasSize)
  }, [])

  useEffect(() => {
    if (!canvasRef.current) return
    if (!canvasSize.width || !canvasSize.height) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const area = canvasSize.width * canvasSize.height
    const baseDensity = particleDensity ?? 40

    // Slightly reduce particle count on smaller screens to keep things smooth
    const isNarrow = canvasSize.width && canvasSize.width < 768
    const effectiveDensity = isNarrow ? baseDensity * 0.6 : baseDensity

    const areaFactor = Math.max(area / (1920 * 1080), 0.3) // scale gently with viewport size
    const MAX_PARTICLES = 450

    const particleCount = Math.min(
      Math.floor(effectiveDensity * areaFactor),
      MAX_PARTICLES,
    )

    if (particleCount <= 0) return

    const particles = []

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvasSize.width,
        y: Math.random() * canvasSize.height,
        size: Math.random() * ((maxSize || 2) - (minSize || 0.5)) + (minSize || 0.5),
        speedX: Math.random() * 0.3 - 0.15,
        speedY: Math.random() * 0.3 - 0.15,
        opacity: Math.random(),
        fadeSpeed: Math.random() * 0.015 + 0.005,
      })
    }

    let animationFrameId

    const animate = () => {
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height)

      particles.forEach((particle) => {
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.opacity += particle.fadeSpeed

        if (particle.opacity > 1 || particle.opacity < 0) {
          particle.fadeSpeed = -particle.fadeSpeed
        }

        if (particle.x < 0 || particle.x > canvasSize.width) particle.speedX = -particle.speedX
        if (particle.y < 0 || particle.y > canvasSize.height) particle.speedY = -particle.speedY

        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${particleColor || "255, 255, 255"}, ${particle.opacity})`
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationFrameId)
  }, [canvasSize, minSize, maxSize, particleDensity, particleColor])

  return (
    <div ref={canvasContainerRef} className={cn("absolute inset-0", className)}>
      <canvas
        ref={canvasRef}
        id={id}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{ background: background || "transparent" }}
        className="w-full h-full"
      />
    </div>
  )
}

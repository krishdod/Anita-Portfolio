import { useEffect, useRef } from "react"

// Spawn particles from screen edges - truly responsive to screen size
function getEdgeOffscreenPos(width, height) {
  // Calculate responsive padding - use 100% of the larger dimension
  // This ensures particles always spawn well outside the visible area for ANY screen size
  const maxDimension = Math.max(width, height)
  const minDimension = Math.min(width, height)
  
  // Use a larger padding to ensure particles are truly off-screen
  // For very large screens, use a percentage; for smaller screens, use a fixed minimum
  const padding = Math.max(maxDimension * 1.0, 500) // At least 500px or 100% of max dimension
  
  // Randomly select one of the four edges
  const edge = Math.floor(Math.random() * 4)
  
  switch (edge) {
    case 0: // Top edge
      return {
        x: Math.random() * width, // Random position along the top
        y: -padding // Well above the screen
      }
    case 1: // Right edge
      return {
        x: width + padding, // Well to the right of the screen
        y: Math.random() * height // Random position along the right
      }
    case 2: // Bottom edge
      return {
        x: Math.random() * width, // Random position along the bottom
        y: height + padding // Well below the screen
      }
    default: // Left edge (case 3)
      return {
        x: -padding, // Well to the left of the screen
        y: Math.random() * height // Random position along the left
      }
  }
}

class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 }
    this.vel = { x: 0, y: 0 }
    this.acc = { x: 0, y: 0 }
    this.target = { x: 0, y: 0 }

    this.closeEnoughTarget = 100
    this.maxSpeed = 1.0
    this.maxForce = 0.1
    this.particleSize = 10
    this.isKilled = false

    this.startColor = { r: 0, g: 0, b: 0 }
    this.targetColor = { r: 0, g: 0, b: 0 }
    this.colorWeight = 0
    this.colorBlendRate = 0.01
  }

  move() {
    let proximityMult = 1
    const distance = Math.sqrt(
      Math.pow(this.pos.x - this.target.x, 2) +
        Math.pow(this.pos.y - this.target.y, 2)
    )

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    const towardsTarget = {
      x: this.target.x - this.pos.x,
      y: this.target.y - this.pos.y,
    }

    const magnitude = Math.sqrt(
      towardsTarget.x * towardsTarget.x +
        towardsTarget.y * towardsTarget.y
    )

    if (magnitude > 0) {
      towardsTarget.x =
        (towardsTarget.x / magnitude) * this.maxSpeed * proximityMult
      towardsTarget.y =
        (towardsTarget.y / magnitude) * this.maxSpeed * proximityMult
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    }

    const steerMagnitude = Math.sqrt(
      steer.x * steer.x + steer.y * steer.y
    )
    if (steerMagnitude > 0) {
      steer.x = (steer.x / steerMagnitude) * this.maxForce
      steer.y = (steer.y / steerMagnitude) * this.maxForce
    }

    this.acc.x += steer.x
    this.acc.y += steer.y

    this.vel.x += this.acc.x
    this.vel.y += this.acc.y
    this.pos.x += this.vel.x
    this.pos.y += this.vel.y
    this.acc.x = 0
    this.acc.y = 0
  }

  draw(ctx, drawAsPoints, devicePixelRatio = 1) {
    if (this.colorWeight < 1.0) {
      this.colorWeight = Math.min(
        this.colorWeight + this.colorBlendRate,
        1.0
      )
    }

    const currentColor = {
      r: Math.round(
        this.startColor.r +
          (this.targetColor.r - this.startColor.r) * this.colorWeight
      ),
      g: Math.round(
        this.startColor.g +
          (this.targetColor.g - this.startColor.g) * this.colorWeight
      ),
      b: Math.round(
        this.startColor.b +
          (this.targetColor.b - this.startColor.b) * this.colorWeight
      ),
    }

    ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`

    if (drawAsPoints) {
      // Scale particle size based on device pixel ratio for crisp rendering
      const size = Math.max(1.5, 2 / devicePixelRatio)
      ctx.fillRect(this.pos.x, this.pos.y, size, size)
    } else {
      ctx.beginPath()
      ctx.arc(
        this.pos.x,
        this.pos.y,
        this.particleSize / 2,
        0,
        Math.PI * 2
      )
      ctx.fill()
    }
  }

  kill(displayWidth, displayHeight) {
    if (!this.isKilled) {
      // Send particle to a random edge of the screen - well outside display bounds
      const randomPos = getEdgeOffscreenPos(displayWidth, displayHeight)
      this.target.x = randomPos.x
      this.target.y = randomPos.y

      this.startColor = {
        r:
          this.startColor.r +
          (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g:
          this.startColor.g +
          (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b:
          this.startColor.b +
          (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0

      this.isKilled = true
    }
  }
}

export function ParticleTextEffect({
  text,
  className = "",
  gradientClass,
  onComplete,
  autoAdvance = false, // kept for compatibility
}) {
  const canvasRef = useRef(null)
  const animationRef = useRef()
  const particlesRef = useRef([])
  const frameCountRef = useRef(0)
  const hasFormedRef = useRef(false)
  const formationCompleteRef = useRef(false)
  const hasCompletedRef = useRef(false) // Prevent re-animation
  const isAnimatingRef = useRef(false) // Track if animation is running

  // Adjust pixel steps based on screen size for better mobile performance
  const getPixelSteps = (width) => {
    if (width < 640) return 4 // More particles on mobile for better detail
    if (width < 1024) return 5
    return 6 // Desktop
  }
  const drawAsPoints = true

  const formText = (word, canvas) => {
    const dpr = window.devicePixelRatio || 1
    // Get actual display size (not scaled size)
    const displayWidth = canvas.width / dpr
    const displayHeight = canvas.height / dpr
    
    const offscreenCanvas = document.createElement("canvas")
    offscreenCanvas.width = canvas.width
    offscreenCanvas.height = canvas.height
    const offscreenCtx = offscreenCanvas.getContext("2d")

    offscreenCtx.fillStyle = "white"
    // Responsive font size calculation for mobile
    const isMobile = displayWidth < 640
    const baseFontSize = isMobile 
      ? Math.min(displayWidth / (word.length * 0.5), 60)
      : Math.min(displayWidth / (word.length * 0.6), 120)
    const fontSize = Math.max(baseFontSize, 32) // Minimum 32px for readability
    offscreenCtx.font = `bold ${fontSize * dpr}px Arial`
    offscreenCtx.textAlign = "center"
    offscreenCtx.textBaseline = "middle"
    offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2)

    const imageData = offscreenCtx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    )
    const pixels = imageData.data

    let newColor = { r: 100, g: 150, b: 255 }

    if (gradientClass) {
      if (gradientClass.includes("blue"))
        newColor = { r: 59, g: 130, b: 246 }
      if (gradientClass.includes("purple"))
        newColor = { r: 147, g: 51, b: 234 }
      if (gradientClass.includes("pink"))
        newColor = { r: 236, g: 72, b: 153 }
      if (gradientClass.includes("yellow"))
        newColor = { r: 250, g: 204, b: 21 }
      if (gradientClass.includes("green"))
        newColor = { r: 34, g: 197, b: 94 }
    }

    const particles = particlesRef.current
    let particleIndex = 0

    const pixelSteps = getPixelSteps(canvas.width)
    const coordsIndexes = []
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      coordsIndexes.push(i)
    }

    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[coordsIndexes[i], coordsIndexes[j]] = [
        coordsIndexes[j],
        coordsIndexes[i],
      ]
    }

    for (const coordIndex of coordsIndexes) {
      const pixelIndex = coordIndex
      const alpha = pixels[pixelIndex + 3]

      if (alpha > 0) {
        // Convert canvas pixel coordinates to display coordinates
        const x = ((pixelIndex / 4) % canvas.width) / dpr
        const y = Math.floor(pixelIndex / 4 / canvas.width) / dpr

        let particle

        if (particleIndex < particles.length) {
          particle = particles[particleIndex]
          particle.isKilled = false
          particleIndex++
        } else {
          particle = new Particle()

          // Start particles from screen edges - truly responsive to ANY screen size
          // Get position well outside the display edges
          
          // Get position well outside the display edges
          const randomPos = getEdgeOffscreenPos(displayWidth, displayHeight)
          particle.pos.x = randomPos.x
          particle.pos.y = randomPos.y

          // Responsive particle properties for mobile
          const isMobile = displayWidth < 640
          particle.maxSpeed = isMobile 
            ? Math.random() * 8 + 6 
            : Math.random() * 10 + 8
          particle.maxForce = particle.maxSpeed * 0.1
          // Smaller particles on mobile for better detail
          particle.particleSize = isMobile
            ? Math.random() * 3 + 3
            : Math.random() * 6 + 6
          particle.colorBlendRate =
            Math.random() * 0.0275 + 0.0025

          particles.push(particle)
        }

        particle.startColor = {
          r:
            particle.startColor.r +
            (particle.targetColor.r - particle.startColor.r) *
              particle.colorWeight,
          g:
            particle.startColor.g +
            (particle.targetColor.g - particle.startColor.g) *
              particle.colorWeight,
          b:
            particle.startColor.b +
            (particle.targetColor.b - particle.startColor.b) *
              particle.colorWeight,
        }
        particle.targetColor = newColor
        particle.colorWeight = 0

        particle.target.x = x
        particle.target.y = y
      }
    }

    // Kill unused particles - pass display dimensions, not canvas dimensions
    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(displayWidth, displayHeight)
    }

    hasFormedRef.current = false
    formationCompleteRef.current = false
  }

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const particles = particlesRef.current
    const dpr = window.devicePixelRatio || 1

    // Clear with proper scaling
    ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr)

    let allReachedTarget = true
    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]

      if (!particle.isKilled) {
        particle.move()

        const distance = Math.sqrt(
          Math.pow(particle.pos.x - particle.target.x, 2) +
            Math.pow(particle.pos.y - particle.target.y, 2)
        )
        if (distance > 5) {
          allReachedTarget = false
        }
      }

      particle.draw(ctx, drawAsPoints, dpr)

      if (particle.isKilled) {
        // Remove particles that are well outside the screen edges
        // Use responsive margin based on screen size
        const dpr = window.devicePixelRatio || 1
        const displayWidth = canvas.width / dpr
        const displayHeight = canvas.height / dpr
        const maxDimension = Math.max(displayWidth, displayHeight)
        // Use larger margin to ensure particles are removed only when truly far off-screen
        const margin = Math.max(maxDimension * 1.5, 800) // At least 800px or 150% of max dimension

        if (
          particle.pos.x < -margin ||
          particle.pos.x > displayWidth + margin ||
          particle.pos.y < -margin ||
          particle.pos.y > displayHeight + margin
        ) {
          particles.splice(i, 1)
        }
      }
    }

    if (
      allReachedTarget &&
      particles.length > 0 &&
      !hasFormedRef.current &&
      !hasCompletedRef.current
    ) {
      hasFormedRef.current = true
      formationCompleteRef.current = true
      hasCompletedRef.current = true

      // Stop the animation loop once complete
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      isAnimatingRef.current = false

      if (onComplete) {
        setTimeout(() => {
          onComplete()
        }, 100)
      }
      return // Exit animation loop
    }

    // Only continue animation if not completed
    if (!hasCompletedRef.current && isAnimatingRef.current) {
      frameCountRef.current += 1
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Get device pixel ratio for crisp rendering on high-DPI displays
    const dpr = window.devicePixelRatio || 1

    // Function to update canvas size responsively with proper DPR handling
    const updateCanvasSize = () => {
      const container = canvas.parentElement
      let width, height
      
      if (container) {
        width = container.clientWidth || window.innerWidth
        height = container.clientHeight || window.innerHeight
      } else {
        width = window.innerWidth || 1200
        height = window.innerHeight || 600
      }

      // Set actual size in memory (scaled for device pixel ratio)
      canvas.width = width * dpr
      canvas.height = height * dpr

      // Scale the canvas back down using CSS
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      // Scale the drawing context so everything draws at the correct size
      const ctx = canvas.getContext("2d")
      ctx.scale(dpr, dpr)
    }

    // Set initial canvas size
    updateCanvasSize()

    // Only initialize if not already completed
    if (!hasCompletedRef.current && !isAnimatingRef.current) {
      // Initialize with text
      formText(text, canvas)

      // Start animation
      isAnimatingRef.current = true
      animate()
    }

    // Handle window resize for responsive behavior
    const handleResize = () => {
      // Don't re-form text if animation is already complete
      if (hasCompletedRef.current) return
      
      updateCanvasSize()
      // Only re-form text if animation hasn't completed
      if (!hasCompletedRef.current) {
        formText(text, canvas)
      }
    }

    window.addEventListener('resize', handleResize)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      isAnimatingRef.current = false
      window.removeEventListener('resize', handleResize)
    }
  }, [text, gradientClass]) // Removed onComplete from dependencies to prevent re-renders

  return (
    <div className={`relative w-full h-full ${className}`}>
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ display: "block" }}
      />
    </div>
  )
}

export default ParticleTextEffect

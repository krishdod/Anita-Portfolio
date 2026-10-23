import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react'

// Spawn particles from screen edges - truly responsive to screen size
function getEdgeOffscreenPos(width, height) {
  const maxDimension = Math.max(width, height)
  const padding = Math.max(maxDimension * 1.0, 500)
  const edge = Math.floor(Math.random() * 4)

  switch (edge) {
    case 0:
      return { x: Math.random() * width, y: -padding }
    case 1:
      return { x: width + padding, y: Math.random() * height }
    case 2:
      return { x: Math.random() * width, y: height + padding }
    default:
      return { x: -padding, y: Math.random() * height }
  }
}

class Particle {
  constructor() {
    this.pos = { x: 0, y: 0 }
    this.vel = { x: 0, y: 0 }
    this.acc = { x: 0, y: 0 }
    this.target = { x: 0, y: 0 }
    this.home = { x: 0, y: 0 }

    this.closeEnoughTarget = 65
    this.maxSpeed = 2.2
    this.maxForce = 0.2
    this.particleSize = 10
    this.isKilled = false

    this.startColor = { r: 0, g: 0, b: 0 }
    this.targetColor = { r: 0, g: 0, b: 0 }
    this.colorWeight = 0
    this.colorBlendRate = 0.01
    this.driftPhase = Math.random() * Math.PI * 2
    this.driftAmp = 0.35 + Math.random() * 0.55
  }

  move(mode = 'form') {
    let proximityMult = 1
    const aimX = mode === 'idle' ? this.home.x + Math.cos(this.driftPhase) * this.driftAmp : this.target.x
    const aimY = mode === 'idle' ? this.home.y + Math.sin(this.driftPhase * 0.9) * this.driftAmp : this.target.y

    if (mode === 'idle') {
      this.driftPhase += 0.02 + this.driftAmp * 0.01
    }

    const distance = Math.sqrt(
      Math.pow(this.pos.x - aimX, 2) + Math.pow(this.pos.y - aimY, 2)
    )

    if (distance < this.closeEnoughTarget) {
      proximityMult = distance / this.closeEnoughTarget
    }

    const towardsTarget = {
      x: aimX - this.pos.x,
      y: aimY - this.pos.y,
    }

    const magnitude = Math.sqrt(
      towardsTarget.x * towardsTarget.x + towardsTarget.y * towardsTarget.y
    )

    if (magnitude > 0) {
      const speed = mode === 'idle' ? Math.min(this.maxSpeed * 0.35, 1.2) : this.maxSpeed
      towardsTarget.x = (towardsTarget.x / magnitude) * speed * proximityMult
      towardsTarget.y = (towardsTarget.y / magnitude) * speed * proximityMult
    }

    const steer = {
      x: towardsTarget.x - this.vel.x,
      y: towardsTarget.y - this.vel.y,
    }

    const steerMagnitude = Math.sqrt(steer.x * steer.x + steer.y * steer.y)
    if (steerMagnitude > 0) {
      const force = mode === 'idle' ? this.maxForce * 0.4 : this.maxForce
      steer.x = (steer.x / steerMagnitude) * force
      steer.y = (steer.y / steerMagnitude) * force
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
      this.colorWeight = Math.min(this.colorWeight + this.colorBlendRate, 1.0)
    }

    const currentColor = {
      r: Math.round(
        this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight
      ),
      g: Math.round(
        this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight
      ),
      b: Math.round(
        this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight
      ),
    }

    ctx.fillStyle = `rgb(${currentColor.r}, ${currentColor.g}, ${currentColor.b})`

    if (this.collapsing) {
      const radius = Math.max(0.6, this.particleSize / 2)
      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, radius, 0, Math.PI * 2)
      ctx.fill()
      return
    }

    if (drawAsPoints) {
      const size = Math.max(1.5, 2 / devicePixelRatio)
      ctx.fillRect(this.pos.x, this.pos.y, size, size)
    } else {
      ctx.beginPath()
      ctx.arc(this.pos.x, this.pos.y, this.particleSize / 2, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  kill(displayWidth, displayHeight) {
    if (!this.isKilled) {
      const randomPos = getEdgeOffscreenPos(displayWidth, displayHeight)
      this.target.x = randomPos.x
      this.target.y = randomPos.y

      this.startColor = {
        r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
        g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
        b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
      }
      this.targetColor = { r: 0, g: 0, b: 0 }
      this.colorWeight = 0
      this.maxSpeed = Math.max(this.maxSpeed, 8)
      this.maxForce = this.maxSpeed * 0.12
      this.isKilled = true
    }
  }

  collapseToward(x, y, accent = { r: 240, g: 153, b: 96 }) {
    this.startColor = {
      r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
      g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
      b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
    }
    this.targetColor = accent
    this.colorWeight = 0
    this.colorBlendRate = 0.08 + Math.random() * 0.06
    const angle = Math.random() * Math.PI * 2
    const radius = Math.random() * 7
    this.target.x = x + Math.cos(angle) * radius
    this.target.y = y + Math.sin(angle) * radius
    this.home.x = this.target.x
    this.home.y = this.target.y
    this.orbitOx = Math.cos(angle) * radius
    this.orbitOy = Math.sin(angle) * radius
    this.maxSpeed = 18 + Math.random() * 14
    this.maxForce = this.maxSpeed * 0.22
    this.particleSize = Math.max(2, this.particleSize * 0.45)
    this.isKilled = false
    this.attracting = true
    this.collapsing = true
  }

  /** Stream toward a moving cursor glow without absorbing yet. */
  beginAttract(accent = { r: 240, g: 153, b: 96 }) {
    this.startColor = {
      r: this.startColor.r + (this.targetColor.r - this.startColor.r) * this.colorWeight,
      g: this.startColor.g + (this.targetColor.g - this.startColor.g) * this.colorWeight,
      b: this.startColor.b + (this.targetColor.b - this.startColor.b) * this.colorWeight,
    }
    this.targetColor = accent
    this.colorWeight = 0
    this.colorBlendRate = 0.06 + Math.random() * 0.05
    this.orbitOx = (Math.random() - 0.5) * 36
    this.orbitOy = (Math.random() - 0.5) * 36
    this.maxSpeed = 11 + Math.random() * 9
    this.maxForce = this.maxSpeed * 0.15
    this.isKilled = false
    this.attracting = true
    this.collapsing = false
  }

  lockAbsorb() {
    if (!this.attracting) return
    this.orbitOx *= 0.2
    this.orbitOy *= 0.2
    this.maxSpeed = 18 + Math.random() * 12
    this.maxForce = this.maxSpeed * 0.22
    this.particleSize = Math.max(2, this.particleSize * 0.5)
    this.collapsing = true
  }
}

export const ParticleTextEffect = forwardRef(function ParticleTextEffect(
  {
    text,
    className = '',
    gradientClass,
    onFormed,
    onDissolveComplete,
    holdMs = 320,
  },
  ref
) {
  const canvasRef = useRef(null)
  const wrapperRef = useRef(null)
  const animationRef = useRef()
  const particlesRef = useRef([])
  const hasFormedRef = useRef(false)
  const hasCompletedRef = useRef(false)
  const isAnimatingRef = useRef(false)
  const phaseRef = useRef('form') // form | idle | dissolve | collapse
  const dissolveStartedRef = useRef(false)
  const collapseStartedRef = useRef(false)
  const formedNotifiedRef = useRef(false)
  const holdTimerRef = useRef(null)
  const wordBoundsRef = useRef(null)
  const attractorRef = useRef({ x: 0, y: 0, locked: false, active: false })
  const onFormedRef = useRef(onFormed)
  const onDissolveCompleteRef = useRef(onDissolveComplete)

  useEffect(() => {
    onFormedRef.current = onFormed
  }, [onFormed])
  useEffect(() => {
    onDissolveCompleteRef.current = onDissolveComplete
  }, [onDissolveComplete])

  const getRenderDpr = () => Math.min(window.devicePixelRatio || 1, 1.5)

  // Step size scales with backing-store width so retina displays stay bounded.
  const getPixelSteps = (backingWidth, dpr) => {
    const cssWidth = backingWidth / dpr
    const density = dpr > 1 ? 1.35 : 1
    if (cssWidth < 640) return Math.round(6 * density * dpr)
    if (cssWidth < 1024) return Math.round(8 * density * dpr)
    return Math.round(12 * density * dpr)
  }
  const drawAsPoints = true

  const formText = (word, canvas) => {
    const dpr = getRenderDpr()
    const displayWidth = canvas.width / dpr
    const displayHeight = canvas.height / dpr

    const offscreenCanvas = document.createElement('canvas')
    offscreenCanvas.width = canvas.width
    offscreenCanvas.height = canvas.height
    const offscreenCtx = offscreenCanvas.getContext('2d')

    offscreenCtx.fillStyle = 'white'
    const isMobile = displayWidth < 640
    const baseFontSize = isMobile
      ? Math.min(displayWidth / (word.length * 0.65), 45)
      : Math.min(displayWidth / (word.length * 0.6), 120)
    const fontSize = Math.max(baseFontSize, 24)
    offscreenCtx.font = `bold ${fontSize * dpr}px Arial`
    offscreenCtx.textAlign = 'center'
    offscreenCtx.textBaseline = 'middle'
    offscreenCtx.fillText(word, canvas.width / 2, canvas.height / 2)

    const imageData = offscreenCtx.getImageData(0, 0, canvas.width, canvas.height)
    const pixels = imageData.data

    let newColor = { r: 100, g: 150, b: 255 }
    if (gradientClass) {
      if (gradientClass === 'resume-ink') newColor = { r: 237, g: 239, b: 242 }
      if (gradientClass.includes('blue')) newColor = { r: 59, g: 130, b: 246 }
      if (gradientClass.includes('purple')) newColor = { r: 147, g: 51, b: 234 }
      if (gradientClass.includes('pink')) newColor = { r: 236, g: 72, b: 153 }
      if (gradientClass.includes('yellow')) newColor = { r: 250, g: 204, b: 21 }
      if (gradientClass.includes('green')) newColor = { r: 34, g: 197, b: 94 }
    }

    const particles = particlesRef.current
    let particleIndex = 0
    const pixelSteps = getPixelSteps(canvas.width, dpr)
    // Collect opaque text pixels first — capping before the alpha filter
    // was discarding almost all name samples on retina canvases.
    const coordsIndexes = []
    for (let i = 0; i < pixels.length; i += pixelSteps * 4) {
      if (pixels[i + 3] > 0) coordsIndexes.push(i)
    }
    const maxParticles = displayWidth < 640 ? 1800 : 3200
    if (coordsIndexes.length > maxParticles) {
      const stride = Math.ceil(coordsIndexes.length / maxParticles)
      const sampled = []
      for (let i = 0; i < coordsIndexes.length; i += stride) sampled.push(coordsIndexes[i])
      coordsIndexes.length = 0
      coordsIndexes.push(...sampled)
    }

    for (let i = coordsIndexes.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[coordsIndexes[i], coordsIndexes[j]] = [coordsIndexes[j], coordsIndexes[i]]
    }

    for (const pixelIndex of coordsIndexes) {
      const x = ((pixelIndex / 4) % canvas.width) / dpr
      const y = Math.floor(pixelIndex / 4 / canvas.width) / dpr

      let particle
      if (particleIndex < particles.length) {
        particle = particles[particleIndex]
        particle.isKilled = false
        particleIndex++
      } else {
        particle = new Particle()
        const randomPos = getEdgeOffscreenPos(displayWidth, displayHeight)
        particle.pos.x = randomPos.x
        particle.pos.y = randomPos.y

        const mobile = displayWidth < 640
        particle.maxSpeed = mobile ? Math.random() * 8 + 6 : Math.random() * 10 + 8
        particle.maxForce = particle.maxSpeed * 0.1
        particle.particleSize = mobile ? Math.random() * 3 + 3 : Math.random() * 6 + 6
        particle.colorBlendRate = Math.random() * 0.0275 + 0.0025
        particles.push(particle)
      }

      particle.startColor = {
        r: particle.startColor.r + (particle.targetColor.r - particle.startColor.r) * particle.colorWeight,
        g: particle.startColor.g + (particle.targetColor.g - particle.startColor.g) * particle.colorWeight,
        b: particle.startColor.b + (particle.targetColor.b - particle.startColor.b) * particle.colorWeight,
      }
      particle.targetColor = newColor
      particle.colorWeight = 0
      particle.target.x = x
      particle.target.y = y
      particle.home.x = x
      particle.home.y = y
    }

    for (let i = particleIndex; i < particles.length; i++) {
      particles[i].kill(displayWidth, displayHeight)
    }

    // CSS-pixel bounds of the formed word inside the canvas (for DOM handoff).
    let minX = Infinity
    let minY = Infinity
    let maxX = -Infinity
    let maxY = -Infinity
    for (let i = 0; i < particleIndex; i++) {
      const home = particles[i].home
      if (home.x < minX) minX = home.x
      if (home.y < minY) minY = home.y
      if (home.x > maxX) maxX = home.x
      if (home.y > maxY) maxY = home.y
    }
    wordBoundsRef.current =
      particleIndex > 0 && Number.isFinite(minX)
        ? { minX, minY, maxX, maxY }
        : {
            minX: displayWidth * 0.15,
            minY: displayHeight * 0.4,
            maxX: displayWidth * 0.85,
            maxY: displayHeight * 0.6,
          }

    hasFormedRef.current = false
  }

  const getWordBounds = () => {
    const canvas = canvasRef.current
    const local = wordBoundsRef.current
    if (!canvas || !local) return null

    const rect = canvas.getBoundingClientRect()
    const pad = 8
    const left = rect.left + local.minX - pad
    const top = rect.top + local.minY - pad
    const width = local.maxX - local.minX + pad * 2
    const height = local.maxY - local.minY + pad * 2

    return {
      left,
      top,
      width,
      height,
      right: left + width,
      bottom: top + height,
      centerX: left + width / 2,
      centerY: top + height / 2,
    }
  }

  const beginDissolve = () => {
    if (dissolveStartedRef.current || collapseStartedRef.current) return
    dissolveStartedRef.current = true
    phaseRef.current = 'dissolve'

    const canvas = canvasRef.current
    if (!canvas) {
      onDissolveCompleteRef.current?.()
      return
    }

    const dpr = getRenderDpr()
    const displayWidth = canvas.width / dpr
    const displayHeight = canvas.height / dpr
    const particles = particlesRef.current

    particles.forEach((particle, index) => {
      window.setTimeout(() => {
        particle.kill(displayWidth, displayHeight)
      }, Math.min(index * 1.2, 420))
    })

    if (wrapperRef.current) {
      wrapperRef.current.style.transition = 'opacity 0.55s ease'
      wrapperRef.current.style.opacity = '0'
    }
  }

  /** Stream particles toward a moving turquoise attractor (canvas CSS px). */
  const beginAttract = (cssX, cssY) => {
    if (collapseStartedRef.current || dissolveStartedRef.current) return
    collapseStartedRef.current = true
    phaseRef.current = 'attract'
    attractorRef.current = { x: cssX, y: cssY, locked: false, active: true }

    const particles = particlesRef.current
    const teal = { r: 240, g: 153, b: 96 }
    const count = particles.length || 1

    const scored = particles.map((particle) => {
      const dx = particle.pos.x - cssX
      const dy = particle.pos.y - cssY
      return { particle, dist: dx * dx + dy * dy }
    })
    scored.sort((a, b) => a.dist - b.dist)

    scored.forEach(({ particle }, order) => {
      const delay = Math.min((order / count) * 180, 200)
      window.setTimeout(() => {
        if (dissolveStartedRef.current) return
        particle.beginAttract(teal)
        if (attractorRef.current.locked) particle.lockAbsorb()
        particle.target.x = attractorRef.current.x + particle.orbitOx
        particle.target.y = attractorRef.current.y + particle.orbitOy
      }, delay)
    })
  }

  const setAttractor = (cssX, cssY) => {
    if (!attractorRef.current.active || attractorRef.current.locked) return
    attractorRef.current.x = cssX
    attractorRef.current.y = cssY
  }

  const lockAttractor = () => {
    if (!attractorRef.current.active) return
    attractorRef.current.locked = true
    phaseRef.current = 'collapse'
    particlesRef.current.forEach((particle) => {
      if (particle.attracting) particle.lockAbsorb()
    })
  }

  /** Pull every particle into a single seed (canvas CSS px). */
  const beginCollapse = (cssX, cssY) => {
    beginAttract(cssX, cssY)
    attractorRef.current.x = cssX
    attractorRef.current.y = cssY
    lockAttractor()
  }

  useImperativeHandle(ref, () => ({
    dissolve: beginDissolve,
    collapseTo: beginCollapse,
    attractTo: beginAttract,
    setAttractor,
    lockAttractor,
    getWordBounds,
  }))

  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const particles = particlesRef.current
    const dpr = getRenderDpr()
    const phase = phaseRef.current

    if (phase === 'form') {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)'
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr)
    } else {
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr)
    }

    let allReachedTarget = true
    let livingCount = 0

    for (let i = particles.length - 1; i >= 0; i--) {
      const particle = particles[i]
      const attractor = attractorRef.current

      if (particle.attracting || particle.collapsing) {
        if (attractor.active) {
          particle.target.x = attractor.x + (particle.orbitOx || 0)
          particle.target.y = attractor.y + (particle.orbitOy || 0)
          particle.home.x = particle.target.x
          particle.home.y = particle.target.y
        }

        particle.move('form')

        if (particle.collapsing) {
          particle.particleSize = Math.max(1.2, particle.particleSize * 0.965)
        }

        particle.draw(ctx, drawAsPoints, dpr)

        if (particle.collapsing) {
          const distance = Math.sqrt(
            Math.pow(particle.pos.x - particle.target.x, 2) +
              Math.pow(particle.pos.y - particle.target.y, 2)
          )
          if (distance < 11 || particle.particleSize < 1.4) {
            particles.splice(i, 1)
          }
        }
        continue
      }

      if (!particle.isKilled) {
        livingCount += 1
        particle.move(phase === 'idle' ? 'idle' : 'form')

        const distance = Math.sqrt(
          Math.pow(particle.pos.x - particle.target.x, 2) +
            Math.pow(particle.pos.y - particle.target.y, 2)
        )
        if (distance > 9) allReachedTarget = false
      } else {
        particle.move('form')
      }

      particle.draw(ctx, drawAsPoints, dpr)

      if (particle.isKilled) {
        const displayWidth = canvas.width / dpr
        const displayHeight = canvas.height / dpr
        const maxDimension = Math.max(displayWidth, displayHeight)
        const margin = Math.max(maxDimension * 1.5, 800)

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
      phase === 'form' &&
      allReachedTarget &&
      particles.length > 0 &&
      !hasFormedRef.current &&
      !hasCompletedRef.current
    ) {
      hasFormedRef.current = true
      phaseRef.current = 'idle'

      if (!formedNotifiedRef.current) {
        formedNotifiedRef.current = true
        if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current)
        holdTimerRef.current = window.setTimeout(() => {
          onFormedRef.current?.()
        }, holdMs)
      }
    }

    if (
      (phase === 'collapse' || phase === 'attract') &&
      collapseStartedRef.current &&
      attractorRef.current.locked &&
      particles.length === 0 &&
      !hasCompletedRef.current
    ) {
      hasCompletedRef.current = true
      isAnimatingRef.current = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      onDissolveCompleteRef.current?.()
      return
    }

    if (phase === 'dissolve' && dissolveStartedRef.current && livingCount === 0 && !hasCompletedRef.current) {
      hasCompletedRef.current = true
      isAnimatingRef.current = false
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      window.setTimeout(() => onDissolveCompleteRef.current?.(), 280)
      return
    }

    if (isAnimatingRef.current && !hasCompletedRef.current) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const updateCanvasSize = () => {
      const dpr = getRenderDpr()
      const container = canvas.parentElement
      let width
      let height

      if (container && container.clientWidth > 0 && container.clientHeight > 0) {
        width = container.clientWidth
        height = container.clientHeight
      } else {
        width = window.innerWidth || document.documentElement.clientWidth || 1200
        height = window.innerHeight || document.documentElement.clientHeight || 600
      }

      if (width <= 0) width = window.innerWidth || 1200
      if (height <= 0) height = window.innerHeight || 600

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const ctx = canvas.getContext('2d')
      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
    }

    updateCanvasSize()

    const initDelay = window.innerWidth < 768 ? 100 : 0

    const initAnimation = () => {
      if (!hasCompletedRef.current && !isAnimatingRef.current) {
        updateCanvasSize()
        formText(text, canvas)
        isAnimatingRef.current = true
        animate()
      }
    }

    const initTimer = initDelay > 0 ? window.setTimeout(initAnimation, initDelay) : null
    if (!initDelay) initAnimation()

    const handleResize = () => {
      if (
        hasCompletedRef.current ||
        phaseRef.current === 'dissolve' ||
        phaseRef.current === 'collapse' ||
        phaseRef.current === 'attract'
      ) {
        return
      }
      const delay = window.innerWidth < 768 ? 150 : 0
      window.setTimeout(() => {
        if (
          hasCompletedRef.current ||
          phaseRef.current === 'dissolve' ||
          phaseRef.current === 'collapse' ||
          phaseRef.current === 'attract'
        ) {
          return
        }
        updateCanvasSize()
        if (phaseRef.current === 'form' && !hasFormedRef.current) {
          formText(text, canvas)
        }
      }, delay)
    }

    window.addEventListener('resize', handleResize)
    window.addEventListener('orientationchange', handleResize)

    return () => {
      if (initTimer) window.clearTimeout(initTimer)
      if (holdTimerRef.current) window.clearTimeout(holdTimerRef.current)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
        animationRef.current = null
      }
      isAnimatingRef.current = false
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleResize)
    }
    // Intentionally only re-init on text/gradient changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, gradientClass])

  return (
    <div ref={wrapperRef} className={`relative w-full h-full ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full" style={{ display: 'block' }} />
    </div>
  )
})

export default ParticleTextEffect

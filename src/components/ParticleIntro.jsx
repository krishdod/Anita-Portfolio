import React, { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react'
import gsap from 'gsap'
import ParticleTextEffect from './ui/particle-text-effect'

const SEQUENCE = [
  {
    id: 'anita',
    text: 'ANITA DANTANI',
    gradientClass: 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400',
  },
]

/**
 * Cursor-attract portal reveal (auto, no click):
 * form → hold → turquoise glow (veil stays opaque) → particles chase cursor →
 * lock → iris mask begins → outline → ink → content.
 *
 * Veil, particles, and glow are separate layers. The veil stays fully opaque
 * (no mask) until reveal. Glow/mask/ring paint through refs — React state is
 * only used for discrete stage changes.
 */
const FORMED_HOLD_MS = 250
const GATHER_MS = 900
const LOCK_CHARGE_MS = 180
const PORTAL_MS = 820
const INK_MS = 300

function portalRadius() {
  return Math.hypot(window.innerWidth, window.innerHeight) * 1.2
}

function toCanvasPoint(stageEl, clientX, clientY) {
  const canvasEl = stageEl?.querySelector('canvas')
  if (!canvasEl) return { x: clientX, y: clientY }
  const rect = canvasEl.getBoundingClientRect()
  return { x: clientX - rect.left, y: clientY - rect.top }
}

function clearVeilMask(veil) {
  if (!veil) return
  veil.style.webkitMaskImage = 'none'
  veil.style.maskImage = 'none'
  veil.style.webkitMaskSize = ''
  veil.style.maskSize = ''
}

function applyVeilMask(veil, x, y, r) {
  if (!veil) return
  if (!(r > 0)) {
    clearVeilMask(veil)
    return
  }
  const softEdge = Math.max(24, Math.min(56, r * 0.08))
  const mask = `radial-gradient(circle at ${x}px ${y}px, transparent ${Math.max(0, r - softEdge)}px, rgba(0,0,0,0.45) ${r}px, #000 ${r + softEdge * 1.35}px)`
  veil.style.webkitMaskImage = mask
  veil.style.maskImage = mask
  veil.style.webkitMaskRepeat = 'no-repeat'
  veil.style.maskRepeat = 'no-repeat'
}

const ParticleIntro = forwardRef(function ParticleIntro(
  { onFormed, onHandoffPhase, onHandoffComplete },
  ref
) {
  const particleRef = useRef(null)
  const stageRef = useRef(null)
  const veilRef = useRef(null)
  const ringRef = useRef(null)
  const canvasLayerRef = useRef(null)

  const [canvasReady, setCanvasReady] = useState(false)

  const handoffStartedRef = useRef(false)
  const finishedRef = useRef(false)
  const cancelledRef = useRef(false)
  const timersRef = useRef(new Set())
  const gatherRafRef = useRef(null)
  const tweenRef = useRef(null)
  const gatherResolveRef = useRef(null)
  const waitResolversRef = useRef(new Set())
  const tweenResolveRef = useRef(null)
  const hasPointerRef = useRef(false)
  const followingRef = useRef(false)
  const cursorRef = useRef({
    x: typeof window !== 'undefined' ? window.innerWidth * 0.5 : 0,
    y: typeof window !== 'undefined' ? window.innerHeight * 0.52 : 0,
  })
  const glowRef = useRef({ ...cursorRef.current })
  /** masking: false keeps the veil fully opaque regardless of r. */
  const visualRef = useRef({
    x: cursorRef.current.x,
    y: cursorRef.current.y,
    r: 0,
    glow: 0,
    seed: 0,
    masking: false,
  })

  const setStage = useCallback((stage) => {
    if (stageRef.current) stageRef.current.dataset.introStage = stage
  }, [])

  const paintVisual = useCallback(() => {
    const p = visualRef.current
    const ring = ringRef.current
    const veil = veilRef.current

    if (ring) {
      const ringSize = Math.max(p.seed * 2, p.masking ? Math.min(p.r * 2.1, 320) : p.seed * 2)
      ring.style.left = `${p.x}px`
      ring.style.top = `${p.y}px`
      ring.style.width = `${ringSize}px`
      ring.style.height = `${ringSize}px`
      const show = p.glow > 0.04 || p.seed > 1
      ring.style.opacity = show ? String(Math.min(1, p.glow + (p.seed > 0 ? 0.2 : 0))) : '0'
    }

    if (veil) {
      veil.dataset.introVeil = p.masking ? 'masking' : 'opaque'
      if (!p.masking) clearVeilMask(veil)
      else applyVeilMask(veil, p.x, p.y, p.r)
    }
  }, [])

  const setVisual = useCallback(
    (patch) => {
      Object.assign(visualRef.current, patch)
      paintVisual()
    },
    [paintVisual]
  )

  const clearTimers = useCallback(() => {
    for (const id of timersRef.current) window.clearTimeout(id)
    timersRef.current.clear()
  }, [])

  const settleWaiters = useCallback((reason) => {
    const waiters = [...waitResolversRef.current]
    waitResolversRef.current.clear()
    for (const resolve of waiters) resolve(reason)
    if (gatherResolveRef.current) {
      const resolve = gatherResolveRef.current
      gatherResolveRef.current = null
      resolve({ x: glowRef.current.x, y: glowRef.current.y, reason })
    }
    if (tweenResolveRef.current) {
      const resolve = tweenResolveRef.current
      tweenResolveRef.current = null
      resolve(reason)
    }
  }, [])

  const killTween = useCallback(() => {
    if (tweenRef.current) {
      tweenRef.current.kill()
      tweenRef.current = null
    }
  }, [])

  const wait = useCallback((ms) => {
    return new Promise((resolve) => {
      if (cancelledRef.current || finishedRef.current) {
        resolve('cancelled')
        return
      }
      const onSettle = (reason) => {
        waitResolversRef.current.delete(onSettle)
        resolve(reason)
      }
      waitResolversRef.current.add(onSettle)
      const id = window.setTimeout(() => {
        timersRef.current.delete(id)
        waitResolversRef.current.delete(onSettle)
        resolve(cancelledRef.current || finishedRef.current ? 'cancelled' : 'done')
      }, ms)
      timersRef.current.add(id)
    })
  }, [])

  const runGsap = useCallback((vars) => {
    return new Promise((resolve) => {
      if (cancelledRef.current || finishedRef.current) {
        resolve('cancelled')
        return
      }
      killTween()
      tweenResolveRef.current = resolve
      const tween = gsap.to(vars.target, {
        ...vars.props,
        duration: vars.duration,
        ease: vars.ease,
        onUpdate: vars.onUpdate,
        onComplete: () => {
          tweenRef.current = null
          if (tweenResolveRef.current === resolve) tweenResolveRef.current = null
          resolve(cancelledRef.current || finishedRef.current ? 'cancelled' : 'done')
        },
      })
      tweenRef.current = tween
      vars.onUpdate?.()
    })
  }, [killTween])

  const abortPending = useCallback(() => {
    cancelledRef.current = true
    followingRef.current = false
    clearTimers()
    if (gatherRafRef.current) {
      cancelAnimationFrame(gatherRafRef.current)
      gatherRafRef.current = null
    }
    killTween()
    settleWaiters('cancelled')
  }, [clearTimers, killTween, settleWaiters])

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    abortPending()
    onHandoffPhase?.('done')
    onHandoffComplete?.()
  }, [abortPending, onHandoffComplete, onHandoffPhase])

  const cancelHandoff = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    abortPending()
    setVisual({
      x: visualRef.current.x,
      y: visualRef.current.y,
      r: portalRadius(),
      glow: 0,
      seed: 0,
      masking: true,
    })
    onHandoffPhase?.('done')
  }, [abortPending, onHandoffPhase, setVisual])

  useImperativeHandle(ref, () => ({ cancelHandoff }), [cancelHandoff])

  useEffect(() => {
    const readPoint = (event) => {
      if (event.touches?.length) {
        return { x: event.touches[0].clientX, y: event.touches[0].clientY }
      }
      if (typeof event.clientX === 'number') {
        return { x: event.clientX, y: event.clientY }
      }
      return null
    }
    const onMove = (event) => {
      const point = readPoint(event)
      if (!point) return
      hasPointerRef.current = true
      cursorRef.current = point
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('touchmove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('touchmove', onMove)
    }
  }, [])

  const runGather = useCallback(() => {
    return new Promise((resolve) => {
      if (cancelledRef.current || finishedRef.current) {
        resolve({ x: glowRef.current.x, y: glowRef.current.y, reason: 'cancelled' })
        return
      }
      const started = performance.now()
      followingRef.current = true
      gatherResolveRef.current = resolve

      const tick = (now) => {
        if (cancelledRef.current || finishedRef.current) {
          gatherRafRef.current = null
          if (gatherResolveRef.current === resolve) gatherResolveRef.current = null
          resolve({ x: glowRef.current.x, y: glowRef.current.y, reason: 'cancelled' })
          return
        }

        const cursor = cursorRef.current
        const glow = glowRef.current
        const ease = hasPointerRef.current ? 0.22 : 0.12
        glow.x += (cursor.x - glow.x) * ease
        glow.y += (cursor.y - glow.y) * ease

        const progress = Math.min(1, (now - started) / GATHER_MS)
        const pulse = 12 + Math.sin(progress * Math.PI) * 4
        // Veil stays opaque: masking remains false; only the ring follows the cursor.
        setVisual({
          x: glow.x,
          y: glow.y,
          r: 0,
          glow: 0.55 + progress * 0.4,
          seed: pulse,
          masking: false,
        })

        const api = particleRef.current
        if (api?.setAttractor) {
          const local = toCanvasPoint(stageRef.current, glow.x, glow.y)
          api.setAttractor(local.x, local.y)
        }

        if (now - started >= GATHER_MS) {
          followingRef.current = false
          gatherRafRef.current = null
          if (gatherResolveRef.current === resolve) gatherResolveRef.current = null
          resolve({ x: glow.x, y: glow.y, reason: 'done' })
          return
        }

        gatherRafRef.current = requestAnimationFrame(tick)
      }

      gatherRafRef.current = requestAnimationFrame(tick)
    })
  }, [setVisual])

  const runHandoff = useCallback(async () => {
    if (handoffStartedRef.current || finishedRef.current || cancelledRef.current) return
    handoffStartedRef.current = true
    cancelledRef.current = false

    onHandoffPhase?.('receiving')
    onFormed?.()
    setStage('gathering')

    const bounds = particleRef.current?.getWordBounds?.()
    if (!hasPointerRef.current) {
      cursorRef.current = {
        x: bounds?.centerX ?? window.innerWidth * 0.5,
        y: bounds?.centerY ?? window.innerHeight * 0.48,
      }
    }
    glowRef.current = { ...cursorRef.current }

    const start = glowRef.current
    setVisual({ x: start.x, y: start.y, r: 0, glow: 0.7, seed: 10, masking: false })

    const api = particleRef.current
    const local = toCanvasPoint(stageRef.current, start.x, start.y)
    if (api?.attractTo) api.attractTo(local.x, local.y)
    else if (api?.collapseTo) api.collapseTo(local.x, local.y)
    else api?.dissolve?.()

    const locked = await runGather()
    if (cancelledRef.current || finishedRef.current || locked.reason === 'cancelled') return

    followingRef.current = false
    const lockX = locked.x
    const lockY = locked.y
    glowRef.current = { x: lockX, y: lockY }
    const lockLocal = toCanvasPoint(stageRef.current, lockX, lockY)
    api?.setAttractor?.(lockLocal.x, lockLocal.y)
    api?.lockAttractor?.()

    const charge = { r: 0, glow: 0.85, seed: 14 }
    const chargeResult = await runGsap({
      target: charge,
      duration: LOCK_CHARGE_MS / 1000,
      ease: 'power2.out',
      props: { r: 0, glow: 1, seed: 24 },
      onUpdate: () => {
        setVisual({
          x: lockX,
          y: lockY,
          r: 0,
          glow: charge.glow,
          seed: charge.seed,
          masking: false,
        })
      },
    })
    if (cancelledRef.current || finishedRef.current || chargeResult === 'cancelled') return

    onHandoffPhase?.('outline')

    // Reveal begins — enable iris mask on the veil only.
    setStage('revealing')
    const portal = { r: 18, glow: 1, seed: 22 }
    setVisual({ x: lockX, y: lockY, r: portal.r, glow: portal.glow, seed: portal.seed, masking: true })

    const portalPromise = runGsap({
      target: portal,
      duration: PORTAL_MS / 1000,
      ease: 'power3.inOut',
      props: { r: portalRadius(), glow: 0, seed: 0 },
      onUpdate: () => {
        setVisual({
          x: lockX,
          y: lockY,
          r: portal.r,
          glow: portal.glow,
          seed: portal.seed,
          masking: true,
        })
      },
    })

    const fadeWait = await wait(110)
    if (cancelledRef.current || finishedRef.current || fadeWait === 'cancelled') return
    if (canvasLayerRef.current) {
      canvasLayerRef.current.style.opacity = '0'
      canvasLayerRef.current.style.transition = 'opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1)'
    }

    const inkWait = await wait(PORTAL_MS * 0.38)
    if (cancelledRef.current || finishedRef.current || inkWait === 'cancelled') return

    onHandoffPhase?.('ink')
    const contentWait = await wait(INK_MS)
    if (cancelledRef.current || finishedRef.current || contentWait === 'cancelled') return

    onHandoffPhase?.('content')
    const portalResult = await portalPromise
    if (cancelledRef.current || finishedRef.current || portalResult === 'cancelled') return
    finish()
  }, [finish, onFormed, onHandoffPhase, runGather, runGsap, setStage, setVisual, wait])

  const handleFormed = useCallback(() => {
    runHandoff()
  }, [runHandoff])

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setCanvasReady(true)
      if (canvasLayerRef.current) canvasLayerRef.current.style.opacity = '1'
    }, 40)
    paintVisual()
    return () => {
      window.clearTimeout(timer)
      finishedRef.current = true
      abortPending()
    }
  }, [abortPending, paintVisual])

  const current = SEQUENCE[0]

  return (
    <div
      ref={stageRef}
      className="particle-intro absolute inset-0 overflow-hidden"
      aria-hidden="true"
      data-intro-stage="forming"
    >
      {/* Opaque veil — mask applied only after reveal begins */}
      <div
        ref={veilRef}
        className="intro-veil absolute inset-0 z-[1]"
        style={{ background: '#000' }}
        data-intro-veil="opaque"
      />

      {/* Particles sit above the veil so they stay visible while it remains opaque */}
      <div
        ref={canvasLayerRef}
        className="particle-intro-canvas absolute inset-0 z-[2] origin-center"
        style={{ opacity: canvasReady ? 1 : 0, transition: 'opacity 0.28s cubic-bezier(0.4, 0, 0.2, 1)' }}
      >
        <ParticleTextEffect
          ref={particleRef}
          text={current.text}
          gradientClass={current.gradientClass}
          holdMs={FORMED_HOLD_MS}
          onFormed={handleFormed}
          className="w-full h-full"
        />
      </div>

      <div
        ref={ringRef}
        className="intro-portal-ring pointer-events-none absolute z-[3] rounded-full"
        style={{
          left: visualRef.current.x,
          top: visualRef.current.y,
          width: 0,
          height: 0,
          opacity: 0,
          transform: 'translate(-50%, -50%)',
          background:
            'radial-gradient(circle, rgba(75,224,213,0.9) 0%, rgba(112,65,197,0.5) 36%, rgba(75,224,213,0.1) 60%, rgba(75,224,213,0) 76%)',
          boxShadow:
            '0 0 36px rgba(75,224,213,0.65), 0 0 72px rgba(112,65,197,0.4), inset 0 0 28px rgba(75,224,213,0.45)',
          mixBlendMode: 'screen',
          willChange: 'left, top, width, height, opacity',
        }}
      />
    </div>
  )
})

export default ParticleIntro

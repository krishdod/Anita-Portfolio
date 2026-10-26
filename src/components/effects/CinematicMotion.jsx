import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useMotionPreference } from '../../hooks/useMotionPreference'

gsap.registerPlugin(ScrollTrigger)

// Camera moves live on image/decorative layers; copy and controls stay in document flow.
export function CinematicMotion({ enabled }) {
  const { reducedMotion } = useMotionPreference()

  useEffect(() => {
    const root = document.getElementById('main-content')
    if (!root || !enabled || reducedMotion) return
    let disposed = false
    let refreshFrame = 0
    const counters = [...root.querySelectorAll('[data-count]')]
    const originalCounts = counters.map((node) => node.textContent)
    const refresh = () => {
      cancelAnimationFrame(refreshFrame)
      refreshFrame = requestAnimationFrame(() => { if (!disposed) ScrollTrigger.refresh() })
    }
    const media = gsap.matchMedia()

    media.add({ desktop: '(min-width: 900px) and (hover: hover) and (pointer: fine)', all: 'all' }, (context) => {
      const desktop = context.conditions.desktop
      root.dataset.motion = 'cinematic'
      const hero = root.querySelector('.studio-hero')
      const heroCamera = hero?.querySelector('.studio-perspective')
      if (heroCamera) {
        gsap.fromTo(heroCamera, { yPercent: 0, rotate: 0 }, {
          yPercent: desktop ? -8 : -3,
          rotate: desktop ? -1.2 : 0,
          ease: 'none',
          scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: .6, invalidateOnRefresh: true },
        })
      }

      root.querySelectorAll('.editorial-project-item').forEach((scene) => {
        const surface = scene.querySelector('.project-image')
        const image = surface?.querySelector('img')
        const caption = scene.querySelector('.project-content')
        if (!surface) return
        gsap.fromTo(surface, { clipPath: 'inset(9% 6% 9% 6% round 2px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 2px)', duration: 1.15, ease: 'power3.out',
          scrollTrigger: { trigger: scene, start: 'top 88%', once: true },
        })
        if (image) {
          gsap.set(image, { transition: 'none' })
          gsap.fromTo(image, { scale: desktop ? 1.24 : 1.14, yPercent: -4 }, {
            scale: 1.12, yPercent: 4, ease: 'none',
            scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: .6, invalidateOnRefresh: true },
          })
        }
        if (caption) {
          gsap.fromTo(caption.children, { y: 28, opacity: .1 }, {
            y: 0, opacity: 1, duration: .75, stagger: .09, ease: 'power3.out',
            scrollTrigger: { trigger: caption, start: 'top 94%', once: true },
          })
        }
      })

      root.querySelectorAll('.career-chapter').forEach((row) => {
        gsap.fromTo(row, { '--rule-progress': 0 }, {
          '--rule-progress': 1, duration: .95, ease: 'power3.out',
          scrollTrigger: { trigger: row, start: 'top 92%', once: true },
        })
      })

      counters.forEach((node) => {
        const count = { value: 0 }
        gsap.to(count, {
          value: Number(node.dataset.count), duration: 1.6, ease: 'power2.out',
          onUpdate: () => { node.textContent = String(Math.round(count.value)) },
          scrollTrigger: { trigger: node, start: 'top 95%', once: true },
        })
      })

      const contactArrow = root.querySelector('.contact-orbit-link')
      if (contactArrow) {
        gsap.fromTo(contactArrow, { rotate: -40 }, {
          rotate: 0, ease: 'none',
          scrollTrigger: { trigger: '#contact', start: 'top bottom', end: 'center center', scrub: .65 },
        })
      }

      const cleanups = []
      if (desktop) {
        root.querySelectorAll('.hero-work-cta, #contact .button-primary, .contact-orbit-link').forEach((button) => {
          const x = gsap.quickTo(button, 'x', { duration: .35, ease: 'power3.out' })
          const y = gsap.quickTo(button, 'y', { duration: .35, ease: 'power3.out' })
          const move = (event) => {
            const rect = button.getBoundingClientRect()
            x(gsap.utils.clamp(-9, 9, (event.clientX - rect.left - rect.width / 2) * .12))
            y(gsap.utils.clamp(-7, 7, (event.clientY - rect.top - rect.height / 2) * .12))
          }
          const leave = () => { x(0); y(0) }
          button.addEventListener('pointermove', move)
          button.addEventListener('pointerleave', leave)
          cleanups.push(() => {
            button.removeEventListener('pointermove', move)
            button.removeEventListener('pointerleave', leave)
            x.tween.kill()
            y.tween.kill()
          })
        })
      }
      return () => { cleanups.forEach((cleanup) => cleanup()) }
    }, root)

    const observer = new ResizeObserver(refresh)
    observer.observe(root)
    document.fonts.ready.then(() => { if (!disposed) refresh() })
    refresh()

    return () => {
      disposed = true
      observer.disconnect()
      cancelAnimationFrame(refreshFrame)
      media.revert()
      counters.forEach((node, index) => { node.textContent = originalCounts[index] })
      delete root.dataset.motion
    }
  }, [enabled, reducedMotion])

  return null
}

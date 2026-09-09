import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Code2, Download, Sparkle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMotionPreference } from '../hooks/useMotionPreference'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { profile } from '../data/profile'
import { projects, getProjectImage, getProjectSrcSet } from '../data/projects'

const stats = [
  { value: '7+', label: 'years of experience' },
  { value: '60+', label: 'Shopify projects' },
  { value: '30+', label: 'clients worked with' },
]
const showcase = ['byneil', 'sabyasachi', 'deckingwood'].map((slug) =>
  projects.find((project) => project.slug === slug)
)

function ShowcaseImage({ project, priority = false }) {
  const [failed, setFailed] = useState(false)
  return failed ? (
    <span className="hero-image-fallback">{project.title}</span>
  ) : (
    <img
      src={getProjectImage(project)}
      srcSet={getProjectSrcSet(project)}
      sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1319px) 55vw, 700px"
      alt={project.title + ' storefront presentation'}
      width="960"
      height="600"
      decoding="async"
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setFailed(true)}
    />
  )
}

export default function HeroEnhanced({ nameFromIntro = false }) {
  const { reducedMotion } = useMotionPreference()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const [active, setActive] = useState(0)
  const [nameVisible, setNameVisible] = useState(!nameFromIntro || reducedMotion)
  const [contentReady, setContentReady] = useState(!nameFromIntro || reducedMotion)
  const nameRef = useRef(null)
  const nameInView = useInView(nameRef, { amount: 0.1 })
  const tiltX = useMotionValue(0)
  const tiltY = useMotionValue(0)
  const rotateX = useSpring(tiltX, { stiffness: 140, damping: 24 })
  const rotateY = useSpring(tiltY, { stiffness: 140, damping: 24 })
  const project = showcase[active]

  useEffect(() => {
    if (reducedMotion || !finePointer) {
      tiltX.set(0)
      tiltY.set(0)
    }
  }, [reducedMotion, finePointer, tiltX, tiltY])

  // Reveal styled name when particle handoff marks the target as revealing/done.
  useEffect(() => {
    if (!nameFromIntro || reducedMotion) {
      setNameVisible(true)
      setContentReady(true)
      return
    }

    const node = nameRef.current
    if (!node) return

    const reveal = () => {
      setNameVisible(true)
      window.setTimeout(() => setContentReady(true), 220)
    }

    if (node.getAttribute('data-handoff') === 'revealing' || node.getAttribute('data-handoff') === 'done') {
      reveal()
      return
    }

    const observer = new MutationObserver(() => {
      const state = node.getAttribute('data-handoff')
      if (state === 'revealing' || state === 'done') {
        reveal()
        observer.disconnect()
      }
    })
    observer.observe(node, { attributes: true, attributeFilter: ['data-handoff'] })

    // Fallback if handoff attribute never arrives.
    const fallback = window.setTimeout(reveal, 2400)
    return () => {
      observer.disconnect()
      window.clearTimeout(fallback)
    }
  }, [nameFromIntro, reducedMotion])

  const followPointer = (event) => {
    if (reducedMotion || !finePointer || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    tiltX.set((-(event.clientY - bounds.top - bounds.height / 2) / bounds.height) * 5)
    tiltY.set(((event.clientX - bounds.left - bounds.width / 2) / bounds.width) * 5)
  }

  const entrance = (delay = 0) => ({
    initial: reducedMotion || !contentReady ? false : { opacity: 0, y: 22 },
    animate: { opacity: contentReady ? 1 : 0, y: contentReady ? 0 : 22 },
    transition: {
      duration: 0.7,
      delay: reducedMotion || !contentReady ? 0 : delay,
      ease: [0.22, 1, 0.36, 1],
    },
  })

  return (
    <section id="home" tabIndex={-1} className="hero-section studio-hero relative">
      <div className="hero-atmosphere" aria-hidden="true" />
      <div className="container-width relative z-10">
        <motion.div className="hero-topline" {...entrance()}>
          <p className="hero-kicker">
            <Code2 size={18} aria-hidden="true" /> A developer's eye. A maker's mindset.
          </p>
          <div className="availability-badge">
            <span className="hero-status-dot" aria-hidden="true" />
            Open to full-time & freelance
          </div>
        </motion.div>

        <div className="studio-signature">
          <motion.p
            className="hero-greeting"
            initial={false}
            animate={{ opacity: contentReady ? 1 : 0, y: contentReady ? 0 : 10 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            Hello, I'm <span aria-hidden="true">↘</span>
          </motion.p>
          <motion.h1
            ref={nameRef}
            id="home-hero-name"
            className="hero-name studio-name"
            data-name-motion={nameInView && !reducedMotion && nameVisible ? 'running' : 'paused'}
            data-handoff={nameFromIntro && !nameVisible ? 'receiving' : undefined}
            initial={false}
            animate={{ opacity: nameVisible ? 1 : 0 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="sr-only">Anita Dantani</span>
            <span className="hero-first-name" aria-hidden="true">
              <span className="hero-name-stroke font-light">Anita</span>
            </span>
            <span className="hero-surname" aria-hidden="true">
              <span className="hero-name-color" data-text="Dantani">
                Dantani
              </span>
              <span className="hero-name-period" />
            </span>
            <Sparkle className="studio-name-spark" aria-hidden="true" strokeWidth={1} />
          </motion.h1>
        </div>

        <div className="studio-hero-grid">
          <motion.div className="studio-introduction" {...entrance(0.08)}>
            <p className="eyebrow">Senior Shopify Plus Developer</p>
            <h2 className="studio-manifesto">
              Code with intent.
              <br />
              <em>Commerce with character.</em>
            </h2>
            <p className="hero-description">
              I build Shopify Plus storefronts, custom apps, and the systems behind them. Thoughtful
              experiences, from the first impression to the final checkout.
            </p>
            <div className="hero-actions">
              <Link to="/#portfolio" className="button-primary hero-work-cta">
                Explore my work{' '}
                <span>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </span>
              </Link>
              <Link to="/#contact" className="hero-contact-cta">
                Let's talk <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <p className="studio-specialisms">
              Shopify Plus <span aria-hidden="true">/</span> Custom apps{' '}
              <span aria-hidden="true">/</span> Technical leadership
            </p>
          </motion.div>

          <motion.div className="studio-showcase" {...entrance(0.14)}>
            <div className="studio-showcase-top">
              <span>
                <span className="hero-status-dot" aria-hidden="true" /> A glimpse of my work
              </span>
              <span className="studio-mono" aria-hidden="true">
                0{active + 1} — 03
              </span>
            </div>
            <div
              className="studio-perspective"
              onPointerMove={followPointer}
              onPointerLeave={() => {
                tiltX.set(0)
                tiltY.set(0)
              }}
            >
              <motion.a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-project-portal"
                style={{ rotateX: reducedMotion ? 0 : rotateX, rotateY: reducedMotion ? 0 : rotateY }}
                aria-label={'View ' + project.title + ' live website (opens in a new tab)'}
              >
                <motion.div
                  key={project.slug}
                  className="studio-project-visual"
                  initial={reducedMotion ? false : { opacity: 0.4, scale: 1.035 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: reducedMotion ? 0 : 0.55 }}
                >
                  <ShowcaseImage project={project} priority={active === 0} />
                </motion.div>
                <span className="studio-project-overlay">
                  <span>
                    <small>{project.category}</small>
                    <strong>{project.title}</strong>
                  </span>
                  <span className="studio-project-visit">
                    <ArrowUpRight size={25} aria-hidden="true" />
                    <span>Visit site</span>
                  </span>
                </span>
              </motion.a>
            </div>
            <div className="studio-project-switcher" role="group" aria-label="Choose a featured project">
              {showcase.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={active === index}
                  onClick={() => setActive(index)}
                >
                  <span className="studio-mono" aria-hidden="true">
                    0{index + 1}
                  </span>
                  {item.title}
                  <span className="studio-switch-dot" aria-hidden="true" />
                </button>
              ))}
            </div>
            <span className="sr-only" role="status">
              Featured project: {project.title}
            </span>
          </motion.div>
        </div>

        <motion.div className="hero-bottom studio-hero-bottom" {...entrance(0.2)}>
          <dl className="hero-stats">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value}</dd>
              </div>
            ))}
          </dl>
          <div className="hero-bottom-links">
            <a href={profile.resume} download className="hero-resume">
              <Download size={15} aria-hidden="true" /> Résumé
            </a>
            <Link to="/#portfolio" className="studio-scroll-link">
              Keep exploring{' '}
              <span className="hero-scroll-link">
                <ArrowDown size={18} aria-hidden="true" />
              </span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

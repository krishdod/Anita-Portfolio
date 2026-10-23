import { useEffect, useRef, useState } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { ArrowDown, ArrowUpRight, Download } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMotionPreference } from '../hooks/useMotionPreference'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { profile } from '../data/profile'
import { projects, getProjectImage, getProjectSrcSet } from '../data/projects'

const stats = [
  { value: '7+', label: 'years of experience' },
  { value: 'DTC / B2B', label: 'commerce experience' },
  { value: 'Full stack', label: 'front to back' },
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

export default function HeroEnhanced({ nameFromIntro = false, handoffPhase = 'done' }) {
  const { reducedMotion } = useMotionPreference()
  const finePointer = useMediaQuery('(hover: hover) and (pointer: fine)')
  const [active, setActive] = useState(0)
  const fromIntro = nameFromIntro && !reducedMotion
  const nameVisible =
    !fromIntro ||
    handoffPhase === 'outline' ||
    handoffPhase === 'ink' ||
    handoffPhase === 'content' ||
    handoffPhase === 'done'
  const contentReady = !fromIntro || handoffPhase === 'content' || handoffPhase === 'done'
  const typeMotionReady = !fromIntro || handoffPhase === 'ink' || handoffPhase === 'content' || handoffPhase === 'done'
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

  const followPointer = (event) => {
    if (reducedMotion || !finePointer || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    tiltX.set((-(event.clientY - bounds.top - bounds.height / 2) / bounds.height) * 10)
    tiltY.set(((event.clientX - bounds.left - bounds.width / 2) / bounds.width) * 10)
  }

  const entrance = (delay = 0) => ({
    initial: reducedMotion || !contentReady ? false : { opacity: 0, y: 14 },
    animate: { opacity: contentReady ? 1 : 0, y: contentReady ? 0 : 14 },
    transition: {
      duration: 0.55,
      delay: reducedMotion || !contentReady ? 0 : delay,
      ease: [0.22, 1, 0.36, 1],
    },
  })

  const handoffAttr = fromIntro && handoffPhase !== 'done' ? handoffPhase : undefined

  return (
    <section id="home" tabIndex={-1} className="hero-section studio-hero relative" data-hero-motion={nameInView && typeMotionReady && !reducedMotion ? 'running' : 'paused'}>
      <div className="container-width relative z-10">
        <motion.div className="hero-topline" {...entrance(0)}>
          <p className="hero-kicker">
            <span className="hero-status-dot" aria-hidden="true" /> Shopify development & technical leadership
          </p>
          <div className="hero-current-role">
            <span>Currently</span> {profile.currentRole} at <strong>{profile.currentCompany}</strong>
          </div>
        </motion.div>

        <div className="studio-signature">
          <motion.p
            className="hero-greeting"
            initial={false}
            animate={{ opacity: contentReady ? 1 : 0, y: contentReady ? 0 : 8 }}
            transition={{ duration: 0.45, delay: contentReady ? 0.04 : 0, ease: [0.22, 1, 0.36, 1] }}
          >
            Hello, I'm <span aria-hidden="true">↘</span>
          </motion.p>
          <h1
            ref={nameRef}
            id="home-hero-name"
            className="hero-name studio-name"
            data-name-motion={nameInView && !reducedMotion && nameVisible && typeMotionReady ? 'running' : 'paused'}
            data-handoff={handoffAttr}
            style={!fromIntro || handoffPhase === 'done' || handoffPhase === 'content' ? { opacity: 1 } : undefined}
          >
            <span className="sr-only">Anita Dantani</span>
            <span className="hero-first-name hero-word-mask" aria-hidden="true">
              <motion.span className="hero-name-stroke" initial={reducedMotion ? false : { y: '110%', rotate: 3 }}
                animate={nameVisible ? { y: '0%', rotate: 0 } : { y: '110%', rotate: 3 }}
                transition={{ duration: reducedMotion ? 0 : .95, ease: [.22, 1, .36, 1] }}>Anita</motion.span>
            </span>
            <span className="hero-surname" aria-hidden="true">
              <motion.span className="hero-name-color" data-text="Dantani" initial={reducedMotion ? false : { y: '110%', rotate: 3 }}
                animate={nameVisible ? { y: '0%', rotate: 0 } : { y: '110%', rotate: 3 }}
                transition={{ duration: reducedMotion ? 0 : .95, delay: reducedMotion ? 0 : .12, ease: [.22, 1, .36, 1] }}>
                Dantani
              </motion.span>
              <span className="hero-name-period" />
            </span>
          </h1>
        </div>

        <div className="studio-hero-grid">
          <motion.div className="studio-introduction" {...entrance(0.06)}>
            <p className="eyebrow">{profile.role}</p>
            <h2 className="studio-manifesto">
              The storefront.
              <br />
              <em>The systems behind it.</em>
            </h2>
            <p className="hero-description">
              I help DTC and B2B brands build on Shopify. From a Figma handoff to custom apps,
              checkout logic, and API integrations, I take care of the details on both sides of the screen.
            </p>
            <div className="hero-actions">
              <Link to="/#portfolio" className="button-primary hero-work-cta">
                See selected work{' '}
                <span>
                  <ArrowUpRight size={19} aria-hidden="true" />
                </span>
              </Link>
              <Link to="/#contact" className="hero-contact-cta">
                Let's talk <ArrowUpRight size={18} aria-hidden="true" />
              </Link>
            </div>
            <p className="studio-specialisms">
              Liquid <span aria-hidden="true">/</span> React & TypeScript{' '}
              <span aria-hidden="true">/</span> Node.js & GraphQL
            </p>
          </motion.div>

          <motion.div className="studio-showcase" {...entrance(0.1)}>
            <div className="studio-showcase-top">
              <span>
                Selected from the project archive
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
            <p className="showcase-footnote"><span aria-hidden="true">↳</span> Real storefronts. Different brands, different challenges.</p>
          </motion.div>
        </div>

        <motion.div className="hero-bottom studio-hero-bottom" {...entrance(0.14)}>
          <dl className="hero-stats">
            {stats.map(({ value, label }) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value === '7+' ? <><span className="sr-only">7+</span><span aria-hidden="true"><span className="metric-value" data-count="7">7</span>+</span></> : value}</dd>
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

import { Component, lazy, Suspense, useCallback, useEffect, useState } from 'react'
import { BrowserRouter, Outlet, Route, Routes, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Navigation } from './components/layout/Navigation'
import { SmoothCursor } from './components/effects/SmoothCursor'
import { ScrollProgress } from './components/effects/ScrollProgress'
import { SmoothScrolling } from './components/effects/SmoothScrolling'
import HeroEnhanced from './components/HeroEnhanced'
import ProjectsEnhanced from './components/ProjectsEnhanced'
import About from './components/sections/About'
import Work from './components/Work'
import TechStack from './components/TechStack'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ParticleIntro from './components/ParticleIntro'
import NotFound from './pages/NotFound'
import { useMotionPreference } from './hooks/useMotionPreference'
import { usePerfMode } from './hooks/usePerfMode'
import { usePageMeta } from './hooks/usePageMeta'
import { smoothScrollTo } from './lib/utils'

const AllProjects = lazy(() => import('./pages/AllProjects'))
const SparklesCore = lazy(() =>
  import('./components/ui/sparkles').then((module) => ({ default: module.SparklesCore }))
)
const BackgroundBeams = lazy(() =>
  import('./components/ui/background-beams').then((module) => ({ default: module.BackgroundBeams }))
)
let hasEnteredPortfolio = false

function PageLoading() {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="container-width min-h-[75svh] flex items-center justify-center pt-24"
    >
      <p role="status" className="text-muted-foreground">
        Loading projects…
      </p>
    </main>
  )
}

class PageErrorBoundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    if (this.state.failed) {
      return (
        <main
          id="main-content"
          className="container-width min-h-[75svh] flex flex-col items-start justify-center pt-28 pb-16"
        >
          <p className="eyebrow">Something didn't load</p>
          <h1 className="section-title mb-5">Let's try that again.</h1>
          <p className="text-muted-foreground mb-7">
            Please reload the page. You can also reach me at{' '}
            <a className="underline" href="mailto:anitadantani0@gmail.com">
              anitadantani0@gmail.com
            </a>
            .
          </p>
          <button type="button" className="button-primary" onClick={() => window.location.reload()}>
            Reload page
          </button>
        </main>
      )
    }
    return this.props.children
  }
}

function SiteLayout() {
  const location = useLocation()
  const perfMode = usePerfMode()

  useEffect(() => {
    if (location.pathname === '/') return
    hasEnteredPortfolio = true
    window.lenis?.scrollTo(0, { immediate: true })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [location.pathname])

  return (
    <div className="site-shell">
      <div className="ambient-background" aria-hidden="true">
        <div className="absolute inset-0 gradient-mesh opacity-25 dark:opacity-35" />
        {!perfMode && (
          <Suspense fallback={null}>
            <BackgroundBeams className="opacity-20" />
            <SparklesCore
              id="ambient-sparkles"
              background="transparent"
              minSize={0.6}
              maxSize={1.6}
              particleDensity={18}
              particleColor="110, 130, 200"
              className="pointer-events-none"
            />
          </Suspense>
        )}
      </div>
      <div className="page-texture" aria-hidden="true" />
      <SmoothScrolling />
      <SmoothCursor />
      <ScrollProgress />
      <Navigation />
      <PageErrorBoundary key={location.pathname}>
        <Suspense fallback={<PageLoading />}>
          <Outlet />
        </Suspense>
      </PageErrorBoundary>
      <Footer />
    </div>
  )
}

function getInitialIntroPhase(location) {
  if (hasEnteredPortfolio || location.hash || location.state?.skipIntro) return 'done'
  return 'playing'
}

function HomePage() {
  const location = useLocation()
  const { reducedMotion } = useMotionPreference()
  const [introPhase, setIntroPhase] = useState(() => getInitialIntroPhase(location))
  const [nameFromIntro, setNameFromIntro] = useState(false)

  const finishIntro = useCallback(() => {
    hasEnteredPortfolio = true
    setIntroPhase('done')
  }, [])

  const startHandoff = useCallback(() => {
    setNameFromIntro(true)
    setIntroPhase((phase) => (phase === 'done' ? 'done' : 'handingOff'))
  }, [])

  const skipIntro = useCallback(() => {
    setNameFromIntro(false)
    finishIntro()
  }, [finishIntro])

  usePageMeta(
    'Anita Dantani — Senior Shopify Plus Developer',
    'Shopify Plus storefronts, custom apps, checkout extensions, and commerce integrations. Explore Anita Dantani’s work and get in touch.',
    '/'
  )

  // Reduced motion: brief static name, then enter without particle handoff.
  useEffect(() => {
    if (!reducedMotion || introPhase !== 'playing') return
    const timer = window.setTimeout(skipIntro, 700)
    return () => window.clearTimeout(timer)
  }, [reducedMotion, introPhase, skipIntro])

  // Safety timeout — skip handoff polish if something stalls.
  useEffect(() => {
    if (introPhase === 'done' || reducedMotion) return
    const timer = window.setTimeout(skipIntro, 22000)
    return () => window.clearTimeout(timer)
  }, [introPhase, reducedMotion, skipIntro])

  useEffect(() => {
    if (introPhase === 'done') return
    const previousOverflow = document.body.style.overflow
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    const header = document.querySelector('.site-header')
    const footer = document.querySelector('footer')
    header?.setAttribute('inert', '')
    footer?.setAttribute('inert', '')
    const handleKey = (event) => {
      if (event.key === 'Escape') skipIntro()
    }
    window.addEventListener('keydown', handleKey)
    return () => {
      document.body.style.overflow = previousOverflow
      header?.removeAttribute('inert')
      footer?.removeAttribute('inert')
      window.removeEventListener('keydown', handleKey)
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true })
    }
  }, [introPhase, skipIntro])

  useEffect(() => {
    if (introPhase !== 'done') return
    hasEnteredPortfolio = true
    let sectionId
    try {
      sectionId = decodeURIComponent(location.hash.slice(1))
    } catch {
      sectionId = 'home'
    }
    if (!sectionId && location.state?.scrollToContact) sectionId = 'contact'
    const frame = requestAnimationFrame(() => {
      if (sectionId && document.getElementById(sectionId)) {
        smoothScrollTo(sectionId)
        document.getElementById(sectionId).focus({ preventScroll: true })
      } else if (!location.hash) {
        document.getElementById('main-content')?.focus({ preventScroll: true })
      }
    })
    return () => cancelAnimationFrame(frame)
  }, [introPhase, location.hash, location.state, location.key])

  const showIntro = introPhase === 'playing' || introPhase === 'handingOff'
  const showContent = introPhase === 'handingOff' || introPhase === 'done'

  return (
    <>
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[999] pointer-events-auto"
            role="dialog"
            aria-modal="true"
            aria-label="Welcome to Anita Dantani’s portfolio"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            {reducedMotion ? (
              <div className="absolute inset-0 bg-black flex items-center justify-center px-6">
                <p className="text-white text-center font-heading font-bold text-3xl sm:text-5xl">
                  ANITA DANTANI
                </p>
              </div>
            ) : (
              <ParticleIntro onFormed={startHandoff} onHandoffComplete={finishIntro} />
            )}
            {showIntro && (
              <button
                type="button"
                autoFocus={introPhase === 'playing'}
                onClick={skipIntro}
                onKeyDown={(event) => {
                  if (event.key === 'Tab' && introPhase === 'playing') event.preventDefault()
                }}
                className="intro-skip"
              >
                Enter portfolio <ArrowRight size={16} aria-hidden="true" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <main id="main-content" tabIndex={-1} className="relative">
        {showContent && (
          <>
            <HeroEnhanced nameFromIntro={nameFromIntro && !reducedMotion} />
            <ProjectsEnhanced />
            <About />
            <Work />
            <TechStack />
            <Contact />
          </>
        )}
      </main>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/all-work" element={<AllProjects />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

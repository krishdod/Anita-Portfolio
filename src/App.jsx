import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { SmoothCursor } from './components/effects/SmoothCursor'
import { ScrollProgress } from './components/effects/ScrollProgress'
import { Navigation } from './components/layout/Navigation'
import HeroEnhanced from './components/HeroEnhanced'
import About from './components/sections/About'
import Work from './components/Work'
import ProjectsEnhanced from './components/ProjectsEnhanced'
import TechStack from './components/TechStack'
import Contact from './components/Contact'
import Footer from './components/Footer'
import ParticleIntro from './components/ParticleIntro'
import { SparklesCore } from './components/ui/sparkles'
import { BackgroundBeams } from './components/ui/background-beams'
import { AnimatedGrid } from './components/ui/animated-grid'
import { AnimatedWaves } from './components/ui/animated-waves'
import { FloatingShapes } from './components/ui/floating-shapes'
import AllProjects from './pages/AllProjects'
import { smoothScrollTo } from './lib/utils'

function HomePage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [showIntro, setShowIntro] = useState(true)
  const [particleEffectComplete, setParticleEffectComplete] = useState(false)
  const [scrollLocked, setScrollLocked] = useState(true)

  // Hide intro after a fallback delay if particle effect doesn't complete
  useEffect(() => {
    if (!showIntro) return
    const timer = setTimeout(() => {
      if (!particleEffectComplete) {
        setShowIntro(false)
      }
    }, 20000) // Fallback safety (avoids getting stuck)
    return () => clearTimeout(timer)
  }, [showIntro, particleEffectComplete])

  const handleParticleComplete = () => {
    setParticleEffectComplete(true)
    // Hide intro; scrolling unlock happens after the exit animation completes.
    setShowIntro(false)
    // Unlock immediately after intro is requested to close (exit opacity is ~instant).
    setScrollLocked(false)
  }

  // From /all-work "Start a project": scroll to contact once main content is mounted
  useEffect(() => {
    if (!location.state?.scrollToContact || showIntro) return
    const id = window.setTimeout(() => {
      smoothScrollTo('contact', 80)
      navigate('/', { replace: true, state: {} })
    }, 150)
    return () => clearTimeout(id)
  }, [location.state, showIntro, navigate])

  // Lock scrolling during the intro overlay.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    if (scrollLocked) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = prevOverflow || ''
    }

    return () => {
      document.body.style.overflow = prevOverflow
    }
  }, [scrollLocked])

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      <div className="page-texture" aria-hidden />
      {/* Global Background - Spans entire page */}
      <div className="fixed inset-0 -z-10">
        {/* Advanced Gradient Mesh Background */}
        <div className="absolute inset-0 gradient-mesh opacity-30 dark:opacity-60 animate-mesh-drift motion-reduce:animate-none [transform:translateZ(0)]" />
        <div
          className="pointer-events-none absolute inset-0 motion-reduce:animate-none animate-aurora-shift opacity-20 dark:opacity-30 mix-blend-screen dark:mix-blend-plus-lighter"
          style={{
            background:
              'linear-gradient(118deg, rgba(59,130,246,0.45) 0%, rgba(139,92,246,0.38) 38%, rgba(244,114,182,0.32) 68%, rgba(34,211,238,0.28) 100%)',
            backgroundSize: '200% 200%',
          }}
        />
        
        {/* Animated Grid Pattern */}
        <AnimatedGrid className="opacity-30" />
        
        {/* Animated Waves */}
        <AnimatedWaves className="opacity-40" />
        
        {/* Floating Shapes */}
        <FloatingShapes className="opacity-50" />
        
        {/* Animated Background with Beams */}
        <BackgroundBeams className="opacity-50" />
        
        {/* Enhanced Sparkles Effect */}
        <SparklesCore
          id="tsparticles-global"
          background="transparent"
          minSize={0.6}
          maxSize={2}
          particleDensity={35}
          className="w-full h-full pointer-events-none"
          particleColor="100, 150, 255"
        />

        {/* Advanced Gradient Orbs with Glow */}
        <motion.div
          className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/10 dark:from-blue-500/30 via-purple-500/10 dark:via-purple-500/20 to-transparent rounded-full blur-[100px]"
          animate={{
            x: [0, 150, 0],
            y: [0, 80, 0],
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 dark:from-purple-500/30 via-pink-500/10 dark:via-pink-500/20 to-transparent rounded-full blur-[120px]"
          animate={{
            x: [0, -150, 0],
            y: [0, -80, 0],
            scale: [1, 1.3, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-pink-500/10 dark:from-pink-500/20 via-blue-500/8 dark:via-blue-500/15 to-transparent rounded-full blur-[80px]"
          animate={{
            scale: [1, 1.4, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </div>

      {/* Full-screen particle intro overlay */}
      <AnimatePresence mode="wait">
        {showIntro && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[999] bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.01 }}
          >
            <ParticleIntro onFinished={handleParticleComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      <ScrollProgress />
      <SmoothCursor />
      <Navigation />
      <main id="main-content" role="main" className="relative">
        {!showIntro && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.01,
            }}
          >
        <HeroEnhanced />
        <About />
            <TechStack />
        <Work />
        <ProjectsEnhanced />
        <Contact />
          </motion.div>
        )}
      </main>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/all-work" element={<AllProjects />} />
      </Routes>
    </Router>
  )
}

export default App

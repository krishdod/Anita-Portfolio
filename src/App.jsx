import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
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
import AllProjects from './pages/AllProjects'

function HomePage() {
  const [showIntro, setShowIntro] = useState(true)
  const [particleEffectComplete, setParticleEffectComplete] = useState(false)

  // Hide intro after a fallback delay if particle effect doesn't complete
  useEffect(() => {
    if (!showIntro) return
    const timer = setTimeout(() => {
      if (!particleEffectComplete) {
        setShowIntro(false)
      }
    }, 5000) // Increased fallback timeout
    return () => clearTimeout(timer)
  }, [showIntro, particleEffectComplete])

  const handleParticleComplete = () => {
    setParticleEffectComplete(true)
    // Wait for particle effect to fully complete, then hide intro
    setTimeout(() => {
      setShowIntro(false)
    }, 1000) // 1 second after particle effect completes
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Global Background - Spans entire page */}
      <div className="fixed inset-0 -z-10">
        {/* Advanced Gradient Mesh Background */}
        <div className="absolute inset-0 gradient-mesh opacity-30 dark:opacity-60" />
        
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
      <AnimatePresence>
        {showIntro && (
          <motion.div
            key="intro"
            className="fixed inset-0 z-[999] bg-black"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
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
            transition={{ duration: 0.6, delay: 0.3 }}
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

import { useEffect, useState } from 'react'
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

function App() {
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
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
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

export default App

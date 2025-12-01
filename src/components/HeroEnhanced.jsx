import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Sparkles, Code2, Award, Users, Briefcase, Trophy } from 'lucide-react'
import { GradientText } from './animated/GradientText'
import { SparklesCore } from './ui/sparkles'
import { BackgroundBeams } from './ui/background-beams'
import { Card } from './ui/card'
import { RevealOnScroll } from './effects/RevealOnScroll'
import { staggerContainer, staggerItem } from '../lib/animations'
import { smoothScrollTo } from '../lib/utils'
import Tilt from 'react-parallax-tilt'
import { CountUpNumber } from './ui/countup'

const HeroEnhanced = () => {
  const scrollToNext = () => {
    smoothScrollTo('about')
  }

  const words = ['Build', 'Optimize', 'Scale', 'Deliver']
  const [currentWord, setCurrentWord] = React.useState(0)
  const [showScrollHint, setShowScrollHint] = React.useState(true)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  React.useEffect(() => {
    if (typeof window === 'undefined') return

    const handleScroll = () => {
      const hero = document.getElementById('home')
      if (!hero) return
      const rect = hero.getBoundingClientRect()
      const visibleRatio = rect.bottom / window.innerHeight
      setShowScrollHint(visibleRatio > 0.7)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden bg-background pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-6 sm:pb-8 md:pb-10">
      {/* Advanced Gradient Mesh Background */}
      <div className="absolute inset-0 gradient-mesh opacity-30 dark:opacity-60" />
      
      {/* Animated Background with Beams */}
      <BackgroundBeams className="opacity-50" />
      
      {/* Enhanced Sparkles Effect */}
      <SparklesCore
        id="tsparticles"
        background="transparent"
        minSize={0.6}
        maxSize={2}
        particleDensity={35}
        className="w-full h-full pointer-events-none"
        particleColor="100, 150, 255"
      />

      {/* Advanced Gradient Orbs with Glow */}
      <motion.div
        className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/30 via-purple-500/20 to-transparent rounded-full blur-[100px] glow-blue"
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
        className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/10 dark:from-purple-500/30 via-pink-500/10 dark:via-pink-500/20 to-transparent rounded-full blur-[120px] glow-purple"
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
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gradient-to-br from-pink-500/10 dark:from-pink-500/20 via-blue-500/8 dark:via-blue-500/15 to-transparent rounded-full blur-[80px] glow-pink"
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

      <div className="container-width w-full relative z-10 px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Badge with Glow */}
          <motion.div variants={staggerItem} className="mb-6 sm:mb-8">
            <motion.div
              className="inline-flex items-center gap-2 px-3 sm:px-4 md:px-5 py-2 sm:py-2.5 rounded-full border border-blue-500/40 dark:border-blue-500/40 bg-blue-100/80 dark:bg-blue-500/15 backdrop-blur-md relative"
              whileHover={{ 
                scale: 1.08, 
                boxShadow: "0 0 30px rgba(59, 130, 246, 0.6)",
                y: -3,
                transition: { duration: 0.3 }
              }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                  "0 0 30px rgba(59, 130, 246, 0.5)",
                  "0 0 20px rgba(59, 130, 246, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.2, 1],
                }}
                transition={{ 
                  rotate: { duration: 3, repeat: Infinity, ease: "linear" },
                  scale: { duration: 1.5, repeat: Infinity }
                }}
              >
                <Sparkles size={18} className="text-blue-600 dark:text-blue-400" />
              </motion.div>
              <span className="text-xs sm:text-sm md:text-base font-semibold text-blue-700 dark:text-white tracking-wide">Open to Full-Time & Freelance</span>
            </motion.div>
          </motion.div>

          {/* Main Heading with Enhanced Gradient */}
          <motion.div variants={staggerItem} className="mb-6 sm:mb-8">
            <h1 className="leading-[0.9] tracking-tighter text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl 2xl:text-[10rem] font-black">
              <motion.span 
                className="block mb-2 sm:mb-3 md:mb-4 text-foreground/90 dark:text-white/90 font-light tracking-normal text-3xl sm:text-4xl md:text-5xl lg:text-6xl"
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                Hi, I'm
              </motion.span>
              <motion.span
                className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-glow"
                style={{
                  backgroundSize: '200% auto',
                  filter: 'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
                }}
                animate={{
                  backgroundPosition: ['0% center', '200% center'],
                  filter: [
                    'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
                    'drop-shadow(0 0 30px rgba(147, 51, 234, 0.6))',
                    'drop-shadow(0 0 20px rgba(59, 130, 246, 0.5))',
                  ],
                }}
                transition={{
                  backgroundPosition: { duration: 8, repeat: Infinity, ease: 'linear' },
                  filter: { duration: 3, repeat: Infinity },
                }}
              >
                Anita Dantani
              </motion.span>
            </h1>
          </motion.div>

          {/* Animated Role with Text Generate Effect */}
          <motion.div variants={staggerItem} className="mb-8 sm:mb-10">
            <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6 text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-light text-foreground/80 dark:text-gray-200">
              <span className="font-extralight">I</span>
              <motion.div
                key={currentWord}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.9 }}
                transition={{ 
                  duration: 0.6,
                  type: 'spring',
                  stiffness: 150,
                }}
                className="min-w-[150px] sm:min-w-[200px] md:min-w-[250px] lg:min-w-[300px] xl:min-w-[350px]"
              >
                <motion.span
                  className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400"
                  animate={{
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                >
                  {words[currentWord]}
                </motion.span>
              </motion.div>
            </div>
          </motion.div>

          {/* Job Title with Icon */}
          <motion.div variants={staggerItem} className="mb-10 sm:mb-12 md:mb-14">
            <div className="flex items-start gap-3 sm:gap-4 md:gap-5">
              <motion.div 
                className="flex gap-2 sm:gap-3 text-blue-400 mt-2"
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                whileHover={{ scale: 1.2, rotate: 360, transition: { duration: 0.5 } }}
              >
                <Code2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" strokeWidth={2} />
              </motion.div>
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl 2xl:text-6xl font-light leading-tight text-foreground/90 dark:text-gray-100">
                  <motion.span
                    className="block mb-2"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    Senior Shopify Full Stack Developer
                  </motion.span>
                  <motion.span
                    className="block mb-2 text-foreground/70 dark:text-gray-300"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    & E-commerce Project Manager
                  </motion.span>
                  <motion.span 
                    className="block font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl mt-2 sm:mt-3"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, type: 'spring' }}
                  >
                    Recognized by Shopify
                  </motion.span>
                </h2>
              </div>
            </div>
          </motion.div>

          {/* Description with Text Generate Effect */}
          <motion.div variants={staggerItem} className="mb-10 sm:mb-12 md:mb-14 max-w-4xl">
            <motion.p
              className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-foreground/80 dark:text-gray-300 leading-relaxed font-light"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              I build{' '}
              <span className="font-semibold text-foreground dark:text-white">high-performing Shopify stores</span>,{' '}
              <span className="font-semibold text-foreground dark:text-white">custom apps</span>, and{' '}
              <span className="font-semibold text-foreground dark:text-white">checkout experiences</span> that{' '}
              <motion.span
                className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-400 font-bold"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                boost revenue
              </motion.span>,{' '}
              improve performance, and streamline operations for fast-growing brands.
            </motion.p>
          </motion.div>

          {/* Advanced CTA Buttons with Premium Effects */}
          <motion.div variants={staggerItem} className="flex flex-wrap gap-3 sm:gap-4 md:gap-5 lg:gap-6">
            <motion.button
              onClick={scrollToNext}
              className="relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl font-bold rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-2xl overflow-hidden group border border-white/20"
              whileHover={{ 
                scale: 1.1,
                boxShadow: '0 30px 60px rgba(59, 130, 246, 0.6), 0 0 100px rgba(147, 51, 234, 0.3)',
                y: -6,
                borderColor: 'rgba(255, 255, 255, 0.4)',
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 20px 40px rgba(59, 130, 246, 0.5), 0 0 60px rgba(147, 51, 234, 0.2)',
                  '0 30px 60px rgba(147, 51, 234, 0.6), 0 0 100px rgba(236, 72, 153, 0.3)',
                  '0 20px 40px rgba(59, 130, 246, 0.5), 0 0 60px rgba(147, 51, 234, 0.2)',
                ],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <span className="relative z-10 flex items-center gap-2">
                View My Work
                <motion.span
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  →
                </motion.span>
              </span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500"
                initial={{ x: '100%' }}
                whileHover={{ x: '0%' }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
            
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                smoothScrollTo('contact', 80)
              }}
              className="relative px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-base sm:text-lg md:text-xl font-bold rounded-full border-2 border-blue-500/60 dark:border-blue-400/60 text-blue-600 dark:text-blue-400 hover:text-white dark:hover:text-white backdrop-blur-xl glass border-gradient transition-all duration-300 overflow-hidden group"
              whileHover={{ 
                scale: 1.1,
                borderColor: 'rgba(147, 51, 234, 0.8)',
                boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4), 0 0 60px rgba(147, 51, 234, 0.2)',
                y: -6,
              }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="relative z-10">Let's Talk</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500"
                initial={{ scale: 0, opacity: 0 }}
                whileHover={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.4 }}
              />
            </motion.a>
          </motion.div>

          {/* Stats Cards - Centered and Responsive */}
          <div className="mt-12 sm:mt-16 md:mt-20 flex flex-col items-center gap-6 sm:gap-8 md:gap-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 w-full max-w-5xl">
            {/* Stats Cards */}
            <RevealOnScroll delay={0.1}>
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
                  <Card className="p-4 sm:p-5 md:p-6 lg:p-8 h-full bg-gradient-to-br from-blue-500/5 to-blue-500/10 border-blue-500/20 hover:border-blue-500/40 transition-all">
                  <div className="flex flex-col items-center text-center">
          <motion.div 
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 sm:mb-3 md:mb-4"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Award className="text-blue-500 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2">
                      <GradientText>
                        <CountUpNumber end={6} suffix="+" duration={2.5} />
                      </GradientText>
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Years Experience</p>
                  </div>
                </Card>
              </Tilt>
            </RevealOnScroll>

            <RevealOnScroll delay={0.2}>
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
                <Card className="p-4 sm:p-5 md:p-6 lg:p-8 h-full bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-transparent border-purple-500/30 hover:border-purple-500/60 glass glow-purple transition-all backdrop-blur-sm">
                  <div className="flex flex-col items-center text-center">
              <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-purple-500/10 flex items-center justify-center mb-2 sm:mb-3 md:mb-4"
                      whileHover={{ scale: 1.1, rotate: -360 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Briefcase className="text-purple-500 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2">
                      <GradientText>
                        <CountUpNumber end={60} suffix="+" duration={2.5} />
                      </GradientText>
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Shopify Projects</p>
                  </div>
                </Card>
              </Tilt>
            </RevealOnScroll>

            <RevealOnScroll delay={0.3}>
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
                <Card className="p-4 sm:p-5 md:p-6 lg:p-8 h-full bg-gradient-to-br from-emerald-500/10 via-green-500/5 to-transparent border-emerald-500/30 hover:border-emerald-500/60 glass transition-all backdrop-blur-sm" style={{ boxShadow: '0 0 20px rgba(34, 197, 94, 0.3)' }}>
                  <div className="flex flex-col items-center text-center">
                  <motion.div 
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-green-500/10 flex items-center justify-center mb-2 sm:mb-3 md:mb-4"
                      whileHover={{ scale: 1.1, y: -5 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Users className="text-green-500 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                  </motion.div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2">
                      <GradientText>
                        <CountUpNumber end={30} suffix="+" duration={2.5} />
                      </GradientText>
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Happy Clients</p>
                  </div>
                </Card>
              </Tilt>
            </RevealOnScroll>

            <RevealOnScroll delay={0.4}>
              <Tilt tiltMaxAngleX={10} tiltMaxAngleY={10}>
                <Card className="p-4 sm:p-5 md:p-6 lg:p-8 h-full bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent border-orange-500/30 hover:border-orange-500/60 glass transition-all backdrop-blur-sm" style={{ boxShadow: '0 0 20px rgba(249, 115, 22, 0.3)' }}>
                  <div className="flex flex-col items-center text-center">
                    <motion.div
                      className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 rounded-full bg-orange-500/10 flex items-center justify-center mb-2 sm:mb-3 md:mb-4"
                      whileHover={{ scale: 1.1, rotate: 180 }}
                      transition={{ duration: 0.6 }}
                    >
                      <Trophy className="text-orange-500 w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8" />
                    </motion.div>
                    <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-1 sm:mb-2">
                      <GradientText>
                        <CountUpNumber end={3} suffix="+" duration={2.5} />
                      </GradientText>
                    </h3>
                    <p className="text-xs sm:text-sm md:text-base text-muted-foreground">Key Achievements</p>
                  </div>
                </Card>
              </Tilt>
            </RevealOnScroll>
            </div>

            {/* Scroll Indicator - Positioned below stats cards */}
            {showScrollHint && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2.5, duration: 0.8 }}
                className="flex flex-col items-center"
              >
                <motion.button
                  onClick={scrollToNext}
                  className="flex flex-col items-center gap-2 sm:gap-3 text-foreground/60 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors group cursor-pointer"
                  whileHover={{ y: -4 }}
                >
                  <span className="text-xs sm:text-sm uppercase tracking-wider font-semibold">Scroll Down</span>
                  <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <ArrowDown size={20} className="group-hover:scale-110 transition-transform text-foreground/60 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                  </motion.div>
                </motion.button>
              </motion.div>
            )}
                </div>
        </motion.div>
      </div>
    </section>
  )
}

export default HeroEnhanced

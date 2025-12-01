import React from 'react'
import { motion } from 'framer-motion'
import { ArrowDown, Sparkles, Code2, Paintbrush } from 'lucide-react'
import { GradientText } from './animated/GradientText'
import { MagneticButton } from './animated/MagneticButton'
import { TypewriterText } from './animated/TypewriterText'
import { FloatingIcons } from './animated/FloatingIcons'
import { staggerContainer, staggerItem, fadeInUp } from '../lib/animations'
import { smoothScrollTo } from '../lib/utils'

const Hero = () => {
  const scrollToNext = () => {
    smoothScrollTo('about', 80)
  }

  const words = ['Build', 'Optimize', 'Scale', 'Deliver']
  const [currentWord, setCurrentWord] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5" />
      
      {/* Floating Icons Background */}
      <FloatingIcons />

      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, 50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: 'linear'
        }}
      />
      <motion.div
        className="absolute bottom-1/4 -right-20 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"
        animate={{
          x: [0, -100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'linear'
        }}
      />

      <div className="container-width w-full relative z-10">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="max-w-6xl"
        >
          {/* Badge */}
          <motion.div variants={staggerItem} className="mb-6">
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 backdrop-blur-sm"
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">Open to Full-Time & Freelance Opportunities</span>
            </motion.div>
          </motion.div>

          {/* Main Heading with Animated Gradient */}
          <motion.div variants={staggerItem} className="mb-6">
            <h1 className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold leading-none tracking-tight">
              <span className="block mb-2">Hi, I'm</span>
              <GradientText className="block">
                Anita Dantani
              </GradientText>
            </h1>
          </motion.div>

          {/* Animated Role with Typewriter */}
          <motion.div variants={staggerItem} className="mb-8">
            <div className="flex items-center gap-4 text-3xl md:text-4xl lg:text-5xl font-light text-muted-foreground">
              <span>I</span>
              <motion.div
                key={currentWord}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="min-w-[200px]"
              >
                <GradientText className="font-semibold">
                  {words[currentWord]}
                </GradientText>
              </motion.div>
            </div>
          </motion.div>

          {/* Job Title */}
          <motion.div variants={staggerItem} className="mb-12">
            <div className="flex items-start gap-4">
              <div className="flex gap-3 text-primary mt-2">
                <Code2 size={24} />
                <Paintbrush size={24} />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-light leading-tight text-foreground">
                  Senior Shopify Full Stack Developer<br />
                  & E-commerce Project Manager<br />
                  <span className="font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
                    Recognized by Shopify
                  </span>
                </h2>
              </div>
            </div>
          </motion.div>

          {/* Description */}
          <motion.div variants={staggerItem} className="mb-12 max-w-3xl">
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              I build high-performing Shopify stores, custom apps, and checkout experiences that boost revenue, improve{' '}
              <span className="text-foreground font-semibold">performance metrics like LCP</span>, and streamline operations for{' '}
              <span className="text-foreground font-semibold">fast-growing brands</span>.
              Specializing in end-to-end Shopify solutions—from themes and APIs to automation and optimization.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div variants={staggerItem} className="flex flex-wrap gap-4">
            <MagneticButton onClick={scrollToNext}>
              View My Work
            </MagneticButton>
            <motion.a
              href="#contact"
              onClick={(e) => {
                e.preventDefault()
                smoothScrollTo('contact', 80)
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 text-lg font-semibold rounded-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Let's Talk
            </motion.a>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={staggerItem}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: 'Years Experience', value: '6+' },
              { label: 'Shopify Projects', value: '60+' },
              { label: 'Happy Clients', value: '30+' },
              { label: 'Key Achievements', value: '3+' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                className="text-center md:text-left"
              >
                <motion.div 
                  className="text-4xl md:text-5xl font-bold mb-2"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 1.2 + index * 0.1, type: 'spring' }}
                >
                  <GradientText>{stat.value}</GradientText>
                </motion.div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-12 left-1/2 transform -translate-x-1/2"
        >
          <motion.button
            onClick={scrollToNext}
            className="flex flex-col items-center gap-2 text-muted-foreground hover:text-primary transition-colors group"
            whileHover={{ y: -4 }}
          >
            <span className="text-xs uppercase tracking-wider font-medium">Scroll Down</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <ArrowDown size={20} className="group-hover:scale-110 transition-transform" />
            </motion.div>
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Hero

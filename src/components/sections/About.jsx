import React from 'react'
import { motion } from 'framer-motion'
import { Code, Zap, Briefcase } from 'lucide-react'
import { RevealOnScroll } from '../effects/RevealOnScroll'
import { GradientText } from '../animated/GradientText'
import { Card } from '../ui/card'
import ScrollReveal from '../ScrollReveal'
import { CountUpNumber } from '../ui/countup'

const About = () => {
  const skills = [
    { icon: Code, name: 'Custom Shopify Apps & APIs', level: 95 },
    { icon: Zap, name: 'Performance & Checkout Optimization', level: 92 },
    { icon: Briefcase, name: 'E-commerce Project Leadership', level: 90 },
  ]

  return (
    <section id="about" className="section-padding relative overflow-hidden bg-transparent scroll-mt-20">
      
      <div className="container-width relative z-10">
        {/* Section Header */}
        <RevealOnScroll>
          <div className="text-center mb-6 sm:mb-8 md:mb-10">
            <motion.div
              className="inline-block mb-4 sm:mb-5 md:mb-6 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm md:text-base font-semibold tracking-wide"
              whileHover={{ scale: 1.08, y: -3 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              About Me
            </motion.div>
            <div className="mb-4 sm:mb-5 md:mb-6 text-center">
              <ScrollReveal
                containerClassName=""
                textClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-tight tracking-tight [&_.word]:bg-gradient-to-r [&_.word]:from-blue-400 [&_.word]:via-purple-400 [&_.word]:to-pink-400 [&_.word]:bg-clip-text [&_.word]:text-transparent"
                baseOpacity={0.2}
                baseRotation={2}
                blurStrength={6}
              >
                Where Shopify Expertise Meets E-commerce Growth
              </ScrollReveal>
            </div>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground max-w-4xl mx-auto leading-relaxed font-light px-4">
              I design, build, and scale{' '}
              <span className="font-semibold text-foreground">Shopify experiences</span> that improve performance,{' '}
              <span className="font-semibold text-foreground">automate operations</span>, and drive{' '}
              <span className="font-semibold text-foreground">measurable business results</span>
            </p>
          </div>
        </RevealOnScroll>

        {/* Skills Section */}
        <RevealOnScroll delay={0.1}>
          <div className="mt-6 sm:mt-8 md:mt-10">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 md:mb-10">
              Core <GradientText>Expertise</GradientText>
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7 md:gap-8 max-w-5xl mx-auto px-4">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 hover:shadow-xl transition-all border-primary/20 hover:border-primary/50 glass hover:scale-[1.02]">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <skill.icon className="text-primary" size={24} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{skill.name}</h4>
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                        viewport={{ once: true }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2 text-right">
                      <CountUpNumber end={skill.level} suffix="%" duration={1.5} />
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

export default About

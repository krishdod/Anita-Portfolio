import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Briefcase, Award } from 'lucide-react'
import { GradientText } from './animated/GradientText'
import { Card } from './ui/card'
import { staggerContainer, staggerItem, fadeInUp } from '../lib/animations'
import ScrollReveal from './ScrollReveal'

const Work = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const experiences = [
    {
      title: 'Senior Shopify Full Stack Developer',
      company: 'Function Growth',
      period: '2025 - Present',
      location: 'New York (Remote)',
      highlight: 'Custom apps, Shopify Functions, and checkout extensions for high‑growth brands.',
      tags: ['Custom Apps', 'Functions', 'Checkout Extensions'],
    },
    {
      title: 'Shopify Developer',
      company: 'Tenovia Solutions',
      period: '2023 - 2025',
      location: 'Bangalore, IN',
      highlight: 'B2B marketplaces, automation, and scalable architectures for enterprise merchants.',
      tags: ['B2B', 'Automation', 'Marketplaces'],
    },
    {
      title: 'Shopify Developer',
      company: 'ISpark IT',
      period: '2023 - 2023',
      location: 'Ahmedabad, IN',
      highlight: 'Private apps, Admin API integrations, and operational tooling.',
      tags: ['Private Apps', 'Admin API', 'Integrations'],
    },
    {
      title: 'Shopify Developer',
      company: 'Creatpix Infotech',
      period: '2021 - 2023',
      location: 'Ahmedabad, IN',
      highlight: 'Theme development, performance optimisation, and LCP & SEO improvements.',
      tags: ['Themes', 'Performance', 'SEO'],
    },
    {
      title: 'Technical Lead',
      company: 'Bacha Motors (TATA)',
      period: '2020 - 2021',
      location: 'Gujarat, IN',
      highlight: 'Led internal systems using PHP & MySQL, improving workflows across teams.',
      tags: ['PHP', 'MySQL', 'Internal Systems'],
    },
  ]

  const containerVariants = staggerContainer
  const itemVariants = fadeInUp

  return (
    <section
      id="work"
      className="section-padding bg-transparent scroll-mt-20 relative overflow-hidden"
      ref={ref}
    >
      <div className="container-width relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-6 sm:mb-8 md:mb-10 max-w-5xl px-4"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary/10 text-primary text-xs sm:text-sm md:text-base font-semibold mb-4 sm:mb-5 md:mb-6 tracking-wide"
            whileHover={{ scale: 1.08, y: -3 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Briefcase size={18} />
            <span>Experience</span>
          </motion.div>
          <div className="mb-3 sm:mb-4 md:mb-5">
            <ScrollReveal
              containerClassName=""
              textClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black leading-tight tracking-tight text-foreground [&_.word:nth-child(odd)]:bg-gradient-to-r [&_.word:nth-child(odd)]:from-blue-400 [&_.word:nth-child(odd)]:via-purple-400 [&_.word:nth-child(odd)]:to-pink-400 [&_.word:nth-child(odd)]:bg-clip-text [&_.word:nth-child(odd)]:text-transparent"
              baseOpacity={0.2}
              baseRotation={2}
              blurStrength={6}
            >
              A track record of shipping, scaling, and owning Shopify experiences
            </ScrollReveal>
          </div>
          <motion.p 
            className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-muted-foreground leading-relaxed font-light"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.7 }}
          >
            From{' '}
            <span className="font-semibold text-foreground">luxury brands</span> to{' '}
            <span className="font-semibold text-foreground">B2B marketplaces</span>,{' '}
            I've led and shipped end‑to‑end solutions across design, development, and performance.
          </motion.p>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="relative"
        >
          {/* Vertical line */}
          <div className="absolute left-5 sm:left-7 md:left-9 lg:left-10 top-0 bottom-0 border-l border-border/50 pointer-events-none" />

          <div className="space-y-8 sm:space-y-10 md:space-y-12 px-4">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title + exp.company}
                variants={itemVariants}
                className="relative pl-16 sm:pl-20 md:pl-24"
              >
                {/* Timeline dot */}
                <div className="absolute left-5 sm:left-7 md:left-9 lg:left-10 top-6 -translate-x-1/2">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_0_6px_rgba(59,130,246,0.25)] border-2 border-background" />
                </div>

                <Card className="border border-border/80 bg-card/90 backdrop-blur-xl glass hover:border-primary/60 transition-smooth shadow-sm hover:shadow-xl hover:scale-[1.01]">
                  <div className="p-4 sm:p-5 md:p-6 lg:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4 mb-4">
                      <div>
                        <h3 className="text-xl md:text-2xl font-semibold text-foreground mb-1">
                          {exp.title}
                        </h3>
                        <p className="text-sm md:text-base text-muted-foreground">
                          {exp.company} · {exp.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm md:text-base text-muted-foreground">
                        <Award size={16} className="text-primary" />
                        <span>{exp.period}</span>
                      </div>
                    </div>

                    <p className="text-sm md:text-base text-muted-foreground mb-4">
                      {exp.highlight}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs md:text-sm font-medium bg-muted/60 text-foreground border border-border/60"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Work

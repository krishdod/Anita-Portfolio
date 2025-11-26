import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Briefcase, Award } from 'lucide-react'
import { GradientText } from './animated/GradientText'
import { Card } from './ui/card'
import { staggerContainer, staggerItem, fadeInUp } from '../lib/animations'

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
      className="section-padding bg-gradient-to-b from-background to-muted/20"
      ref={ref}
    >
      <div className="container-width">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="mb-20 max-w-5xl"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary text-sm md:text-base font-semibold mb-6 tracking-wide"
            whileHover={{ scale: 1.08, y: -3 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <Briefcase size={18} />
            <span>Experience</span>
          </motion.div>
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 text-foreground leading-tight tracking-tight">
            A track record of{' '}
            <motion.span
              className="block mt-2"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <GradientText>shipping, scaling, and owning</GradientText>
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.4, duration: 0.7 }}
            >
              <GradientText>Shopify experiences</GradientText>
            </motion.span>
          </h2>
          <motion.p 
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground leading-relaxed font-light"
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
          <div className="absolute left-4 md:left-6 top-0 bottom-0 border-l border-border/40 pointer-events-none" />

          <div className="space-y-10 md:space-y-12">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title + exp.company}
                variants={itemVariants}
                className="relative pl-14 md:pl-20"
              >
                {/* Timeline dot */}
                <div className="absolute left-4 md:left-6 top-6 -translate-x-1/2">
                  <div className="w-3 h-3 rounded-full bg-primary shadow-[0_0_0_6px_rgba(59,130,246,0.25)]" />
                </div>

                <Card className="border border-border/80 bg-card/90 backdrop-blur-sm hover:border-primary/50 transition-smooth shadow-sm hover:shadow-lg">
                  <div className="p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
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

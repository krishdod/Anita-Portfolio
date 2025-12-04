import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { SiShopify, SiReact, SiTypescript, SiJavascript, SiTailwindcss, SiPhp, SiMysql, SiGit, SiWebpack } from 'react-icons/si'
import { FaCode, FaShoppingCart, FaCog } from 'react-icons/fa'
import { GradientText } from './animated/GradientText'
import { Card } from './ui/card'
import ScrollReveal from './ScrollReveal'

const TechStack = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const techCategories = [
    {
      category: 'Shopify & E-commerce',
      icon: FaShoppingCart,
      color: 'from-green-500 to-emerald-500',
      skills: [
        'Shopify',
        'Shopify Plus',
        'Shopify Functions',
        'Liquid',
        'Shopify Flow',
        'Klaviyo',
        'Checkout Extensions',
      ]
    },
    {
      category: 'Frontend Development',
      icon: FaCode,
      color: 'from-blue-500 to-cyan-500',
      skills: [
        'React',
        'TypeScript',
        'JavaScript',
        'Tailwind CSS',
        'SCSS/LESS',
        'AngularJS',
        'jQuery',
        'Bootstrap',
      ]
    },
    {
      category: 'Backend & APIs',
      icon: FaCog,
      color: 'from-purple-500 to-pink-500',
      skills: [
        'REST APIs',
        'Webhooks',
        'PHP',
        'MySQL',
        'Admin API',
        'GraphQL',
        'JSON',
      ]
    },
    {
      category: 'Tools & Workflow',
      icon: FaCog,
      color: 'from-orange-500 to-red-500',
      skills: [
        'Git',
        'Webpack',
        'Gulp',
        'Agile/Scrum',
        'Test-Driven Development',
        'Performance Optimization',
        'SEO',
      ]
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
      },
    },
  }

  return (
    <section id="tech-stack" className="section-padding bg-transparent scroll-mt-20 relative overflow-hidden" ref={ref}>
      <div className="container-width relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] }}
          className="text-center mb-6 sm:mb-8 md:mb-10 px-4"
        >
          <div className="mb-3 sm:mb-4 md:mb-5 text-center">
            <ScrollReveal
              containerClassName=""
              textClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold [&_.word]:bg-gradient-to-r [&_.word]:from-blue-400 [&_.word]:via-purple-400 [&_.word]:to-pink-400 [&_.word]:bg-clip-text [&_.word]:text-transparent"
              baseOpacity={0.2}
              baseRotation={2}
              blurStrength={6}
            >
              Technical Expertise
            </ScrollReveal>
          </div>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Full-stack capabilities across the Shopify ecosystem and modern web technologies
          </p>
        </motion.div>

        {/* Tech Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-7 md:gap-8 px-4"
        >
          {techCategories.map((category, index) => (
            <motion.div 
              key={category.category} 
              variants={cardVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="p-5 sm:p-6 md:p-8 h-full hover:shadow-2xl transition-all border-primary/20 hover:border-primary/50 glass group hover:scale-[1.02]">
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-5 md:mb-6">
                  <motion.div 
                    className={`w-12 h-12 sm:w-13 sm:h-13 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center shadow-lg`}
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: index * 0.2,
                    }}
                    whileHover={{ 
                      scale: 1.15, 
                      rotate: 360,
                      transition: { duration: 0.6 }
                    }}
                  >
                    <category.icon className="text-white w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8" />
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold group-hover:text-primary transition-colors">{category.category}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <motion.span
                      key={skill}
                      initial={{ opacity: 0, scale: 0.8, y: 20 }}
                      animate={inView ? { opacity: 1, scale: 1, y: 0 } : {}}
                      transition={{ 
                        delay: 0.5 + index * 0.1 + skillIndex * 0.05,
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                      }}
                      whileHover={{ 
                        scale: 1.15, 
                        y: -5,
                        boxShadow: '0 10px 25px rgba(59, 130, 246, 0.2)',
                        transition: { duration: 0.2 }
                      }}
                      className="px-4 py-2 bg-muted/50 hover:bg-primary/10 rounded-full text-sm font-medium text-foreground border border-primary/10 hover:border-primary/30 transition-all cursor-default"
                    >
                      {skill}
                    </motion.span>
                  ))}
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Certifications Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-10 sm:mt-12 md:mt-14"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-center mb-8">
            Certifications & <GradientText>Recognition</GradientText>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: 'Shopify Development Badge', desc: 'Verified expert-level proficiency' },
              { title: 'E-commerce Launch Success', desc: 'High-revenue client launches' },
              { title: 'Site Performance Enhancement', desc: 'Improved LCP & SEO metrics' },
              { title: 'PMP Certified', desc: 'Project Management Professional' },
            ].map((cert, index) => (
              <motion.div
                key={cert.title}
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
                transition={{ 
                  delay: 0.8 + index * 0.1,
                  type: 'spring',
                  stiffness: 150,
                  damping: 12,
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.05,
                  rotateY: 5,
                  transition: { duration: 0.3 }
                }}
              >
                <Card className="p-6 text-center h-full border-primary/20 hover:border-primary/50 transition-all glass group hover:scale-[1.03]">
                  <motion.div 
                    className="text-4xl mb-3 inline-block"
                    animate={{
                      rotate: [0, -10, 10, -10, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                      delay: index * 0.5,
                    }}
                  >
                    🏆
                  </motion.div>
                  <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">{cert.title}</h4>
                  <p className="text-sm text-muted-foreground">{cert.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default TechStack

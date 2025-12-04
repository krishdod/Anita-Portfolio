import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { HiExternalLink } from 'react-icons/hi'
import { FaReact } from 'react-icons/fa'
import { BentoGrid, BentoGridItem } from './ui/bento-grid'
import { SparklesCore } from './ui/sparkles'
import ScrollReveal from './ScrollReveal'

const ProjectsEnhanced = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const projects = [
    {
      title: 'Dior Official Website',
      description: 'Luxury fashion e-commerce with high-performance animations, sophisticated product catalogs, and seamless checkout for global audience.',
      icon: '💎',
      tags: ['Shopify Plus', 'Performance', 'Luxury'],
      link: 'https://www.dior.com/en_us/fashion',
      image: '/projects/dior.jpg', // place screenshot at public/projects/dior.jpg
      gradient: 'from-slate-800 to-slate-600',
      span: 'md:col-span-2',
    },
    {
      title: 'Sabyasachi',
      description: 'Premium Indian luxury brand with intricate jewelry collections, custom wedding wear, and complex catalog management.',
      icon: '✨',
      tags: ['Shopify Plus', 'Luxury', 'Custom'],
      link: 'https://sabyasachi.com/',
      image: '/projects/sabyasachi.jpg',
      gradient: 'from-amber-600 to-yellow-500',
      span: 'md:col-span-1',
    },
    {
      title: 'Mediwares',
      description: 'Medical equipment B2B features with advanced filtering, bulk ordering, and optimized checkout for healthcare pros.',
      icon: '🏥',
      tags: ['B2B', 'Healthcare', 'API'],
      link: 'https://mediwares.com/',
      image: '/projects/mediwares.jpg',
      gradient: 'from-blue-500 to-cyan-500',
      span: 'md:col-span-1',
    },
    {
      title: 'Nickron India',
      description: 'Footwear brand with marketing automation, dynamic pricing, and seamless Klaviyo integration.',
      icon: '👟',
      tags: ['Klaviyo', 'Automation', 'Marketing'],
      link: 'https://nickronindia.com/',
      image: '/projects/nickron-india.jpg',
      gradient: 'from-orange-500 to-red-500',
      span: 'md:col-span-1 md:row-span-2',
    },
    {
      title: 'Paragon Footwear',
      description: 'Multi-brand store with large inventory management, advanced search, and optimized mobile experience.',
      icon: '👞',
      tags: ['Multi-Brand', 'Large Inventory', 'Mobile'],
      link: 'https://paragonfootwear.com/',
      image: '/projects/paragon.jpg',
      gradient: 'from-green-500 to-emerald-500',
      span: 'md:col-span-1',
    },
    {
      title: 'Taruni',
      description: 'Traditional ethnic wear with custom checkout extensions, size guides, and personalized recommendations.',
      icon: '👗',
      tags: ['Checkout', 'Customization', 'Extensions'],
      link: 'https://taruni.in/',
      image: '/projects/taruni.jpg',
      gradient: 'from-pink-500 to-purple-500',
      span: 'md:col-span-1',
    },
    {
      title: 'Baggit',
      description: 'Cruelty-free fashion bags with sustainability messaging and optimized product discovery.',
      icon: '👜',
      tags: ['Sustainability', 'Fashion', 'Performance'],
      link: 'https://baggit.com/',
      image: '/projects/baggit.jpg',
      gradient: 'from-indigo-500 to-blue-500',
      span: 'md:col-span-1',
    },
    {
      title: 'Mou Official',
      description: 'Hand-crafted footwear with vintage collections, custom galleries, and multi-currency support.',
      icon: '🧥',
      tags: ['International', 'Multi-Currency', 'Custom'],
      link: 'https://www.mou.com/',
      image: '/projects/mou.jpg',
      gradient: 'from-yellow-600 to-amber-500',
      span: 'md:col-span-1',
    },
    {
      title: 'Assay Jewelers',
      description: 'Fine jewelry with high-ticket handling, secure checkout, and advanced filtering by price and gemstone.',
      icon: '💍',
      tags: ['Luxury Jewelry', 'High-Ticket', 'Security'],
      link: 'https://www.assayjewelers.com/',
      image: '/projects/assay.jpg',
      gradient: 'from-purple-600 to-pink-500',
      span: 'md:col-span-1',
    },
  ]

  return (
    <section id="projects" className="relative section-padding bg-transparent overflow-hidden scroll-mt-20">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] }}
          className="text-center mb-6 sm:mb-8 md:mb-10"
        >
          <motion.div
            className="inline-block mb-3 sm:mb-4 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs sm:text-sm font-semibold backdrop-blur-sm"
            whileHover={{ scale: 1.05 }}
          >
            Portfolio
          </motion.div>
          <div className="mb-3 sm:mb-4 md:mb-5 px-4 text-center">
            <ScrollReveal
              containerClassName=""
              textClassName="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-foreground [&_.word:nth-child(1)]:bg-gradient-to-r [&_.word:nth-child(1)]:from-blue-400 [&_.word:nth-child(1)]:to-purple-400 [&_.word:nth-child(1)]:bg-clip-text [&_.word:nth-child(1)]:text-transparent"
              baseOpacity={0.2}
              baseRotation={2}
              blurStrength={6}
            >
              Real Shopify Projects
            </ScrollReveal>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Live websites I've built for luxury brands, B2B marketplaces, and high-volume e-commerce stores
          </p>
        </motion.div>

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.6, 0.01, 0.05, 0.95] }}
        >
          <BentoGrid className="max-w-7xl mx-auto">
            {projects.map((project, index) => (
              <BentoGridItem
                key={project.title}
                title={project.title}
                description={project.description}
                header={
                  <div className={`relative flex flex-1 w-full h-full min-h-[8rem] rounded-xl overflow-hidden group`}>
                    {/* Background image with gradient overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${project.gradient}`} />
                    {project.image && (
                      <img
                        src={project.image}
                        alt={`Screenshot of ${project.title} Shopify storefront`}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover opacity-80"
                      />
                    )}

                    {/* Icon badge */}
                    <div className="absolute top-3 left-3 z-20 flex items-center justify-center text-2xl bg-black/40 rounded-full w-9 h-9 border border-white/30 backdrop-blur-sm">
                      <span aria-hidden="true">{project.icon}</span>
                    </div>
                    
                    {/* Hover Overlay with CTA */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      className="absolute inset-0 bg-black/55 flex items-center justify-center backdrop-blur-sm z-30"
                    >
                      <motion.a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full text-white font-semibold transition-all backdrop-blur-sm border border-white/20"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span>View Live Site</span>
                        <HiExternalLink size={20} />
                      </motion.a>
                    </motion.div>

                    {/* Tags */}
                    <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 z-20">
                      {project.tags.slice(0, 2).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-black/55 backdrop-blur-sm text-white text-xs rounded-full border border-white/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                }
                className={`${project.span} border-white/20 bg-white/10 backdrop-blur-xl glass hover:bg-white/15 hover:border-blue-400/70 hover:scale-[1.02] transition-all duration-300 hover:shadow-2xl`}
                icon={
                  <div className="flex gap-2 mt-4">
                    <FaReact className="text-blue-400" size={20} />
                  </div>
                }
              />
            ))}
          </BentoGrid>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-8 sm:mt-10"
        >
          <p className="text-muted-foreground mb-4">+ Many more projects under NDA</p>
          <motion.a
            href="https://www.linkedin.com/in/anita-dantani/"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-semibold shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 transition-all duration-300"
          >
            View Full Portfolio on LinkedIn
            <HiExternalLink size={20} />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default ProjectsEnhanced

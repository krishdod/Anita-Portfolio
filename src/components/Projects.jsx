import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { HiExternalLink, HiCode } from 'react-icons/hi'
import { FaFigma, FaReact, FaMobile } from 'react-icons/fa'

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const projects = [
    {
      title: 'Dior Official Website',
      description: 'Luxury fashion e-commerce with high-performance animations, sophisticated product catalogs, and seamless checkout experience for global audience.',
      image: '💎',
      tags: ['Shopify Plus', 'Performance', 'Luxury Fashion'],
      icons: [FaReact],
      gradient: 'from-slate-800 to-slate-600',
      link: 'https://www.dior.com/en_us/fashion',
    },
    {
      title: 'Sabyasachi',
      description: 'Premium Indian luxury brand featuring intricate jewelry collections, custom wedding wear, and high-end fashion with complex catalog management.',
      image: '✨',
      tags: ['Shopify Plus', 'Luxury', 'Custom Catalog'],
      icons: [FaFigma],
      gradient: 'from-amber-600 to-yellow-500',
      link: 'https://sabyasachi.com/',
    },
    {
      title: 'Mediwares',
      description: 'Medical equipment supplier with B2B features, advanced product filtering, bulk ordering capabilities, and optimized checkout for healthcare professionals.',
      image: '🏥',
      tags: ['Shopify', 'B2B', 'Healthcare'],
      icons: [FaReact],
      gradient: 'from-blue-500 to-cyan-500',
      link: 'https://mediwares.com/',
    },
    {
      title: 'Nickron India',
      description: 'Footwear brand with marketing automation, dynamic pricing, customer segmentation, and seamless integration with Klaviyo for email campaigns.',
      image: '👟',
      tags: ['Shopify', 'Klaviyo', 'Marketing Automation'],
      icons: [FaReact],
      gradient: 'from-orange-500 to-red-500',
      link: 'https://nickronindia.com/',
    },
    {
      title: 'Paragon Footwear',
      description: 'Multi-brand footwear store with large inventory management, advanced search and filtering, collection organization, and optimized mobile experience.',
      image: '👞',
      tags: ['Shopify', 'Large Inventory', 'Multi-Brand'],
      icons: [FaReact],
      gradient: 'from-green-500 to-emerald-500',
      link: 'https://paragonfootwear.com/',
    },
    {
      title: 'Taruni',
      description: 'Traditional Indian ethnic wear store with custom checkout extensions, size guides, personalized recommendations, and seamless payment integration.',
      image: '👗',
      tags: ['Shopify', 'Checkout Customization', 'Ethnic Wear'],
      icons: [FaReact],
      gradient: 'from-pink-500 to-purple-500',
      link: 'https://taruni.in/',
    },
    {
      title: 'Baggit',
      description: 'Cruelty-free fashion bags brand with PETA approval, sustainability-focused messaging, and optimized product discovery with performance enhancements.',
      image: '👜',
      tags: ['Shopify', 'Sustainability', 'Fashion'],
      icons: [FaReact],
      gradient: 'from-indigo-500 to-blue-500',
      link: 'https://baggit.com/',
    },
    {
      title: 'Mou Official',
      description: 'Hand-crafted footwear brand with vintage collections, custom product galleries, international shipping logic, and multi-currency support.',
      image: '🧥',
      tags: ['Shopify', 'International', 'Multi-Currency'],
      icons: [FaReact],
      gradient: 'from-yellow-600 to-amber-500',
      link: 'https://www.mou.com/',
    },
    {
      title: 'Assay Jewelers',
      description: 'Fine jewelry and luxury watches with high-ticket item handling, secure checkout, advanced filtering by price and gemstone, and premium UX.',
      image: '💍',
      tags: ['Shopify Plus', 'Luxury Jewelry', 'High-Ticket'],
      icons: [FaReact],
      gradient: 'from-purple-600 to-pink-500',
      link: 'https://www.assayjewelers.com/',
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
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section id="projects" className="py-20 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={ref}>
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Real <span className="text-gradient">Shopify Projects</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Live websites I've built for luxury brands, B2B marketplaces, and high-volume e-commerce stores
          </p>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -10 }}
              className="group relative glass-effect rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300"
            >
              {/* Project Image/Icon */}
              <div className={`h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center text-6xl relative overflow-hidden`}>
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-white/10"
                />
                <span className="relative z-10">{project.image}</span>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex gap-2">
                    {project.icons.map((Icon, i) => (
                      <div key={i} className="p-1.5 bg-gray-100 rounded-lg">
                        <Icon size={16} className="text-gray-600" />
                      </div>
                    ))}
                  </div>
                </div>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <motion.a
                    href={project.link}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                  >
                    <HiExternalLink size={18} />
                    View Project
                  </motion.a>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 glass-effect rounded-lg font-medium hover:bg-gray-100 transition-colors"
                  >
                    <HiCode size={18} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default Projects








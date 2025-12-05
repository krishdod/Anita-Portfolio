import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef } from 'react'
import { useInView } from 'react-intersection-observer'
import { HiArrowUpRight } from 'react-icons/hi2'
import { Link } from 'react-router-dom'
import ScrollReveal from './ScrollReveal'
import { CursorButton } from './effects/CursorButton'

const ProjectsEnhanced = () => {
  const work = [
    {
      id: '',
      title: 'ByNeil',
      shortTitle: 'ByNeil',
      description:
        'Luxury fashion e-commerce platform migrated from Magento to Shopify Plus, featuring high-performance design and seamless user experience.',
      tags: ['Shopify Plus', 'Migration', 'Luxury'],
      link: 'https://www.byneilny.com/',
      image: '/projects/byneil.png',
      gradient: 'from-slate-800 to-slate-600',
      device: 'laptop',
    },
    {
      id: '02',
      title: 'Sabyasachi',
      shortTitle: 'Sabyasachi',
      description:
        'Premium Indian luxury brand with intricate jewelry collections, custom wedding wear, and complex catalog management.',
      tags: ['Shopify Plus', 'Luxury', 'Custom'],
      link: 'https://sabyasachi.com/',
      image: '/projects/sabyasachi.png',
      gradient: 'from-amber-600 to-yellow-500',
      device: 'desktop',
    },
    {
      id: '03',
      title: 'Decking Wood',
      shortTitle: 'Decking Wood',
      description:
        'Premium decking materials e-commerce with product visualization, custom calculators, and optimized checkout flow.',
      tags: ['E-commerce', 'Custom Tools', 'B2C'],
      link: 'https://www.deckingwood.com.au/',
      image: '/projects/deckingwood.png',
      gradient: 'from-amber-700 to-orange-600',
      device: 'laptop',
    },
    {
      id: '04',
      title: 'Nickron India',
      shortTitle: 'Nickron India',
      description:
        'Footwear brand migrated from Magento with marketing automation, dynamic pricing, and seamless Klaviyo integration.',
      tags: ['Migration', 'Automation', 'Marketing'],
      link: 'https://nickronindia.com/',
      image: '/projects/nickron-india.jpg',
      gradient: 'from-orange-500 to-red-500',
      device: 'laptop',
    },
    {
      id: '05',
      title: 'My-My Style',
      shortTitle: 'My-My Style',
      description:
        'Fashion-forward e-commerce platform with curated collections, personalized recommendations, and modern design.',
      tags: ['Fashion', 'E-commerce', 'Modern'],
      link: 'https://www.mymystyle.com/',
      image: '/projects/mymystyle.jpg',
      gradient: 'from-pink-500 to-purple-500',
      device: 'desktop',
    },
    {
      id: '06',
      title: 'Assay Jewelers',
      shortTitle: 'Assay Jewelers',
      description:
        'Fine jewelry with high-ticket handling, secure checkout, and advanced filtering by price and gemstone.',
      tags: ['Luxury Jewelry', 'High-Ticket', 'Security'],
      link: 'https://assayjewelers.com/',
      image: '/projects/assay.jpg',
      gradient: 'from-purple-600 to-pink-500',
      device: 'desktop',
    },
    {
      id: '07',
      title: 'MOU',
      shortTitle: 'MOU',
      description:
        'Hand-crafted footwear built from scratch with vintage collections, custom galleries, and multi-currency support.',
      tags: ['Build From Scratch', 'Multi-Currency', 'Custom'],
      link: 'https://www.mou.com/',
      image: '/projects/mou.jpg',
      gradient: 'from-yellow-600 to-amber-500',
      device: 'laptop',
    },
    {
      id: '08',
      title: 'Fabric of Society',
      shortTitle: 'Fabric of Society',
      description:
        'Luxury fashion brand built from scratch featuring premium collections, elegant design, and seamless shopping experience.',
      tags: ['Build From Scratch', 'Luxury', 'Premium'],
      link: 'https://fabricofsociety.luxury/',
      image: '/projects/fabricofsociety.jpg',
      gradient: 'from-indigo-600 to-purple-600',
      device: 'desktop',
    },
    {
      id: '09',
      title: 'E3K',
      shortTitle: 'E3K',
      description:
        'Modern e-commerce platform with international shipping, multi-language support, and optimized user experience.',
      tags: ['International', 'Multi-Language', 'E-commerce'],
      link: 'https://e3k.shop/en-in',
      image: '/projects/e3k.jpg',
      gradient: 'from-blue-500 to-cyan-500',
      device: 'laptop',
    },
    {
      id: '10',
      title: 'Baggit',
      shortTitle: 'Baggit',
      description:
        'Cruelty-free fashion bags with sustainability messaging and optimized product discovery.',
      tags: ['Sustainability', 'Fashion', 'Performance'],
      link: 'https://baggit.com/',
      image: '/projects/baggit.jpg',
      gradient: 'from-indigo-500 to-blue-500',
      device: 'laptop',
    },
    {
      id: '11',
      title: 'Paragon Footwear',
      shortTitle: 'Paragon Footwear',
      description:
        'Multi-brand store with large inventory management, advanced search, and optimized mobile experience.',
      tags: ['Multi-Brand', 'Large Inventory', 'Mobile'],
      link: 'http://paragonfootwear.com/',
      image: '/projects/paragon.jpg',
      gradient: 'from-green-500 to-emerald-500',
      device: 'desktop',
    },
    {
      id: '12',
      title: 'Nude Project',
      shortTitle: 'Nude Project',
      description:
        'Contemporary fashion brand with minimalist design, clean aesthetics, and seamless shopping experience.',
      tags: ['Fashion', 'Minimalist', 'Modern'],
      link: 'https://nude-project.com/',
      image: '/projects/nude-project.jpg',
      gradient: 'from-gray-700 to-gray-500',
      device: 'laptop',
    },
  ]

  const [refInView, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const mainWork = work.slice(0, 3)

  // Scroll-based effects: entire section
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end start'],
  })

  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.9, 0.2])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.08])
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -60])
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4])

  // Work Card Component
  const WorkCard = ({ workItem, index }) => {
    const cardRef = useRef(null)

    // Mouse-based parallax
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const xSpring = useSpring(x, { stiffness: 300, damping: 30 })
    const ySpring = useSpring(y, { stiffness: 300, damping: 30 })

    const transform = useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`

    const ROTATION_RANGE = 32.5
    const HALF_ROTATION_RANGE = ROTATION_RANGE / 2

    const handleMouseMove = (e) => {
      if (!cardRef.current) return

      const rect = cardRef.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      const mouseX = (e.clientX - rect.left) * ROTATION_RANGE
      const mouseY = (e.clientY - rect.top) * ROTATION_RANGE

      const rX = (mouseX / width - HALF_ROTATION_RANGE) * -1
      const rY = mouseY / height - HALF_ROTATION_RANGE

      x.set(rX * 1.5)
      y.set(rY * 1.5)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    // Vertical parallax per card
    const cardY = useTransform(scrollYProgress, [0, 1], [index * 20, -index * 25])
    const cardOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.85])

    const handleClick = () => {
      if (workItem.link) {
        window.open(workItem.link, '_blank', 'noopener,noreferrer')
      }
    }

    return (
      <motion.div
        ref={cardRef}
        data-work-card
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="group relative h-[400px] sm:h-[450px] md:h-[500px] w-full cursor-none overflow-hidden rounded-2xl bg-gradient-to-br from-muted/20 to-muted/10 border border-border/40 group-hover:border-primary/50 transition-all duration-300"
        style={{
          y: cardY,
          opacity: cardOpacity,
        }}
        initial={{ opacity: 0, y: 80, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{
          duration: 0.7,
          delay: index * 0.1,
          ease: [0.6, 0.01, 0.05, 0.95],
        }}
        whileHover={{
          scale: 1.03,
          transition: { duration: 0.3 },
        }}
      >
        {/* Image Layer with Mouse Parallax */}
        <motion.div
          style={{
            transform,
          }}
          className="absolute inset-0 h-full w-full"
        >
          {workItem.image ? (
            <motion.img
              src={workItem.image}
              alt={workItem.title}
              className="h-full w-full object-cover"
              initial={{ scale: 1, opacity: 1 }}
              whileHover={{
                scale: 1.05,
                opacity: 0.9,
                transition: { duration: 0.4, ease: 'easeOut' },
              }}
            />
          ) : (
            <div
              className={`h-full w-full bg-gradient-to-br ${workItem.gradient} flex items-center justify-center`}
            >
              <span className="text-6xl text-white/80">
                {workItem.title.charAt(0)}
              </span>
            </div>
          )}
        </motion.div>

        {/* Dark Gradient Overlay */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent transition-opacity duration-300 group-hover:from-black/95"
          initial={{ opacity: 0.7 }}
          whileHover={{ opacity: 1 }}
        />

        {/* Work Info */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 text-white"
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{
            delay: index * 0.1 + 0.25,
            duration: 0.5,
            ease: [0.6, 0.01, 0.05, 0.95],
          }}
        >
          <motion.p
            className="text-xs sm:text-sm font-medium text-gray-300 mb-1"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            {workItem.tags[0]}
          </motion.p>
          <motion.h3
            className="text-xl sm:text-2xl md:text-3xl font-bold mb-3"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
          >
            {workItem.title}
          </motion.h3>
          <motion.p
            className="text-sm sm:text-base text-white/90 mb-4 line-clamp-2"
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            {workItem.description}
          </motion.p>
          <motion.a
            href={workItem.link}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, x: 4, opacity: 1 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-black rounded-lg font-semibold text-sm sm:text-base"
            onClick={(e) => e.stopPropagation()}
            initial={{ x: -20, opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            View Work
            <HiArrowUpRight size={16} />
          </motion.a>
        </motion.div>

        {/* Tags Badge */}
        <motion.div
          className="absolute top-4 right-4 flex flex-wrap gap-2 z-10"
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: index * 0.1 + 0.35 }}
        >
          {workItem.tags.slice(0, 2).map((tag) => (
            <motion.span
              key={tag}
              className="px-2 py-1 rounded-full text-xs font-medium bg-white/10 backdrop-blur-sm text-white border border-white/20"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
            >
              {tag}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    )
  }

  return (
    <>
      <CursorButton />
      <section
        id="portfolio"
        className="relative section-padding bg-transparent overflow-visible scroll-mt-20"
        style={{ position: 'relative', minHeight: '100vh' }}
        ref={sectionRef}
      >
      {/* Background scroll parallax glow */}
      <motion.div
        style={{ opacity: bgOpacity, scale: bgScale }}
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[700px] bg-gradient-to-b from-blue-500/30 via-purple-500/20 to-transparent blur-3xl" />
      </motion.div>

      <div
        className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
        ref={refInView}
        style={{ position: 'relative' }}
      >
        {/* Section Header with scroll motion */}
        <motion.div
          style={{ y: headerY, opacity: headerOpacity }}
          initial={{ opacity: 0, y: 60 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.6, 0.01, 0.05, 0.95] }}
          className="text-center mb-12 sm:mb-16 md:mb-20"
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
              Real Shopify Work
            </ScrollReveal>
          </div>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto px-4">
            Live websites I&apos;ve built for luxury brands, B2B marketplaces, and
            high-volume e-commerce stores. Hover over a work to explore.
          </p>
        </motion.div>

        {/* Work Grid - Always show only 3 work items */}
        <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3 mb-12">
          {mainWork.map((workItem, index) => (
            <WorkCard key={workItem.id} workItem={workItem} index={index} />
          ))}
        </div>

        {/* View All Work Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
          className="text-center mt-16 sm:mt-20 relative z-10"
        >
          <Link to="/all-work">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full text-white font-semibold shadow-lg shadow-blue-500/50 hover:shadow-xl hover:shadow-blue-500/70 transition-all duration-300"
            >
              View All Work
              <HiArrowUpRight size={20} />
            </motion.button>
          </Link>
          <p className="text-muted-foreground mt-4 text-sm">
            + Many more work under NDA
          </p>
        </motion.div>
      </div>
    </section>
    </>
  )
}

export default ProjectsEnhanced

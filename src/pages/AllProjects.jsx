import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useScroll,
  useTransform,
} from 'framer-motion'
import { useRef, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { HiArrowUpRight } from 'react-icons/hi2'
import { HiExternalLink } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'
import ScrollReveal from '../components/ScrollReveal'
import { Navigation } from '../components/layout/Navigation'
import Footer from '../components/Footer'
import { SparklesCore } from '../components/ui/sparkles'
import { BackgroundBeams } from '../components/ui/background-beams'
import { CursorButton } from '../components/effects/CursorButton'

const AllProjects = () => {
  const navigate = useNavigate()

  // Ensure page starts from the top when navigating here
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [])

  const work = [
      {
        id: '01',
        title: 'ByNeil',
        shortTitle: 'ByNeil',
        description:
          'Luxury fashion e-commerce platform migrated from Magento to Shopify Plus, featuring high-performance design and seamless user experience.',
        tags: ['Shopify Plus', 'Migration', 'Luxury'],
        link: 'https://www.byneilny.com/',
        image: '/projects/byneil.png',
        gradient: 'from-slate-800 to-slate-600',
        device: 'Jewellery Store',
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
        device: 'Luxury Bridal Store',
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
        device: 'E-commerce Timber Store',
      },
      {
        id: '04',
        title: 'Nickron India',
        shortTitle: 'Nickron India',
        description:
          'Footwear brand migrated from Magento with marketing automation, dynamic pricing, and seamless Klaviyo integration.',
        tags: ['Migration', 'Automation', 'Marketing'],
        link: 'https://nickronindia.com/',
        image: '/projects/nickron-india.png',
        gradient: 'from-orange-500 to-red-500',
        device: 'Footwear Store',
      },
      {
        id: '05',
        title: 'My-My Style',
        shortTitle: 'My-My Style',
        description:
          'Fashion-forward e-commerce platform with curated collections, personalized recommendations, and modern design.',
        tags: ['Fashion', 'E-commerce', 'Modern'],
        link: 'https://www.mymystyle.com/',
        image: '/projects/mymystyle.png',
        gradient: 'from-pink-500 to-purple-500',
        device: 'Fashion',
      },
      {
        id: '06',
        title: 'Assay Jewelers',
        shortTitle: 'Assay Jewelers',
        description:
          'Fine jewelry with high-ticket handling, secure checkout, and advanced filtering by price and gemstone.',
        tags: ['Luxury Jewelry', 'High-Ticket', 'Security'],
        link: 'https://assayjewelers.com/',
        image: '/projects/assay.png',
        gradient: 'from-purple-600 to-pink-500',
        device: 'Jewelry',
      },
      {
        id: '07',
        title: 'MOU',
        shortTitle: 'MOU',
        description:
          'Hand-crafted footwear built from scratch with vintage collections, custom galleries, and multi-currency support.',
        tags: ['Build From Scratch', 'Multi-Currency', 'Custom'],
        link: 'https://www.mou.com/',
        image: '/projects/mou.png',
        gradient: 'from-yellow-600 to-amber-500',
        device: 'From Scratch',
      },
      {
        id: '08',
        title: 'Fabric of Society',
        shortTitle: 'Fabric of Society',
        description:
          'Luxury fashion brand built from scratch featuring premium collections, elegant design, and seamless shopping experience.',
        tags: ['Build From Scratch', 'Luxury', 'Premium'],
        link: 'https://fabricofsociety.luxury/',
        image: '/projects/fabricofsociety.png',
        gradient: 'from-indigo-600 to-purple-600',
        device: 'Luxury Fashion',
      },
      {
        id: '09',
        title: 'E3K',
        shortTitle: 'E3K',
        description:
          'Modern e-commerce platform with international shipping, multi-language support, and optimized user experience.',
        tags: ['International', 'Multi-Language', 'E-commerce'],
        link: 'https://e3k.shop/en-in',
        image: '/projects/e3k.png',
        gradient: 'from-blue-500 to-cyan-500',
        device: 'Global Store',
      },
      {
        id: '10',
        title: 'Baggit',
        shortTitle: 'Baggit',
        description:
          'Cruelty-free fashion bags with sustainability messaging and optimized product discovery.',
        tags: ['Sustainability', 'Fashion', 'Performance'],
        link: 'https://baggit.com/',
        image: '/projects/baggit.png',
        gradient: 'from-indigo-500 to-blue-500',
        device: 'Sustainable Brand',
      },
      {
        id: '11',
        title: 'Paragon Footwear',
        shortTitle: 'Paragon Footwear',
        description:
          'Multi-brand store with large inventory management, advanced search, and optimized mobile experience.',
        tags: ['Multi-Brand', 'Large Inventory', 'Mobile'],
        link: 'http://paragonfootwear.com/',
        image: '/projects/paragon.png',
        gradient: 'from-green-500 to-emerald-500',
        device: 'Multi-Brand',
      },
      {
        id: '12',
        title: 'Nude Project',
        shortTitle: 'Nude Project',
        description:
          'Contemporary fashion brand with minimalist design, clean aesthetics, and seamless shopping experience.',
        tags: ['Fashion', 'Minimalist', 'Modern'],
        link: 'https://nude-project.com/',
        image: '/projects/nude-project.png',
        gradient: 'from-gray-700 to-gray-500',
        device: 'Minimalist',
      },
  ]

  const [refInView, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Scroll-based effects: entire section
  const sectionRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 75%', 'end 20%'],
  })

  const bgOpacity = useTransform(scrollYProgress, [0, 1], [0.9, 0.2])
  const bgScale = useTransform(scrollYProgress, [0, 1], [1, 1.05])
  const headerY = useTransform(scrollYProgress, [0, 1], [0, -30])
  const headerOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.6])
  const listY = useTransform(scrollYProgress, [0, 1], [0, -20])
  const listOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.92])

  // Work Row Component (Nakula-style row)
  const WorkRow = ({ workItem, index }) => {
    const rowRef = useRef(null)

    // micro parallax on image
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const xSpring = useSpring(x, { stiffness: 250, damping: 26 })
    const ySpring = useSpring(y, { stiffness: 250, damping: 26 })

    const imageTransform = useMotionTemplate`translateX(${xSpring}px) translateY(${ySpring}px)`

    const ROTATION_RANGE = 24
    const HALF_ROTATION_RANGE = ROTATION_RANGE / 2

    const handleMouseMove = (e) => {
      if (!rowRef.current) return
      const rect = rowRef.current.getBoundingClientRect()
      const width = rect.width
      const height = rect.height

      const mouseX = (e.clientX - rect.left) * ROTATION_RANGE
      const mouseY = (e.clientY - rect.top) * ROTATION_RANGE

      const rX = (mouseX / width - HALF_ROTATION_RANGE) * -1
      const rY = mouseY / height - HALF_ROTATION_RANGE

      x.set(rX * 0.9)
      y.set(rY * 0.9)
    }

    const handleMouseLeave = () => {
      x.set(0)
      y.set(0)
    }

    const handleClick = () => {
      if (workItem.link) {
        window.open(workItem.link, '_blank', 'noopener,noreferrer')
      }
    }

    return (
      <motion.article
        ref={rowRef}
        data-work-card
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        className="group relative w-full overflow-hidden rounded-2xl border border-border/40 bg-background/70 backdrop-blur-sm hover:border-primary/60 transition-all duration-300 cursor-none"
        initial={{ opacity: 0, y: 50, scale: 0.99 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{
          duration: 0.6,
          delay: index * 0.06,
          ease: [0.22, 0.61, 0.36, 1],
        }}
      >
        <div className="flex flex-col md:flex-row gap-0 md:gap-6">
          {/* Image */}
          <motion.div
            style={{ transform: imageTransform }}
            className="relative md:basis-[46%] h-56 sm:h-64 md:h-72 overflow-hidden"
          >
            {workItem.image ? (
              <motion.img
                src={workItem.image}
                alt={workItem.title}
                loading="lazy"
                className="h-full w-full object-cover"
                initial={{ scale: 1.03 }}
                whileHover={{
                  scale: 1.08,
                  transition: { duration: 0.4, ease: 'easeOut' },
                }}
              />
            ) : (
              <div
                className={`h-full w-full bg-gradient-to-br ${workItem.gradient} flex items-center justify-center`}
              >
                <span className="text-5xl text-white/80">
                  {workItem.title.charAt(0)}
                </span>
              </div>
            )}

            {/* Top-left badge */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-xs font-semibold text-white border border-white/20">
                {workItem.id}
              </span>
              <span className="hidden sm:inline-flex px-3 py-1 rounded-full text-[10px] font-medium bg-black/45 text-white/80 border border-white/20 uppercase tracking-[0.18em]">
                {workItem.device}
              </span>
            </div>
          </motion.div>

          {/* Content */}
          <div className="flex-1 px-4 py-4 sm:px-6 sm:py-6 md:py-7 flex flex-col justify-between gap-4 md:gap-5">
            <div className="space-y-2 sm:space-y-3">
              <p className="text-[11px] sm:text-xs font-medium text-muted-foreground/80 uppercase tracking-[0.22em]">
                Shopify Work • {workItem.tags[0]}
              </p>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold">
                {workItem.title}
              </h3>
              <p className="text-xs sm:text-sm md:text-[15px] text-muted-foreground leading-relaxed">
                {workItem.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {workItem.tags.slice(0, 3).map((tag) => (
                  <motion.span
                    key={tag}
                    className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-white/5 text-white/90 border border-white/15 backdrop-blur-sm"
                    whileHover={{ scale: 1.08 }}
                  >
                    {tag}
                  </motion.span>
                ))}
              </div>
              <motion.a
                href={workItem.link}
                target="_blank"
                rel="noreferrer"
                whileHover={{ x: 4, scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white text-black px-4 py-2 text-xs sm:text-sm font-semibold shadow-sm shadow-black/40"
                onClick={(e) => e.stopPropagation()}
              >
                View work
                <HiArrowUpRight size={14} />
              </motion.a>
            </div>
          </div>
        </div>
      </motion.article>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden relative">
      {/* Global Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 gradient-mesh opacity-30 dark:opacity-60" />
        <BackgroundBeams className="opacity-45" />
        <SparklesCore
          id="tsparticles-all-work"
          background="transparent"
          minSize={0.6}
          maxSize={2}
          particleDensity={30}
          className="w-full h-full pointer-events-none"
          particleColor="120, 150, 255"
        />
      </div>

      <Navigation />
      <CursorButton />

      <section
        id="all-work"
        ref={sectionRef}
        className="relative scroll-mt-20 pt-24 pb-24"
        style={{ minHeight: '100vh' }}
      >
        {/* Section background glow */}
        <motion.div
          style={{ opacity: bgOpacity, scale: bgScale }}
          className="pointer-events-none absolute inset-0 -z-10"
        >
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-80 w-[640px] bg-gradient-to-b from-blue-500/35 via-purple-500/25 to-transparent blur-3xl" />
        </motion.div>

        <div
          className="max-w-6xl xl:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10"
          ref={refInView}
        >
          {/* Top row: back button + label/meta */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, ease: [0.22, 0.61, 0.36, 1] }}
            className="mb-6 sm:mb-8 flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              {/* Back button (SPA navigation to home) */}
              <button
                type="button"
                onClick={() => navigate('/')}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-[11px] sm:text-xs text-white/80 hover:bg-black/60 hover:border-white/30 transition-colors"
              >
                <HiArrowUpRight size={14} className="rotate-180" />
                Back
              </button>
              <span className="text-[11px] sm:text-xs font-medium text-muted-foreground/80 uppercase tracking-[0.3em]">
                O U R &nbsp; W O R K S
              </span>
            </div>

            <span className="hidden sm:inline-flex text-[11px] sm:text-xs text-muted-foreground uppercase tracking-[0.2em]">
              Live Shopify Work
            </span>
          </motion.div>

          {/* Header copy */}
          <motion.div
            style={{ y: headerY, opacity: headerOpacity }}
            initial={{ opacity: 0, y: 26 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 0.61, 0.36, 1] }}
            className="mb-8 sm:mb-10 md:mb-12"
          >
            <div className="space-y-3 sm:space-y-4">
              <ScrollReveal
                containerClassName=""
                textClassName="text-2xl sm:text-3xl md:text-4xl lg:text-[2.6rem] font-semibold text-foreground tracking-tight"
                baseOpacity={0.2}
                baseRotation={1.5}
                blurStrength={5}
              >
                Shopify builds for brands that care about experience.
              </ScrollReveal>
              <p className="max-w-2xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                A curated view of live Shopify websites – luxury fashion, footwear,
                jewelry, and high-volume commerce. Every build focuses on performance,
                clarity, and conversion.
              </p>
            </div>
          </motion.div>

          {/* Work list */}
          <motion.div
            className="space-y-6 sm:space-y-7 md:space-y-8"
            style={{ y: listY, opacity: listOpacity }}
          >
            {work.map((workItem, index) => (
              <WorkRow key={workItem.id} workItem={workItem} index={index} />
            ))}
          </motion.div>

          {/* CTA: Start a project (links to contact) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7, ease: [0.22, 0.61, 0.36, 1] }}
            className="mt-16 sm:mt-20"
          >
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900/85 to-slate-950/90 px-6 sm:px-8 md:px-10 py-10 sm:py-12 md:py-14">
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -right-24 top-0 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />
                <div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />
              </div>

              <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6 md:gap-10">
                <div className="max-w-xl space-y-3 sm:space-y-4">
                  <p className="text-[11px] sm:text-xs font-medium tracking-[0.3em] uppercase text-blue-300/80">
                    L E T&apos; S &nbsp; W O R K &nbsp; T O G E T H E R
                  </p>
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
                    Have a Shopify project in mind?
                  </h2>
                  <p className="text-sm sm:text-base text-white/80 leading-relaxed">
                    Whether you&apos;re migrating from Magento, launching a new brand,
                    or scaling a high-volume store, I help you ship fast without
                    compromising on design, performance, or UX.
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-3 sm:gap-4">
                  <Link to="/contact">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      className="inline-flex items-center gap-2 rounded-full bg-white text-black px-6 sm:px-8 py-3.5 text-sm sm:text-base font-semibold shadow-lg shadow-black/40"
                    >
                      Start a project
                      <HiArrowUpRight size={18} />
                    </motion.button>
                  </Link>
                  <motion.a
                    href="https://www.linkedin.com/in/anita-dantani/"
                    target="_blank"
                    rel="noreferrer"
                    whileHover={{ x: 3 }}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm text-blue-200/90 underline-offset-4 hover:underline"
                  >
                    Or view more context on LinkedIn
                    <HiExternalLink size={16} />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

export default AllProjects
  
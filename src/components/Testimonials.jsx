import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { Quote, Star } from 'lucide-react'
import { GradientText } from './animated/GradientText'
import { Card } from './ui/card'
import { staggerContainer, staggerItem } from '../lib/animations'

const Testimonials = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'CEO, Luxe Fashion',
      company: 'Luxury E-commerce Brand',
      content: 'Working with Anita felt personal. The process was smooth, the design was stunning, and everything had meaning. Our store performance improved by 40% after the rebuild.',
      rating: 5,
      avatar: '👩‍💼',
      gradient: 'from-blue-500/10 to-purple-500/10',
      borderColor: 'border-blue-500/20',
    },
    {
      name: 'Michael Chen',
      role: 'Founder, MediCare Plus',
      company: 'B2B Healthcare Platform',
      content: 'Anita transformed our B2B marketplace with custom features that our team didn\'t even know were possible. The checkout optimization alone increased conversions by 35%.',
      rating: 5,
      avatar: '👨‍💻',
      gradient: 'from-green-500/10 to-emerald-500/10',
      borderColor: 'border-green-500/20',
    },
    {
      name: 'Priya Sharma',
      role: 'Creative Director',
      company: 'Premium Jewelry Brand',
      content: 'The attention to detail in the custom Shopify app development was exceptional. Anita understood our vision and delivered beyond expectations. Our LCP scores improved dramatically.',
      rating: 5,
      avatar: '👩‍🎨',
      gradient: 'from-purple-500/10 to-pink-500/10',
      borderColor: 'border-purple-500/20',
    },
    {
      name: 'David Martinez',
      role: 'Operations Manager',
      company: 'Multi-Brand Retailer',
      content: 'The automation features Anita built saved us 20+ hours per week. The store is faster, more efficient, and our customers love the new checkout experience.',
      rating: 5,
      avatar: '👨‍💼',
      gradient: 'from-orange-500/10 to-red-500/10',
      borderColor: 'border-orange-500/20',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  return (
    <section
      id="testimonials"
      className="section-padding relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background"
      ref={ref}
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-20 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
        <motion.div
          className="absolute bottom-20 -right-20 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>

      <div className="container-width relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
          className="text-center mb-20"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6"
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          >
            <Star size={16} className="fill-primary" />
            <span>Client Love</span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            What <GradientText>Clients Say</GradientText> About Working Together
          </h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Real feedback from merchants who trusted me to build and scale their Shopify stores
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              variants={cardVariants}
              whileHover={{ 
                y: -8, 
                scale: 1.02,
                transition: { duration: 0.3 }
              }}
            >
              <Card
                className={`relative p-8 h-full bg-gradient-to-br ${testimonial.gradient} border ${testimonial.borderColor} hover:border-primary/40 transition-all duration-300 overflow-hidden group`}
              >
                {/* Quote Icon Background */}
                <motion.div
                  className="absolute -top-4 -right-4 text-primary/5 group-hover:text-primary/10 transition-colors"
                  animate={{
                    rotate: [0, 5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: 'easeInOut',
                  }}
                >
                  <Quote size={120} strokeWidth={1} />
                </motion.div>

                {/* Content */}
                <div className="relative z-10">
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={inView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ delay: 0.5 + i * 0.1 }}
                      >
                        <Star
                          size={18}
                          className="fill-yellow-500 text-yellow-500"
                        />
                      </motion.div>
                    ))}
                  </div>

                  {/* Testimonial Text */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={inView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-foreground text-base md:text-lg leading-relaxed mb-6"
                  >
                    "{testimonial.content}"
                  </motion.p>

                  {/* Author Info */}
                  <motion.div
                    className="flex items-center gap-4"
                    initial={{ opacity: 0, x: -20 }}
                    animate={inView ? { opacity: 1, x: 0 } : {}}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <motion.div
                      className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-3xl"
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.6 }}
                    >
                      {testimonial.avatar}
                    </motion.div>
                    <div>
                      <h4 className="font-semibold text-foreground text-lg">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {testimonial.company}
                      </p>
                    </div>
                  </motion.div>
                </div>

                {/* Hover Effect Gradient */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/0 group-hover:from-primary/5 group-hover:to-transparent transition-all duration-300 pointer-events-none"
                  initial={false}
                />
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.7 }}
          className="text-center mt-16"
        >
          <motion.p
            className="text-lg md:text-xl text-muted-foreground mb-6"
            animate={{
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            Ready to join them?
          </motion.p>
          <motion.a
            href="#contact"
            onClick={(e) => {
              e.preventDefault()
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
            whileHover={{ 
              scale: 1.05,
              boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4)',
            }}
            whileTap={{ scale: 0.95 }}
          >
            Let's Work Together
            <motion.span
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              →
            </motion.span>
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
}

export default Testimonials

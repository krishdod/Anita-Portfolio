import { motion } from 'framer-motion'
import { Linkedin, Mail, Heart } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const socialLinks = [
    { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/anita-dantani/', color: 'hover:text-blue-600' },
    { name: 'Email', icon: Mail, url: 'mailto:anitadantani0@gmail.com', color: 'hover:text-green-600' },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.6, 0.01, 0.05, 0.95],
      },
    },
  }

  return (
    <footer className="bg-gradient-to-b from-background to-muted/20 border-t border-border py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
      <div className="container-width">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="text-center"
        >
          {/* Social Links */}
          <motion.div variants={itemVariants} className="flex justify-center gap-4 mb-8">
            {socialLinks.map((social, index) => {
              const Icon = social.icon
              return (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-3 rounded-full bg-muted/50 text-muted-foreground transition-all ${social.color} hover:bg-primary/10`}
                  whileHover={{ 
                    scale: 1.2, 
                    rotate: [0, -10, 10, -10, 0],
                    y: -5,
                    transition: { duration: 0.4 }
                  }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={social.name}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + index * 0.1, type: 'spring', stiffness: 200 }}
                >
                  <Icon size={20} />
                </motion.a>
              )
            })}
          </motion.div>

          {/* Copyright */}
          <motion.div
            variants={itemVariants}
            className="text-muted-foreground text-sm md:text-base mb-3"
          >
            <p className="flex items-center justify-center gap-2">
              © {currentYear} Anita Dantani. Made with
              <motion.span
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              >
                <Heart size={16} className="fill-red-500 text-red-500" />
              </motion.span>
            </p>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            variants={itemVariants}
            className="flex flex-wrap justify-center gap-2 text-xs md:text-sm text-muted-foreground/70"
          >
            {['React', 'Vite', 'Tailwind CSS', 'Framer Motion'].map((tech, index) => (
              <motion.span
                key={tech}
                className="px-3 py-1 rounded-full bg-muted/30 hover:bg-muted/50 transition-colors"
                whileHover={{ scale: 1.1, y: -2 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
              >
                {tech}
              </motion.span>
            ))}
          </motion.div>

          {/* Additional Info */}
          <motion.p
            variants={itemVariants}
            className="mt-6 text-xs text-muted-foreground/60"
          >
            Designed & Developed with attention to detail
          </motion.p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer

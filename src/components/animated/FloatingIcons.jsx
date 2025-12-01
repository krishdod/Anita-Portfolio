import { motion } from 'framer-motion'
import { Code, Palette, Zap, Star, Heart, Coffee } from 'lucide-react'

const icons = [
  { Icon: Code, delay: 0 },
  { Icon: Palette, delay: 0.5 },
  { Icon: Zap, delay: 1 },
  { Icon: Star, delay: 1.5 },
  { Icon: Heart, delay: 2 },
  { Icon: Coffee, delay: 2.5 }
]

export function FloatingIcons() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {icons.map(({ Icon, delay }, index) => (
        <motion.div
          key={index}
          className="absolute text-primary/10"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            scale: 0,
            rotate: 0
          }}
          animate={{
            y: [null, -50, 0, -50],
            x: [null, Math.random() * 50 - 25, 0],
            scale: [0, 1, 1, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            delay,
            repeat: Infinity,
            ease: 'linear'
          }}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
        >
          <Icon size={40 + Math.random() * 40} />
        </motion.div>
      ))}
    </div>
  )
}

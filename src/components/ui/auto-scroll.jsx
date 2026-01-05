import { motion } from 'framer-motion'
import { cn } from '../../lib/utils'

export const AutoScroll = ({ 
  items, 
  direction = 'left',
  speed = 30,
  pauseOnHover = true,
  className,
  showIcons = false,
  iconMap = {}
}) => {
  // Duplicate items multiple times for seamless infinite loop
  const duplicatedItems = [...items, ...items, ...items]

  return (
    <div 
      className={cn("relative w-full overflow-hidden", className)}
    >
      {/* Gradient fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-background via-background/80 to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10 pointer-events-none" />
      
      <motion.div
        className="flex gap-8 md:gap-10 lg:gap-12 items-center"
        animate={{
          x: direction === 'left' ? ['0%', '-33.333%'] : ['-33.333%', '0%'],
        }}
        transition={{
          duration: speed,
          repeat: Infinity,
          ease: 'linear',
        }}
        style={{
          width: 'max-content',
        }}
      >
        {duplicatedItems.map((item, index) => {
          const Icon = showIcons && iconMap[item] ? iconMap[item] : null
          
          return (
            <motion.div
              key={`${item}-${index}`}
              className="flex-shrink-0 flex items-center justify-center gap-2 group"
              style={{ width: 'max-content' }}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {Icon && (
                <Icon className="w-6 h-6 md:w-7 md:h-7 text-foreground/60 group-hover:text-foreground/90 transition-colors" />
              )}
              <span className="text-lg md:text-xl lg:text-2xl font-semibold text-foreground/60 group-hover:text-foreground/90 transition-colors whitespace-nowrap">
                {typeof item === 'string' ? item : item}
              </span>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}


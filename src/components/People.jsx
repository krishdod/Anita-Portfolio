import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'

const People = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  // Generate more diverse avatars
  const people = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    name: `Person ${i + 1}`,
    emoji: [
      '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '🧑‍💻', '👨‍🎨', '👩‍🎨', '🧑‍🎓', '👨‍🏫',
      '👩‍🏫', '🧑‍🔬', '👨‍⚕️', '👩‍⚕️', '🧑‍⚖️', '👨‍✈️', '👩‍✈️', '🧑‍🚀', '👨‍🚒', '👩‍🚒'
    ][i],
    size: Math.random() > 0.5 ? 'large' : Math.random() > 0.5 ? 'medium' : 'small',
  }))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, scale: 0, rotate: -180 },
    visible: {
      opacity: 1,
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 200,
        damping: 15,
      },
    },
  }

  const getSize = (size) => {
    switch (size) {
      case 'large':
        return 'w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 text-5xl md:text-6xl'
      case 'medium':
        return 'w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 text-4xl md:text-5xl'
      default:
        return 'w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 text-3xl md:text-4xl'
    }
  }

  return (
    <section id="people" className="section-padding bg-gray-50" ref={ref}>
      <div className="container-width">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 text-gray-900">
            PE<span className="text-red-500">😍</span>PLE
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 font-light">
            who makes it all worth
          </p>
        </motion.div>

        {/* People Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="flex flex-wrap justify-center items-center gap-6 md:gap-8 lg:gap-10"
        >
          {people.map((person) => (
            <motion.div
              key={person.id}
              variants={itemVariants}
              whileHover={{ 
                scale: 1.15, 
                rotate: [0, -10, 10, -10, 0],
                zIndex: 10,
              }}
              whileTap={{ scale: 0.95 }}
              className={`${getSize(person.size)} rounded-full bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex items-center justify-center shadow-lg hover:shadow-2xl transition-shadow cursor-pointer border-4 border-white`}
              title={person.name}
            >
              {person.emoji}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

export default People

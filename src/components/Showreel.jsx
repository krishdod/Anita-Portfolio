import { useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { HiPlay, HiX } from 'react-icons/hi'

const Showreel = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  })
  const [isPlaying, setIsPlaying] = useState(false)

  const handlePlay = () => {
    setIsPlaying(true)
    // Replace with actual video embed
  }

  const handleClose = () => {
    setIsPlaying(false)
  }

  return (
    <section id="showreel" className="min-h-screen flex items-center justify-center relative py-24 section-padding">
      <div className="container-width w-full" ref={ref}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }}
          className="text-center"
        >
          {/* Title */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-16 text-gray-900"
          >
            Watch Showreel
          </motion.h2>

          {/* Video Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="relative max-w-6xl mx-auto aspect-video bg-gray-100 rounded-2xl overflow-hidden shadow-2xl cursor-pointer group"
            onClick={!isPlaying ? handlePlay : undefined}
          >
            {!isPlaying ? (
              <>
                {/* Thumbnail/Placeholder */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-300 to-gray-400 flex items-center justify-center">
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative z-10"
                  >
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full flex items-center justify-center shadow-2xl mb-4">
                      <HiPlay size={48} className="text-gray-900 ml-2" />
                    </div>
                    <p className="text-gray-600 text-sm md:text-base font-medium mt-4">
                      Click to play showreel
                    </p>
                  </motion.div>
                </div>
                {/* Hover Overlay */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute inset-0 bg-black/20 transition-opacity"
                />
              </>
            ) : (
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleClose()
                  }}
                  className="absolute top-4 right-4 z-20 p-2 bg-white/10 hover:bg-white/20 rounded-full backdrop-blur-sm transition-colors"
                >
                  <HiX size={24} className="text-white" />
                </button>
                {/* Video would be embedded here */}
                <div className="text-white">Video Player Placeholder</div>
              </div>
            )}
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-2xl md:text-3xl lg:text-4xl text-gray-600 mt-12 font-light"
          >
            The Alphabet
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}

export default Showreel

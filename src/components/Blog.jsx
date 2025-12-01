import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import { HiArrowRight } from 'react-icons/hi'

const Blog = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  })

  const articles = [
    {
      date: '12 August 2019',
      title: 'The Good, the bad, my 4 years of College Life.',
      excerpt: 'The age 19, 20 and 21 ain\'t easy, you lose friends, you make mistakes, you fall, you fail, you realize things. My college life and lessons.',
    },
    {
      date: '10 August 2019',
      title: 'Building a static blog with NuxtJs and Markdown as a beginner',
      excerpt: 'A summary of my ongoing journey to get a statically generated blog up and running with the help of NuxtJS and Markdown.',
    },
    {
      date: '17 August 2019',
      title: 'Often the best transformation happens after your worst encounter with life.',
      excerpt: 'You aren\'t what\'s happened to you, you are how you\'ve overcome it.',
    },
    {
      date: '6 September 2019',
      title: 'The so called Design Process.',
      excerpt: 'Its not only some of the steps you follow to make something amazing but more.',
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  }

  return (
    <section id="blog" className="section-padding bg-white" ref={ref}>
      <div className="container-width max-w-5xl">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-8 text-gray-900 leading-tight">
            Hack Things,<br />
            Solve Problems.<br />
            Be Curious.
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 font-light">
            I write on things I love. Here are some of my articles.
          </p>
        </motion.div>

        {/* Articles List */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          className="space-y-16 md:space-y-20"
        >
          {articles.map((article, index) => (
            <motion.article
              key={index}
              variants={itemVariants}
              whileHover={{ x: 10 }}
              className="border-b-2 border-gray-200 pb-12 last:border-b-0 cursor-pointer group"
            >
              <div className="flex flex-col md:flex-row md:items-start gap-6 md:gap-12">
                <div className="md:w-48 flex-shrink-0">
                  <p className="text-sm md:text-base text-gray-500 font-medium uppercase tracking-wider">
                    Published on {article.date}
                  </p>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 group-hover:text-gray-600 transition-colors leading-tight">
                    {article.title}
                  </h3>
                  <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-6">
                    {article.excerpt}
                  </p>
                  <motion.button
                    whileHover={{ x: 8 }}
                    className="text-gray-900 font-medium text-lg flex items-center gap-2 hover:underline group/btn"
                  >
                    Read more
                    <HiArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
                  </motion.button>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ x: 8 }}
            className="text-gray-900 font-medium text-lg flex items-center gap-2 mx-auto hover:underline group"
          >
            view all article
            <HiArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}

export default Blog

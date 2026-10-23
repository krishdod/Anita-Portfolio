import { Children, cloneElement, isValidElement, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useMotionPreference } from '../../hooks/useMotionPreference'

function wrapWords(children) {
  return Children.map(children, (child) => {
    if (typeof child === 'string' || typeof child === 'number') {
      return String(child).split(/(\s+)/).map((word, index) => /^\s+$/.test(word) ? word : (
        <span className="word-mask" key={index}>
          <motion.span className="word-reveal" variants={{
            hidden: { y: '112%', rotate: 3, opacity: .1 },
            visible: { y: '0%', rotate: 0, opacity: 1, transition: { duration: .8, ease: [.22, 1, .36, 1] } },
          }}>{word}</motion.span>
        </span>
      ))
    }
    if (isValidElement(child) && child.props.children) return cloneElement(child, {}, wrapWords(child.props.children))
    return child
  })
}

export function WordReveal({ children, className = '', as = 'h2' }) {
  const { reducedMotion } = useMotionPreference()
  const ref = useRef(null)
  const visible = useInView(ref, { once: true, amount: .2 })
  const Heading = motion[as]
  return (
    <Heading ref={ref} className={className} initial={reducedMotion ? false : 'hidden'} animate={reducedMotion || visible ? 'visible' : 'hidden'}
      variants={{ visible: { transition: { staggerChildren: reducedMotion ? 0 : .075 } } }}>
      {reducedMotion ? children : wrapWords(children)}
    </Heading>
  )
}

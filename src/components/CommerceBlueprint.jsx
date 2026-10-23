import { useRef } from 'react'
import { motion, useInView, useMotionValue, useSpring } from 'framer-motion'
import { useMotionPreference } from '../hooks/useMotionPreference'
import { useMediaQuery } from '../hooks/useMediaQuery'

const captions = ['The experience customers see.', 'The connections behind the store.', 'From reviewed code to a live release.']

// A schematic of the actual disciplines in the expertise selector, not a client dashboard.
export default function CommerceBlueprint({ stage = 0 }) {
  const { reducedMotion } = useMotionPreference()
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const ref = useRef(null)
  const visible = useInView(ref, { amount: .1 })
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(x, { stiffness: 100, damping: 22 })
  const rotateY = useSpring(y, { stiffness: 100, damping: 22 })
  const move = (event) => {
    if (reducedMotion || !fine || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    x(-((event.clientY - bounds.top) / bounds.height - .5) * 8)
    y(((event.clientX - bounds.left) / bounds.width - .5) * 8)
  }
  const plane = (index) => ({
    initial: false,
    animate: { y: reducedMotion ? 0 : (stage === index ? -10 : 5), opacity: stage === index ? 1 : .4 },
    transition: { duration: reducedMotion ? 0 : .65, ease: [.22, 1, .36, 1] },
  })
  return (
    <div ref={ref} className="commerce-blueprint" data-blueprint-stage={stage} data-playing={!reducedMotion && visible}
      onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0) }}>
      <div className="blueprint-topline"><span className="studio-mono">Commerce / System study</span><span className="blueprint-live" aria-hidden="true" /> </div>
      <motion.svg viewBox="45 -25 510 395" role="img" aria-label={captions[stage]} className="blueprint-drawing"
        style={{ rotateX: reducedMotion || !fine ? 0 : rotateX, rotateY: reducedMotion || !fine ? 0 : rotateY }}>
        <g className="blueprint-grid" aria-hidden="true">
          {[0, 1, 2, 3, 4, 5, 6].map((i) => <path key={'a' + i} d={`M${70 + i * 44} 224l190 -98M${70 + i * 44} 224l174 86`} />)}
        </g>
        <motion.g {...plane(2)} className="blueprint-plane blueprint-delivery">
          <path d="M84 235 304 123 527 233 307 344Z" className="blueprint-face" />
          <path d="M84 235v9l223 110 220-112v-9M307 344v10" className="blueprint-edge" />
          <path d="m168 234 64-32 64 32-64 32Z" className="blueprint-panel" />
          <path d="m306 235 65-33 64 33-65 33Z" className="blueprint-panel" />
          <path d="m216 232 13 6 25-15m100 12 13 6 25-15" className="blueprint-accent" />
          <path d="m252 217 53-27 53 26" className="blueprint-route" />
        </motion.g>
        <motion.g {...plane(1)} className="blueprint-plane blueprint-connections">
          <path d="M84 170 304 58 527 168 307 279Z" className="blueprint-face" />
          <path d="M84 170v9l223 110 220-112v-9M307 279v10" className="blueprint-edge" />
          <path d="m191 167 65-33 65 33-65 33Z" className="blueprint-panel" />
          <path d="m332 168 51-25 51 25-51 26Z" className="blueprint-panel" />
          <path d="m321 167 18 0M255 133v-14M191 167h-22" className="blueprint-accent" />
          <path d="m169 167 86-43 128 64 51-26" className="blueprint-route" />
          <circle cx="255" cy="167" r="7" className="blueprint-node" /><circle cx="383" cy="168" r="5" className="blueprint-node" />
        </motion.g>
        <motion.g {...plane(0)} className="blueprint-plane blueprint-storefront">
          <path d="M84 105 304-7 527 103 307 214Z" className="blueprint-face" />
          <path d="M84 105v9l223 110 220-112v-9M307 214v10" className="blueprint-edge" />
          <path d="m111 106 194-98 195 96M111 106l196 97 193-99" className="blueprint-panel" />
          <path d="m132 111 194-98M139 99l6 3m4-7 6 3m4-7 6 3" className="blueprint-accent" />
          <path d="m156 121 62-31 59 29-62 31Zm70 34 62-31 59 29-62 31Zm63-66 38-19 58 29-38 19Z" className="blueprint-product" />
          <path d="m360 125 56-28 29 14-56 28ZM359 151l35-18" className="blueprint-accent" />
          <path d="m156 121 59 29 62-31M226 155l59 29 62-31" className="blueprint-route" />
        </motion.g>
      </motion.svg>
      <div className="blueprint-caption"><span className="studio-mono">0{stage + 1} / 03</span><span>{captions[stage]}</span></div>
    </div>
  )
}

import { useEffect, useId, useRef, useState } from 'react'
import { ArrowUpRight, Pause, Play } from 'lucide-react'
import { useInView } from 'framer-motion'
import { useMotionPreference } from '../hooks/useMotionPreference'

const phrases = ['Storefronts', 'Checkout', 'Integrations', 'Shopify Plus']

export default function CommerceMarquee() {
  const { reducedMotion } = useMotionPreference()
  const [paused, setPaused] = useState(false)
  const [pageVisible, setPageVisible] = useState(() => !document.hidden)
  const ref = useRef(null)
  const visible = useInView(ref, { margin: '100px' })
  const trackId = useId()
  useEffect(() => {
    const update = () => setPageVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  return (
    <div ref={ref} className="commerce-marquee" data-static={reducedMotion || undefined} role="region" aria-label="Commerce specialisms">
      <p className="sr-only">Shopify Plus storefronts, checkout development, and integrations.</p>
      <div className="commerce-marquee-viewport">
        <div id={trackId} className="commerce-marquee-track" aria-hidden="true" style={{ animationPlayState: !paused && !reducedMotion && visible && pageVisible ? 'running' : 'paused' }}>
          {(reducedMotion ? [0] : [0, 1]).map((copy) => <div className="commerce-marquee-copy" key={copy}>
            {phrases.map((phrase, index) => <span className="commerce-marquee-item" key={phrase}>
              <small>0{index + 1}</small><span>{phrase}</span><ArrowUpRight aria-hidden="true" />
            </span>)}
          </div>)}
        </div>
      </div>
      {!reducedMotion && <button type="button" className="marquee-control" aria-controls={trackId}
        aria-pressed={paused} aria-label={paused ? 'Play moving specialisms' : 'Pause moving specialisms'} onClick={() => setPaused((value) => !value)}>
        {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>}
    </div>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Code2, Workflow, Compass } from 'lucide-react'
import { SectionHeading } from '../SectionHeading'
import { RevealOnScroll } from '../effects/RevealOnScroll'
import { useMotionPreference } from '../../hooks/useMotionPreference'

const expertise = [
  { icon: Code2, label: 'The experience', title: 'Build the experience', description: 'Shopify Plus storefronts, custom apps, and checkout extensions that connect the brand experience to the buying journey.', tags: ['Liquid', 'React', 'Shopify Functions'], flow: ['Brand experience', 'Storefront', 'Checkout'], note: 'The details customers see. The journeys they remember.' },
  { icon: Workflow, label: 'The systems', title: 'Connect the systems', description: 'Admin API integrations, webhooks, and commerce automation that help teams spend less time on repetitive work.', tags: ['GraphQL', 'REST APIs', 'Shopify Flow'], flow: ['Commerce data', 'Integrations', 'Automation'], note: 'The connections that keep a commerce business moving.' },
  { icon: Compass, label: 'The delivery', title: 'Own the delivery', description: 'Technical planning, theme architecture, and launch coordination across development, design, and business teams.', tags: ['Architecture', 'Performance', 'Project leadership'], flow: ['Technical planning', 'Build & test', 'Launch readiness'], note: 'A considered path from the first conversation to launch.' },
]

export default function About() {
  const [active, setActive] = useState(0)
  const { reducedMotion } = useMotionPreference()
  const selected = expertise[active]
  const Icon = selected.icon
  return (
    <section id="about" tabIndex={-1} className="section-padding editorial-about relative">
      <div className="container-width">
        <div className="section-header grid lg:grid-cols-2 gap-6 lg:gap-16 items-start">
          <SectionHeading eyebrow="02 / The person behind the code" title={<>An eye for the detail.<br /><em className="editorial-em">A mind for the whole.</em></>} />
          <RevealOnScroll className="space-y-4 text-base sm:text-lg text-muted-foreground lg:pt-10">
            <p>I'm Anita, a Shopify developer and technical lead. My work spans storefront development, custom apps, checkout experiences, and the integrations that keep commerce running.</p>
            <p>Across luxury fashion, jewelry, footwear, and B2B commerce, I bring the implementation details and the wider business goals into the same conversation.</p>
          </RevealOnScroll>
        </div>
        <RevealOnScroll className="expertise-explorer">
          <div className="expertise-index" role="group" aria-label="Explore my areas of expertise">
            {expertise.map((item, index) => <button type="button" key={item.label} id={'expertise-control-' + index} aria-pressed={active === index} aria-controls="expertise-detail" onClick={() => setActive(index)}>
              <span className="studio-mono">0{index + 1}</span><span>{item.label}</span><ArrowUpRight size={22} aria-hidden="true" />
            </button>)}
          </div>
          <div id="expertise-detail" className="expertise-detail" role="region" aria-labelledby={'expertise-control-' + active}>
            <motion.div key={active} initial={reducedMotion ? false : { opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: reducedMotion ? 0 : 0.3 }}>
              <div className="expertise-detail-top"><Icon size={30} strokeWidth={1.25} aria-hidden="true" /><span className="expertise-chapter" aria-hidden="true">0{active + 1}</span></div>
              <h3>{selected.title}</h3><p className="expertise-description">{selected.description}</p>
              <ol className="expertise-flow" aria-label="How this work connects">
                {selected.flow.map((step, index) => <li key={step}><span>{step}</span>{index < selected.flow.length - 1 && <ArrowRight size={16} aria-hidden="true" />}</li>)}
              </ol>
              <p className="expertise-note">{selected.note}</p>
              <ul className="expertise-tags" aria-label="Skills used">{selected.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
            </motion.div>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}

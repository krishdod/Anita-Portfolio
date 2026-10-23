import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ArrowUpRight, Code2, Workflow, Compass } from 'lucide-react'
import { SectionHeading } from '../SectionHeading'
import { RevealOnScroll } from '../effects/RevealOnScroll'
import { useMotionPreference } from '../../hooks/useMotionPreference'
import { outcomes } from '../../data/career'
import { profile } from '../../data/profile'
import CommerceBlueprint from '../CommerceBlueprint'

const expertise = [
  { icon: Code2, label: 'Storefront & checkout', title: 'From a design file to a working store.', description: 'I turn Figma handoffs into mobile-first Shopify themes, then extend the buying journey with Shopify Functions, Checkout UI Extensions, and custom apps.', tags: ['Liquid', 'React', 'Shopify Functions'], flow: ['Figma handoff', 'Storefront', 'Checkout'], note: 'DTC storefronts, Shopify B2B, and Shopify Plus.' },
  { icon: Workflow, label: 'Apps & integrations', title: 'Make the systems talk to each other.', description: 'Custom apps, Admin and Storefront API integrations, and webhooks that keep data moving between Shopify and third-party tools.', tags: ['Node.js & Express', 'GraphQL', 'REST APIs'], flow: ['Commerce data', 'API integrations', 'Automation'], note: 'Backend experience across Node.js, PHP, and MySQL.' },
  { icon: Compass, label: 'People & delivery', title: 'Stay involved all the way to launch.', description: 'At Zerb, I lead technical planning, architecture, code reviews, and production releases. I work directly with developers, business stakeholders, and technology partners.', tags: ['Technical planning', 'Code reviews', 'Mentoring'], flow: ['Plan', 'Build & review', 'Release'], note: 'Clean code and long-term maintainability stay part of the conversation.' },
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
          <SectionHeading eyebrow="02 / A little about me" title={<>From design handoff<br /><em className="editorial-em">to production.</em></>} />
          <RevealOnScroll className="space-y-4 text-base sm:text-lg text-muted-foreground lg:pt-10">
            <p>I'm Anita, a Senior Shopify Full Stack Developer with 7+ years of hands-on experience. I enjoy taking a project from a design handoff to a live store, and getting the frontend and backend to work well together.</p>
            <p>I'm currently {profile.currentRole} at {profile.currentCompany}. Alongside building custom features, I lead technical planning, review code, and help the team ship reliable work. Performance, accessibility, and maintainability matter to me beyond launch day.</p>
          </RevealOnScroll>
        </div>
        <RevealOnScroll className="expertise-explorer">
          <div className="expertise-index" role="group" aria-label="Explore my areas of expertise">
            {expertise.map((item, index) => <button type="button" key={item.label} id={'expertise-control-' + index} aria-pressed={active === index} aria-controls="expertise-detail" onClick={() => setActive(index)}>
              <span className="studio-mono">0{index + 1}</span><span>{item.label}</span><ArrowUpRight size={22} aria-hidden="true" />
            </button>)}
          </div>
          <div id="expertise-detail" className="expertise-detail" role="region" aria-labelledby={'expertise-control-' + active}>
            <CommerceBlueprint stage={active} />
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
        <RevealOnScroll className="outcomes-note">
          <div className="outcomes-context">
            <p className="eyebrow">At {profile.currentCompany}</p>
            <h3>A few improvements<br />along the way.</h3>
          </div>
          <dl className="outcomes-grid">
            {outcomes.map(({ value, label, direction }) => <div key={label}>
              <dt>{label}</dt>
              <dd><span className="sr-only">{value}</span><span aria-hidden="true">{direction === 'up' ? '↗' : '↘'}</span><span className="metric-number" aria-hidden="true"><span className="metric-value" data-count={Number.parseInt(value, 10)}>{value.replace('%', '')}</span>%</span></dd>
            </div>)}
          </dl>
        </RevealOnScroll>
      </div>
    </section>
  )
}

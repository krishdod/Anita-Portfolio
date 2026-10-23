import { RevealOnScroll } from './effects/RevealOnScroll'
import { WordReveal } from './effects/WordReveal'

export function SectionHeading({ eyebrow, title, children, centered = false }) {
  return (
    <RevealOnScroll className={'section-heading' + (centered ? ' text-center mx-auto' : '')}>
      <p className="eyebrow">{eyebrow}</p>
      <WordReveal className="section-title text-balance">{title}</WordReveal>
      {children && <p className="section-description">{children}</p>}
    </RevealOnScroll>
  )
}

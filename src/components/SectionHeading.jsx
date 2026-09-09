import { RevealOnScroll } from './effects/RevealOnScroll'

export function SectionHeading({ eyebrow, title, children, centered = false }) {
  return (
    <RevealOnScroll className={'section-heading' + (centered ? ' text-center mx-auto' : '')}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title text-balance">{title}</h2>
      {children && <p className="section-description">{children}</p>}
    </RevealOnScroll>
  )
}

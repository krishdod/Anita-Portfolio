import { SectionHeading } from './SectionHeading'
import { RevealOnScroll } from './effects/RevealOnScroll'
import { skillGroups } from '../data/career'

export default function TechStack() {
  return (
    <section id="tech-stack" tabIndex={-1} className="section-padding editorial-toolkit">
      <div className="container-width">
        <SectionHeading eyebrow="04 / My toolkit" title={<>What I work with,<br /><em className="editorial-em">and what I use it for.</em></>}>
          Shopify is the core. These are the tools I use around it to build, measure, and maintain the whole experience.
        </SectionHeading>
        <div className="toolkit-ledger">
          {skillGroups.map(({ title, description, skills }, index) => (
            <RevealOnScroll key={title} delay={0.03}>
              <article className="toolkit-row">
                <span className="toolkit-number studio-mono" aria-hidden="true">0{index + 1}</span>
                <div className="toolkit-intro"><h3>{title}</h3><p>{description}</p></div>
                <ul aria-label={title + ' skills'} className="toolkit-skills">
                  {skills.map((skill) => <li key={skill}>{skill}</li>)}
                </ul>
              </article>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}

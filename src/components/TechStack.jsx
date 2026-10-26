import { useId, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { skillGroups } from '../data/career'

const disciplines = [
  { label: 'Commerce', detail: 'Shopify & checkout' },
  { label: 'Interface', detail: 'Frontend development' },
  { label: 'Connections', detail: 'Apps & integrations' },
  { label: 'Intelligence', detail: 'Analytics & measurement' },
  { label: 'Craft', detail: 'Performance & quality' },
  { label: 'Delivery', detail: 'Tools & teamwork' },
]

export default function TechStack() {
  const [active, setActive] = useState(0)
  const tabRefs = useRef([])
  const id = useId()
  const select = (index, focus = false) => {
    setActive(index)
    if (focus) tabRefs.current[index]?.focus({ preventScroll: true })
  }
  const onKeyDown = (event, index) => {
    let next
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') next = (index + 1) % skillGroups.length
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') next = (index + skillGroups.length - 1) % skillGroups.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = skillGroups.length - 1
    if (next === undefined) return
    event.preventDefault()
    select(next, true)
  }

  return (
    <section id="tech-stack" tabIndex={-1} className="section-padding editorial-toolkit">
      <div className="container-width">
        <SectionHeading eyebrow="04 / My toolkit" title={<>The stack behind<br /><em className="editorial-em">the storefront.</em></>}>
          Shopify at the core. The tools around it, chosen for the work.
        </SectionHeading>

        <div className="toolkit-workbench">
          <div className="toolkit-disciplines" role="tablist" aria-label="Toolkit disciplines" aria-orientation="vertical">
            {skillGroups.map((group, index) => {
              const { label, detail } = disciplines[index]
              const selected = index === active
              return (
                <button key={group.title} type="button" role="tab" aria-label={`${label}: ${group.title}`}
                  id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={selected}
                  tabIndex={selected ? 0 : -1} className="toolkit-discipline" ref={(node) => { tabRefs.current[index] = node }}
                  onClick={() => select(index)} onKeyDown={(event) => onKeyDown(event, index)} onFocus={() => select(index)}>
                  <span className="toolkit-tab-number studio-mono" aria-hidden="true">0{index + 1}</span>
                  <span className="toolkit-tab-copy"><strong>{label}</strong><span>{detail}</span></span>
                  <ArrowRight className="toolkit-tab-arrow" size={17} aria-hidden="true" />
                </button>
              )
            })}
          </div>

          <div className="toolkit-details">
            {skillGroups.map((group, index) => (
              <div key={group.title} id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`}
                hidden={active !== index} tabIndex={0} className="toolkit-detail-panel">
                <div className="toolkit-detail-intro">
                  <p className="studio-mono">0{index + 1} / {disciplines[index].label.toUpperCase()}</p>
                  <h3>{group.title}</h3>
                  <p>{group.description}</p>
                </div>
                <ul className="toolkit-skill-list" aria-label={`${group.title} skills`}>
                  {group.skills.map((skill) => <li key={skill}>{skill}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

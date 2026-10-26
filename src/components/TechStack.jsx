import { useId, useRef, useState } from 'react'
import { ArrowUpRight, Boxes, Cable, ChartNoAxesCombined, Code2, Gauge, GitBranch } from 'lucide-react'
import { SectionHeading } from './SectionHeading'
import { ToolkitEngine } from './ToolkitEngine'
import { skillGroups } from '../data/career'

const disciplines = [
  { label: 'Commerce', detail: 'The foundation', icon: Boxes },
  { label: 'Interface', detail: 'The experience', icon: Code2 },
  { label: 'Connections', detail: 'The infrastructure', icon: Cable },
  { label: 'Intelligence', detail: 'The feedback loop', icon: ChartNoAxesCombined },
  { label: 'Craft', detail: 'The fine tuning', icon: Gauge },
  { label: 'Delivery', detail: 'The release', icon: GitBranch },
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
        <div className="toolkit-heading">
          <SectionHeading eyebrow="04 / My toolkit" title={<>The stack behind<br /><em className="editorial-em">the storefront.</em></>}>
            A good storefront is a whole system. Explore the layers I use to build it.
          </SectionHeading>
          <p className="toolkit-edition"><span aria-hidden="true">06</span>Disciplines.<br />One connected build.</p>
        </div>

        <div className="toolkit-workbench">
          <ToolkitEngine active={active} onSelect={select} />
          <div className="toolkit-disciplines" role="tablist" aria-label="Toolkit disciplines" aria-orientation="vertical">
            {skillGroups.map((group, index) => {
              const { label, detail, icon: Icon } = disciplines[index]
              const selected = index === active
              return (
                <button key={group.title} type="button" role="tab" aria-label={`${label}: ${group.title}`}
                  id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={selected}
                  tabIndex={selected ? 0 : -1} className="toolkit-discipline" ref={(node) => { tabRefs.current[index] = node }}
                  onClick={() => select(index)} onKeyDown={(event) => onKeyDown(event, index)} onFocus={() => select(index)}>
                  <span className="toolkit-tab-number studio-mono" aria-hidden="true">0{index + 1}</span>
                  <Icon size={22} strokeWidth={1.4} aria-hidden="true" />
                  <span className="toolkit-tab-copy"><strong>{label}</strong><span>{detail}</span></span>
                  <ArrowUpRight className="toolkit-tab-arrow" size={18} aria-hidden="true" />
                </button>
              )
            })}
          </div>

          <div className="toolkit-details">
            {skillGroups.map((group, index) => (
              <div key={group.title} id={`${id}-panel-${index}`} role="tabpanel" aria-labelledby={`${id}-tab-${index}`}
                hidden={active !== index} tabIndex={0} className="toolkit-detail-panel">
                <div className="toolkit-detail-intro">
                  <p className="studio-mono">LAYER 0{index + 1} / {disciplines[index].label.toUpperCase()}</p>
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
        <p className="toolkit-colophon"><span>Built to fit the project. Down to the last detail.</span><span className="studio-mono">AD / COMMERCE SYSTEMS</span></p>
      </div>
    </section>
  )
}

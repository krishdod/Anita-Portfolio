import { MapPin } from 'lucide-react'
import { profile } from '../data/profile'
import { SectionHeading } from './SectionHeading'

const experiences = [
    {
      title: 'Senior Shopify Full Stack Developer',
      company: 'Function Growth',
      period: '2025 - Present',
      location: 'New York (Remote)',
      highlight: 'Custom apps, Shopify Functions, and checkout extensions for high‑growth brands.',
      tags: ['Custom Apps', 'Functions', 'Checkout Extensions'],
    },
    {
      title: 'Shopify Developer',
      company: 'Tenovia Solutions',
      period: '2023 - 2025',
      location: 'Bangalore, IN',
      highlight: 'B2B marketplaces, automation, and scalable architectures for enterprise merchants.',
      tags: ['B2B', 'Automation', 'Marketplaces'],
    },
    {
      title: 'Shopify Developer',
      company: 'ISpark IT',
      period: '2023 - 2023',
      location: 'Ahmedabad, IN',
      highlight: 'Private apps, Admin API integrations, and operational tooling.',
      tags: ['Private Apps', 'Admin API', 'Integrations'],
    },
    {
      title: 'Shopify Developer',
      company: 'Creatpix Infotech',
      period: '2021 - 2023',
      location: 'Ahmedabad, IN',
      highlight: 'Theme development, performance optimisation, and LCP & SEO improvements.',
      tags: ['Themes', 'Performance', 'SEO'],
    },
    {
      title: 'Technical Lead',
      company: 'Bacha Motors (TATA)',
      period: '2020 - 2021',
      location: 'Gujarat, IN',
      highlight: 'Led internal systems using PHP & MySQL, improving workflows across teams.',
      tags: ['PHP', 'MySQL', 'Internal Systems'],
    },
  ]

export default function Work() {
  return (
    <section id="work" tabIndex={-1} className="section-padding editorial-career relative">
      <div className="container-width career-layout">
        <div className="career-introduction">
          <SectionHeading eyebrow="03 / Along the way" title={<>Built on<br /><em className="editorial-em">real experience.</em></>}>
            From internal systems to Shopify Plus. A career connecting technical delivery with the needs of commerce teams.
          </SectionHeading>
          <a href={profile.resume} download className="text-link mt-7">Download full résumé ↗</a>
        </div>
        <ol className="career-chapters">
          {experiences.map((experience, index) => (
            <li key={experience.company}>
              <details className="career-chapter" open={index === 0}>
                <summary>
                  <span className="studio-mono career-index" aria-hidden="true">0{index + 1}</span>
                  <span className="career-summary"><span className="career-date">{experience.period === '2023 - 2023' ? '2023' : experience.period.replace(' - ', ' – ')}{index === 0 && <span className="career-current">Current</span>}</span><span className="career-company">{experience.company}</span><span className="career-role">{experience.title}</span></span>
                  <span className="career-toggle" aria-hidden="true">+</span>
                </summary>
                <div className="career-detail">
                  <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} aria-hidden="true" />{experience.location}</p>
                  <p className="mt-4 text-base text-muted-foreground">{experience.highlight}</p>
                  <ul aria-label="Focus areas" className="expertise-tags mt-5">{experience.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                </div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

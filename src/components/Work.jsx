import { ArrowUpRight, MapPin } from 'lucide-react'
import { profile } from '../data/profile'
import { experiences, education, credentials } from '../data/career'
import { SectionHeading } from './SectionHeading'

export default function Work() {
  return (
    <section id="work" tabIndex={-1} className="section-padding editorial-career relative">
      <div className="container-width">
        <div className="career-layout">
          <div className="career-introduction">
            <SectionHeading eyebrow="03 / Experience" title={<>Where I've<br /><em className="editorial-em">done the work.</em></>}>
              Internal systems first. Then Shopify themes, custom apps, and technical leadership.
              Here's the path that brought me here.
            </SectionHeading>
            <a href={profile.resume} download className="text-link mt-7">Download my résumé <ArrowUpRight size={17} aria-hidden="true" /></a>
          </div>
          <ol className="career-chapters">
            {experiences.map((experience, index) => (
              <li key={experience.company}>
                <details className="career-chapter" open={experience.current || undefined}>
                  <summary>
                    <span className="studio-mono career-index" aria-hidden="true">0{index + 1}</span>
                    <span className="career-summary">
                      <span className="career-date">{experience.period}{experience.current && <span className="career-current">Current</span>}</span>
                      <span className="career-company">{experience.company}</span>
                      <span className="career-role">{experience.title}</span>
                    </span>
                    <span className="career-toggle" aria-hidden="true">+</span>
                  </summary>
                  <div className="career-detail">
                    {experience.location && <p className="flex items-center gap-2 text-sm text-muted-foreground"><MapPin size={14} aria-hidden="true" />{experience.location}</p>}
                    <p className="career-description">{experience.description}</p>
                    <ul className="career-highlights">{experience.highlights.map((line) => <li key={line}>{line}</li>)}</ul>
                    <ul aria-label="Focus areas" className="expertise-tags">{experience.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>
                  </div>
                </details>
              </li>
            ))}
          </ol>
        </div>
        <div className="education-layout">
          <div>
            <h3 className="eyebrow">Education</h3>
            <ul className="education-list">
              {education.map(({ qualification, school, year }) => <li key={qualification}>
                <div><h4>{qualification}</h4><p>{school}</p></div><span className="studio-mono">{year}</span>
              </li>)}
            </ul>
          </div>
          <div className="credentials-block">
            <h3 className="eyebrow">Certifications & courses</h3>
            <ul className="credentials-list">{credentials.map((credential) => <li key={credential}>{credential}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  )
}

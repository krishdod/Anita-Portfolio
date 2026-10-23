import { useState } from 'react'
import { ArrowUpRight, ImageOff } from 'lucide-react'
import { getProjectImage, getProjectSrcSet } from '../data/projects'
import { RevealOnScroll } from './effects/RevealOnScroll'

export function ProjectCard({ project, index = 0, layout = 'featured' }) {
  const [imageFailed, setImageFailed] = useState(false)
  const isRow = layout === 'row'
  const isEditorial = layout === 'editorial'
  const Heading = isRow ? 'h2' : 'h3'
  return (
    <RevealOnScroll delay={Math.min(index * 0.06, 0.18)} className={isEditorial ? 'editorial-project-item' : 'h-full'}>
      <a
        href={project.link}
        target="_blank"
        rel="noopener noreferrer"
        className={'project-card group' + (isRow ? ' project-row' : '') + (isEditorial ? ' editorial-project' : '')}
        aria-label={'View ' + project.title + ' live website (opens in a new tab)'}
      >
        {isEditorial && <div className="project-scene-heading" aria-hidden="true"><span className="studio-mono">Selected work / {project.id}</span><span>{project.industry}</span></div>}
        <div className="project-image">
          {imageFailed ? (
            <div className="h-full flex flex-col gap-3 items-center justify-center bg-muted text-muted-foreground">
              <ImageOff size={28} aria-hidden="true" /><span>{project.title}</span>
            </div>
          ) : (
            <img
              src={getProjectImage(project)}
              srcSet={getProjectSrcSet(project)}
              sizes={isEditorial
                ? '(max-width: 767px) calc(100vw - 40px), (max-width: 1319px) 65vw, 900px'
                : isRow
                ? '(max-width: 767px) calc(100vw - 40px), (max-width: 1319px) 42vw, 520px'
                : '(max-width: 767px) calc(100vw - 40px), (max-width: 1023px) 46vw, (max-width: 1319px) 30vw, 400px'}
              alt={project.title + ' storefront preview'}
              loading="lazy"
              decoding="async"
              width="960"
              height="600"
              onError={() => setImageFailed(true)}
            />
          )}
          <span className="project-number">{project.id}</span>
          <span className="project-open" aria-hidden="true"><ArrowUpRight size={22} />{isEditorial && <span>Visit site</span>}</span>
        </div>
        <div className="project-content">
          <p className="eyebrow !mb-3">{project.category}</p>
          <Heading className="text-2xl sm:text-[1.75rem] font-semibold tracking-tight">{project.title}</Heading>
          <p className="text-sm sm:text-base text-muted-foreground mt-3">{project.description}</p>
          <ul aria-label="Project focus" className="flex flex-wrap gap-2 mt-5">
            {project.tags.map((tag) => <li key={tag} className="project-tag">{tag}</li>)}
          </ul>
          <span className="inline-flex items-center gap-2 text-sm font-semibold mt-6 group-hover:text-primary transition-colors">
            Visit live website <ArrowUpRight size={16} aria-hidden="true" />
          </span>
        </div>
      </a>
    </RevealOnScroll>
  )
}

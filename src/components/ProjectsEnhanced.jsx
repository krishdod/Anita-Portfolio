import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import { SectionHeading } from './SectionHeading'
import { ProjectCard } from './ProjectCard'

export default function ProjectsEnhanced() {
  return (
    <section id="portfolio" tabIndex={-1} className="section-padding editorial-work relative">
      <div className="container-width">
        <div className="section-header flex flex-col md:flex-row md:items-end justify-between gap-6">
          <SectionHeading eyebrow="01 / Selected work" title={<>Some stores<br /><em className="editorial-em">I've helped build.</em></>}>
            Luxury fashion, jewelry, and everyday commerce. A selection of Shopify projects I've worked on.
          </SectionHeading>
          <Link to="/all-work" className="text-link mb-1 shrink-0">All {projects.length} projects <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
        <div className="editorial-project-grid">
          {projects.slice(0, 3).map((project, index) => <ProjectCard key={project.id} project={project} index={index} layout="editorial" />)}
        </div>
        <div className="section-actions flex flex-col sm:flex-row items-center justify-between gap-5">
          <p className="text-sm text-muted-foreground">More projects across fashion, footwear, jewelry, and global commerce.</p>
          <Link to="/all-work" className="button-secondary shrink-0">Explore all work <ArrowUpRight size={18} aria-hidden="true" /></Link>
        </div>
      </div>
    </section>
  )
}

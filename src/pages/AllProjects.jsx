import { useEffect, useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight, Search, X } from 'lucide-react'
import { projects, projectIndustries } from '../data/projects'
import { ProjectCard } from '../components/ProjectCard'
import { usePageMeta } from '../hooks/usePageMeta'

export default function AllProjects() {
  useEffect(() => { document.getElementById('main-content')?.focus({ preventScroll: true }) }, [])
  usePageMeta('Selected Work — Anita Dantani', 'Explore Anita Dantani’s Shopify portfolio across luxury fashion, jewelry, footwear, and global commerce.', '/all-work')
  const [params, setParams] = useSearchParams()
  const query = params.get('q') || ''
  const requestedIndustry = params.get('industry') || 'All projects'
  const industry = projectIndustries.includes(requestedIndustry) ? requestedIndustry : 'All projects'

  const filtered = useMemo(() => {
    const words = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
    return projects.filter((project) => {
      const text = [project.title, project.description, project.category, ...project.tags].join(' ').toLowerCase()
      return (industry === 'All projects' || project.industry === industry) && words.every((word) => text.includes(word))
    })
  }, [query, industry])

  const updateFilter = (key, value, replace = false) => {
    const next = new URLSearchParams(params)
    if (!value || value === 'All projects') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace })
  }

  return (
    <main id="main-content" tabIndex={-1} className="gallery-page container-width">
      <Link to="/#portfolio" state={{ skipIntro: true }} className="text-link text-sm mb-10"><ArrowLeft size={16} aria-hidden="true" /> Back to portfolio</Link>
      <div className="max-w-3xl">
        <p className="eyebrow">The project collection</p>
        <h1 className="section-title text-balance">Built for the way<br /><em className="editorial-em">people shop.</em></h1>
        <p className="section-description mt-5">Shopify storefronts across luxury fashion, jewelry, footwear, and more. Find a project by brand, industry, or technology.</p>
      </div>
      <div className="gallery-controls">
        <div className="search-field">
          <Search size={19} aria-hidden="true" />
          <label className="sr-only" htmlFor="project-search">Search projects</label>
          <input id="project-search" type="search" placeholder="Search brands, skills, or projects…" value={query} onChange={(event) => updateFilter('q', event.target.value, true)} />
          {query && <button type="button" className="icon-button !min-h-9 !min-w-9" aria-label="Clear search" onClick={() => updateFilter('q', '', true)}><X size={16} aria-hidden="true" /></button>}
        </div>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by industry">
          {projectIndustries.map((item) => (
            <button key={item} type="button" className="filter-chip" aria-pressed={industry === item} onClick={() => updateFilter('industry', item)}>{item}</button>
          ))}
        </div>
      </div>
      <p role="status" aria-live="polite" aria-atomic="true" className="text-sm text-muted-foreground mb-6">
        Showing {filtered.length} of {projects.length} projects
      </p>
      {filtered.length ? (
        <div className="space-y-6">
          {filtered.map((project, index) => <ProjectCard key={project.id} project={project} index={index} layout="row" />)}
        </div>
      ) : (
        <div className="surface-card py-16 px-6 text-center">
          <Search size={28} className="mx-auto text-muted-foreground mb-4" aria-hidden="true" />
          <h2 className="text-2xl mb-3">No projects found</h2>
          <p className="text-muted-foreground mb-6">Try another brand, a broader search, or a different industry.</p>
          <button type="button" className="button-secondary" onClick={() => setParams({})}>Clear all filters</button>
        </div>
      )}
      <aside className="gallery-cta surface-card">
        <div>
          <p className="eyebrow">Let's work together</p>
          <h2 className="text-2xl sm:text-3xl font-semibold mb-3">Have a Shopify challenge in mind?</h2>
          <p className="text-muted-foreground max-w-xl">A new storefront, a complex integration, or a team looking for its next developer. Let's talk about what you need.</p>
        </div>
        <Link to="/#contact" state={{ skipIntro: true }} className="button-primary shrink-0">Start a conversation <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </aside>
    </main>
  )
}

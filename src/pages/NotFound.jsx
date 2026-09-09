import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { usePageMeta } from '../hooks/usePageMeta'

export default function NotFound() {
  usePageMeta('Page not found — Anita Dantani', 'This page could not be found. Explore Anita Dantani’s portfolio or get in touch.', '/', true)
  return (
    <main id="main-content" tabIndex={-1} className="container-width min-h-[80svh] flex flex-col items-start justify-center pt-28 pb-16">
      <p className="eyebrow">404 / A little off track</p>
      <h1 className="section-title">This page isn't here.</h1>
      <p className="section-description mt-5 mb-8">The link may have changed. There is plenty of work to explore back at the portfolio.</p>
      <div className="flex flex-wrap gap-3">
        <Link to="/#home" className="button-primary"><ArrowLeft size={18} aria-hidden="true" /> Back home</Link>
        <Link to="/all-work" className="button-secondary">Explore projects <ArrowUpRight size={18} aria-hidden="true" /></Link>
      </div>
    </main>
  )
}

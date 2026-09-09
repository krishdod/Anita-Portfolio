import { Link } from 'react-router-dom'
import { ArrowUp, Pause, Play } from 'lucide-react'
import { useMotionPreference } from '../hooks/useMotionPreference'
import { profile } from '../data/profile'

export default function Footer() {
  const { reducedMotion, pauseMotion, systemReduced, toggleMotion } = useMotionPreference()
  return (
    <footer className="studio-footer relative py-7">
      <div className="container-width"><p className="footer-signature" aria-hidden="true">Anita Dantani<span>.</span></p></div>
      <div className="container-width flex flex-col md:flex-row items-start md:items-center justify-between gap-5">
        <div>
          <p className="text-sm font-semibold">© {new Date().getFullYear()} {profile.name}</p>
          <p className="text-xs text-muted-foreground mt-1">Thoughtful code. Better commerce.</p>
        </div>
        <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm text-muted-foreground">
          <button type="button" onClick={toggleMotion} disabled={systemReduced} aria-pressed={pauseMotion || systemReduced} className="inline-flex items-center gap-2 min-h-11 hover:text-foreground disabled:cursor-default">
            {reducedMotion ? <Play size={15} aria-hidden="true" /> : <Pause size={15} aria-hidden="true" />}
            {systemReduced ? 'Reduced motion enabled' : pauseMotion ? 'Resume animations' : 'Pause animations'}
          </button>
          <Link to="/#home" state={{ skipIntro: true }} className="text-link min-h-11">Back to top <ArrowUp size={16} aria-hidden="true" /></Link>
        </div>
      </div>
    </footer>
  )
}

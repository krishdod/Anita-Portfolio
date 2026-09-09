import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, useLocation } from 'react-router-dom'
import { ArrowUpRight, Download, Menu, Moon, Sun, X } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'
import { useMediaQuery } from '../../hooks/useMediaQuery'
import { navigation, profile } from '../../data/profile'

export function Navigation() {
  const location = useLocation()
  const { isDark, toggleTheme } = useTheme()
  const desktop = useMediaQuery('(min-width: 1200px)')
  const [isOpen, setIsOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [scrolled, setScrolled] = useState(false)
  const dialogRef = useRef(null)
  const triggerRef = useRef(null)
  const destinationRef = useRef(null)

  useEffect(() => {
    let frame
    const update = () => {
      setScrolled(window.scrollY > 24)
      if (location.pathname !== '/') { setActive('portfolio'); return }
      const sections = navigation.map(({ id }) => document.getElementById(id)).filter(Boolean)
      const current = [...sections].reverse().find((section) => section.getBoundingClientRect().top <= 160)
      setActive(current?.id || 'home')
    }
    const onScroll = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [location.pathname, location.hash])

  useEffect(() => { setIsOpen(false) }, [location.pathname, location.hash, desktop])

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (!isOpen) { if (dialog.open) dialog.close(); return }
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialog.showModal()
    return () => {
      if (dialog.open) dialog.close()
      document.body.style.overflow = previousOverflow
    }
  }, [isOpen])

  const followSection = (id) => {
    destinationRef.current = id
    setIsOpen(false)
    // Let the route's location-key effect scroll after the dialog unlocks,
    // including when a visitor selects the same section again.
  }

  const sectionLinks = (mobile = false) => navigation.map(({ id, label }) => (
    <Link
      key={id}
      to={'/#' + id}
      state={{ skipIntro: true }}
      onClick={() => followSection(id)}
      aria-current={active === id ? 'location' : undefined}
      className={mobile ? 'mobile-nav-link' : 'desktop-nav-link'}
    >
      {label}
      {mobile && <ArrowUpRight size={18} aria-hidden="true" />}
    </Link>
  ))

  return (
    <>
      <header className={'site-header' + (scrolled ? ' is-scrolled' : '')}>
        <div className="container-width flex items-center justify-between gap-4">
          <Link to="/#home" state={{ skipIntro: true }} className="brand-link" aria-label="Anita Dantani — home" onClick={() => followSection('home')}>
            <span className="brand-mark" aria-hidden="true">a<span>.</span></span>
            <span className="hidden sm:block text-sm font-semibold tracking-tight">Anita Dantani</span>
          </Link>
          {desktop && <nav aria-label="Primary" className="desktop-nav">{sectionLinks()}</nav>}
          <div className="flex items-center gap-2">
            <a href={profile.resume} download className="header-resume button-secondary text-sm !min-h-10 !px-4">
              <Download size={15} aria-hidden="true" /> Résumé
            </a>
            <button type="button" className="icon-button" onClick={toggleTheme} aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}>
              {isDark ? <Sun size={20} aria-hidden="true" /> : <Moon size={20} aria-hidden="true" />}
            </button>
            {!desktop && (
              <button ref={triggerRef} type="button" className="icon-button" onClick={() => { destinationRef.current = null; setIsOpen(true) }} aria-label="Open navigation" aria-haspopup="dialog" aria-expanded={isOpen} aria-controls="mobile-navigation">
                <Menu size={22} aria-hidden="true" />
              </button>
            )}
          </div>
        </div>
      </header>
      {createPortal(
        <dialog
          ref={dialogRef}
          id="mobile-navigation"
          className="mobile-menu"
          aria-labelledby="menu-title"
          onCancel={() => setIsOpen(false)}
          onClose={() => {
            setIsOpen(false)
            const destination = destinationRef.current
            destinationRef.current = null
            if (destination) requestAnimationFrame(() => document.getElementById(destination)?.focus({ preventScroll: true }))
            else triggerRef.current?.focus({ preventScroll: true })
          }}
          onKeyDown={(event) => {
            if (event.key !== 'Tab') return
            const items = event.currentTarget.querySelectorAll('a[href], button:not([disabled])')
            const first = items[0]
            const last = items[items.length - 1]
            if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus() }
            else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus() }
          }}
          onClick={(event) => { if (event.target === event.currentTarget) setIsOpen(false) }}
        >
          <div className="mobile-menu-content">
            <div className="flex items-center justify-between mb-8">
              <h2 id="menu-title" className="text-lg">Explore the portfolio</h2>
              <button type="button" className="icon-button" onClick={() => setIsOpen(false)} aria-label="Close navigation" autoFocus>
                <X size={22} aria-hidden="true" />
              </button>
            </div>
            <nav aria-label="Mobile">{sectionLinks(true)}</nav>
            <div className="mt-auto pt-10 flex flex-col gap-4">
              <a href={profile.resume} download className="button-primary"><Download size={18} aria-hidden="true" /> Download résumé</a>
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground inline-flex gap-2 items-center">
                Connect on LinkedIn <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </div>
        </dialog>,
        document.body,
      )}
    </>
  )
}

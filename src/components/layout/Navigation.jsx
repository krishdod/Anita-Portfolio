import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, Moon, Sun, Linkedin, Home, User, Briefcase, FolderKanban, Mail } from 'lucide-react'
import { LimelightNav } from '../limelight-nav'
import { useTheme } from '../../hooks/useTheme'
import { useIsMobile } from '../../hooks/useMediaQuery'
import { smoothScrollTo } from '../../lib/utils'

const navLinks = [
  { name: 'Home', href: 'home', icon: Home },
  { name: 'About', href: 'about', icon: User },
  { name: 'Technical Skills', href: 'tech-stack', icon: Briefcase },
  
  { name: 'Experience', href: 'work', icon: Briefcase },
  { name: 'Work', href: 'portfolio', icon: FolderKanban },
  { name: 'Contact', href: 'contact', icon: Mail },
]

const socialLinks = [
  { name: 'LinkedIn', icon: Linkedin, url: 'https://www.linkedin.com/in/anita-dantani/', color: 'hover:text-blue-900' },
]

// Direct download link to CV in public folder
const CV_PDF_FILE = 'Anita_Dantani_updated.pdf'
const CV_DOWNLOAD_URL = `/${CV_PDF_FILE}`

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [activeIndex, setActiveIndex] = useState(0)
  const [isNavigating, setIsNavigating] = useState(false)
  const { theme, toggleTheme, isDark } = useTheme()
  const isMobile = useIsMobile()
  const [isScrolled, setIsScrolled] = useState(false)

  // Scroll-reactive nav background (modern “glass” header behavior)
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Update active section based on scroll
  useEffect(() => {
    const sections = navLinks.map(link => document.getElementById(link.href))
    
    // Improved observer options - triggers when section enters viewport from top
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px -60% 0px', // Trigger when section top is 100px from viewport top
      threshold: [0, 0.1, 0.3, 0.5, 0.7, 1] // Multiple thresholds for better detection
    }

    const observer = new IntersectionObserver((entries) => {
      // Don't update if user just clicked a nav item
      if (isNavigating) return
      
      // Find the section that's most visible in the viewport
      const visibleSections = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => {
          // Sort by intersection ratio (most visible first)
          return b.intersectionRatio - a.intersectionRatio
        })

      if (visibleSections.length > 0) {
        const mostVisible = visibleSections[0]
        setActiveSection(mostVisible.target.id)
        const index = navLinks.findIndex(link => link.href === mostVisible.target.id)
        if (index !== -1) {
          setActiveIndex(index)
        }
      }
    }, observerOptions)

    sections.forEach(section => {
      if (section) observer.observe(section)
    })

    // Fallback: Also check on scroll for better responsiveness
    const handleScroll = () => {
      if (isNavigating) return
      
      const scrollPosition = window.scrollY + 200 // Offset for navbar and some padding
      
      // Find which section is currently most visible in viewport
      let currentSection = null
      let maxVisibility = 0
      
      sections.forEach(section => {
        if (section) {
          const rect = section.getBoundingClientRect()
          const sectionTop = rect.top + window.scrollY
          const sectionBottom = sectionTop + rect.height
          
          // Check if section is in viewport
          if (scrollPosition >= sectionTop - 150 && scrollPosition <= sectionBottom) {
            // Calculate how much of the section is visible
            const viewportTop = window.scrollY
            const viewportBottom = window.scrollY + window.innerHeight
            const visibleTop = Math.max(sectionTop, viewportTop)
            const visibleBottom = Math.min(sectionBottom, viewportBottom)
            const visibility = (visibleBottom - visibleTop) / rect.height
            
            if (visibility > maxVisibility) {
              maxVisibility = visibility
              currentSection = section
            }
          }
        }
      })
      
      if (currentSection) {
        setActiveSection(currentSection.id)
        const index = navLinks.findIndex(link => link.href === currentSection.id)
        if (index !== -1) {
          setActiveIndex(index)
        }
      }
    }

    // Throttled scroll handler
    let ticking = false
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', throttledScroll, { passive: true })
    handleScroll() // Initial check

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', throttledScroll)
    }
  }, [isNavigating])

  const handleNavClick = (href, index) => {
    // Immediately set the active index
    if (index !== undefined) {
      setActiveIndex(index)
      setActiveSection(href)
    }
    
    // Disable scroll observer temporarily
    setIsNavigating(true)
    setIsOpen(false)
    
    // Scroll to section
    smoothScrollTo(href, 80)
    
    // Re-enable scroll observer after scroll completes
    setTimeout(() => {
      setIsNavigating(false)
    }, 1000) // Wait for smooth scroll to complete
  }

  // Prepare nav items for LimelightNav - using text labels instead of icons
  const limelightNavItems = navLinks.map((link, index) => ({
    id: link.href,
    icon: <span className="text-sm font-medium">{link.name}</span>, // Text label instead of icon
    label: link.name,
    onClick: () => handleNavClick(link.href, index),
  }))

  return (
    <>
      <motion.nav
        className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
          isScrolled ? 'bg-background/70 backdrop-blur-xl border-b border-border/40 shadow-sm' : 'bg-transparent'
        }`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.6, 0.01, 0.05, 0.95] }}
      >
        <div className="container-width">
          <div className="flex items-center justify-between relative">
            {/* Spacer for left side to center nav */}
            <div className="hidden md:block flex-1"></div>
            
            {/* Desktop Navigation - Centered with LimelightNav */}
            <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <LimelightNav
                items={limelightNavItems}
                activeIndex={activeIndex}
                onTabChange={(index) => {
                  const link = navLinks[index]
                  if (link) {
                    handleNavClick(link.href, index)
                  }
                }}
                className="bg-background/80 backdrop-blur-md border-border/50 shadow-lg"
                limelightClassName="bg-gradient-to-r from-blue-600/80 via-purple-600/80 to-pink-600/80 backdrop-blur-sm"
                iconContainerClassName="hover:bg-accent/50 rounded-full transition-colors"
                iconClassName="text-foreground"
              />
            </div>

            {/* Right Side - Social Links, Download CV, Theme Toggle & Mobile Menu */}
            <div className="flex items-center gap-2 z-10 ml-auto">
                {/* Social Links - Desktop Only */}
                {!isMobile && (
                  <div className="hidden md:flex items-center gap-1">
                    {socialLinks.map((social) => {
                      const Icon = social.icon
                      return (
                        <motion.a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-2 rounded-lg text-muted-foreground transition-colors ${social.color}`}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={social.name}
                        >
                          <Icon size={20} />
                        </motion.a>
                      )
                    })}
                  </div>
                )}

                {/* Download CV - Desktop */}
                {!isMobile && (
                  <motion.a
                    href={CV_DOWNLOAD_URL}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hidden md:inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Download CV
                  </motion.a>
                )}

                {/* Theme Toggle */}
              <motion.button
                onClick={toggleTheme}
                className="p-2 rounded-lg hover:bg-accent transition-colors"
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Toggle theme"
              >
                <AnimatePresence mode="wait">
                  {isDark ? (
                    <motion.div
                      key="sun"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Sun size={20} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="moon"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Moon size={20} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

                {/* Mobile Menu Button */}
                {isMobile && (
                  <motion.button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 rounded-lg hover:bg-accent transition-colors md:hidden"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Toggle menu"
                  >
                    <AnimatePresence mode="wait">
                      {isOpen ? (
                        <motion.div
                          key="close"
                          initial={{ rotate: -90 }}
                          animate={{ rotate: 0 }}
                          exit={{ rotate: 90 }}
                        >
                          <X size={24} />
                        </motion.div>
                      ) : (
                        <motion.div
                          key="menu"
                          initial={{ rotate: 90 }}
                          animate={{ rotate: 0 }}
                          exit={{ rotate: -90 }}
                        >
                          <Menu size={24} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )}
              </div>
            </div>
          </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && isMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-50 w-72 bg-background/95 backdrop-blur-xl shadow-2xl border-l border-border md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            >
              <div className="flex flex-col h-full pt-20 px-6">
                <nav className="flex flex-col gap-2">
                  {navLinks.map((link, index) => {
                    const isActive = activeSection === link.href
                    const Icon = link.icon
                    return (
                      <motion.button
                        key={link.href}
                        onClick={() => handleNavClick(link.href, index)}
                        className={`text-left px-4 py-3 rounded-lg font-medium text-lg transition-all flex items-center gap-3 ${
                          isActive
                            ? 'bg-primary text-primary-foreground shadow-md'
                            : 'text-foreground hover:bg-accent'
                        }`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Icon size={20} />
                        {link.name}
                      </motion.button>
                    )
                  })}
                </nav>

                {/* Social Links - Mobile */}
                <div className="mt-8 pt-8 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-4 px-4">Connect with me</p>
                  <div className="flex gap-3">
                    {socialLinks.map((social) => {
                      const Icon = social.icon
                      return (
                        <motion.a
                          key={social.name}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`p-3 rounded-lg bg-accent text-foreground transition-colors ${social.color}`}
                          whileHover={{ scale: 1.1, y: -2 }}
                          whileTap={{ scale: 0.9 }}
                          aria-label={social.name}
                        >
                          <Icon size={22} />
                        </motion.a>
                      )
                    })}
                  </div>

                  <motion.a
                    href={CV_DOWNLOAD_URL}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 inline-flex items-center justify-center w-full px-4 py-2 rounded-full bg-primary text-primary-foreground font-semibold text-sm"
                    whileHover={{ scale: 1.05, y: -1 }}
                    whileTap={{ scale: 0.96 }}
                  >
                    Download CV
                  </motion.a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

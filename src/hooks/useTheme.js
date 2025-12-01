import { useState, useEffect } from 'react'

/**
 * Custom hook for managing theme (light/dark mode)
 * Supports system preference detection and localStorage persistence
 * @returns {Object} Theme state and toggle function
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) return savedTheme

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark'
    }
    return 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    
    // Remove both classes first
    root.classList.remove('light', 'dark')
    
    // Add current theme class
    root.classList.add(theme)
    
    // Save to localStorage
    localStorage.setItem('theme', theme)
  }, [theme])

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    
    const handleChange = (e) => {
      // Only update if user hasn't manually set preference
      const savedTheme = localStorage.getItem('theme')
      if (!savedTheme) {
        setTheme(e.matches ? 'dark' : 'light')
      }
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light')
  }

  return { theme, toggleTheme, isDark: theme === 'dark' }
}

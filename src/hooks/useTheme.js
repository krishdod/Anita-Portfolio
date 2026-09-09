import { useEffect, useState } from 'react'

function savedPreference() {
  try {
    const value = localStorage.getItem('theme')
    return value === 'dark' || value === 'light' ? value : null
  } catch {
    return null
  }
}

export function useTheme() {
  const [preference, setPreference] = useState(savedPreference)
  const [systemDark, setSystemDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const theme = preference || (systemDark ? 'dark' : 'light')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(document.body).backgroundColor)
  }, [theme])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const update = (event) => setSystemDark(event.matches)
    const sync = (event) => {
      if (event.key === 'theme' || event.key === null) setPreference(savedPreference())
    }
    media.addEventListener('change', update)
    window.addEventListener('storage', sync)
    return () => {
      media.removeEventListener('change', update)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setPreference(next)
    try { localStorage.setItem('theme', next) } catch { /* Preference still works for this visit. */ }
  }

  return { theme, toggleTheme, isDark: theme === 'dark' }
}

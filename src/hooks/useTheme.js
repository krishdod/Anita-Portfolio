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
  const theme = preference || 'dark'

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    document.documentElement.classList.toggle('light', theme === 'light')
    document.documentElement.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', getComputedStyle(document.body).backgroundColor)
  }, [theme])

  useEffect(() => {
    const sync = (event) => {
      if (event.key === 'theme' || event.key === null) setPreference(savedPreference())
    }
    window.addEventListener('storage', sync)
    return () => {
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

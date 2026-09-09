import { createContext, useContext, useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { useMediaQuery } from './useMediaQuery'

const MotionPreference = createContext({ reducedMotion: false, pauseMotion: false, toggleMotion: () => {} })

export function MotionPreferenceProvider({ children }) {
  const systemReduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [pauseMotion, setPauseMotion] = useState(() => {
    try { return localStorage.getItem('pause-motion') === 'true' } catch { return false }
  })
  const reducedMotion = systemReduced || pauseMotion

  useEffect(() => {
    document.documentElement.classList.toggle('reduce-motion', reducedMotion)
    return () => document.documentElement.classList.remove('reduce-motion')
  }, [reducedMotion])

  const toggleMotion = () => {
    const next = !pauseMotion
    setPauseMotion(next)
    try { localStorage.setItem('pause-motion', String(next)) } catch { /* Optional persistence. */ }
  }

  return (
    <MotionPreference.Provider value={{ reducedMotion, pauseMotion, systemReduced, toggleMotion }}>
      <MotionConfig reducedMotion={reducedMotion ? 'always' : 'never'}>
        {children}
      </MotionConfig>
    </MotionPreference.Provider>
  )
}

export const useMotionPreference = () => useContext(MotionPreference)

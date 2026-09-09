import { useMediaQuery } from './useMediaQuery'
import { useMotionPreference } from './useMotionPreference'

export function usePerfMode() {
  const narrow = useMediaQuery('(max-width: 768px)')
  const { reducedMotion } = useMotionPreference()
  const cores = navigator.hardwareConcurrency
  const memory = navigator.deviceMemory
  return narrow || reducedMotion || (cores > 0 && cores <= 4) || (memory > 0 && memory <= 4)
}


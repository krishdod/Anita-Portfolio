import { useEffect, useMemo, useState } from 'react'

function getIsLowEndDevice() {
  // These are best-effort hints; not all browsers support them.
  const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency : undefined
  const memory = typeof navigator !== 'undefined' ? navigator.deviceMemory : undefined

  const lowCores = typeof cores === 'number' && cores > 0 && cores <= 4
  const lowMemory = typeof memory === 'number' && memory > 0 && memory <= 4

  return Boolean(lowCores || lowMemory)
}

export function usePerfMode() {
  const [isNarrow, setIsNarrow] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mqNarrow = window.matchMedia('(max-width: 768px)')
    const mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)')

    const update = () => {
      setIsNarrow(mqNarrow.matches)
      setPrefersReducedMotion(mqReduce.matches)
    }

    update()
    mqNarrow.addEventListener('change', update)
    mqReduce.addEventListener('change', update)
    return () => {
      mqNarrow.removeEventListener('change', update)
      mqReduce.removeEventListener('change', update)
    }
  }, [])

  const lowEnd = useMemo(() => getIsLowEndDevice(), [])

  // Perf mode: mobile or reduced-motion or low-end hardware hints
  return isNarrow || prefersReducedMotion || lowEnd
}


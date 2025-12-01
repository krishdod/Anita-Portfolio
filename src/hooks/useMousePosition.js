import { useState, useEffect } from 'react'
import { throttle } from '../lib/utils'

/**
 * Custom hook to track mouse position
 * @param {number} throttleMs - Throttle delay in milliseconds
 * @returns {Object} Mouse position coordinates
 */
export function useMousePosition(throttleMs = 50) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = throttle((e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }, throttleMs)

    window.addEventListener('mousemove', updateMousePosition)
    return () => window.removeEventListener('mousemove', updateMousePosition)
  }, [throttleMs])

  return mousePosition
}

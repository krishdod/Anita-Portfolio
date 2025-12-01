import { useState, useEffect } from 'react'
import { throttle } from '../lib/utils'

/**
 * Custom hook to track scroll position
 * @param {number} throttleMs - Throttle delay in milliseconds
 * @returns {Object} Scroll position data
 */
export function useScrollPosition(throttleMs = 100) {
  const [scrollPosition, setScrollPosition] = useState({
    scrollY: 0,
    scrollX: 0,
    scrollPercentage: 0,
    scrollDirection: 'down'
  })

  useEffect(() => {
    let lastScrollY = window.pageYOffset

    const updateScrollPosition = throttle(() => {
      const scrollY = window.pageYOffset
      const scrollX = window.pageXOffset
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrollPercentage = (scrollY / windowHeight) * 100

      setScrollPosition({
        scrollY,
        scrollX,
        scrollPercentage: Math.min(Math.max(scrollPercentage, 0), 100),
        scrollDirection: scrollY > lastScrollY ? 'down' : 'up'
      })

      lastScrollY = scrollY
    }, throttleMs)

    window.addEventListener('scroll', updateScrollPosition, { passive: true })
    updateScrollPosition() // Initialize

    return () => window.removeEventListener('scroll', updateScrollPosition)
  }, [throttleMs])

  return scrollPosition
}

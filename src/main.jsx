import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import Lenis from 'lenis'

// Respect prefers-reduced-motion by exposing it via a CSS class on the root element
const prefersReducedMotion =
  window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (prefersReducedMotion) {
  document.documentElement.classList.add('reduce-motion')
}

// Initialize Lenis smooth scroll (skip entirely for reduced-motion users)
if (!prefersReducedMotion) {
  const lenis = new Lenis({
    // Smoother feel without getting “floaty”
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.9,
    // Touch scrolling is already smooth natively; keep Lenis off for touch to avoid jank
    smoothTouch: false,
    touchMultiplier: 1,
    infinite: false,
  })

  // Make Lenis available globally for smoothScrollTo utility
  window.lenis = lenis

  // Animation frame for smooth scrolling (pause when tab is hidden)
  let rafId = null
  const raf = (time) => {
    lenis.raf(time)
    rafId = requestAnimationFrame(raf)
  }

  const start = () => {
    if (rafId) return
    rafId = requestAnimationFrame(raf)
  }
  const stop = () => {
    if (!rafId) return
    cancelAnimationFrame(rafId)
    rafId = null
  }

  const onVisibility = () => {
    if (document.hidden) stop()
    else start()
  }

  document.addEventListener('visibilitychange', onVisibility)
  start()
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />,
)








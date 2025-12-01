import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Respect prefers-reduced-motion by exposing it via a CSS class on the root element
if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.documentElement.classList.add('reduce-motion')
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <App />,
)








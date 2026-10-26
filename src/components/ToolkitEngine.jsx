import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, Layers3, Pause, Play, RotateCcw } from 'lucide-react'
import { useMotionPreference } from '../hooks/useMotionPreference'

const labels = ['SHOPIFY', 'REACT / TS', 'NODE / API', 'ANALYTICS', 'QUALITY', 'DELIVERY']

export function ToolkitEngine({ active, onSelect }) {
  const hostRef = useRef(null)
  const canvasRef = useRef(null)
  const engineRef = useRef(null)
  const selectRef = useRef(onSelect)
  selectRef.current = onSelect
  const near = useInView(hostRef, { margin: '250px 0px' })
  const visible = useInView(hostRef, { amount: .05 })
  const { reducedMotion } = useMotionPreference()
  const [activated, setActivated] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [playing, setPlaying] = useState(true)
  const [phase, setPhase] = useState('loading')
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))
  const stateRef = useRef({})
  stateRef.current = { active, expanded, playing, reducedMotion, visible }

  useEffect(() => { if (near) setActivated(true) }, [near])
  useEffect(() => {
    const observer = new MutationObserver(() => setDark(document.documentElement.classList.contains('dark')))
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!activated) return
    let cancelled = false
    let engine
    setPhase('loading')
    import('./effects/createToolkitEngine').then(({ createToolkitEngine }) => {
      if (cancelled) return
      engine = createToolkitEngine(canvasRef.current, {
        dark,
        onSelect: (index) => selectRef.current(index),
        onContextLost: () => { if (!cancelled) { engineRef.current?.dispose(); engineRef.current = null; setPhase('fallback') } },
      })
      if (!engine) { setPhase('fallback'); return }
      engineRef.current = engine
      engine.update(stateRef.current)
      setPhase('ready')
    }).catch(() => { if (!cancelled) setPhase('fallback') })
    return () => { cancelled = true; engine?.dispose(); engineRef.current = null }
  }, [activated, dark])

  useEffect(() => { engineRef.current?.update(stateRef.current) }, [active, expanded, playing, reducedMotion, visible])

  const ready = phase === 'ready'
  return (
    <div className="toolkit-machine" ref={hostRef} data-engine={phase} data-expanded={expanded}>
      <div className="toolkit-machine-top studio-mono"><span><i aria-hidden="true" /> THE COMMERCE ENGINE</span><span>VOL. 01 / AD</span></div>
      <div className="toolkit-scene">
        <span className="toolkit-scene-watermark" aria-hidden="true">BUILT<br />TO CONNECT.</span>
        <canvas key={dark ? 'dark' : 'light'} className="toolkit-canvas" ref={canvasRef} aria-hidden="true" />
        {!ready && <div className="toolkit-fallback" aria-hidden="true">
          <div className="toolkit-fallback-core"><span>AD.</span><small>COMMERCE ENGINE</small></div>
          {labels.map((label, index) => <span key={label} className={'toolkit-fallback-node' + (active === index ? ' is-active' : '')}>{label}</span>)}
        </div>}
        <div className="toolkit-scene-caption"><span className="studio-mono">0{active + 1} / {labels[active]}</span>
          <span className="toolkit-desktop-hint">{ready ? 'Drag to orbit · Click a module' : 'Select a discipline to explore'}</span>
          <span className="toolkit-touch-hint">Tap a discipline to explore</span>
        </div>
      </div>
      <div className="toolkit-controls">
        <button type="button" className="toolkit-layer-toggle" disabled={!ready} aria-pressed={expanded}
          aria-label={expanded ? 'Collapse 3D layers' : 'Separate 3D layers'} onClick={() => setExpanded(!expanded)}>
          <Layers3 size={17} aria-hidden="true" /><span>{expanded ? 'Bring it together' : 'Pull it apart'}</span>
        </button>
        <div className="toolkit-view-controls">
          <button type="button" aria-label="Rotate 3D view left" disabled={!ready} onClick={() => engineRef.current?.rotate(-.4)}><ChevronLeft size={17} aria-hidden="true" /></button>
          <button type="button" aria-label="Rotate 3D view right" disabled={!ready} onClick={() => engineRef.current?.rotate(.4)}><ChevronRight size={17} aria-hidden="true" /></button>
          <span className="toolkit-control-divider" />
          <button type="button" aria-label="Reset 3D view" disabled={!ready} onClick={() => engineRef.current?.reset()}><RotateCcw size={16} aria-hidden="true" /></button>
          <button type="button" aria-label={playing && !reducedMotion ? 'Pause 3D animation' : 'Play 3D animation'}
            disabled={!ready || reducedMotion} onClick={() => setPlaying(!playing)}>{playing && !reducedMotion ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}</button>
        </div>
      </div>
    </div>
  )
}

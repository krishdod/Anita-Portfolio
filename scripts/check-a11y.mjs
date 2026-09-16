import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const read = (file) => readFile(path.join(root, file), 'utf8')

const html = await read('index.html')
assert(html.includes('class="skip-link"'), 'Missing skip link')
assert(html.includes('href="#main-content"'), 'Skip link must target main content')
assert(!/DM\+Sans:ital,/.test(html), 'DM Sans still requests an incomplete ital axis')

const navigation = await read('src/components/layout/Navigation.jsx')
assert(navigation.includes('supportsDialogModal'), 'Mobile menu needs a showModal fallback')
assert(navigation.includes("location.pathname === '/' && active === id"), 'aria-current must be homepage-only for section links')
assert(navigation.includes('aria-label="Open navigation"'), 'Menu trigger needs an accessible name')
assert(navigation.includes('aria-labelledby="menu-title"'), 'Mobile dialog needs a labelled title')

const app = await read('src/App.jsx')
assert(/setTimeout\(skipIntro,\s*22000\)/.test(app), 'Intro safety timeout must remain a stall fallback (~22s), not a short-circuit')
assert(app.includes('ParticleIntro'), 'Homepage must keep the particle intro gate')
assert(app.includes('onHandoffPhase'), 'Intro must drive the DOM handoff phases')
assert(app.includes('cancelHandoff'), 'Skip/Escape must cancel an in-flight portal handoff')
assert(app.includes("main?.setAttribute('inert'") || app.includes('hadInert'), 'Intro must inert main content while blocking')
assert(app.includes('hadInert'), 'Intro must preserve and restore each element’s original inert state')
assert(app.includes('introDialogRef'), 'Intro must keep a dialog ref for focus containment')
assert(app.includes("event.key !== 'Tab'") || app.includes("event.key === 'Tab'"), 'Intro must trap Tab inside the dialog')

const particleIntro = await read('src/components/ParticleIntro.jsx')
assert(particleIntro.includes('attractTo') || particleIntro.includes('collapseTo'), 'Handoff must attract particles into the turquoise glow')
assert(particleIntro.includes('expandPortal') || particleIntro.includes('portalRadius'), 'Handoff must expand a radial portal/iris')
assert(particleIntro.includes('maskImage') || particleIntro.includes('WebkitMaskImage') || particleIntro.includes('applyVeilMask'), 'Portal must reveal the hero via a radial CSS mask')
assert(particleIntro.includes('masking: false') || particleIntro.includes('masking = false') || particleIntro.includes('clearVeilMask'), 'Veil must stay unmasked (opaque) until reveal begins')
assert(particleIntro.includes('intro-veil') || particleIntro.includes('veilRef'), 'Particles/glow must sit on layers separate from the opaque veil')
assert(particleIntro.includes('data-intro-stage') || particleIntro.includes('introStage'), 'Intro must expose explicit stage markers for verification')
assert(particleIntro.includes('pointermove') || particleIntro.includes('setAttractor'), 'Attraction point must follow the cursor while gathering')
assert(particleIntro.includes('lockAttractor') || particleIntro.includes('GATHER_MS'), 'Attraction must lock briefly before the final reveal')
assert(particleIntro.includes('FORMED_HOLD_MS'), 'Completed particle name must hold before collapse')
assert(particleIntro.includes('settleWaiters') || particleIntro.includes('cancelled'), 'Skip/unmount must settle pending animation promises')
assert(particleIntro.includes("'outline'"), 'Reveal must pass through outlined typography')
assert(particleIntro.includes("'ink'"), 'Reveal must fill the surname with gradient ink')
assert(particleIntro.includes("'content'"), 'Supporting hero content must enter after the name resolves')
assert(!/setPortal\(/.test(particleIntro), 'Portal visuals must not use per-frame React setState')

const particleFx = await read('src/components/ui/particle-text-effect.jsx')
assert(particleFx.includes('beginAttract') || particleFx.includes('collapseToward'), 'Particle effect must support attract-to-cursor motion')
assert(particleFx.includes('setAttractor'), 'Particle attractor must update while the cursor moves')
assert(particleFx.includes('lockAttractor'), 'Particle attractor must lock for the final absorb')
assert(particleFx.includes('collapsing'), 'Collapse phase must be distinct from dissolve')

const hero = await read('src/components/HeroEnhanced.jsx')
assert(hero.includes('handoffPhase'), 'Hero must accept explicit handoff phases from the intro')
assert(hero.includes("handoffPhase === 'outline'"), 'Hero must show the outline stage under the iris')
assert(hero.includes("handoffPhase === 'ink'"), 'Hero must resolve outline into gradient ink')
assert(hero.includes('contentReady'), 'Hero supporting content must wait for the content phase')

const studio = await read('src/studio.css')
assert(studio.includes('min-height: 220px'), 'Featured project needs a height fallback')
assert(studio.includes('@supports not (aspect-ratio: 16 / 10)'), 'Featured project needs an aspect-ratio fallback')
assert(studio.includes("data-handoff='outline'"), 'Studio CSS must style the outline stage')
assert(studio.includes('morph-surname-ink'), 'Studio CSS must animate the surname ink fill')

const vercel = JSON.parse(await read('vercel.json'))
assert(
  vercel.rewrites.some(({ source, destination }) => source === '/all-work' && destination === '/all-work.html'),
  'Gallery rewrite must serve all-work.html for crawlers'
)
assert(
  vercel.headers.some(({ source }) => source.includes('projects/optimized')),
  'Project images need long-lived cache headers'
)
assert(
  vercel.headers.some(({ source }) => source.includes('.pdf')),
  'Résumé PDF needs a cache header'
)

console.log('Passed accessibility and regression checks for fonts, radial portal handoff, dialog fallback, and crawler metadata.')

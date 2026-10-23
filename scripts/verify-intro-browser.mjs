/**
 * Browser verification for the cursor-attract portal intro.
 * Usage: node scripts/verify-intro-browser.mjs [baseUrl]
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const outDir = path.join(root, 'tmp', 'intro-verify')
const baseUrl = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '')
const RING_TOLERANCE_PX = 90
const results = []

function pass(name, detail = '') {
  results.push({ name, ok: true, detail })
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  results.push({ name, ok: false, detail })
  console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`)
}

function attachErrorCapture(page) {
  const errors = []
  page.on('pageerror', (error) => {
    errors.push(`pageerror: ${error.message}`)
  })
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(`console.error: ${msg.text()}`)
  })
  return {
    assertClean(label) {
      const relevant = errors.filter(
        (line) =>
          !line.includes('favicon') &&
          !line.includes('Download the React DevTools') &&
          !line.includes('net::ERR_')
      )
      if (relevant.length) fail(`${label}_no_app_errors`, relevant.slice(0, 3).join(' | '))
      else pass(`${label}_no_app_errors`)
    },
  }
}

async function openFresh(context, query = '') {
  const page = await context.newPage()
  const capture = attachErrorCapture(page)
  const url = `${baseUrl}/${query ? `?${query}&` : '?'}t=${Date.now()}`
  await page.goto(url.replace('?&', '?'), { waitUntil: 'networkidle' })
  await page.waitForSelector('.particle-intro, .intro-skip, #home-hero-name', { timeout: 20000 })
  return { page, capture }
}

async function waitForStage(page, stage, timeout = 20000) {
  await page.waitForFunction(
    (expected) => document.querySelector(`.particle-intro[data-intro-stage="${expected}"]`),
    stage,
    { timeout }
  )
}

async function waitForIntroGone(page, timeout = 25000) {
  await page.waitForFunction(() => !document.querySelector('[role="dialog"][aria-modal="true"]'), null, {
    timeout,
  })
}

async function ringPoint(page) {
  return page.evaluate(() => {
    const ring = document.querySelector('.intro-portal-ring')
    if (!ring) return null
    const opacity = Number(getComputedStyle(ring).opacity || 0)
    return {
      x: Number.parseFloat(ring.style.left || '0'),
      y: Number.parseFloat(ring.style.top || '0'),
      opacity,
    }
  })
}

async function sampleVeil(page) {
  return page.evaluate(() => {
    const veil = document.querySelector('.intro-veil')
    if (!veil) return { present: false }
    const style = getComputedStyle(veil)
    const mask = style.maskImage || style.webkitMaskImage || ''
    return {
      present: true,
      maskNone: !mask || mask === 'none',
      veilState: veil.dataset.introVeil || null,
      stage: document.querySelector('.particle-intro')?.dataset.introStage || null,
    }
  })
}

async function recoveryState(page) {
  return page.evaluate(() => {
    const main = document.getElementById('main-content')
    const header = document.querySelector('.site-header')
    const footer = document.querySelector('footer')
    const dialog = document.querySelector('[role="dialog"][aria-modal="true"]')
    const hero = document.getElementById('home-hero-name')
    return {
      dialogPresent: !!dialog,
      overflow: document.body.style.overflow,
      mainInert: main?.hasAttribute('inert') ?? false,
      headerInert: header?.hasAttribute('inert') ?? false,
      footerInert: footer?.hasAttribute('inert') ?? false,
      heroVisible: !!(hero && getComputedStyle(hero).visibility !== 'hidden' && hero.getClientRects().length),
      focusId: document.activeElement?.id || null,
      focusTag: document.activeElement?.tagName || null,
      scrollY: window.scrollY,
    }
  })
}

async function assertRecovered(page, label) {
  const beforeScroll = await page.evaluate(() => window.scrollY)
  await page.evaluate(() => window.scrollTo(0, 400))
  await page.waitForTimeout(120)
  const after = await recoveryState(page)
  const scrolled = after.scrollY > beforeScroll + 40 || after.scrollY >= 200
  if (
    !after.dialogPresent &&
    after.overflow !== 'hidden' &&
    !after.mainInert &&
    !after.headerInert &&
    !after.footerInert &&
    after.heroVisible &&
    scrolled
  ) {
    pass(`${label}_recovered`, `focus=${after.focusId || after.focusTag}`)
  } else {
    fail(`${label}_recovered`, JSON.stringify({ beforeScroll, ...after, scrolled }))
  }
  await page.evaluate(() => window.scrollTo(0, 0))
}

async function assertRingMovesToward(page, targets, label) {
  const hits = []
  for (const target of targets) {
    await page.mouse.move(target.x, target.y)
    let best = null
    for (let i = 0; i < 24; i++) {
      await page.waitForTimeout(40)
      const ring = await ringPoint(page)
      if (!ring || ring.opacity < 0.15) continue
      const dist = Math.hypot(ring.x - target.x, ring.y - target.y)
      if (!best || dist < best.dist) best = { ...ring, dist }
      if (dist <= RING_TOLERANCE_PX) {
        hits.push({ target, dist })
        break
      }
    }
    if (!hits.some((hit) => hit.target === target)) {
      fail(label, `missed (${target.x},${target.y}) best=${JSON.stringify(best)}`)
      return false
    }
  }
  const movedAcross = Math.hypot(hits[0].target.x - hits.at(-1).target.x, hits[0].target.y - hits.at(-1).target.y)
  if (movedAcross < 180) {
    fail(label, `targets too close to prove motion (${movedAcross})`)
    return false
  }
  pass(label, hits.map((h) => `${Math.round(h.dist)}px`).join(', '))
  return true
}

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch({ headless: true })

try {
  // --- Happy path + recording + themes ---
  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      colorScheme: 'dark',
      recordVideo: { dir: outDir, size: { width: 1280, height: 720 } },
    })
    const { page, capture } = await openFresh(context, 'theme=dark')
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark'
    })
    await page.mouse.move(640, 360)
    await waitForStage(page, 'forming')
    await page.screenshot({ path: path.join(outDir, '01-forming.png') })

    await waitForStage(page, 'gathering')
    const gatherVeil = await sampleVeil(page)
    if (gatherVeil.maskNone && gatherVeil.veilState === 'opaque') pass('veil_opaque_during_gather')
    else fail('veil_opaque_during_gather', JSON.stringify(gatherVeil))
    await page.screenshot({ path: path.join(outDir, '02-gather-opaque.png') })

    await page.keyboard.press('Tab')
    await page.keyboard.press('Tab')
    const focus = await page.evaluate(() => {
      const dialog = document.querySelector('[role="dialog"][aria-modal="true"]')
      return {
        inDialog: !!(dialog && dialog.contains(document.activeElement)),
        mainInert: document.getElementById('main-content')?.hasAttribute('inert') ?? false,
      }
    })
    if (focus.inDialog && focus.mainInert) pass('focus_contained')
    else fail('focus_contained', JSON.stringify(focus))

    await waitForStage(page, 'revealing', 12000)
    await page.screenshot({ path: path.join(outDir, '02b-revealing.png') })
    await waitForIntroGone(page)
    await page.screenshot({ path: path.join(outDir, '03-revealed-dark.png') })
    await assertRecovered(page, 'dark_complete')
    capture.assertClean('dark_complete')
    await context.close()
  }

  {
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      colorScheme: 'light',
    })
    await context.addInitScript(() => localStorage.setItem('theme', 'light'))
    const { page, capture } = await openFresh(context, 'theme=light')
    await page.evaluate(() => {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
      try {
        localStorage.setItem('theme', 'light')
      } catch {
        /* ignore */
      }
    })
    await page.mouse.move(640, 360)
    await waitForIntroGone(page)
    await page.screenshot({ path: path.join(outDir, '03-revealed-light.png') })
    const darkClass = await page.evaluate(() => document.documentElement.classList.contains('dark'))
    if (!darkClass) pass('light_theme_complete')
    else fail('light_theme_complete', 'html still has .dark')
    await assertRecovered(page, 'light_complete')
    capture.assertClean('light_complete')
    await context.close()
  }

  // --- Moving cursor during gathering ---
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const { page, capture } = await openFresh(context, 'move=1')
    await page.mouse.move(180, 160)
    await waitForStage(page, 'gathering')
    const ok = await assertRingMovesToward(
      page,
      [
        { x: 220, y: 180 },
        { x: 1040, y: 200 },
        { x: 240, y: 560 },
        { x: 1000, y: 540 },
      ],
      'glow_follows_distinct_targets'
    )
    if (ok) await page.screenshot({ path: path.join(outDir, '04-moving-cursor.png') })
    await waitForIntroGone(page)
    pass('intro_completes_after_motion')
    capture.assertClean('moving_cursor')
    await context.close()
  }

  // --- Skip / Escape at explicit stages ---
  for (const [stage, action] of [
    ['forming', 'Escape'],
    ['gathering', 'Skip'],
    ['revealing', 'Escape'],
    ['forming', 'Skip'],
    ['gathering', 'Escape'],
    ['revealing', 'Skip'],
  ]) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const { page, capture } = await openFresh(context, `exit=${stage}-${action}`)
    await page.mouse.move(700, 360)
    await waitForStage(page, stage)
    if (action === 'Skip') await page.click('.intro-skip')
    else await page.keyboard.press('Escape')
    await waitForIntroGone(page, 8000)
    await assertRecovered(page, `${action.toLowerCase()}_${stage}`)
    capture.assertClean(`${action.toLowerCase()}_${stage}`)
    await context.close()
  }

  // --- Desktop corners: complete intro with cursor near each corner ---
  const corners = [
    { name: 'tl', x: 48, y: 48 },
    { name: 'tr', x: 1232, y: 48 },
    { name: 'bl', x: 48, y: 672 },
    { name: 'br', x: 1232, y: 672 },
  ]
  for (const corner of corners) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const { page, capture } = await openFresh(context, `corner=${corner.name}`)
    await page.mouse.move(corner.x, corner.y)
    await waitForStage(page, 'gathering')
    // Keep the cursor near the corner through gather/reveal lock.
    for (let i = 0; i < 8; i++) {
      await page.mouse.move(corner.x + (i % 2), corner.y + (i % 3))
      const stage = await page.evaluate(() => document.querySelector('.particle-intro')?.dataset.introStage)
      if (stage === 'revealing' || !stage) break
      await page.waitForTimeout(80)
    }
    await waitForIntroGone(page)
    const hero = await page.locator('#home-hero-name').isVisible()
    if (hero) pass(`corner_${corner.name}_completes`)
    else fail(`corner_${corner.name}_completes`)
    await assertRecovered(page, `corner_${corner.name}`)
    capture.assertClean(`corner_${corner.name}`)
    await context.close()
  }

  // --- Mobile full intro without Skip ---
  {
    const mobile = await browser.newContext({
      viewport: { width: 390, height: 844 },
      hasTouch: true,
      isMobile: true,
    })
    const { page, capture } = await openFresh(mobile, 'mobile=1')
    await waitForStage(page, 'forming')
    const formingVeil = await sampleVeil(page)
    if (formingVeil.maskNone) pass('mobile_veil_starts_opaque')
    else fail('mobile_veil_starts_opaque', JSON.stringify(formingVeil))
    await page.screenshot({ path: path.join(outDir, '07-mobile-forming.png') })
    await waitForIntroGone(page, 30000)
    await page.screenshot({ path: path.join(outDir, '07-mobile-complete.png') })
    const heroVisible = await page.locator('#home-hero-name').isVisible()
    if (heroVisible) pass('mobile_auto_completes_hero')
    else fail('mobile_auto_completes_hero')
    await assertRecovered(page, 'mobile_auto')
    capture.assertClean('mobile_auto')
    await mobile.close()
  }

  // --- Reduced motion ---
  {
    const rm = await browser.newContext({
      viewport: { width: 1280, height: 720 },
      reducedMotion: 'reduce',
    })
    const { page, capture } = await openFresh(rm, 'rm=1')
    await waitForIntroGone(page, 5000)
    await page.screenshot({ path: path.join(outDir, '06-reduced-motion.png') })
    pass('reduced_motion_enters')
    await assertRecovered(page, 'reduced_motion')
    capture.assertClean('reduced_motion')
    await rm.close()
  }
} finally {
  await browser.close()
}

const failed = results.filter((item) => !item.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
console.log(`Artifacts: ${outDir}`)
if (failed.length) {
  console.error('Failed assertions:')
  for (const item of failed) console.error(`- ${item.name}: ${item.detail}`)
  process.exit(1)
}

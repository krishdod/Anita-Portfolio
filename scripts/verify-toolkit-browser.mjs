// Real Chromium checks against a built preview; no test-only hooks in application code.
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import sharp from 'sharp'
import { skillGroups } from '../src/data/career.js'

const base = process.argv[2] || 'http://127.0.0.1:4173'
const output = new URL('../tmp/toolkit-3d/', import.meta.url)
await mkdir(output, { recursive: true })
const artifact = (name) => fileURLToPath(new URL(name, output))
const results = []
const check = (name, passed, detail = '') => {
  assert(passed, `${name}: ${detail}`)
  results.push({ name, passed: true, detail }); console.log(`PASS ${name}${detail ? ' — ' + detail : ''}`)
}
const browser = await chromium.launch({ headless: true, args: ['--enable-unsafe-swiftshader'] })
const errorsFor = (page) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  return errors
}
async function instrument(context) {
  await context.addInitScript(() => {
    window.__engineDraws = 0; window.__engineContexts = []
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type, ...args) {
      const ctx = original.call(this, type, ...args)
      if (type === 'webgl2' && ctx && !window.__engineContexts.includes(ctx)) {
        window.__engineContexts.push(ctx)
        const draw = ctx.drawElements.bind(ctx)
        ctx.drawElements = (...args) => { if (this.classList.contains('toolkit-canvas')) window.__engineDraws++; return draw(...args) }
      }
      return ctx
    }
  })
}
async function enter(page) {
  await page.locator('.toolkit-workbench').waitFor({ state: 'visible' })
  await page.waitForFunction(() => !document.querySelector('.intro-skip') && !document.getElementById('main-content')?.hasAttribute('inert'))
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  // A remounted homepage is taller than the gallery. Wait for Lenis's resize observer
  // before issuing an immediate scroll, or its stale gallery limit clamps the target.
  await page.waitForFunction(() => !window.lenis || Math.abs(window.lenis.limit - (document.documentElement.scrollHeight - innerHeight)) < 4)
  await page.evaluate(() => {
    const top = document.querySelector('.toolkit-workbench').getBoundingClientRect().top + scrollY - 120
    if (window.lenis) window.lenis.scrollTo(top, { immediate: true }); else scrollTo(0, top)
  })
  await page.waitForSelector('.toolkit-machine[data-engine="ready"]', { timeout: 20000 }).catch(async (error) => {
    console.error('Engine timeout state', await page.evaluate(() => ({ phase: document.querySelector('.toolkit-machine')?.dataset.engine, scrollY, top: document.querySelector('.toolkit-machine')?.getBoundingClientRect().top, intro: !!document.querySelector('.intro-skip') })))
    throw error
  })
  await page.waitForFunction(() => window.__engineDraws > 0)
  await page.waitForTimeout(650)
}
const draws = (page) => page.evaluate(() => window.__engineDraws)
async function pixelChanges(before, after) {
  const a = await sharp(before).removeAlpha().raw().toBuffer()
  const b = await sharp(after).removeAlpha().raw().toBuffer()
  assert.equal(a.length, b.length)
  let changed = 0
  for (let i = 0; i < a.length; i += 3) if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 30) changed++
  return changed
}

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1100 }, recordVideo: { dir: artifact('recordings'), size: { width: 1440, height: 1100 } } })
  await instrument(desktop)
  const page = await desktop.newPage()
  const errors = errorsFor(page)
  await page.goto(`${base}/#home`, { waitUntil: 'networkidle' })
  await page.waitForSelector('main[data-motion="cinematic"]', { timeout: 20000 })
  check('renderer_not_loaded_above_fold', !await page.evaluate(() => performance.getEntriesByType('resource').some(({ name }) => name.includes('createToolkitEngine'))))
  await enter(page)
  check('real_webgl2_scene_renders', await page.evaluate(() => __engineContexts.length === 1 && !__engineContexts[0].isContextLost()))
  check('accessible_tab_names_include_visible_labels', await page.getByRole('tab').evaluateAll((tabs) => tabs.every((tab) => tab.getAttribute('aria-label').includes(tab.querySelector('strong').textContent))))
  const movingStart = await draws(page)
  await page.waitForTimeout(350)
  check('scene_animates_when_visible', await draws(page) > movingStart)
  await page.getByRole('button', { name: 'Pause 3D animation' }).click()
  await page.waitForTimeout(150)
  const stopped = await draws(page)
  await page.waitForTimeout(300)
  check('local_pause_stops_gpu_frames', await draws(page) === stopped)

  const canvas = page.locator('.toolkit-canvas')
  const assembled = await canvas.screenshot()
  await page.getByRole('button', { name: 'Separate 3D layers' }).click()
  const expanded = await canvas.screenshot()
  const separatedPixels = await pixelChanges(assembled, expanded)
  check('separating_layers_changes_rendered_geometry', separatedPixels > 1000, `${separatedPixels} changed pixels`)
  await page.getByRole('button', { name: 'Collapse 3D layers' }).click()
  const box = await canvas.boundingBox()
  await page.mouse.move(box.x + box.width * .5, box.y + box.height * .5)
  const beforeDrag = await canvas.screenshot()
  await page.mouse.down()
  await page.mouse.move(box.x + box.width * .76, box.y + box.height * .5, { steps: 12 })
  await page.mouse.up()
  const afterDrag = await canvas.screenshot()
  const rotatedPixels = await pixelChanges(beforeDrag, afterDrag)
  check('pointer_drag_rotates_actual_scene', rotatedPixels > 1000, `${rotatedPixels} changed pixels`)
  await page.getByRole('button', { name: 'Reset 3D view' }).click()

  // Scan raycast targets without a production debug API; a hit must change the real tab selection.
  let hit = false
  for (const [x, y] of [[.4,.4],[.36,.55],[.56,.66],[.7,.43],[.64,.32],[.42,.3]]) {
    await page.mouse.click(box.x + box.width*x, box.y + box.height*y)
    if (!(await page.getByRole('tab', { selected: true }).getAttribute('aria-label')).endsWith(skillGroups[0].title)) { hit = true; break }
  }
  check('clicking_3d_module_selects_discipline', hit)

  for (const group of skillGroups) {
    await page.getByRole('tab', { name: group.title }).click()
    const panel = page.getByRole('tabpanel')
    const skills = await panel.locator('li').allTextContents()
    check(`skills_match_resume_${group.title}`, await panel.isVisible() && JSON.stringify(skills) === JSON.stringify(group.skills))
  }
  const firstTab = page.getByRole('tab', { name: skillGroups[0].title })
  await firstTab.focus()
  await page.keyboard.press('ArrowDown')
  check('arrow_key_moves_selection_and_focus', (await page.getByRole('tab', { selected: true }).getAttribute('aria-label')).endsWith(skillGroups[1].title) && await page.getByRole('tab', { selected: true }).evaluate((el) => el === document.activeElement))
  await page.keyboard.press('End')
  check('end_selects_last_discipline', (await page.getByRole('tab', { selected: true }).getAttribute('aria-label')).endsWith(skillGroups[5].title))
  await page.keyboard.press('Home')
  await page.keyboard.press('Tab')
  check('tab_reaches_visible_panel_only', await page.getByRole('tabpanel').evaluate((el) => el === document.activeElement))
  const beforeKeyboardRotate = await canvas.screenshot()
  await page.getByRole('button', { name: 'Rotate 3D view right' }).focus()
  await page.keyboard.press('Enter')
  check('keyboard_button_rotates_actual_scene', await pixelChanges(beforeKeyboardRotate, await canvas.screenshot()) > 1000)
  await page.getByRole('button', { name: 'Rotate 3D view left' }).click()

  // Record a deliberate tour with the animated geometry, not just static selected states.
  await page.getByRole('button', { name: 'Play 3D animation' }).click()
  await page.getByRole('button', { name: 'Separate 3D layers' }).click()
  await page.waitForTimeout(1100)
  await page.getByRole('tab', { name: skillGroups[2].title }).click()
  await page.waitForTimeout(1000)
  await page.getByRole('tab', { name: skillGroups[3].title }).click()
  await page.waitForTimeout(1100)
  await page.getByRole('button', { name: 'Collapse 3D layers' }).click()
  await page.waitForTimeout(900)
  await firstTab.click()
  await page.waitForTimeout(800)
  const sectionCapture = { style: '.site-header, .skip-link, .studio-cursor, .site-shell > div.fixed[aria-hidden="true"] { visibility: hidden !important; }' }
  await page.locator('#tech-stack').screenshot({ ...sectionCapture, path: artifact('toolkit-desktop-dark.png') })

  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  await page.waitForSelector('.toolkit-machine[data-engine="ready"]')
  await page.waitForFunction(() => __engineContexts.length === 2 && __engineContexts[0].isContextLost())
  check('theme_change_disposes_previous_gpu_context', true)
  await enter(page)
  check('light_theme_scene_renders', await page.locator('html').evaluate((el) => !el.classList.contains('dark')) && !await page.evaluate(() => __engineContexts.at(-1).isContextLost()))
  await page.locator('#tech-stack').screenshot({ ...sectionCapture, path: artifact('toolkit-desktop-light.png') })

  await page.getByRole('button', { name: 'Pause animations', exact: true }).click()
  await page.waitForFunction(() => document.documentElement.classList.contains('reduce-motion'))
  await enter(page)
  const globalPaused = await draws(page)
  await page.waitForTimeout(300)
  check('global_motion_preference_stops_gpu_frames', globalPaused === await draws(page) && await page.getByRole('button', { name: 'Play 3D animation' }).isDisabled())
  await page.getByRole('button', { name: 'Separate 3D layers' }).click()
  check('reduced_motion_still_allows_layer_inspection', await page.getByRole('button', { name: 'Collapse 3D layers' }).getAttribute('aria-pressed') === 'true')
  await page.getByRole('button', { name: 'Resume animations', exact: true }).click()
  await page.evaluate(() => { if (window.lenis) window.lenis.scrollTo(0, { immediate: true }); else scrollTo(0,0) })
  await page.waitForTimeout(600)
  const offscreen = await draws(page)
  await page.waitForTimeout(350)
  check('offscreen_scene_stops_gpu_frames', offscreen === await draws(page))
  await page.goto(`${base}/all-work`, { waitUntil: 'networkidle' })
  check('gallery_route_has_no_engine', await canvas.count() === 0)
  // SPA navigation is verified separately below; goto above also proves the direct route builds.
  await page.getByRole('link', { name: 'Back to portfolio' }).click()
  await page.waitForURL('**/#portfolio')
  await enter(page)
  await page.getByRole('link', { name: 'All 12 projects' }).click()
  await page.waitForURL('**/all-work')
  await page.waitForFunction(() => __engineContexts.every((ctx) => ctx.isContextLost()))
  check('spa_unmount_disposes_gpu_resources', true)
  check('desktop_has_no_application_errors', errors.length === 0, errors.join(' | '))
  const video = page.video()
  await desktop.close()
  await video.saveAs(artifact('toolkit-walkthrough.webm'))

  for (const width of [320, 375, 768, 1024]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, isMobile: width < 768, hasTouch: width < 768, deviceScaleFactor: 3, reducedMotion: 'reduce' })
    await instrument(context)
    const page = await context.newPage(), errors = errorsFor(page)
    await page.goto(`${base}/#tech-stack`, { waitUntil: 'networkidle' })
    await enter(page)
    check(`${width}_no_horizontal_overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    check(`${width}_pixel_ratio_is_capped`, await canvasRatio(page) <= (width < 600 ? 1.26 : 1.71))
    await page.getByRole('tab', { name: skillGroups[2].title }).click()
    check(`${width}_module_selection_works`, (await page.getByRole('tabpanel').innerText()).includes('Node.js'))
    check(`${width}_touch_controls_have_44px_targets`, await page.locator('.toolkit-controls button, .toolkit-discipline').evaluateAll((els) => els.every((el) => { const r=el.getBoundingClientRect(); return r.width >= 44 && r.height >= 44 })))
    if (width === 375) {
      await enter(page)
      const position = await page.locator('.toolkit-canvas').boundingBox()
      const session = await context.newCDPSession(page)
      const y = position.y + position.height * .7, x = position.x + position.width * .5
      const scrollBefore = await page.evaluate(() => scrollY)
      await session.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x, y }] })
      for (let step = 1; step <= 6; step++) await session.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x, y: y-step*30 }] })
      await session.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] })
      await page.waitForTimeout(400)
      check('touch_swipe_over_canvas_preserves_page_scroll', await page.evaluate(() => scrollY) > scrollBefore + 50)
      await page.locator('#tech-stack').screenshot({ ...sectionCapture, path: artifact('toolkit-mobile.png') })
    }
    check(`${width}_no_application_errors`, errors.length === 0, errors.join(' | '))
    await context.close()
  }

  const fallback = await browser.newContext({ reducedMotion: 'reduce' })
  await fallback.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext
    HTMLCanvasElement.prototype.getContext = function (type, ...args) { return type === 'webgl2' ? null : original.call(this, type, ...args) }
  })
  const pageFallback = await fallback.newPage(), fallbackErrors = errorsFor(pageFallback)
  await pageFallback.goto(`${base}/#tech-stack`, { waitUntil: 'networkidle' })
  await pageFallback.locator('.toolkit-machine[data-engine="fallback"]').waitFor()
  check('no_webgl_has_visible_designed_fallback', await pageFallback.locator('.toolkit-fallback').isVisible())
  await pageFallback.getByRole('tab', { name: skillGroups[3].title }).click()
  check('no_webgl_retains_all_skills_and_controls', (await pageFallback.getByRole('tabpanel').innerText()).includes('GA4') && await pageFallback.getByRole('button', { name: 'Separate 3D layers' }).isDisabled())
  check('no_webgl_has_no_application_errors', fallbackErrors.length === 0, fallbackErrors.join(' | '))
  await fallback.close()
} finally {
  await browser.close()
  await writeFile(new URL('verification-results.json', output), JSON.stringify(results, null, 2))
}
console.log(`${results.length}/${results.length} 3D toolkit checks passed.`)

async function canvasRatio(page) { return page.locator('.toolkit-canvas').evaluate((c) => c.width/c.clientWidth) }

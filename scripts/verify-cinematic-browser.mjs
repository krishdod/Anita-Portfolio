// Production-preview checks for actual motion, controls, and reduced-motion fallbacks.
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const base = process.argv[2] || 'http://127.0.0.1:4173'
const output = new URL('../tmp/cinematic-verify/', import.meta.url)
await mkdir(output, { recursive: true })
const results = []
const browser = await chromium.launch({ headless: true })
const check = (name, value, detail = '') => {
  assert(value, `${name}: ${detail}`)
  results.push({ name, passed: true, detail })
  console.log(`PASS ${name}${detail ? ` (${detail})` : ''}`)
}
const artifact = (name) => fileURLToPath(new URL(name, output))
const captureErrors = (page) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  return errors
}
async function scrollTo(page, selector, offset = 130) {
  await page.evaluate(({ selector, offset }) => {
    const target = document.querySelector(selector).getBoundingClientRect().top + scrollY - offset
    if (window.lenis) window.lenis.scrollTo(target, { immediate: true })
    else window.scrollTo(0, target)
  }, { selector, offset })
  await page.waitForTimeout(450)
}
const transform = (page, selector) => page.locator(selector).first().evaluate((element) => getComputedStyle(element).transform)

try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, recordVideo: { dir: artifact('recordings'), size: { width: 1440, height: 1000 } } })
  const page = await context.newPage()
  const errors = captureErrors(page)
  await page.goto(`${base}/#home`, { waitUntil: 'networkidle' })
  await page.waitForSelector('main[data-motion="cinematic"]')
  await page.evaluate(() => document.fonts.ready)
  await page.waitForTimeout(1300)
  check('background_is_pitch_black', await page.locator('body').evaluate((element) => getComputedStyle(element).backgroundColor === 'rgb(0, 0, 0)'))
  check('hero_text_is_upright', await page.locator('.hero-surname').evaluate((element) => getComputedStyle(element).fontStyle === 'normal'))
  await page.screenshot({ path: artifact('pitch-black-hero.png') })

  await scrollTo(page, '.commerce-marquee', 350)
  const movingStart = await transform(page, '.commerce-marquee-track')
  await page.waitForTimeout(220)
  const movingEnd = await transform(page, '.commerce-marquee-track')
  check('specialisms_strip_actually_moves', movingStart !== movingEnd, `${movingStart} -> ${movingEnd}`)
  await page.getByRole('button', { name: 'Pause moving specialisms' }).click()
  await page.waitForFunction(() => getComputedStyle(document.querySelector('.commerce-marquee-track')).animationPlayState === 'paused')
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  const pausedStart = await transform(page, '.commerce-marquee-track')
  await page.waitForTimeout(220)
  check('local_pause_stops_strip', pausedStart === await transform(page, '.commerce-marquee-track'))
  await page.getByRole('button', { name: 'Play moving specialisms' }).click()

  await scrollTo(page, '.editorial-project-item', 350)
  const cameraStart = await transform(page, '.editorial-project .project-image img')
  await page.mouse.wheel(0, 420)
  await page.waitForTimeout(1200)
  const cameraEnd = await transform(page, '.editorial-project .project-image img')
  check('project_scroll_camera_actually_moves', cameraStart !== cameraEnd, `${cameraStart} -> ${cameraEnd}`)
  await page.waitForFunction(() => {
    const clip = getComputedStyle(document.querySelector('.editorial-project .project-image')).clipPath
    const insets = clip.split('round')[0].match(/-?[\d.]+(?=%)/g)
    return insets?.length && insets.every((value) => Math.abs(Number(value)) < .01)
  })
  check('project_image_reveal_completes', true)
  await scrollTo(page, '.editorial-project-item', 145)
  await page.waitForTimeout(1100)
  await page.screenshot({ path: artifact('cinematic-project.png') })

  await scrollTo(page, '#about', 125)
  await page.waitForFunction(() => [...document.querySelectorAll('#about .word-reveal')].every((element) => Number(getComputedStyle(element).opacity) > .99))
  check('word_reveals_finish_readably', true)
  await scrollTo(page, '.expertise-explorer', 120)
  await page.waitForTimeout(900)
  check('commerce_diagram_visible', await page.locator('.blueprint-drawing').isVisible())
  const beforeStage = await transform(page, '.blueprint-connections')
  await page.getByRole('button', { name: 'Apps & integrations' }).click()
  await page.waitForTimeout(750)
  check('diagram_layer_responds_to_selection', beforeStage !== await transform(page, '.blueprint-connections'))
  check('diagram_selection_matches_copy', await page.locator('.commerce-blueprint').getAttribute('data-blueprint-stage') === '1' && (await page.locator('#expertise-detail').innerText()).includes('Make the systems talk'))
  await page.screenshot({ path: artifact('interactive-commerce.png') })
  await page.getByRole('button', { name: 'People & delivery' }).click()
  check('third_diagram_stage_works', await page.locator('.commerce-blueprint').getAttribute('data-blueprint-stage') === '2')
  await scrollTo(page, '.outcomes-note', 180)
  await page.waitForFunction(() => [...document.querySelectorAll('.outcomes-grid .metric-value')].map((element) => element.textContent).join(',') === '15,25,20')
  check('animated_metrics_finish_at_resume_values', true)

  await page.getByRole('button', { name: 'Pause animations', exact: true }).click()
  await page.waitForFunction(() => document.documentElement.classList.contains('reduce-motion') && !document.getElementById('main-content').dataset.motion)
  check('global_pause_cleans_up_scroll_animations', true)
  check('paused_content_remains_readable', await page.locator('#home-hero-name').isVisible() && await page.locator('.commerce-marquee').getAttribute('data-static') === 'true')
  await page.getByRole('button', { name: 'Resume animations', exact: true }).click()
  await page.waitForSelector('main[data-motion="cinematic"]')
  check('global_resume_restarts_motion', true)
  await page.getByRole('link', { name: 'All 12 projects' }).click()
  await page.locator('#project-search').waitFor({ state: 'visible' })
  check('gallery_works_after_motion_cleanup', await page.locator('.project-row').count() === 12)
  check('desktop_has_no_application_errors', errors.length === 0, errors.join(' | '))
  const video = page.video()
  await context.close()
  await video.saveAs(artifact('cinematic-walkthrough.webm'))

  const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true })
  const mobilePage = await mobile.newPage()
  const mobileErrors = captureErrors(mobilePage)
  await mobilePage.goto(`${base}/#home`, { waitUntil: 'networkidle' })
  await mobilePage.waitForSelector('main[data-motion="cinematic"]')
  await mobilePage.waitForTimeout(1300)
  check('mobile_no_horizontal_overflow', await mobilePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  check('mobile_has_no_custom_cursor', await mobilePage.locator('.studio-cursor').count() === 0)
  await mobilePage.screenshot({ path: artifact('pitch-black-mobile.png') })
  await scrollTo(mobilePage, '.expertise-explorer', 110)
  await mobilePage.getByRole('button', { name: 'Apps & integrations' }).click()
  check('mobile_diagram_controls_work', await mobilePage.locator('.commerce-blueprint').getAttribute('data-blueprint-stage') === '1')
  check('mobile_still_has_no_overflow', await mobilePage.evaluate(() => document.documentElement.scrollWidth <= innerWidth))
  check('mobile_no_application_errors', mobileErrors.length === 0, mobileErrors.join(' | '))
  await mobile.close()

  const reduced = await browser.newContext({ reducedMotion: 'reduce' })
  const reducedPage = await reduced.newPage()
  await reducedPage.goto(`${base}/#home`, { waitUntil: 'networkidle' })
  check('reduced_motion_has_no_scroll_camera', !await reducedPage.locator('main').getAttribute('data-motion'))
  check('reduced_motion_strip_is_static', await reducedPage.locator('.commerce-marquee').getAttribute('data-static') === 'true')
  check('reduced_motion_has_no_hidden_words', await reducedPage.locator('.word-reveal').count() === 0)
  check('reduced_motion_metrics_are_complete', (await reducedPage.locator('.outcomes-grid .metric-value').allTextContents()).join(',') === '15,25,20')
  await reduced.close()
} finally {
  await browser.close()
  await writeFile(new URL('results.json', output), JSON.stringify(results, null, 2))
}
console.log(`${results.length}/${results.length} cinematic motion checks passed.`)

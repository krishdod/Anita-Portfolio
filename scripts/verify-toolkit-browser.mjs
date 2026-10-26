// Production-preview checks for the compact toolkit, keyboard selection, and mobile scrolling.
import assert from 'node:assert/strict'
import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'
import { skillGroups } from '../src/data/career.js'

const base = process.argv[2] || 'http://127.0.0.1:4173'
const output = new URL('../tmp/toolkit-refined/', import.meta.url)
await mkdir(output, { recursive: true })
const artifact = (name) => fileURLToPath(new URL(name, output))
const results = []
const check = (name, passed, detail = '') => {
  assert(passed, `${name}: ${detail}`)
  results.push({ name, passed: true, detail }); console.log(`PASS ${name}${detail ? ' — ' + detail : ''}`)
}
const browser = await chromium.launch({ headless: true })
const errorsFor = (page) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  return errors
}
async function enter(page) {
  await page.locator('.toolkit-workbench').waitFor({ state: 'visible' })
  await page.waitForFunction(() => !document.querySelector('.intro-skip') && !document.getElementById('main-content')?.hasAttribute('inert'))
  await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))))
  await page.waitForFunction(() => !window.lenis || Math.abs(window.lenis.limit - (document.documentElement.scrollHeight - innerHeight)) < 4)
  await page.evaluate(() => {
    const top = document.querySelector('#tech-stack').getBoundingClientRect().top + scrollY - 100
    if (window.lenis) window.lenis.scrollTo(top, { immediate: true }); else scrollTo(0, top)
  })
}

try {
  const desktop = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
  const page = await desktop.newPage(), errors = errorsFor(page)
  await page.goto(`${base}/#tech-stack`, { waitUntil: 'networkidle' })
  await enter(page)
  check('toolkit_has_no_canvas_or_3d_controls', await page.locator('#tech-stack canvas, .toolkit-controls, .toolkit-machine').count() === 0)
  check('no_3d_renderer_download', !await page.evaluate(() => performance.getEntriesByType('resource').some(({ name }) => name.includes('createToolkitEngine'))))
  check('desktop_index_is_compact', await page.locator('.toolkit-workbench').evaluate((el) => el.getBoundingClientRect().height < 500))
  check('six_accessible_disciplines', await page.getByRole('tab').count() === 6 && await page.getByRole('tab').evaluateAll((tabs) => tabs.every((tab) => tab.getAttribute('aria-label').includes(tab.querySelector('strong').textContent))))
  for (const group of skillGroups) {
    await page.getByRole('tab', { name: group.title }).click()
    await page.waitForFunction(() => {
      const panel = document.querySelector('[role="tabpanel"]:not([hidden])')
      return Number(getComputedStyle(panel).opacity) > .99
    })
    const panel = page.getByRole('tabpanel'), skills = await panel.locator('li').allTextContents()
    check(`skills_match_resume_${group.title}`, JSON.stringify(skills) === JSON.stringify(group.skills) && await page.getByRole('tabpanel').count() === 1)
  }
  await page.getByRole('tab', { name: skillGroups[0].title }).focus()
  await page.keyboard.press('ArrowDown')
  check('arrow_keys_move_selection_and_focus', (await page.getByRole('tab', { selected: true }).getAttribute('aria-label')).endsWith(skillGroups[1].title) && await page.getByRole('tab', { selected: true }).evaluate((el) => el === document.activeElement))
  await page.keyboard.press('End')
  check('end_selects_last_discipline', (await page.getByRole('tab', { selected: true }).getAttribute('aria-label')).endsWith(skillGroups[5].title))
  await page.keyboard.press('Home')
  await page.keyboard.press('ArrowUp')
  check('arrow_up_wraps_to_last_discipline', (await page.getByRole('tab', { selected: true }).getAttribute('aria-label')).endsWith(skillGroups[5].title))
  await page.keyboard.press('Home')
  await page.keyboard.press('Tab')
  check('tab_reaches_visible_panel_only', await page.getByRole('tabpanel').evaluate((el) => el === document.activeElement))
  await page.getByRole('tab', { name: skillGroups[0].title }).focus()
  for (let i = 0; i < 8; i++) await page.keyboard.press('ArrowDown')
  await page.waitForFunction(() => Number(getComputedStyle(document.querySelector('[role="tabpanel"]:not([hidden])')).opacity) > .99)
  check('rapid_switching_settles_on_requested_content', (await page.getByRole('tabpanel').innerText()).includes('Node.js') && await page.getByRole('tabpanel').count() === 1)
  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  check('theme_switch_preserves_selection', (await page.getByRole('tabpanel').innerText()).includes('Node.js') && await page.locator('html').evaluate((el) => !el.classList.contains('dark')))
  await page.getByRole('link', { name: 'All 12 projects' }).click()
  await page.waitForURL('**/all-work')
  await page.locator('.project-row').first().waitFor({ state: 'visible' })
  check('gallery_navigation_works', await page.locator('.project-row').count() === 12 && await page.getByRole('tab').count() === 0)
  await page.getByRole('link', { name: 'Back to portfolio' }).click()
  await page.waitForURL('**/#portfolio')
  await enter(page)
  check('return_navigation_restores_working_index', await page.getByRole('tab').count() === 6 && await page.getByRole('tabpanel').isVisible())
  check('desktop_has_no_application_errors', errors.length === 0, errors.join(' | '))
  await desktop.close()

  for (const theme of ['dark', 'light']) for (const width of [320, 375, 768, 1024, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 1000 }, isMobile: width < 768, hasTouch: width < 768, reducedMotion: 'reduce' })
    await context.addInitScript((theme) => localStorage.setItem('theme', theme), theme)
    const page = await context.newPage(), errors = errorsFor(page), label = `${theme}_${width}`
    await page.goto(`${base}/#tech-stack`, { waitUntil: 'networkidle' })
    await enter(page)
    check(`${label}_no_horizontal_overflow`, await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1))
    check(`${label}_visible_44px_targets`, await page.getByRole('tab').evaluateAll((tabs) => tabs.every((tab) => { const r = tab.getBoundingClientRect(); return r.width >= 44 && r.height >= 44 })))
    await page.getByRole('tab', { name: skillGroups[3].title }).click()
    check(`${label}_selection_works_without_motion`, (await page.getByRole('tabpanel').innerText()).includes('GA4') && await page.getByRole('tabpanel').evaluate((el) => getComputedStyle(el).animationName === 'none' && Number(getComputedStyle(el).opacity) === 1))
    const scrollBefore = await page.evaluate(() => scrollY)
    await page.mouse.wheel(0, 250)
    await page.waitForFunction((before) => scrollY > before + 100, scrollBefore)
    check(`${label}_page_scroll_works`, true)
    if (width === 375 || width === 1440) {
      await page.getByRole('tab', { name: skillGroups[0].title }).click()
      await page.locator('#tech-stack').screenshot({ path: artifact(`${label}.png`), style: '.site-header, .skip-link, .studio-cursor, .site-shell > div.fixed[aria-hidden="true"] { visibility: hidden !important; }' })
    }
    check(`${label}_no_application_errors`, errors.length === 0, errors.join(' | '))
    await context.close()
  }
} finally {
  await browser.close()
  await writeFile(new URL('verification-results.json', output), JSON.stringify(results, null, 2))
}
console.log(`${results.length}/${results.length} compact toolkit checks passed.`)

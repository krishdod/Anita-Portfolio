// Run with: node scripts/verify-resume-refresh.mjs http://127.0.0.1:4173
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { chromium } from 'playwright'
import { profile } from '../src/data/profile.js'

const base = process.argv[2] || 'http://127.0.0.1:4173'
const output = new URL('../tmp/resume-refresh/', import.meta.url)
await mkdir(output, { recursive: true })
const results = []
const browser = await chromium.launch({ headless: true })
const check = (label, condition, detail = '') => {
  assert(condition, `${label}: ${detail}`)
  results.push({ label, passed: true, detail })
  console.log(`PASS ${label}${detail ? ` (${detail})` : ''}`)
}

try {
  const firstVisit = await browser.newContext({ colorScheme: 'light', reducedMotion: 'reduce' })
  const firstPage = await firstVisit.newPage()
  await firstPage.goto(`${base}/#home`, { waitUntil: 'networkidle' })
  check('first_visit_uses_charcoal', await firstPage.locator('html').evaluate((element) => element.classList.contains('dark')))
  await firstVisit.close()
  for (const theme of ['light', 'dark']) {
    for (const width of [320, 375, 768, 1024, 1440]) {
      const context = await browser.newContext({
        viewport: { width, height: width < 768 ? 900 : 1080 },
        colorScheme: theme,
        reducedMotion: 'reduce',
        isMobile: width < 768,
        hasTouch: width < 768,
      })
      await context.addInitScript((theme) => localStorage.setItem('theme', theme), theme)
      const page = await context.newPage()
      const appErrors = []
      page.on('pageerror', (error) => appErrors.push(error.message))
      page.on('console', (message) => { if (message.type() === 'error') appErrors.push(message.text()) })
      const label = `${theme}_${width}`
      await page.goto(`${base}/#home`, { waitUntil: 'networkidle' })
      await page.evaluate(() => document.fonts.ready)
      check(`${label}_hero`, await page.locator('#home-hero-name').isVisible())
      check(`${label}_role`, (await page.locator('.studio-introduction').textContent()).includes(profile.role))
      check(`${label}_current_employer`, (await page.locator('.hero-current-role').innerText()).includes('Programming Team Lead at Zerb'))
      const overflow = await page.evaluate(() => ({ viewport: innerWidth, scroll: document.documentElement.scrollWidth }))
      check(`${label}_no_horizontal_overflow`, overflow.scroll <= overflow.viewport + 1, JSON.stringify(overflow))
      const nameFits = await page.locator('#home-hero-name').evaluate((element) => {
        const rects = [...element.querySelectorAll('.hero-first-name, .hero-surname')].map((span) => span.getBoundingClientRect())
        return rects.every((rect) => rect.left >= 0 && rect.right <= innerWidth + 1)
      })
      check(`${label}_name_unclipped`, nameFits)
      const previewFits = await page.locator('.studio-project-portal').evaluate((element) => {
        const rect = element.getBoundingClientRect()
        return rect.left >= 0 && rect.right <= innerWidth + 1
      })
      check(`${label}_storefront_unclipped`, previewFits)
      const upright = await page.locator('.hero-surname, .editorial-em, .studio-manifesto em, .footer-signature').evaluateAll((elements) => elements.every((element) => getComputedStyle(element).fontStyle === 'normal'))
      check(`${label}_upright_typography`, upright)

      // Measure actual browser-resolved theme colors, including text and button foreground.
      const contrast = await page.evaluate(() => {
        const rgb = (color) => color.match(/[\d.]+/g).slice(0, 3).map(Number)
        const luminance = (color) => rgb(color).map((v) => { const s = v / 255; return s <= .04045 ? s / 12.92 : ((s + .055) / 1.055) ** 2.4 }).reduce((sum, n, i) => sum + n * [.2126, .7152, .0722][i], 0)
        const ratio = (a, b) => { const x = luminance(a), y = luminance(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05) }
        const background = getComputedStyle(document.body).backgroundColor
        const primary = getComputedStyle(document.querySelector('.button-primary'))
        const description = getComputedStyle(document.querySelector('.hero-description'))
        const heading = getComputedStyle(document.querySelector('.hero-name-color'))
        return { body: ratio(getComputedStyle(document.body).color, background), muted: ratio(description.color, background), name: ratio(heading.color, background), button: ratio(primary.color, primary.backgroundColor) }
      })
      check(`${label}_text_contrast`, contrast.body >= 4.5 && contrast.muted >= 4.5 && contrast.button >= 4.5 && contrast.name >= 3, JSON.stringify(contrast))
      const themesMatch = await page.evaluate(() => document.documentElement.classList.contains('dark'))
      check(`${label}_theme`, themesMatch === (theme === 'dark'))

      // Verify all career entries and the updated dates, without relying on accordion visibility.
      const career = await page.locator('#work').innerText()
      check(`${label}_six_roles`, await page.locator('.career-chapter').count() === 6)
      check(`${label}_employment_dates`, career.includes('Sep 2026 – Present') && career.includes('May 2025 – Sep 2026'))
      check(`${label}_education`, career.includes('Computer Science and Tech') && career.includes('Computer Engineering') && career.includes('2023') && career.includes('2020'))
      check(`${label}_expanded_skills`, (await page.locator('#tech-stack').innerText()).includes('Node.js') && (await page.locator('#tech-stack').innerText()).includes('GA4'))

      if (width === 1440 || (width === 375 && theme === 'light')) {
        await page.screenshot({ path: new URL(`${label}-hero.png`, output).pathname.replace(/^\/([A-Z]:)/, '$1') })
        await page.screenshot({ path: new URL(`${label}-page.png`, output).pathname.replace(/^\/([A-Z]:)/, '$1'), fullPage: true })
      }
      check(`${label}_no_browser_errors`, appErrors.length === 0, appErrors.join(' | '))
      await context.close()
    }
  }

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' })
  await context.addInitScript(() => { if (!localStorage.getItem('theme')) localStorage.setItem('theme', 'light') })
  const page = await context.newPage()
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  page.on('console', (message) => { if (message.type() === 'error') errors.push(message.text()) })
  await page.goto(`${base}/#home`, { waitUntil: 'networkidle' })
  const resumeLinks = await page.locator('a[download]').evaluateAll((links) => links.map((link) => link.getAttribute('href')))
  check('resume_links_consistent', resumeLinks.length >= 4 && resumeLinks.every((href) => href === profile.resume))
  const response = await page.request.get(base + profile.resume)
  const downloaded = await response.body()
  const expected = await readFile(new URL('../public' + profile.resume, import.meta.url))
  check('new_resume_downloads_unchanged', response.ok() && createHash('sha256').update(downloaded).digest('hex') === createHash('sha256').update(expected).digest('hex'))
  const metadata = await page.locator('script[type="application/ld+json"]').textContent()
  check('current_employer_metadata', JSON.parse(metadata).worksFor[0].name === 'Zerb')

  await page.getByRole('button', { name: 'Switch to dark theme' }).click()
  check('theme_toggle_dark', await page.locator('html').evaluate((el) => el.classList.contains('dark')))
  await page.reload({ waitUntil: 'networkidle' })
  check('theme_persists_after_reload', await page.locator('html').evaluate((el) => el.classList.contains('dark')))
  await page.getByRole('button', { name: 'Switch to light theme' }).click()
  await page.getByRole('button', { name: 'Apps & integrations' }).click()
  check('expertise_switch_works', (await page.locator('#expertise-detail').innerText()).includes('Make the systems talk to each other.'))
  await page.locator('.career-chapter').nth(1).locator('summary').click()
  check('career_accordion_works', await page.locator('.career-chapter').nth(1).getAttribute('open') !== null)
  await page.getByRole('link', { name: 'All 12 projects' }).click()
  await page.waitForURL('**/all-work')
  await page.locator('#project-search').fill('Sabyasachi')
  check('project_search_works', await page.locator('.project-row').count() === 1 && (await page.locator('.project-row').innerText()).includes('Sabyasachi'))
  await page.getByRole('button', { name: 'Clear search' }).click()
  await page.waitForFunction(() => document.getElementById('project-search').value === '')
  await page.getByRole('button', { name: 'Footwear', exact: true }).click()
  await page.waitForFunction(() => document.querySelectorAll('.project-row').length === 3)
  check('project_industry_filter_works', await page.locator('.project-row').count() === 3)
  await page.reload({ waitUntil: 'networkidle' })
  check('gallery_direct_refresh', await page.locator('.project-row').count() === 3 && await page.locator('h1').isVisible())
  await page.getByRole('link', { name: 'Back to portfolio' }).click()
  await page.waitForURL('**/#portfolio')
  await page.locator('#portfolio').waitFor({ state: 'visible' })
  check('gallery_back_to_home', await page.locator('#portfolio').isVisible() && await page.locator('.intro-skip').count() === 0)
  await page.getByRole('link', { name: 'Skills', exact: true }).click()
  await page.waitForURL('**/#tech-stack')
  await page.waitForFunction(() => document.getElementById('tech-stack').getBoundingClientRect().top < innerHeight / 2)
  check('homepage_anchor_scrolls', await page.locator('#tech-stack').evaluate((el) => el.getBoundingClientRect().top < innerHeight / 2))
  check('interactions_no_browser_errors', errors.length === 0, errors.join(' | '))
  await context.close()

  const mobile = await browser.newContext({ viewport: { width: 375, height: 812 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' })
  const mobilePage = await mobile.newPage()
  await mobilePage.goto(`${base}/#home`, { waitUntil: 'networkidle' })
  await mobilePage.getByRole('button', { name: 'Open navigation' }).click()
  check('mobile_navigation_opens', await mobilePage.locator('#mobile-navigation').isVisible())
  await mobilePage.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: 'Experience' }).click()
  await mobilePage.waitForURL('**/#work')
  await mobilePage.locator('#mobile-navigation').waitFor({ state: 'hidden' })
  await mobilePage.waitForFunction(() => document.getElementById('work').getBoundingClientRect().top < innerHeight / 2)
  check('mobile_navigation_closes_and_scrolls', !await mobilePage.locator('#mobile-navigation').isVisible() && await mobilePage.locator('#work').evaluate((el) => el.getBoundingClientRect().top < innerHeight / 2))
  await mobile.close()
} finally {
  await browser.close()
  await writeFile(new URL('verification-results.json', output), JSON.stringify(results, null, 2))
}
console.log(`${results.length}/${results.length} résumé, theme, responsive layout, contrast, and interaction checks passed.`)

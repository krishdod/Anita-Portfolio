/**
 * Smoke verification for the production build.
 * Usage: node scripts/verify-release-smoke.mjs [baseUrl]
 */
import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = fileURLToPath(new URL('../', import.meta.url))
const outDir = path.join(root, 'tmp', 'release-smoke')
const baseUrl = (process.argv[2] || 'http://127.0.0.1:4173').replace(/\/$/, '')
const results = []

function pass(name, detail = '') {
  results.push({ ok: true, name, detail })
  console.log(`PASS  ${name}${detail ? ` — ${detail}` : ''}`)
}
function fail(name, detail = '') {
  results.push({ ok: false, name, detail })
  console.error(`FAIL  ${name}${detail ? ` — ${detail}` : ''}`)
}

await mkdir(outDir, { recursive: true })
const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
const errors = []
page.on('pageerror', (error) => errors.push(error.message))
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})

try {
  await page.goto(`${baseUrl}/?smoke=${Date.now()}`, { waitUntil: 'networkidle' })
  await page.waitForSelector('.intro-skip, #home-hero-name', { timeout: 20000 })

  if (await page.locator('.intro-skip').count()) {
    await page.click('.intro-skip')
    await page.waitForFunction(() => !document.querySelector('[role="dialog"][aria-modal="true"]'), null, {
      timeout: 8000,
    })
  }

  if (await page.locator('#home-hero-name').isVisible()) pass('hero_visible')
  else fail('hero_visible')

  for (const id of ['portfolio', 'about', 'work', 'tech-stack', 'contact']) {
    if (await page.locator(`#${id}`).count()) pass(`section_${id}_present`)
    else fail(`section_${id}_present`)
  }

  await page.locator('#tech-stack').scrollIntoViewIfNeeded()
  await page.waitForTimeout(400)
  const toolkit = await page.evaluate(() => ({
    hasWorkbench: !!document.querySelector('#tech-stack .toolkit-workbench'),
    tabCount: document.querySelectorAll('#tech-stack [role="tab"]').length,
  }))
  await page.screenshot({ path: path.join(outDir, 'tech-stack-committed.png') })

  if (toolkit.hasWorkbench && toolkit.tabCount === 6) pass('toolkit_six_disciplines', JSON.stringify(toolkit))
  else fail('toolkit_six_disciplines', JSON.stringify(toolkit))
  await page.getByRole('tab', { name: 'Backend & integrations' }).click()
  if ((await page.getByRole('tabpanel').innerText()).includes('Node.js')) pass('toolkit_selection_shows_resume_skills')
  else fail('toolkit_selection_shows_resume_skills')

  await page.goto(`${baseUrl}/all-work?smoke=${Date.now()}`, { waitUntil: 'networkidle' })
  if (await page.locator('#main-content').isVisible()) pass('all_work_loads')
  else fail('all_work_loads')

  await page.goto(`${baseUrl}/?resume=${Date.now()}`, { waitUntil: 'networkidle' })
  if (await page.locator('.intro-skip').count()) await page.click('.intro-skip')
  const resumeHref = await page.locator('a[download]').first().getAttribute('href')
  if (resumeHref === '/Anita_Dantani_Resume_2026.pdf') pass('resume_href_current')
  else fail('resume_href_current', String(resumeHref))
  const resumeOk = await page.request.get(`${baseUrl}${resumeHref}`)
  if (resumeOk.ok()) pass('resume_downloadable')
  else fail('resume_downloadable', String(resumeOk.status()))

  await page.evaluate(() => window.scrollTo(0, 600))
  await page.waitForTimeout(200)
  const scrollY = await page.evaluate(() => window.scrollY)
  if (scrollY > 100) pass('scrolling_works')
  else fail('scrolling_works', String(scrollY))

  const filtered = errors.filter(
    (line) => !line.includes('favicon') && !line.includes('Download the React DevTools') && !line.includes('net::ERR_')
  )
  if (filtered.length) fail('no_app_errors', filtered.slice(0, 5).join(' | '))
  else pass('no_app_errors')
} finally {
  await browser.close()
}

const failed = results.filter((item) => !item.ok)
console.log(`\n${results.length - failed.length}/${results.length} checks passed`)
console.log(`Artifacts: ${outDir}`)
if (failed.length) {
  console.error('Failed:')
  for (const item of failed) console.error(`- ${item.name}: ${item.detail}`)
  process.exit(1)
}

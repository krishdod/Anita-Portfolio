import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import sharp from 'sharp'
import { projects, projectIndustries, getProjectImage, getProjectSrcSet } from '../src/data/projects.js'
import { profile, navigation } from '../src/data/profile.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const asset = (url) => path.join(root, 'public', url.replace(/^\//, ''))
assert.equal(new Set(projects.map(({ id }) => id)).size, projects.length, 'Duplicate project IDs')
assert.equal(new Set(projects.map(({ slug }) => slug)).size, projects.length, 'Duplicate project slugs')
assert.equal(new Set(navigation.map(({ id }) => id)).size, navigation.length, 'Duplicate navigation targets')
let bytes = 0
for (const project of projects) {
  assert.match(project.slug, /^[a-z0-9-]+$/)
  assert.equal(new URL(project.link).protocol, 'https:')
  assert(projectIndustries.includes(project.industry), 'Missing industry: ' + project.title)
  assert(project.title && project.description && project.tags.length, 'Incomplete project: ' + project.slug)
  for (const width of [640, 960, 1440]) {
    const url = getProjectImage(project, width)
    const metadata = await sharp(asset(url)).metadata()
    assert.equal(metadata.format, 'webp', url)
    assert.equal(metadata.width, width, 'Incorrect responsive width: ' + url)
    assert(getProjectSrcSet(project).includes(url + ' ' + width + 'w'))
    bytes += (await stat(asset(url))).size
  }
}
const resume = await readFile(asset(profile.resume))
assert.equal(resume.subarray(0, 5).toString(), '%PDF-', 'Invalid résumé PDF')
const og = await sharp(asset('/og-image.jpg')).metadata()
assert.equal(og.width, 1200)
assert.equal(og.height, 630)
assert.match(await readFile(asset('/favicon.svg'), 'utf8'), /<svg/)
const html = await readFile(path.join(root, 'index.html'), 'utf8')
assert(html.includes('href="' + profile.resume + '"'), 'The no-JavaScript résumé link differs from the shared profile')
const structuredData = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)
assert(structuredData, 'Missing person metadata')
assert.equal(JSON.parse(structuredData[1]).name, profile.name)
assert(html.includes(profile.siteUrl + '/og-image.jpg'), 'Social domain differs from profile')
assert((await readFile(asset('/sitemap.xml'), 'utf8')).includes(profile.siteUrl + '/all-work'))
console.log('Passed: ' + projects.length + ' projects, ' + projects.length * 3 + ' responsive images, résumé, favicon, and social metadata.')
console.log('All WebP variants combined: ' + (bytes / 1024 / 1024).toFixed(2) + ' MiB.')

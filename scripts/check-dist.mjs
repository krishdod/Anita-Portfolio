import assert from 'node:assert/strict'
import { readFile, readdir, stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { releaseAssets } from './release-assets.mjs'
import { profile } from '../src/data/profile.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const dist = path.join(root, 'dist')
const html = await readFile(path.join(dist, 'index.html'), 'utf8')
assert(!html.includes('/src/main.jsx'), 'Unbuilt entry point in production HTML')
assert(html.includes(profile.siteUrl + '/og-image.jpg'), 'Incorrect production sharing URL')
assert(!html.includes('https://anitadantani.com'), 'Old custom domain remains in the build')
assert(!html.includes('localhost:') && !html.includes('127.0.0.1:'), 'Local URL in production HTML')
for (const asset of releaseAssets) {
  const built = await readFile(path.join(dist, asset))
  const original = await readFile(path.join(root, 'public', asset))
  assert(built.equals(original), 'Changed or missing public asset: ' + asset)
}
const bundled = [...html.matchAll(/(?:src|href)="(\/assets\/[^"?#]+)"/g)].map((match) => match[1].slice(1))
assert(bundled.some((file) => file.endsWith('.js')), 'Missing JavaScript bundle')
assert(bundled.some((file) => file.endsWith('.css')), 'Missing CSS bundle')
for (const asset of bundled) assert((await stat(path.join(dist, asset))).size > 0, 'Empty bundle: ' + asset)
const files = await readdir(dist, { recursive: true })
let total = 0
for (const file of files) {
  const info = await stat(path.join(dist, file))
  if (!info.isFile()) continue
  const normalized = file.replaceAll('\\', '/')
  assert(normalized === 'index.html' || normalized === 'all-work.html' || releaseAssets.includes(normalized) || /^assets\/[^/]+\.(js|css)$/.test(normalized), 'Unexpected published file: ' + normalized)
  total += info.size
}
assert(total < 5 * 1024 * 1024, 'Deployment grew beyond the 5 MiB asset budget')
const config = JSON.parse(await readFile(path.join(root, 'vercel.json'), 'utf8'))
assert.equal(config.outputDirectory, 'dist')
assert(config.rewrites.some(({ source, destination }) => source === '/all-work' && destination === '/all-work.html'), 'Missing gallery rewrite')
assert(config.rewrites.every(({ source }) => !source.includes('(.*)')), 'Catch-all rewrite would mask missing assets')
assert(config.headers.some(({ source }) => source.includes('projects/optimized')), 'Missing project image cache rules')
assert(config.headers.some(({ source }) => source.includes('.pdf')), 'Missing résumé cache rules')
const gallery = await readFile(path.join(dist, 'all-work.html'), 'utf8')
assert(gallery.includes('Selected Work — Anita Dantani'), 'Gallery HTML is missing its title')
assert(gallery.includes(profile.siteUrl + '/all-work'), 'Gallery HTML is missing its canonical URL')
assert(!gallery.includes('/src/main.jsx'), 'Unbuilt entry point in gallery HTML')
const notFound = await readFile(path.join(dist, '404.html'), 'utf8')
assert(notFound.includes('noindex, follow'), '404 page must not be indexed')
console.log('Production output passed: ' + (total / 1024 / 1024).toFixed(2) + ' MiB; only approved assets, with gallery routing and a noindex 404 page.')

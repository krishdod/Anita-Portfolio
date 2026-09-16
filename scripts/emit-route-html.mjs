import assert from 'node:assert/strict'
import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { profile } from '../src/data/profile.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const distHtml = path.join(root, 'dist', 'index.html')
const html = await readFile(distHtml, 'utf8')

const title = 'Selected Work — Anita Dantani'
const description =
  'Explore Anita Dantani’s Shopify portfolio across luxury fashion, jewelry, footwear, and global commerce.'
const url = profile.siteUrl + '/all-work'

const replaceMeta = (source, attr, value) => {
  const pattern = new RegExp(`(<meta[^>]*${attr}[^>]*content=")([^"]*)(")`, 'i')
  assert(pattern.test(source), 'Missing meta for ' + attr)
  return source.replace(pattern, `$1${value}$3`)
}

let page = html
page = page.replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
page = replaceMeta(page, 'name="description"', description)
page = replaceMeta(page, 'property="og:title"', title)
page = replaceMeta(page, 'property="og:description"', description)
page = replaceMeta(page, 'property="og:url"', url)
page = replaceMeta(page, 'name="twitter:title"', title)
page = replaceMeta(page, 'name="twitter:description"', description)
page = replaceMeta(page, 'name="twitter:url"', url)
page = page.replace(
  /(<link rel="canonical" href=")[^"]*(")/,
  `$1${url}$2`
)

await writeFile(path.join(root, 'dist', 'all-work.html'), page)
console.log('Emitted dist/all-work.html with gallery link-preview metadata.')

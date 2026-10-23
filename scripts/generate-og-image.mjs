import sharp from 'sharp'
import { profile } from '../src/data/profile.js'

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#000000"/>
  <path d="M64 75H1136M64 515H1136" stroke="#484b4e"/>
  <text x="64" y="55" fill="#ea9553" font-family="monospace" font-size="15" letter-spacing="3">SHOPIFY DEVELOPMENT &amp; TECHNICAL LEADERSHIP</text>
  <text x="62" y="235" fill="#f1f0ef" font-family="Arial,sans-serif" font-size="110" font-weight="700" letter-spacing="-6">Anita Dantani<tspan fill="#ea9553">.</tspan></text>
  <text x="68" y="325" fill="#f1f0ef" font-family="Arial,sans-serif" font-size="44" font-weight="600" letter-spacing="-2">The storefront.</text>
  <text x="68" y="382" fill="#ea9553" font-family="Arial,sans-serif" font-size="44" font-weight="600" letter-spacing="-2">The systems behind it.</text>
  <text x="68" y="460" fill="#a9adb1" font-family="Arial,sans-serif" font-size="23">7+ years of experience · DTC &amp; B2B commerce</text>
  <text x="68" y="555" fill="#f1f0ef" font-family="Arial,sans-serif" font-size="21">${profile.role}</text>
  <text x="68" y="589" fill="#a9adb1" font-family="Arial,sans-serif" font-size="18">${profile.currentRole} at ${profile.currentCompany}</text>
  <text x="1132" y="581" text-anchor="end" fill="#ea9553" font-family="Arial,sans-serif" font-size="16">${new URL(profile.siteUrl).host}</text>
</svg>`

await sharp(Buffer.from(svg)).jpeg({ quality: 88, mozjpeg: true }).toFile('public/og-image.jpg')
console.log('Generated public/og-image.jpg')

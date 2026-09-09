import sharp from 'sharp'

const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0a0a0f"/>
      <stop offset="100%" stop-color="#12121a"/>
    </linearGradient>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="50%" stop-color="#8b5cf6"/>
      <stop offset="100%" stop-color="#ec4899"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="72" y="72" width="8" height="180" rx="4" fill="url(#g)"/>
  <text x="110" y="130" fill="#a1a1aa" font-family="system-ui,sans-serif" font-size="28" letter-spacing="6">SHOPIFY PLUS DEVELOPER</text>
  <text x="110" y="240" fill="#ffffff" font-family="system-ui,sans-serif" font-size="84" font-weight="700">Anita Dantani</text>
  <text x="110" y="320" fill="#d4d4d8" font-family="system-ui,sans-serif" font-size="36">Senior Shopify Plus Developer</text>
  <text x="110" y="380" fill="#a1a1aa" font-family="system-ui,sans-serif" font-size="28">&amp; E-commerce Technical Lead</text>
  <text x="110" y="500" fill="#71717a" font-family="system-ui,sans-serif" font-size="24">6+ years · 60+ projects · Checkout Extensibility</text>
  <text x="110" y="560" fill="url(#g)" font-family="system-ui,sans-serif" font-size="22" font-weight="600">anitadantani.com</text>
</svg>
`

await sharp(Buffer.from(svg))
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile('public/og-image.jpg')

console.log('Generated public/og-image.jpg')

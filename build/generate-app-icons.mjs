import sharp from 'sharp'
import { resolve } from 'node:path'

const root = process.cwd()
const iconDirectory = resolve(root, 'assets', 'icons')

const iconSvg = Buffer.from(`
<svg width="1024" height="1024" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="background" x1="150" y1="80" x2="860" y2="930" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF8276"/>
      <stop offset="0.55" stop-color="#F06457"/>
      <stop offset="1" stop-color="#D9473D"/>
    </linearGradient>
    <radialGradient id="highlight" cx="0" cy="0" r="1" gradientTransform="translate(310 210) rotate(50) scale(600)">
      <stop stop-color="#FFFFFF" stop-opacity="0.28"/>
      <stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1024" height="1024" fill="url(#background)"/>
  <rect width="1024" height="1024" fill="url(#highlight)"/>
  <circle cx="512" cy="522" r="326" fill="#FFFFFF" fill-opacity="0.09"/>
  <text
    x="512"
    y="676"
    text-anchor="middle"
    fill="#FFFFFF"
    font-family="Yu Mincho, Noto Serif JP, serif"
    font-size="470"
    font-weight="700"
  >歩</text>
</svg>`)

const outputs = [
  ['app-icon-1024.png', 1024],
  ['android-chrome-512x512.png', 512],
  ['android-chrome-384x384.png', 384],
  ['android-chrome-192x192.png', 192],
  ['apple-touch-icon.png', 180],
  ['mstile-150x150.png', 150],
  ['favicon-32x32.png', 32],
  ['favicon-16x16.png', 16],
]

await Promise.all(outputs.map(([name, size]) =>
  sharp(iconSvg).resize(size, size).png({ compressionLevel: 9 }).toFile(resolve(iconDirectory, name)),
))

const maskableSvg = Buffer.from(`
<svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="background" x1="70" y1="30" x2="440" y2="480" gradientUnits="userSpaceOnUse">
      <stop stop-color="#FF8276"/>
      <stop offset="0.55" stop-color="#F06457"/>
      <stop offset="1" stop-color="#D9473D"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" fill="url(#background)"/>
  <circle cx="256" cy="260" r="160" fill="#FFFFFF" fill-opacity="0.09"/>
  <text
    x="256"
    y="335"
    text-anchor="middle"
    fill="#FFFFFF"
    font-family="Yu Mincho, Noto Serif JP, serif"
    font-size="235"
    font-weight="700"
  >歩</text>
</svg>`)

await sharp(maskableSvg)
  .png({ compressionLevel: 9 })
  .toFile(resolve(iconDirectory, 'maskable-512x512.png'))

console.log(`Generated ${outputs.length + 1} app icons in ${iconDirectory}`)

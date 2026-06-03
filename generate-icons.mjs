// node generate-icons.mjs — generates PWA icons with dumbbell via sharp
import sharp from 'sharp'
import { mkdirSync } from 'fs'

mkdirSync('public/icons', { recursive: true })

function makeSvg(size) {
  const pad = size * 0.18
  const scale = (size - pad * 2) / 24
  const strokeW = size * 0.065

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1a3a8f"/>
      <stop offset="100%" stop-color="#2979ff"/>
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.22}" ry="${size * 0.22}" fill="url(#bg)"/>
  <g transform="translate(${pad}, ${pad}) scale(${scale})"
     fill="none" stroke="white" stroke-width="${strokeW / scale}"
     stroke-linecap="round" stroke-linejoin="round">
    <path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/>
    <path d="m2.5 21.5 1.4-1.4"/>
    <path d="m20.1 3.9 1.4-1.4"/>
    <path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/>
    <path d="m9.6 14.4 4.8-4.8"/>
  </g>
</svg>`
}

for (const size of [192, 512]) {
  await sharp(Buffer.from(makeSvg(size))).png().toFile(`public/icons/icon-${size}.png`)
  console.log(`✓ icon-${size}.png`)
}

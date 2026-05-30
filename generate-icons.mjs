// node generate-icons.mjs — no external deps
import { createWriteStream, mkdirSync } from 'fs'
import zlib from 'zlib'

function uint32BE(n) {
  const b = Buffer.alloc(4)
  b.writeUInt32BE(n)
  return b
}

function crc32(buf) {
  let crc = 0xffffffff
  const table = []
  for (let i = 0; i < 256; i++) {
    let c = i
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    table[i] = c
  }
  for (const byte of buf) crc = table[(crc ^ byte) & 0xff] ^ (crc >>> 8)
  return (crc ^ 0xffffffff) >>> 0
}

function chunk(type, data) {
  const typeBuf = Buffer.from(type)
  const crcBuf = crc32(Buffer.concat([typeBuf, data]))
  return Buffer.concat([uint32BE(data.length), typeBuf, data, uint32BE(crcBuf)])
}

function makePng(size, r, g, b) {
  const signature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  const ihdr = Buffer.concat([
    uint32BE(size), uint32BE(size),
    Buffer.from([8, 2, 0, 0, 0]) // bit depth 8, RGB, deflate, no filter, no interlace
  ])

  // Build raw scanlines with filter byte 0 (None) per row
  const raw = Buffer.alloc(size * (1 + size * 3))
  for (let y = 0; y < size; y++) {
    const offset = y * (1 + size * 3)
    raw[offset] = 0 // filter type None
    for (let x = 0; x < size; x++) {
      // Dumbbell-style gradient: orange circle on dark bg
      const cx = x - size / 2, cy = y - size / 2
      const dist = Math.sqrt(cx * cx + cy * cy)
      const radius = size * 0.35
      const inCircle = dist < radius
      const px = offset + 1 + x * 3
      if (inCircle) {
        raw[px] = 0xe8; raw[px + 1] = 0x54; raw[px + 2] = 0x2f // orange #e8542f
      } else {
        raw[px] = 0x1a; raw[px + 1] = 0x2b; raw[px + 2] = 0x4a // navy #1a2b4a
      }
    }
  }

  const compressed = zlib.deflateSync(raw)
  const idat = chunk('IDAT', compressed)
  const iend = chunk('IEND', Buffer.alloc(0))

  return Buffer.concat([signature, chunk('IHDR', ihdr), idat, iend])
}

mkdirSync('public/icons', { recursive: true })
for (const size of [192, 512]) {
  const buf = makePng(size)
  const ws = createWriteStream(`public/icons/icon-${size}.png`)
  ws.write(buf)
  ws.end()
  console.log(`Generated icon-${size}.png (${size}×${size})`)
}

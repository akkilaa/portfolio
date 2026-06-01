import sharp from 'sharp'

/** A solid-colour PNG. Vary size/colour to produce distinct (non-deduping) images. */
export function pngImage(
  opts: { width?: number; height?: number; r?: number; g?: number; b?: number } = {},
): Promise<Buffer> {
  const { width = 400, height = 300, r = 20, g = 120, b = 200 } = opts
  return sharp({ create: { width, height, channels: 3, background: { r, g, b } } })
    .png()
    .toBuffer()
}

/**
 * A 100x200 JPEG tagged with EXIF orientation 6 (display rotated 90° CW).
 * Used to prove the pipeline auto-orients (output becomes 200x100) and strips EXIF.
 */
export function jpegWithExifOrientation(): Promise<Buffer> {
  return sharp({
    create: { width: 100, height: 200, channels: 3, background: { r: 0, g: 0, b: 0 } },
  })
    .withMetadata({ orientation: 6 })
    .jpeg()
    .toBuffer()
}

/** A minimal SVG — readable by sharp but a non-raster format we deliberately reject. */
export function svgImage(): Buffer {
  return Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32"/></svg>',
  )
}

/** Bytes that are not an image at all. */
export const notAnImage = Buffer.from('this is definitely not an image')

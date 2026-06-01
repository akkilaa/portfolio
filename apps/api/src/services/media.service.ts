import { createHash } from 'node:crypto'
import sharp from 'sharp'
import { BadRequestError } from '@portfolio/shared'
import type { MediaAsset } from '@portfolio/shared'
import type { IStorageService } from '@api/ports/storage.port'
import type { IMediaRepository } from '@api/ports/media.repository'

const ACCEPTED_INPUT_FORMATS = new Set(['jpeg', 'png', 'webp', 'avif', 'gif', 'tiff'])
const MAX_DIMENSION = 2400 // cap stored size; next/image handles responsive downscaling
const WEBP_QUALITY = 82
const LQIP_SIZE = 20

export class MediaService {
  constructor(
    private readonly storage: IStorageService,
    private readonly media: IMediaRepository,
  ) {}

  /**
   * Normalises an uploaded image and persists it once.
   *
   * Pipeline: validate → auto-orient + strip EXIF (privacy) → clamp dimensions →
   * re-encode to WebP → content-address by sha256 (dedupe) → store bytes + row.
   * Returns an existing asset if the same bytes were uploaded before.
   */
  async upload(input: Buffer, _declaredMime: string, alt?: string): Promise<MediaAsset> {
    const { animated } = await this.readMetadata(input)
    const transformed = await this.transformToWebp(input, animated)
    const checksum = this.getChecksum(transformed.data)

    const existing = await this.media.findByChecksum(checksum)
    if (existing) return existing

    const key = this.getStorageKey(checksum)
    const { width, height } = this.getDimensions(transformed.info, animated)
    const blurDataUrl = await this.makeLqip(transformed.data)

    return this.persistNewAsset({
      key,
      data: transformed.data,
      width,
      height,
      sizeBytes: transformed.info.size,
      checksum,
      blurDataUrl,
      alt: alt ?? null,
    })
  }

  getById(id: string): Promise<MediaAsset | null> {
    return this.media.findById(id)
  }

  /** Soft delete; a later GC sweep removes unreferenced bytes from storage. */
  delete(id: string): Promise<void> {
    return this.media.softDelete(id)
  }

  resolveUrl(asset: MediaAsset): string {
    return this.storage.publicUrl(asset.key)
  }

  private async readMetadata(input: Buffer): Promise<{ animated: boolean }> {
    let metadata: sharp.Metadata
    try {
      metadata = await sharp(input, { failOn: 'truncated' }).metadata()
    } catch {
      throw new BadRequestError('File is not a valid image')
    }

    const format = metadata.format
    if (!format || !ACCEPTED_INPUT_FORMATS.has(format)) {
      throw new BadRequestError(`Unsupported image format: ${format ?? 'unknown'}`)
    }

    return { animated: (metadata.pages ?? 1) > 1 }
  }

  private async transformToWebp(
    input: Buffer,
    animated: boolean,
  ): Promise<{ data: Buffer; info: sharp.OutputInfo }> {
    // sharp drops metadata unless .withMetadata() is called, so EXIF (incl. GPS)
    // is stripped here. Auto-orient first so the baked pixels stay upright.
    let pipeline = sharp(input, { animated, failOn: 'truncated' })
    if (!animated) pipeline = pipeline.rotate()

    return pipeline
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: WEBP_QUALITY })
      .toBuffer({ resolveWithObject: true })
  }

  private getChecksum(data: Buffer): string {
    return createHash('sha256').update(data).digest('hex')
  }

  private getStorageKey(checksum: string): string {
    return `${checksum.slice(0, 2)}/${checksum}.webp`
  }

  private getDimensions(
    info: sharp.OutputInfo,
    animated: boolean,
  ): { width: number; height: number } {
    return {
      width: info.width,
      height: animated ? (info.pageHeight ?? info.height) : info.height,
    }
  }

  private async persistNewAsset(params: {
    key: string
    data: Buffer
    width: number
    height: number
    sizeBytes: number
    checksum: string
    blurDataUrl: string
    alt: string | null
  }): Promise<MediaAsset> {
    const { key, data, width, height, sizeBytes, checksum, blurDataUrl, alt } = params

    await this.storage.put(key, data, 'image/webp')
    try {
      return await this.media.create({
        key,
        mime: 'image/webp',
        width,
        height,
        sizeBytes,
        checksum,
        blurDataUrl,
        alt,
      })
    } catch (err) {
      // Roll back the orphaned bytes if the row write fails.
      await this.storage.delete(key).catch(() => {})
      throw err
    }
  }

  private async makeLqip(webp: Buffer): Promise<string> {
    const buf = await sharp(webp, { pages: 1 })
      .resize(LQIP_SIZE, LQIP_SIZE, { fit: 'inside' })
      .webp({ quality: 40 })
      .toBuffer()
    return `data:image/webp;base64,${buf.toString('base64')}`
  }
}

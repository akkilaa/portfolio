export type MediaAsset = {
  id: string
  /** Backend-agnostic object key, e.g. `ab/<sha256>.webp`. Never includes a host. */
  key: string
  mime: string
  width: number
  height: number
  sizeBytes: number
  /** sha256 of the stored bytes — content address + dedupe key. */
  checksum: string
  /** Tiny base64 LQIP, consumable directly by `next/image` `blurDataURL`. */
  blurDataUrl: string | null
  /** Default alt text; a reference (e.g. ProjectImage) may override per usage. */
  alt: string | null
  createdAt: Date
  deletedAt: Date | null
}

export type CreateMediaAssetInput = {
  key: string
  mime: string
  width: number
  height: number
  sizeBytes: number
  checksum: string
  blurDataUrl?: string | null
  alt?: string | null
}

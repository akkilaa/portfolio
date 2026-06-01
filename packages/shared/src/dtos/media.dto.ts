/**
 * Wire shape for a media asset. Note it exposes a resolved `url` (built by the
 * active storage adapter) and deliberately omits the raw `key` and `checksum` —
 * the public surface stays decoupled from the storage backend.
 */
export interface MediaAssetResponse {
  id: string
  url: string
  mime: string
  width: number
  height: number
  sizeBytes: number
  blurDataUrl: string | null
  alt: string | null
  createdAt: string
}

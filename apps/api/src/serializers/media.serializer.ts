import type { MediaAsset, MediaAssetResponse } from '@portfolio/shared'

export function serializeMedia(asset: MediaAsset, url: string): MediaAssetResponse {
  return {
    id: asset.id,
    url,
    mime: asset.mime,
    width: asset.width,
    height: asset.height,
    sizeBytes: asset.sizeBytes,
    blurDataUrl: asset.blurDataUrl,
    alt: asset.alt,
    createdAt: asset.createdAt.toISOString(),
  }
}

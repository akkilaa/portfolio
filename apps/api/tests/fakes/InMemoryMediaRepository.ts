import type { IMediaRepository } from '../../src/ports/media.repository'
import type { CreateMediaAssetInput, MediaAsset } from '@portfolio/shared'

export class InMemoryMediaRepository implements IMediaRepository {
  private store = new Map<string, MediaAsset>()
  private nextId = 1

  seed(assets: MediaAsset[]): this {
    for (const asset of assets) this.store.set(asset.id, asset)
    return this
  }

  async create(data: CreateMediaAssetInput): Promise<MediaAsset> {
    const asset: MediaAsset = {
      id: String(this.nextId++),
      key: data.key,
      mime: data.mime,
      width: data.width,
      height: data.height,
      sizeBytes: data.sizeBytes,
      checksum: data.checksum,
      blurDataUrl: data.blurDataUrl ?? null,
      alt: data.alt ?? null,
      createdAt: new Date(),
      deletedAt: null,
    }
    this.store.set(asset.id, asset)
    return asset
  }

  async findById(id: string): Promise<MediaAsset | null> {
    const asset = this.store.get(id)
    return asset && !asset.deletedAt ? asset : null
  }

  async findByChecksum(checksum: string): Promise<MediaAsset | null> {
    for (const asset of this.store.values()) {
      if (asset.checksum === checksum && !asset.deletedAt) return asset
    }
    return null
  }

  async softDelete(id: string): Promise<void> {
    const asset = this.store.get(id)
    if (asset) asset.deletedAt = new Date()
  }
}

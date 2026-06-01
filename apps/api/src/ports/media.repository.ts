import type { CreateMediaAssetInput, MediaAsset } from '@portfolio/shared'

export interface IMediaRepository {
  create(data: CreateMediaAssetInput): Promise<MediaAsset>
  findById(id: string): Promise<MediaAsset | null>
  findByChecksum(checksum: string): Promise<MediaAsset | null>
  softDelete(id: string): Promise<void>
}

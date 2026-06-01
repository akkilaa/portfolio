import type { PrismaClient } from '../../../prisma/src/generated/prisma'
import type { CreateMediaAssetInput, MediaAsset } from '@portfolio/shared'

export class PrismaMediaRepository {
  constructor(private readonly db: PrismaClient) {}

  create(data: CreateMediaAssetInput): Promise<MediaAsset> {
    return this.db.mediaAsset.create({ data })
  }

  findById(id: string): Promise<MediaAsset | null> {
    return this.db.mediaAsset.findFirst({ where: { id, deletedAt: null } })
  }

  findByChecksum(checksum: string): Promise<MediaAsset | null> {
    return this.db.mediaAsset.findFirst({ where: { checksum, deletedAt: null } })
  }

  async softDelete(id: string): Promise<void> {
    await this.db.mediaAsset.update({ where: { id }, data: { deletedAt: new Date() } })
  }
}

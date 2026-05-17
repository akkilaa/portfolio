import type { PrismaClient } from '@prisma'
import type {
  IRecommendationRepository,
  IRecommendationAuthorRepository,
} from '@db/ports/repositories/recommendation.repository'

import type {
  Recommendation,
  RecommendationWithAuthor,
  RecommendationAuthor,
  RecommendationStatus,
  CreateRecommendationInput,
  UpsertRecommendationAuthorInput,
} from '@portfolio/shared'

const authorInclude = { author: true }

export class PrismaRecommendationAuthorRepository implements IRecommendationAuthorRepository {
  constructor(private readonly db: PrismaClient) {}

  findByProvider(provider: string, providerId: string): Promise<RecommendationAuthor | null> {
    return this.db.recommendationAuthor.findUnique({
      where: { provider_providerId: { provider, providerId } },
    }) as Promise<RecommendationAuthor | null>
  }

  upsert(data: UpsertRecommendationAuthorInput): Promise<RecommendationAuthor> {
    const { provider, providerId, ...rest } = data
    return this.db.recommendationAuthor.upsert({
      where: { provider_providerId: { provider, providerId } },
      create: { provider, providerId, ...rest },
      update: { ...rest },
    }) as Promise<RecommendationAuthor>
  }
}

export class PrismaRecommendationRepository implements IRecommendationRepository {
  constructor(private readonly db: PrismaClient) {}

  async findApproved(): Promise<RecommendationWithAuthor[]> {
    return this.db.recommendation.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      include: authorInclude,
    }) as Promise<RecommendationWithAuthor[]>
  }

  async findAll({
    status,
  }: {
    status?: RecommendationStatus
  }): Promise<RecommendationWithAuthor[]> {
    return this.db.recommendation.findMany({
      where: status ? { status } : {},
      orderBy: { createdAt: 'desc' },
      include: authorInclude,
    }) as Promise<RecommendationWithAuthor[]>
  }

  async findById(id: string): Promise<RecommendationWithAuthor | null> {
    return this.db.recommendation.findUnique({
      where: { id },
      include: authorInclude,
    }) as Promise<RecommendationWithAuthor | null>
  }

  findByAuthorId(authorId: string): Promise<Recommendation | null> {
    return this.db.recommendation.findUnique({ where: { authorId } })
  }

  create(data: CreateRecommendationInput): Promise<Recommendation> {
    return this.db.recommendation.create({ data })
  }

  approve(id: string): Promise<Recommendation> {
    return this.db.recommendation.update({
      where: { id },
      data: { status: 'APPROVED' },
    })
  }

  reject(id: string): Promise<Recommendation> {
    return this.db.recommendation.update({
      where: { id },
      data: { status: 'REJECTED' },
    })
  }

  async delete(id: string): Promise<void> {
    await this.db.recommendation.delete({ where: { id } })
  }
}

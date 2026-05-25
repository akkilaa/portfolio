import type {
  Recommendation,
  RecommendationWithAuthor,
  RecommendationAuthor,
  RecommendationStatus,
  CreateRecommendationInput,
  UpsertRecommendationAuthorInput,
} from '@portfolio/shared'

export interface IRecommendationAuthorRepository {
  findById(id: string): Promise<RecommendationAuthor | null>
  findByProvider(provider: string, providerId: string): Promise<RecommendationAuthor | null>
  upsert(data: UpsertRecommendationAuthorInput): Promise<RecommendationAuthor>
  updateProfileUrl(id: string, profileUrl: string): Promise<void>
}

export interface IRecommendationRepository {
  findApproved(): Promise<RecommendationWithAuthor[]>
  findAll(opts: { status?: RecommendationStatus }): Promise<RecommendationWithAuthor[]>
  findById(id: string): Promise<RecommendationWithAuthor | null>
  findByAuthorId(authorId: string): Promise<Recommendation | null>
  create(data: CreateRecommendationInput): Promise<Recommendation>
  approve(id: string): Promise<Recommendation>
  reject(id: string): Promise<Recommendation>
  delete(id: string): Promise<void>
}

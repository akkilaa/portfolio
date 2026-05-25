import type {
  RecommendationAuthor,
  Recommendation,
  RecommendationStatus,
} from '../domain/recommendation'

export interface RecommendationAuthorResponse extends Omit<
  RecommendationAuthor,
  'createdAt' | 'updatedAt'
> {
  createdAt: string
  updatedAt: string
}

export interface RecommendationResponse extends Omit<Recommendation, 'createdAt' | 'updatedAt'> {
  createdAt: string
  updatedAt: string
  author: RecommendationAuthorResponse
}

export type RecommendationListResponse = {
  items: RecommendationResponse[]
}

export type AdminRecommendationListResponse = {
  items: RecommendationResponse[]
}

export type AdminRecommendationQuery = {
  status?: RecommendationStatus
}

export type CreateRecommendationBody = {
  comment: string
  linkedinUrl?: string
}

export type RecommendationMeResponse = {
  author: RecommendationAuthorResponse
  recommendation: Omit<RecommendationResponse, 'author'> | null
}

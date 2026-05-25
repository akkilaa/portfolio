export type RecommendationProvider = 'github' | 'linkedin'

export type RecommendationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type RecommendationAuthor = {
  id: string
  provider: RecommendationProvider
  providerId: string
  displayName: string
  username: string | null
  avatarUrl: string | null
  profileUrl: string | null
  createdAt: Date
  updatedAt: Date
}

export type Recommendation = {
  id: string
  authorId: string
  comment: string
  status: RecommendationStatus
  createdAt: Date
  updatedAt: Date
}

export type RecommendationWithAuthor = Recommendation & {
  author: RecommendationAuthor
}

export type UpsertRecommendationAuthorInput = {
  provider: RecommendationProvider
  providerId: string
  displayName: string
  username?: string
  avatarUrl?: string
  profileUrl?: string | null
}

export type CreateRecommendationInput = {
  authorId: string
  comment: string
}

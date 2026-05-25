import type {
  RecommendationWithAuthor,
  RecommendationAuthor,
  Recommendation,
} from '@portfolio/shared'
import type {
  RecommendationResponse,
  RecommendationAuthorResponse,
  RecommendationListResponse,
  AdminRecommendationListResponse,
  RecommendationMeResponse,
} from '@portfolio/shared'

function serializeAuthor(author: RecommendationAuthor): RecommendationAuthorResponse {
  return {
    ...author,
    createdAt: author.createdAt.toISOString(),
    updatedAt: author.updatedAt.toISOString(),
  }
}

export function serializeRecommendation(rec: RecommendationWithAuthor): RecommendationResponse {
  return {
    ...rec,
    createdAt: rec.createdAt.toISOString(),
    updatedAt: rec.updatedAt.toISOString(),
    author: serializeAuthor(rec.author),
  }
}

export function serializeRecommendationList(
  items: RecommendationWithAuthor[],
): RecommendationListResponse {
  return { items: items.map(serializeRecommendation) }
}

export function serializeMe({
  author,
  recommendation,
}: {
  author: RecommendationAuthor
  recommendation: Recommendation | null
}): RecommendationMeResponse {
  return {
    author: serializeAuthor(author),
    recommendation: recommendation
      ? {
          id: recommendation.id,
          authorId: recommendation.authorId,
          comment: recommendation.comment,
          status: recommendation.status,
          createdAt: recommendation.createdAt.toISOString(),
          updatedAt: recommendation.updatedAt.toISOString(),
        }
      : null,
  }
}

export function serializeAdminRecommendationList(
  items: RecommendationWithAuthor[],
): AdminRecommendationListResponse {
  return { items: items.map(serializeRecommendation) }
}

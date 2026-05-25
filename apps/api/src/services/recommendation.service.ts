import { ConflictError, NotFoundError } from '@portfolio/shared'
import type { RecommendationStatus } from '@portfolio/shared'
import type {
  IRecommendationRepository,
  IRecommendationAuthorRepository,
} from '@api/ports/recommendation.repository'

export class RecommendationService {
  constructor(
    private readonly recommendations: IRecommendationRepository,
    private readonly authors: IRecommendationAuthorRepository,
  ) {}

  async getMe(authorId: string) {
    const author = await this.authors.findById(authorId)
    if (!author) throw new NotFoundError('Author not found')
    const recommendation = await this.recommendations.findByAuthorId(authorId)
    return { author, recommendation }
  }

  getApproved() {
    return this.recommendations.findApproved()
  }

  getAll(opts: { status?: RecommendationStatus }) {
    return this.recommendations.findAll(opts)
  }

  async getById(id: string) {
    const rec = await this.recommendations.findById(id)
    if (!rec) throw new NotFoundError('Recommendation not found')
    return rec
  }

  async create(authorId: string, comment: string, linkedinUrl?: string) {
    const existing = await this.recommendations.findByAuthorId(authorId)
    if (existing) throw new ConflictError('You already submitted a recommendation')
    if (linkedinUrl) {
      await this.authors.updateProfileUrl(authorId, linkedinUrl)
    }
    return this.recommendations.create({ authorId, comment })
  }

  async approve(id: string) {
    await this.getById(id)
    return this.recommendations.approve(id)
  }

  async reject(id: string) {
    await this.getById(id)
    return this.recommendations.reject(id)
  }

  async delete(id: string) {
    await this.getById(id)
    return this.recommendations.delete(id)
  }
}

import {
  createPrismaClient,
  PrismaUserRepository,
  PrismaPostRepository,
  PrismaProjectRepository,
  PrismaTagRepository,
  PrismaContactRepository,
  PrismaRecommendationRepository,
  PrismaRecommendationAuthorRepository,
  PrismaAuditLogRepository,
  PrismaLlmChatLogRepository,
} from '@portfolio/db'
import type { IUserRepository } from '@api/ports/user.repository'
import type { IPostRepository } from '@api/ports/post.repository'
import type { IProjectRepository } from '@api/ports/project.repository'
import type { ITagRepository } from '@api/ports/tag.repository'
import type { IContactRepository } from '@api/ports/contact.repository'
import type {
  IRecommendationRepository,
  IRecommendationAuthorRepository,
} from '@api/ports/recommendation.repository'
import type { IAuditLogRepository } from '@api/ports/audit-log.repository'
import type { ILlmChatLogRepository } from '@api/ports/llm-chat-log.repository'

const prisma = createPrismaClient()

export const userRepository: IUserRepository = new PrismaUserRepository(prisma)
export const postRepository: IPostRepository = new PrismaPostRepository(prisma)
export const projectRepository: IProjectRepository = new PrismaProjectRepository(prisma)
export const tagRepository: ITagRepository = new PrismaTagRepository(prisma)
export const contactRepository: IContactRepository = new PrismaContactRepository(prisma)
export const recommendationRepository: IRecommendationRepository =
  new PrismaRecommendationRepository(prisma)
export const recommendationAuthorRepository: IRecommendationAuthorRepository =
  new PrismaRecommendationAuthorRepository(prisma)
export const auditLogRepository: IAuditLogRepository = new PrismaAuditLogRepository(prisma)
export const llmChatLogRepository: ILlmChatLogRepository = new PrismaLlmChatLogRepository(prisma)

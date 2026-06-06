import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '../prisma/src/generated/prisma/index.js'

export function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
  return new PrismaClient({ adapter, log: ['error'] })
}

export { PrismaUserRepository } from './adapters/prisma/user.repository'
export { PrismaPostRepository } from './adapters/prisma/post.repository'
export { PrismaProjectRepository } from './adapters/prisma/project.repository'
export { PrismaTagRepository } from './adapters/prisma/tag.repository'
export { PrismaContactRepository } from './adapters/prisma/contact.repository'
export { PrismaMediaRepository } from './adapters/prisma/media.repository'
export {
  PrismaRecommendationRepository,
  PrismaRecommendationAuthorRepository,
} from './adapters/prisma/recommendation.repository'
export { PrismaAuditLogRepository } from './adapters/prisma/audit-log.repository'
export { PrismaLlmChatLogRepository } from './adapters/prisma/llm-chat-log.repository'
export { isPrismaValidationError, isPrismaError } from './utils'

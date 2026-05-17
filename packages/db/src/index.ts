import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma";
import { PrismaUserRepository } from "@db/adapters/prisma/user.repository";
import { PrismaPostRepository } from "@db/adapters/prisma/post.repository";
import { PrismaProjectRepository } from "@db/adapters/prisma/project.repository";
import { PrismaTagRepository } from "@db/adapters/prisma/tag.repository";
import { PrismaContactRepository } from "@db/adapters/prisma/contact.repository";
import {
  PrismaRecommendationRepository,
  PrismaRecommendationAuthorRepository,
} from "@db/adapters/prisma/recommendation.repository";
import { PrismaAuditLogRepository } from "@db/adapters/prisma/audit-log.repository";
import { PrismaLlmChatLogRepository } from "@db/adapters/prisma/llm-chat-log.repository";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  return new PrismaClient({ adapter, log: ["error"] });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Repositories — apps/api imports these, never prisma directly
export const userRepository = new PrismaUserRepository(prisma);
export const postRepository = new PrismaPostRepository(prisma);
export const projectRepository = new PrismaProjectRepository(prisma);
export const tagRepository = new PrismaTagRepository(prisma);
export const contactRepository = new PrismaContactRepository(prisma);
export const recommendationRepository = new PrismaRecommendationRepository(
  prisma,
);
export const recommendationAuthorRepository =
  new PrismaRecommendationAuthorRepository(prisma);
export const auditLogRepository = new PrismaAuditLogRepository(prisma);
export const llmChatLogRepository = new PrismaLlmChatLogRepository(prisma);

// Port interfaces — for type annotations in apps/api
export type { IUserRepository } from "./ports/repositories/user.repository";
export type { IPostRepository } from "./ports/repositories/post.repository";
export type { IProjectRepository } from "./ports/repositories/project.repository";
export type { ITagRepository } from "./ports/repositories/tag.repository";
export type { IContactRepository } from "./ports/repositories/contact.repository";
export type {
  IRecommendationRepository,
  IRecommendationAuthorRepository,
} from "./ports/repositories/recommendation.repository";
export type { IAuditLogRepository } from "./ports/repositories/audit-log.repository";
export type { ILlmChatLogRepository } from "./ports/repositories/llm-chat-log.repository";

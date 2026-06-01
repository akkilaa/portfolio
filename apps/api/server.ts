import path from 'node:path'
import {
  createPrismaClient,
  PrismaPostRepository,
  PrismaProjectRepository,
  PrismaContactRepository,
  PrismaUserRepository,
  PrismaRecommendationRepository,
  PrismaRecommendationAuthorRepository,
  PrismaLlmChatLogRepository,
  PrismaMediaRepository,
} from '@portfolio/db'
import type { IPostRepository } from './src/ports/post.repository.js'
import type { IProjectRepository } from './src/ports/project.repository.js'
import type { IContactRepository } from './src/ports/contact.repository.js'
import type { IUserRepository } from './src/ports/user.repository.js'
import type {
  IRecommendationRepository,
  IRecommendationAuthorRepository,
} from './src/ports/recommendation.repository.js'
import type { IMediaRepository } from './src/ports/media.repository.js'
import type { IStorageService } from './src/ports/storage.port.js'
import { PostsService } from './src/services/posts.service.js'
import { ProjectsService } from './src/services/projects.service.js'
import { ContactService } from './src/services/contact.service.js'
import { UsersService } from './src/services/users.service.js'
import { AuthService } from './src/services/auth.service.js'
import { GithubOAuthService } from './src/services/github-oauth.service.js'
import { LinkedInOAuthService } from './src/services/linkedin-oauth.service.js'
import { RecommendationService } from './src/services/recommendation.service.js'
import { LlmChatService } from './src/services/llm-chat.service.js'
import { MediaService } from './src/services/media.service.js'
import { PostsController } from './src/controllers/posts.controller.js'
import { ProjectsController } from './src/controllers/projects.controller.js'
import { ContactController } from './src/controllers/contact.controller.js'
import { UsersController } from './src/controllers/users.controller.js'
import { AuthController } from './src/controllers/auth.controller.js'
import { RecommendationController } from './src/controllers/recommendation.controller.js'
import { AskController } from './src/controllers/ask.controller.js'
import { MediaController } from './src/controllers/media.controller.js'
import { NodemailerEmailService } from './src/adapters/nodemailer.email.js'
import { LocalDiskStorage } from './src/adapters/local-disk.storage.js'
import { composeApp } from './src/container.js'

/**
 * Selects the storage backend from STORAGE_DRIVER. Adding an `s3` driver later
 * (R2/AWS) is the only change needed here — nothing downstream knows or cares.
 */
function createStorage(): IStorageService {
  const driver = process.env.STORAGE_DRIVER ?? 'local'
  switch (driver) {
    case 'local': {
      const root = process.env.MEDIA_ROOT ?? path.resolve('var/media')
      const baseUrl = process.env.MEDIA_BASE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`
      return new LocalDiskStorage(root, baseUrl)
    }
    default:
      throw new Error(`Unknown STORAGE_DRIVER: ${driver}`)
  }
}

const prisma = createPrismaClient()

// Outbound adapters
const postRepository: IPostRepository = new PrismaPostRepository(prisma)
const projectRepository: IProjectRepository = new PrismaProjectRepository(prisma)
const contactRepository: IContactRepository = new PrismaContactRepository(prisma)
const userRepository: IUserRepository = new PrismaUserRepository(prisma)
const recommendationRepository: IRecommendationRepository = new PrismaRecommendationRepository(
  prisma,
)
const recommendationAuthorRepository: IRecommendationAuthorRepository =
  new PrismaRecommendationAuthorRepository(prisma)
const llmChatLogRepository = new PrismaLlmChatLogRepository(prisma)
const mediaRepository: IMediaRepository = new PrismaMediaRepository(prisma)
const emailService = new NodemailerEmailService()
const storageService: IStorageService = createStorage()

// Application services
const postsService = new PostsService(postRepository)
const projectsService = new ProjectsService(projectRepository)
const contactService = new ContactService(contactRepository)
const usersService = new UsersService(userRepository)
const authService = new AuthService(userRepository, emailService)
const githubOAuthService = new GithubOAuthService(recommendationAuthorRepository)
const linkedinOAuthService = new LinkedInOAuthService(recommendationAuthorRepository)
const recommendationService = new RecommendationService(
  recommendationRepository,
  recommendationAuthorRepository,
)
const llmChatService = new LlmChatService(llmChatLogRepository)
const mediaService = new MediaService(storageService, mediaRepository)

// Inbound adapters (HTTP controllers)
const postsController = new PostsController(postsService)
const projectsController = new ProjectsController(projectsService)
const contactController = new ContactController(contactService)
const usersController = new UsersController(usersService)
const authController = new AuthController(authService, githubOAuthService, linkedinOAuthService)
const recommendationController = new RecommendationController(recommendationService)
const askController = new AskController(llmChatService)
const mediaController = new MediaController(mediaService)

const app = composeApp({
  auth: authController,
  posts: postsController,
  projects: projectsController,
  contact: contactController,
  users: usersController,
  recommendations: recommendationController,
  ask: askController,
  media: mediaController,
})

const port = process.env.PORT ? Number(process.env.PORT) : 3000
const server = app.listen(port, () => console.log(`API listening on port ${port}`))

const shutdown = async () => {
  server.close()
  await prisma.$disconnect()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

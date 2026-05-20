import {
  createPrismaClient,
  PrismaPostRepository,
  PrismaProjectRepository,
  PrismaContactRepository,
  PrismaUserRepository,
} from '@portfolio/db'
import type { IPostRepository } from './src/ports/post.repository.js'
import type { IProjectRepository } from './src/ports/project.repository.js'
import type { IContactRepository } from './src/ports/contact.repository.js'
import type { IUserRepository } from './src/ports/user.repository.js'
import { PostsService } from './src/services/posts.service.js'
import { ProjectsService } from './src/services/projects.service.js'
import { ContactService } from './src/services/contact.service.js'
import { UsersService } from './src/services/users.service.js'
import { AuthService } from './src/services/auth.service.js'
import { PostsController } from './src/controllers/posts.controller.js'
import { ProjectsController } from './src/controllers/projects.controller.js'
import { ContactController } from './src/controllers/contact.controller.js'
import { UsersController } from './src/controllers/users.controller.js'
import { AuthController } from './src/controllers/auth.controller.js'
import { NodemailerEmailService } from './src/adapters/nodemailer.email.js'
import { composeApp } from './src/container.js'

const prisma = createPrismaClient()

// Outbound adapters
const postRepository: IPostRepository = new PrismaPostRepository(prisma)
const projectRepository: IProjectRepository = new PrismaProjectRepository(prisma)
const contactRepository: IContactRepository = new PrismaContactRepository(prisma)
const userRepository: IUserRepository = new PrismaUserRepository(prisma)
const emailService = new NodemailerEmailService()

// Application services
const postsService = new PostsService(postRepository)
const projectsService = new ProjectsService(projectRepository)
const contactService = new ContactService(contactRepository)
const usersService = new UsersService(userRepository)
const authService = new AuthService(userRepository, emailService)

// Inbound adapters (HTTP controllers)
const postsController = new PostsController(postsService)
const projectsController = new ProjectsController(projectsService)
const contactController = new ContactController(contactService)
const usersController = new UsersController(usersService)
const authController = new AuthController(authService)

const app = composeApp({
  auth: authController,
  posts: postsController,
  projects: projectsController,
  contact: contactController,
  users: usersController,
})

const port = process.env.PORT ? Number(process.env.PORT) : 3000
const server = app.listen(port, () => console.log(`API listening on port ${port}`))

const shutdown = async () => {
  server.close()
  await prisma.$disconnect()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

import {
  createPrismaClient,
  PrismaPostRepository,
  PrismaProjectRepository,
  PrismaContactRepository,
} from '@portfolio/db'
import type { IPostRepository } from './src/ports/post.repository.js'
import type { IProjectRepository } from './src/ports/project.repository.js'
import type { IContactRepository } from './src/ports/contact.repository.js'
import { PostsService } from './src/services/posts.service.js'
import { ProjectsService } from './src/services/projects.service.js'
import { ContactService } from './src/services/contact.service.js'
import { PostsController } from './src/controllers/posts.controller.js'
import { ProjectsController } from './src/controllers/projects.controller.js'
import { ContactController } from './src/controllers/contact.controller.js'
import { composeApp } from './src/container.js'

const prisma = createPrismaClient()

// Outbound adapters
const postRepository: IPostRepository = new PrismaPostRepository(prisma)
const projectRepository: IProjectRepository = new PrismaProjectRepository(prisma)
const contactRepository: IContactRepository = new PrismaContactRepository(prisma)

// Application services
const postsService = new PostsService(postRepository)
const projectsService = new ProjectsService(projectRepository)
const contactService = new ContactService(contactRepository)

// Inbound adapters (HTTP controllers)
const postsController = new PostsController(postsService)
const projectsController = new ProjectsController(projectsService)
const contactController = new ContactController(contactService)

const app = composeApp({
  posts: postsController,
  projects: projectsController,
  contact: contactController,
})

const port = process.env.PORT ? Number(process.env.PORT) : 3000
const server = app.listen(port, () => console.log(`API listening on port ${port}`))

const shutdown = async () => {
  server.close()
  await prisma.$disconnect()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

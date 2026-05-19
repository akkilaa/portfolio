import { createPrismaClient, PrismaPostRepository } from '@portfolio/db'
import type { IPostRepository } from './src/ports/post.repository.js'
import { PostsService } from './src/services/posts.service.js'
import { PostsController } from './src/controllers/posts.controller.js'
import { composeApp } from './src/container.js'

const prisma = createPrismaClient()

// Outbound adapters
const postRepository: IPostRepository = new PrismaPostRepository(prisma)

// Application services
const postsService = new PostsService(postRepository)

// Inbound adapters (HTTP controllers)
const postsController = new PostsController(postsService)

const app = composeApp({ posts: postsController })

const port = process.env.PORT ? Number(process.env.PORT) : 3000
const server = app.listen(port, () => console.log(`API listening on port ${port}`))

const shutdown = async () => {
  server.close()
  await prisma.$disconnect()
}

process.on('SIGTERM', shutdown)
process.on('SIGINT', shutdown)

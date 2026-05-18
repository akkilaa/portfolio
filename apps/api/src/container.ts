import express, { type Express } from 'express'
import { createPrismaClient, PrismaPostRepository } from '@portfolio/db'
import type { IPostRepository } from '@api/ports/post.repository'
import { PostsService } from '@api/services/posts.service'
import { PostsController } from '@api/controllers/posts.controller'
import { createV1Router } from '@api/routes/v1.router'

type App = {
  app: Express
  dispose: () => Promise<void>
}

export function createApp(): App {
  const prisma = createPrismaClient()

  // Outbound adapters

  const postRepository: IPostRepository = new PrismaPostRepository(prisma)

  // Application services
  const postsService = new PostsService(postRepository)

  // Inbound adapters (HTTP controllers)
  const postsController = new PostsController(postsService)

  // Express app
  const app = express()
  app.use(express.json())
  app.get('/', (_req, res) => res.json({ status: 'ok' }))
  app.use('/v1', createV1Router({ posts: postsController }))

  return {
    app,
    dispose: () => prisma.$disconnect(),
  }
}

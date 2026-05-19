import express, { type Express } from 'express'
import { createV1Router } from '@api/routes/v1.router'
import type { PostsController } from '@api/controllers/posts.controller'

type Controllers = {
  posts: PostsController
}

export function composeApp(controllers: Controllers): Express {
  const app = express()
  app.use(express.json())
  app.get('/', (_req, res) => res.json({ status: 'ok' }))
  app.use('/v1', createV1Router(controllers))

  return app
}

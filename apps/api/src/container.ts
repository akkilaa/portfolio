import express, { type Express } from 'express'
import { createV1Router } from '@api/routes/v1.router'
import type { PostsController } from '@api/controllers/posts.controller'
import type { ProjectsController } from '@api/controllers/projects.controller'
import type { ContactController } from '@api/controllers/contact.controller'
import { errorHandler } from '@api/middlewares/error-handler'

type Controllers = {
  posts: PostsController
  projects: ProjectsController
  contact: ContactController
}

export function composeApp(controllers: Controllers): Express {
  const app = express()
  app.use(express.json())
  app.get('/', (_req, res) => res.json({ status: 'ok' }))
  app.use('/v1', createV1Router(controllers))
  app.use(errorHandler)

  return app
}

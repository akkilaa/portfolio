import express, { type Express } from 'express'
import cookieParser from 'cookie-parser'
import { createV1Router } from '@api/routes/v1.router'
import type { AuthController } from '@api/controllers/auth.controller'
import type { PostsController } from '@api/controllers/posts.controller'
import type { ProjectsController } from '@api/controllers/projects.controller'
import type { ContactController } from '@api/controllers/contact.controller'
import type { UsersController } from '@api/controllers/users.controller'
import { errorHandler } from '@api/middlewares/error-handler'

type Controllers = {
  auth: AuthController
  posts: PostsController
  projects: ProjectsController
  contact: ContactController
  users: UsersController
}

export function composeApp(controllers: Controllers): Express {
  const app = express()
  app.use(express.json())
  app.use(cookieParser())
  app.get('/', (_req, res) => res.json({ status: 'ok' }))
  app.use('/v1', createV1Router(controllers))
  app.use(errorHandler)

  return app
}

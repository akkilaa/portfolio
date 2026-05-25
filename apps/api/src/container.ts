import express, { type Express } from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { createV1Router } from '@api/routes/v1.router'
import type { AuthController } from '@api/controllers/auth.controller'
import type { PostsController } from '@api/controllers/posts.controller'
import type { ProjectsController } from '@api/controllers/projects.controller'
import type { ContactController } from '@api/controllers/contact.controller'
import type { UsersController } from '@api/controllers/users.controller'
import type { RecommendationController } from '@api/controllers/recommendation.controller'
import { errorHandler } from '@api/middlewares/error-handler'

type Controllers = {
  auth: AuthController
  posts: PostsController
  projects: ProjectsController
  contact: ContactController
  users: UsersController
  recommendations: RecommendationController
}

export function composeApp(controllers: Controllers): Express {
  const app = express()

  const corsOrigin =
    process.env.NODE_ENV !== 'production'
      ? /^https?:\/\/localhost(:\d+)?$/
      : process.env.CORS_ORIGIN

  if (corsOrigin) {
    app.use(cors({ origin: corsOrigin, credentials: true }))
  }

  app.use(express.json())
  app.use(cookieParser())
  app.get('/', (_req, res) => res.json({ status: 'ok' }))
  app.use('/v1', createV1Router(controllers))
  app.use(errorHandler)

  return app
}

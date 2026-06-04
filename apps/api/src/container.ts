import path from 'node:path'
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
import type { AskController } from '@api/controllers/ask.controller'
import type { MediaController } from '@api/controllers/media.controller'
import { errorHandler } from '@api/middlewares/error-handler'

type Controllers = {
  auth: AuthController
  posts: PostsController
  projects: ProjectsController
  contact: ContactController
  users: UsersController
  recommendations: RecommendationController
  ask: AskController
  media: MediaController
}

export function composeApp(controllers: Controllers): Express {
  const app = express()

  const corsOrigin =
    process.env.NODE_ENV !== 'production'
      ? /^https?:\/\/(localhost|(\d{1,3}\.){3}\d{1,3})(:\d+)?$/
      : process.env.CORS_ORIGIN

  if (corsOrigin) {
    app.use(cors({ origin: corsOrigin, credentials: true }))
  }

  app.use(express.json())
  app.use(cookieParser())
  app.get('/', (_req, res) => res.json({ status: 'ok' }))

  // Serve uploaded media from disk. In production Nginx should own `/media/*`
  // (long, immutable cache); this is here so the local-disk backend works
  // end-to-end in dev without a reverse proxy. A cloud backend (R2/S3) serves
  // its own host, so this branch is a no-op there.
  if ((process.env.STORAGE_DRIVER ?? 'local') === 'local') {
    const mediaRoot = path.resolve(process.env.MEDIA_ROOT ?? 'var/media')
    app.use('/media', express.static(mediaRoot, { immutable: true, maxAge: '1y', index: false }))
  }

  app.use('/v1', createV1Router(controllers))
  app.use(errorHandler)

  return app
}

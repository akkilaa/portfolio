import { Router } from 'express'
import { ROUTES } from '@api/constants/routes'
import postsRouter from '@api/routes/posts.router'

const router = Router()

router.use(ROUTES.POSTS, postsRouter)

export default router

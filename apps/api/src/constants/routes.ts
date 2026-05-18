export const ROUTES = {
  POSTS: '/posts',
} as const

export const POST_ROUTES = {
  ROOT: '/',
  ADMIN: '/admin',
  BY_SLUG: '/:slug',
  BY_ID: '/:id',
  PUBLISH: '/:id/publish',
  UNPUBLISH: '/:id/unpublish',
} as const

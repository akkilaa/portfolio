export const ROUTES = {
  POSTS: '/posts',
  PROJECTS: '/projects',
} as const

export const POST_ROUTES = {
  ROOT: '/',
  ADMIN: '/admin',
  BY_SLUG: '/:slug',
  BY_ID: '/:id',
  PUBLISH: '/:id/publish',
  UNPUBLISH: '/:id/unpublish',
} as const

export const PROJECT_ROUTES = {
  ROOT: '/',
  FEATURED: '/featured',
  ADMIN: '/admin',
  BY_SLUG: '/:slug',
  BY_ID: '/:id',
  PUBLISH: '/:id/publish',
  UNPUBLISH: '/:id/unpublish',
  RESTORE: '/:id/restore',
} as const

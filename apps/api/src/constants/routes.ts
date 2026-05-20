export const ROUTES = {
  AUTH: '/auth',
  POSTS: '/posts',
  PROJECTS: '/projects',
  CONTACT: '/contact',
  USERS: '/users',
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

export const CONTACT_ROUTES = {
  ROOT: '/',
  ADMIN: '/admin',
  BY_ID: '/:id',
} as const

export const USER_ROUTES = {
  ROOT: '/',
  BY_ID: '/:id',
} as const

export const AUTH_ROUTES = {
  LOGIN: '/login',
  VERIFY: '/verify',
  REFRESH: '/refresh',
  LOGOUT: '/logout',
} as const

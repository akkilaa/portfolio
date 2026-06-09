export const ROUTES = {
  AUTH: '/auth',
  POSTS: '/posts',
  PROJECTS: '/projects',
  CONTACT: '/contact',
  USERS: '/users',
  RECOMMENDATIONS: '/recommendations',
  ASK: '/ask',
  MEDIA: '/media',
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
  FEATURE: '/:id/feature',
  UNFEATURE: '/:id/unfeature',
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
  ME: '/me',
  GITHUB: '/github',
  GITHUB_CALLBACK: '/github/callback',
  LINKEDIN: '/linkedin',
  LINKEDIN_CALLBACK: '/linkedin/callback',
} as const

export const RECOMMENDATION_ROUTES = {
  ROOT: '/',
  ADMIN: '/admin',
  BY_ID: '/:id',
  APPROVE: '/:id/approve',
  REJECT: '/:id/reject',
} as const

export const MEDIA_ROUTES = {
  ROOT: '/',
  BY_ID: '/:id',
} as const

import * as Sentry from '@sentry/node'

Sentry.init({
  dsn: process.env.GLITCHTIP_DSN,
  enabled: !!process.env.GLITCHTIP_DSN,
  environment: process.env.NODE_ENV ?? 'development',
})

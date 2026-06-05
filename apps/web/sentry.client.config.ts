import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_GLITCHTIP_DSN,
  enabled: !!process.env.NEXT_PUBLIC_GLITCHTIP_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 0.1,
})

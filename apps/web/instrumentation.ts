import type { captureRequestError } from '@sentry/nextjs'

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { init } = await import('@sentry/nextjs')
    init({
      dsn: process.env.GLITCHTIP_DSN,
      enabled: !!process.env.GLITCHTIP_DSN,
      environment: process.env.NODE_ENV,
      tracesSampleRate: 0.1,
    })
  }
}

export const onRequestError = async (...args: Parameters<typeof captureRequestError>) => {
  const { captureRequestError: capture } = await import('@sentry/nextjs')
  capture(...args)
}

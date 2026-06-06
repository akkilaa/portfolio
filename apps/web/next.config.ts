import path from 'node:path'
import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  output: 'standalone',
  // Traces files from the monorepo root so workspace packages are included
  outputFileTracingRoot: path.join(__dirname, '../..'),
  allowedDevOrigins: [process.env.NEXT_PUBLIC_LOCAL_IP!],
  images: {
    // Skip optimization in dev — Next.js 15+ blocks localhost (private IP) in the optimizer
    unoptimized: process.env.NODE_ENV === 'development',
    remotePatterns: [
      // OAuth provider avatars
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: '*.licdn.com' },
      { hostname: 'media.licdn.com' },
      // arbitrary external images used in blog/project markdown
      { protocol: 'https', hostname: '**' },
    ],
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
}

const bundleAnalyzed = withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig)

export default withSentryConfig(bundleAnalyzed, {
  silent: true,
  sourcemaps: { disable: true },
  telemetry: false,
})

import type { NextConfig } from 'next'
import withBundleAnalyzer from '@next/bundle-analyzer'

const nextConfig: NextConfig = {
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

export default withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' })(nextConfig)

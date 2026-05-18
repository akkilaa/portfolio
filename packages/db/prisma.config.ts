import { config } from 'dotenv'
import { resolve } from 'node:path'
config({ path: resolve(import.meta.dirname, '../../.env') })
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})

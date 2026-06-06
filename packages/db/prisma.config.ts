import { config } from 'dotenv'
import { resolve } from 'node:path'
config({ path: resolve(import.meta.dirname, '../../.env') })
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DATABASE_URL ?? '',
  },
})

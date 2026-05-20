import { parseArgs } from 'node:util'
import { hash } from 'bcryptjs'
import { createPrismaClient } from '../src/index'

const { values } = parseArgs({
  options: {
    email: { type: 'string' },
    password: { type: 'string' },
  },
})

if (!values.email || !values.password) {
  console.error('Usage: pnpm user:create --email <email> --password <password>')
  process.exit(1)
}

const prisma = createPrismaClient()

async function main() {
  const passwordHash = await hash(values.password!, 10)
  const user = await prisma.user.create({
    data: { email: values.email!, passwordHash },
  })
  console.log(`User created: ${user.id} (${user.email})`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

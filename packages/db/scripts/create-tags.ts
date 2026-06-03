import { createPrismaClient } from '../src/index'

const prisma = createPrismaClient()

const tags = [
  { slug: 'react-native', label: 'React Native', color: '#61DAFB' },
  { slug: 'expo', label: 'Expo', color: '#000000' },
  { slug: 'redux', label: 'Redux', color: '#764ABC' },
  { slug: 'ios', label: 'iOS', color: '#000000' },
  { slug: 'android', label: 'Android', color: '#3DDC84' },
  { slug: 'mobile', label: 'Mobile', color: '#FF6B6B' },
  { slug: 'ci-cd', label: 'CI/CD', color: '#F0C27F' },
]

async function main() {
  for (const tag of tags) {
    const t = await prisma.tag.upsert({ where: { slug: tag.slug }, update: {}, create: tag })
    console.log(`Tag: ${t.slug} (${t.id})`)
  }
}

main()
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

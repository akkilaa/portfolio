import 'dotenv-expand/config'
import 'dotenv/config'
import { prisma } from '@db'

if (process.env.NODE_ENV === 'production') {
  throw new Error('Seed must not run in production')
}

async function main() {
  // Tags
  const tags = await Promise.all(
    [
      { slug: 'react', label: 'React', color: '#61DAFB' },
      { slug: 'typescript', label: 'TypeScript', color: '#3178C6' },
      { slug: 'node', label: 'Node.js', color: '#339933' },
      { slug: 'postgres', label: 'PostgreSQL', color: '#4169E1' },
      { slug: 'nextjs', label: 'Next.js', color: '#000000' },
      { slug: 'tailwind', label: 'Tailwind CSS', color: '#06B6D4' },
    ].map((tag) =>
      prisma.tag.upsert({
        where: { slug: tag.slug },
        update: {},
        create: tag,
      }),
    ),
  )

  console.log(`Seeded ${tags.length} tags`)

  // Admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL
  const adminPassword = process.env.SEED_ADMIN_PASSWORD

  if (!adminEmail || !adminPassword) {
    console.warn('SEED_ADMIN_EMAIL or SEED_ADMIN_PASSWORD not set — skipping admin user')
  } else {
    const bcrypt = await import('bcryptjs')
    const passwordHash = await bcrypt.hash(adminPassword, 12)

    const admin = await prisma.user.upsert({
      where: { email: adminEmail },
      update: {},
      create: { email: adminEmail, passwordHash },
    })

    console.log(`Seeded admin user: ${admin.email}`)

    // Example project
    const project = await prisma.project.upsert({
      where: { slug: 'example-project' },
      update: {},
      create: {
        slug: 'example-project',
        title: 'Example Project',
        shortDescription: 'A sample project to verify the admin UI works.',
        descriptionMd: '## Example\n\nThis is a seed project.',
        featured: true,
        published: true,
        displayOrder: 0,
        projectTags: {
          create: [
            { tag: { connect: { slug: 'react' } } },
            { tag: { connect: { slug: 'typescript' } } },
          ],
        },
      },
    })

    console.log(`Seeded project: ${project.title}`)

    // Example post
    const post = await prisma.post.upsert({
      where: { slug: 'hello-world' },
      update: {},
      create: {
        slug: 'hello-world',
        title: 'Hello World',
        excerpt: 'The first post on the blog.',
        contentMd: '## Hello\n\nThis is a seed post.',
        readingMinutes: 1,
        publishedAt: new Date(),
        authorId: admin.id,
      },
    })

    console.log(`Seeded post: ${post.title}`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())

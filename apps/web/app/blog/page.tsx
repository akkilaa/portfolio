import { pageMeta } from '@/lib/site'
import { getPosts } from '@/services/posts'
import BlogHero from '@/components/organisms/BlogHero'
import BlogShell from '@/components/organisms/BlogShell'

export const revalidate = 60

export const metadata = pageMeta(
  'blog - akkila.dev',
  'Field notes from building products end to end.',
)

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <BlogHero count={posts.length} />
      <BlogShell posts={posts} />
    </>
  )
}

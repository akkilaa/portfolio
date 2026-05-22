import { getPosts } from '@/lib/posts'
import BlogHero from '@/components/organisms/BlogHero'
import BlogShell from '@/components/organisms/BlogShell'

export const revalidate = 60

export const metadata = {
  title: 'blog — akkila.dev',
  description: 'Field notes from building products end-to-end.',
}

export default async function BlogPage() {
  const posts = await getPosts()

  return (
    <>
      <BlogHero count={posts.length} />
      <BlogShell posts={posts} />
    </>
  )
}

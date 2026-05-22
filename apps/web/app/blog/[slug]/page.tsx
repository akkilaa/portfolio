import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPost, getAllSlugs } from '@/lib/posts'
import { extractToc } from '@/lib/markdown'
import PostHeader from '@/components/organisms/PostHeader'
import PostToc from '@/components/organisms/PostToc'
import MarkdownContent from '@/components/organisms/MarkdownContent'
import PostFooter from '@/components/organisms/PostFooter'

export const revalidate = 60

export async function generateStaticParams() {
  const slugs = await getAllSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) return {}
  return { title: `${post.title} — akkila.dev`, description: post.excerpt }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPost(slug)
  if (!post) notFound()

  const toc = extractToc(post.contentMd)

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_240px] gap-16 py-16 pb-24 max-[1040px]:grid-cols-1 max-[1040px]:gap-8 max-[1040px]:py-10">
      <div>
        <Link
          href="/blog"
          className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] inline-flex items-center gap-1.5 mb-7 transition-colors duration-150 hover:text-[var(--accent)]"
        >
          ← cd ../blog
        </Link>

        <PostHeader post={post} />
        <MarkdownContent>{post.contentMd}</MarkdownContent>

        <PostFooter />
      </div>

      <PostToc items={toc} />
    </div>
  )
}

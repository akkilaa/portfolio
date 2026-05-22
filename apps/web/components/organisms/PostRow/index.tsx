import Link from 'next/link'
import { formatDate, type PostListItemResponse } from '@/lib/posts'
import Tag from '@/components/atoms/Tag'

const PostRow = ({ post }: { post: PostListItemResponse }) => {
  const d = formatDate(post.publishedAt)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group relative grid grid-cols-[120px_1fr_auto] gap-7 items-baseline py-[22px] border-b border-[var(--border)] first:border-t transition-[padding-left] duration-220 hover:pl-3 max-[760px]:grid-cols-1 max-[760px]:gap-2"
    >
      <span className="absolute left-[-22px] top-[26px] font-[family-name:var(--font-mono)] text-[var(--accent)] opacity-0 -translate-x-1.5 transition-[opacity,transform] duration-200 group-hover:opacity-100 group-hover:translate-x-0 max-[760px]:hidden">
        →
      </span>

      <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] tracking-[0.02em] whitespace-nowrap">
        {d.month} {d.day}{' '}
        <span className="text-[var(--text-faint)]">·{String(d.year).slice(2)}</span>
      </div>

      <div className="min-w-0">
        <h3 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(18px,2vw,22px)] tracking-[-0.02em] text-[var(--text-bright)] m-0 mb-1.5 transition-colors duration-200 group-hover:text-[var(--accent)]">
          {post.title}
        </h3>
        <p className="text-[14px] text-[var(--text)] m-0 mb-3 leading-[1.55] max-w-[70ch] text-pretty">
          {post.excerpt}
        </p>
        <div className="flex gap-2 flex-wrap items-center">
          {post.tags.map((t) => (
            <Tag key={t.id} label={`#${t.label}`} />
          ))}
        </div>
      </div>

      <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] whitespace-nowrap text-right self-center max-[760px]:text-left">
        <span className="text-[var(--accent)]">{String(post.readingMinutes).padStart(2, '0')}</span>{' '}
        min
      </div>
    </Link>
  )
}

export default PostRow

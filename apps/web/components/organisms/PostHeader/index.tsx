import { formatDate, type PostDetailResponse } from '@/services/posts'
import Tag from '@/components/atoms/Tag'

const PostHeader = ({ post }: { post: PostDetailResponse }) => {
  const d = formatDate(post.publishedAt ?? post.createdAt)

  return (
    <header className="pb-8 mb-10 border-b border-[var(--border)]">
      <div className="flex gap-1.5 flex-wrap mb-[18px]">
        {post.tags.map((t, i) => (
          <Tag key={t.id} label={`#${t.label}`} highlighted={i === 0} />
        ))}
      </div>

      <h1 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(32px,4.6vw,52px)] leading-[1.08] tracking-[-0.035em] text-[var(--text-bright)] m-0 mb-[18px] text-balance">
        {post.title}
      </h1>

      <div className="flex gap-3.5 flex-wrap items-center font-[family-name:var(--font-mono)] text-[12.5px] text-[var(--text-dim)]">
        <span className="inline-flex items-center gap-2 text-[var(--text-bright)]">
          <span
            className="w-[22px] h-[22px] rounded-full grid place-items-center text-[11px] font-bold text-[#001a0e]"
            style={{
              background:
                'linear-gradient(135deg, var(--accent), color-mix(in oklab, var(--accent) 60%, #000))',
            }}
          >
            a
          </span>
          akkila
        </span>
        <span className="text-[var(--text-faint)]">·</span>
        <span>
          {d.month} {d.day}, {d.year}
        </span>
        <span className="text-[var(--text-faint)]">·</span>
        <span>{post.readingMinutes} min read</span>
      </div>

      {post.coverImage && (
        <div className="mt-8 rounded-xl overflow-hidden">
          <img src={post.coverImage} alt={post.title} className="w-full h-auto block" />
        </div>
      )}
    </header>
  )
}

export default PostHeader

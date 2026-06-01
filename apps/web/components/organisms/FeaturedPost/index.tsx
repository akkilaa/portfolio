import Link from 'next/link'
import { formatDate, type PostListItemResponse } from '@/services/posts'

const FeaturedPost = ({ post }: { post: PostListItemResponse }) => {
  const d = formatDate(post.publishedAt)
  const terminalSlug = post.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block relative grid grid-cols-[1fr_1.2fr] border border-[var(--border)] rounded-[14px] bg-[var(--surface)] overflow-hidden mb-8 transition-[border-color] duration-220 hover:border-[var(--accent)] max-[940px]:grid-cols-1"
    >
      {/* Terminal cover */}
      <div
        className="relative min-h-[280px] border-r border-[var(--border)] grid place-items-center overflow-hidden max-[940px]:border-r-0 max-[940px]:border-b max-[940px]:min-h-[220px]"
        style={{
          background:
            'radial-gradient(circle at 30% 30%, var(--accent-dim) 0%, transparent 60%), linear-gradient(135deg, #0f1614 0%, #0a0a0a 70%)',
        }}
      >
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--dot-base) 1px, transparent 1.4px)',
            backgroundSize: '22px 22px',
          }}
        />
        <pre className="relative z-[1] font-[family-name:var(--font-mono)] text-[var(--accent)] text-left leading-[1.4] text-[13px] p-6 border border-[var(--accent)] rounded-[10px] shadow-[0_0_32px_-8px_var(--accent-glow)] max-w-[75%] bg-[color-mix(in_oklab,var(--bg)_80%,transparent)] whitespace-pre-wrap">
          <span>{`$ cat post.md\n─────────────────\n`}</span>
          <span className="text-[var(--text-faint)]">{`# ${terminalSlug}`}</span>
          {`\n`}
          <span className="text-[var(--text-dim)]">tags:</span>
          {` [`}
          <span className="text-[var(--accent)]">{post.tags.map((t) => t.label).join(', ')}</span>
          {`]\n`}
          <span className="text-[var(--text-dim)]">read:</span>
          {` ~${post.readingMinutes}min`}
        </pre>
      </div>

      {/* Body */}
      <div className="p-8 flex flex-col gap-3.5 max-[940px]:p-[22px]">
        <span className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] text-[var(--accent)]">
          ★ FEATURED · LATEST
        </span>
        <h2 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(22px,2.6vw,30px)] tracking-[-0.02em] leading-[1.18] text-[var(--text-bright)] m-0">
          {post.title}
        </h2>
        <p className="text-[15px] leading-[1.6] text-[var(--text)] m-0 text-pretty">
          {post.excerpt}
        </p>
        <div className="flex gap-3.5 font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] items-center flex-wrap">
          <span>
            {d.month} {d.day}, {d.year}
          </span>
          <span className="text-[var(--text-faint)]">·</span>
          <span>{post.readingMinutes} min read</span>
          <span className="text-[var(--text-faint)]">·</span>
          <span>{post.tags.map((t) => `#${t.label}`).join('  ')}</span>
        </div>
        <span className="mt-1.5 font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)] inline-flex items-center gap-1.5">
          read post →
        </span>
      </div>
    </Link>
  )
}

export default FeaturedPost

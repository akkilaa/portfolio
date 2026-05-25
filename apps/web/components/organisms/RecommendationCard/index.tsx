import AuthorProfileCard from '@/components/organisms/AuthorProfileCard'
import type { RecommendationWithAuthor } from '@/lib/recommendations'
import { formatDate } from '@/utils/dateUtils'

const RecommendationCard = ({ rec }: { rec: RecommendationWithAuthor }) => {
  const { author } = rec

  return (
    <article className="border border-[var(--border)] bg-[var(--surface)] rounded-[14px] p-6 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-4">
        <AuthorProfileCard
          displayName={author.displayName}
          avatarUrl={author.avatarUrl}
          profileUrl={author.profileUrl}
          username={author.username}
          provider={author.provider}
        />
        <div className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)] whitespace-nowrap shrink-0">
          {formatDate(rec.createdAt)}
        </div>
      </div>

      <blockquote className="font-[family-name:var(--font-sans)] text-[14px] text-[var(--text)] leading-[1.65] m-0 border-l-2 border-[var(--accent)] pl-4">
        &ldquo;{rec.comment}&rdquo;
      </blockquote>

      <div className="flex items-center gap-1.5 font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)]">
        <span className="text-[var(--accent)]">✓</span>
        verified via {author.provider}
      </div>
    </article>
  )
}

export default RecommendationCard

interface StatusBadgeProps {
  published: boolean
  featured: boolean
}

const StatusBadge = ({ published, featured }: StatusBadgeProps) => (
  <span className="flex gap-1.5 items-center">
    <span
      className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${published ? 'bg-[var(--accent)]' : 'bg-[var(--text-faint)]'}`}
    />
    <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)]">
      {published ? 'live' : 'draft'}
    </span>
    {featured && (
      <span className="font-[family-name:var(--font-mono)] text-[10px] text-amber-400 border border-amber-400/30 rounded px-1 leading-5">
        featured
      </span>
    )}
  </span>
)

export default StatusBadge

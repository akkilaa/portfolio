interface EmptyStateProps {
  message?: string
  hint?: string
}

const EmptyState = ({
  message = '// no matches',
  hint = 'Try a different tag or clear the search.',
}: EmptyStateProps) => (
  <div className="py-16 text-center font-[family-name:var(--font-mono)] text-[14px] text-[var(--text-dim)]">
    <div className="text-[var(--accent)] mb-2">{message}</div>
    <div>{hint}</div>
  </div>
)

export default EmptyState

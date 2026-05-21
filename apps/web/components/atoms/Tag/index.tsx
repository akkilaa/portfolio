interface TagProps {
  label: string
  highlighted?: boolean
}

const base = 'font-[family-name:var(--font-mono)] text-[11px] px-2 py-1 border rounded-[4px]'
const normal = 'border-[var(--border-strong)] text-[var(--text-dim)]'
const lit = 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-dim)]'

const Tag = ({ label, highlighted = false }: TagProps) => (
  <span className={`${base} ${highlighted ? lit : normal}`}>{label}</span>
)

export default Tag

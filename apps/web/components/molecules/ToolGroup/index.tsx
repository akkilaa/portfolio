interface ToolGroupProps {
  group: string
  items: [string, boolean][]
}

const chipBase =
  'font-[family-name:var(--font-mono)] text-[12px] px-2.5 py-[5px] border rounded-[6px] transition-[border-color,color,background] duration-150'
const chipDefault =
  'border-[var(--border-strong)] text-[var(--text)] hover:border-[var(--accent)] hover:text-[var(--accent)] hover:bg-[var(--accent-dim)]'
const chipStar = 'border-[var(--accent)] text-[var(--accent)] bg-[var(--accent-dim)]'

const ToolGroup = ({ group, items }: ToolGroupProps) => (
  <div className="border border-[var(--border)] rounded-xl bg-[var(--surface)] p-5">
    <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] tracking-[0.05em] mb-3.5 flex items-center gap-2">
      <span className="text-[var(--accent)]">▹</span>
      {group}
    </div>
    <div className="flex flex-wrap gap-[7px]">
      {items.map(([tech, star]) => (
        <span key={tech} className={`${chipBase} ${star ? chipStar : chipDefault}`}>
          {tech}
        </span>
      ))}
    </div>
  </div>
)

export default ToolGroup

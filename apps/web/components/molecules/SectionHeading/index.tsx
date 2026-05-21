interface SectionHeadingProps {
  num: string
  label: string
  title: string
  aside?: React.ReactNode
}

const SectionHeading = ({ num, label, title, aside }: SectionHeadingProps) => (
  <div className="flex items-baseline justify-between gap-6 mb-9 pb-5 border-b border-[var(--border)]">
    <div>
      <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] tracking-[0.05em]">
        <span className="text-[var(--accent)] mr-2">{num}</span>
        {label}
      </div>
      <h2 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(28px,3.5vw,40px)] tracking-[-0.03em] text-[var(--text-bright)] mt-2 mb-0">
        {title}
      </h2>
    </div>
    {aside && (
      <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] text-right">
        {aside}
      </div>
    )}
  </div>
)

export default SectionHeading

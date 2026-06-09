interface NowCardProps {
  verb: string
  what: string
  detail: string
}

const NowCard = ({ verb, what, detail }: NowCardProps) => (
  <div className="relative overflow-hidden border border-[var(--border)] rounded-xl bg-[var(--surface)] p-5 group">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_100%_0%,var(--accent-dim),transparent_60%)] opacity-0 group-hover:opacity-100 transition-opacity duration-[250ms] pointer-events-none" />
    <div className="font-[family-name:var(--font-mono)] text-[11px] tracking-[0.08em] text-[var(--accent)] mb-2.5">
      ▸ {verb}
    </div>
    <p className="text-[15px] text-[var(--text-bright)] leading-[1.45] m-0 mb-1">{what}</p>
    <p className="text-[13px] text-[var(--text-dim)] leading-[1.45] m-0">{detail}</p>
  </div>
)

export default NowCard

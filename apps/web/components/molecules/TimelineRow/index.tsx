interface TimelineRowProps {
  when: string
  title: string
  body: string
}

const TimelineRow = ({ when, title, body }: TimelineRowProps) => (
  <div className="grid grid-cols-[100px_1fr] gap-8 pb-10 last:pb-0 max-[640px]:grid-cols-1 max-[640px]:gap-1 max-[640px]:pb-8">
    <div className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-dim)] pt-0.5 text-right max-[640px]:text-left">
      {when}
    </div>
    <div className="relative pl-[22px] border-l border-[var(--border)] max-[640px]:pl-5">
      <span className="absolute left-[-5px] top-[5px] w-[9px] h-[9px] rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]" />
      <h4 className="font-[family-name:var(--font-mono)] text-[14px] font-medium text-[var(--text-bright)] mt-0 mb-1.5">
        {title}
      </h4>
      <p className="text-[14px] leading-[1.6] text-[var(--text-dim)] m-0">{body}</p>
    </div>
  </div>
)

export default TimelineRow

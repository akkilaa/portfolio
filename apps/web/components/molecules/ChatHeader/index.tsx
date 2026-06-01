import Blip from '@/components/atoms/Blip'

const ChatHeader = () => (
  <div className="flex items-center justify-between font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] border-b border-dashed border-[var(--border)] pb-3 mb-3.5">
    <div className="flex gap-1.5">
      <span className="w-[10px] h-[10px] rounded-full bg-[var(--border-strong)]" />
      <span className="w-[10px] h-[10px] rounded-full bg-[var(--border-strong)]" />
      <span className="w-[10px] h-[10px] rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent-glow)]" />
    </div>
    <span className="tracking-[0.04em] whitespace-nowrap">~/ask-me.sh</span>
    <span className="flex items-center gap-1.5">
      <Blip size={6} />
      ready
    </span>
  </div>
)

export default ChatHeader

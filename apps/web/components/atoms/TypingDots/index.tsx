import './styles.css'

const dot =
  'w-[5px] h-[5px] rounded-full bg-[var(--accent)] animate-[typingBounce_1.2s_ease-in-out_infinite]'

const TypingDots = () => (
  <span className="inline-flex items-center gap-1 h-[1em]" aria-label="Typing…">
    <span className={dot} />
    <span className={`${dot} [animation-delay:0.15s]`} />
    <span className={`${dot} [animation-delay:0.3s]`} />
  </span>
)

export default TypingDots

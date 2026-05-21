import './styles.css'

const Blip = ({ size = 7 }: { size?: number }) => (
  <span
    className="rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent-glow)] animate-[blip-pulse_1.6s_ease-in-out_infinite] inline-block shrink-0"
    style={{ width: size, height: size }}
    aria-hidden="true"
  />
)

export default Blip

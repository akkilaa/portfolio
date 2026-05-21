'use client'

interface ChipProps {
  label: string
  onClick: () => void
  disabled?: boolean
}

const Chip = ({ label, onClick, disabled = false }: ChipProps) => (
  <button
    className="font-[family-name:var(--font-mono)] text-[11.5px] py-1.5 px-2.5 border border-[var(--border)] rounded-full text-[var(--text-dim)] bg-[var(--surface-2)] transition-[border-color,color] duration-150 whitespace-nowrap hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-40 disabled:cursor-not-allowed"
    onClick={onClick}
    disabled={disabled}
  >
    {label}
  </button>
)

export default Chip

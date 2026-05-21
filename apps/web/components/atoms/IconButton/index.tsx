import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
}

const IconButton = ({ icon, label, ...props }: IconButtonProps) => (
  <button
    className="relative grid place-items-center w-10 h-10 p-0 border border-[var(--border-strong)] rounded-lg text-[var(--text-bright)] bg-[var(--surface)] shrink-0 transition-[border-color,background,transform,color] duration-[180ms] hover:border-[var(--accent)] hover:text-[var(--accent)] active:translate-y-px"
    aria-label={label}
    {...props}
  >
    {icon}
  </button>
)

export default IconButton

import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode
  label: string
}

const BASE =
  'flex items-center justify-center w-9 h-9 p-0 border border-[var(--border)] rounded-lg text-[var(--text-dim)] shrink-0 transition-[border-color,color] duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50'

const IconButton = ({ icon, label, className, ...props }: IconButtonProps) => (
  <button className={className ? `${BASE} ${className}` : BASE} aria-label={label} {...props}>
    {icon}
  </button>
)

export default IconButton

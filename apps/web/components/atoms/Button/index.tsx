import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react'

type ButtonOwnProps = {
  variant?: 'default' | 'primary' | 'icon' | 'plain'
  children?: ReactNode
}

type ButtonProps<T extends ElementType = 'button'> = ButtonOwnProps & {
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps | 'as'>

const base =
  'relative font-[family-name:var(--font-mono)] text-[13px] tracking-[-0.005em] rounded-lg whitespace-nowrap shrink-0 transition-[border-color,background,transform,color] duration-[180ms] active:translate-y-px'

const variants = {
  default:
    "inline-flex items-center gap-2.5 py-3 px-[18px] border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-bright)] hover:border-[var(--accent)] hover:text-[var(--accent)] before:content-['$'] before:text-[var(--text-faint)]",
  primary:
    "inline-flex items-center gap-2.5 py-3 px-[18px] border border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)] font-semibold hover:bg-transparent hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_24px_-4px_var(--accent-glow)] before:content-['→'] before:text-[var(--on-accent)] hover:before:text-[var(--accent)]",
  icon: 'grid place-items-center w-10 h-10 p-0 border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-bright)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
  plain: 'inline-flex items-center gap-1.5 text-[var(--text-dim)] hover:text-[var(--accent)]',
} as const

const Button = <T extends ElementType = 'button'>({
  as,
  variant = 'default',
  children,
  ...props
}: ButtonProps<T>) => {
  const Component = (as ?? 'button') as ElementType
  return (
    <Component className={`${base} ${variants[variant]}`} {...props}>
      {children}
    </Component>
  )
}

export default Button

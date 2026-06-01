import type { ElementType, ComponentPropsWithoutRef, ReactNode } from 'react'

type ButtonOwnProps = {
  variant?: 'default' | 'primary' | 'icon' | 'plain' | 'ghost' | 'bare'
  children?: ReactNode
}

type ButtonProps<T extends ElementType = 'button'> = ButtonOwnProps & {
  as?: T
} & Omit<ComponentPropsWithoutRef<T>, keyof ButtonOwnProps | 'as'>

const withRequiredClasses = (classNames: string) =>
  `${classNames} cursor-pointer disabled:cursor-not-allowed disabled:opacity-50`

const base =
  'relative font-[family-name:var(--font-mono)] whitespace-nowrap shrink-0 transition-[border-color,background,transform,color] duration-[180ms] active:translate-y-px'

const variants = {
  default:
    "inline-flex items-center gap-2.5 py-3 px-[18px] text-[13px] tracking-[-0.005em] rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-bright)] hover:border-[var(--accent)] hover:text-[var(--accent)] before:content-['$'] before:text-[var(--text-faint)]",
  primary:
    "inline-flex items-center gap-2.5 py-3 px-[18px] text-[13px] tracking-[-0.005em] rounded-lg border border-[var(--accent)] bg-[var(--accent)] text-[var(--on-accent)] font-semibold hover:bg-transparent hover:border-[var(--accent)] hover:text-[var(--accent)] hover:shadow-[0_0_24px_-4px_var(--accent-glow)] before:content-['→'] before:text-[var(--on-accent)] hover:before:text-[var(--accent)]",
  icon: 'grid place-items-center w-10 h-10 p-0 text-[13px] tracking-[-0.005em] rounded-lg border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text-bright)] hover:border-[var(--accent)] hover:text-[var(--accent)]',
  plain:
    'inline-flex items-center gap-1.5 text-[13px] tracking-[-0.005em] rounded-lg text-[var(--text-dim)] hover:text-[var(--accent)]',
  ghost:
    'inline-flex items-center py-1.5 px-2.5 text-[11px] tracking-[0.06em] rounded-[6px] border border-[var(--border-strong)] text-[var(--text-dim)] hover:text-[var(--accent)] hover:border-[var(--accent)]',
} as const

const Button = <T extends ElementType = 'button'>({
  as,
  variant = 'default',
  children,
  className,
  ...props
}: ButtonProps<T> & { className?: string }) => {
  const Component = (as ?? 'button') as ElementType
  const cls =
    variant === 'bare'
      ? (withRequiredClasses(className ?? '') ?? '')
      : withRequiredClasses([base, variants[variant], className].filter(Boolean).join(' '))
  return (
    <Component className={cls} {...props}>
      {children}
    </Component>
  )
}

export default Button

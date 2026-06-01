import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react'

const fieldCls = 'mb-[18px]'

const labelCls =
  'block font-[family-name:var(--font-mono)] text-[11px] tracking-[0.06em] text-[var(--text-dim)] mb-1.5'

const inputCls =
  'w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded-lg py-[11px] px-[14px] font-[family-name:var(--font-sans)] text-[14px] text-[var(--text-bright)] transition-[border-color] duration-150 focus:outline-none focus:border-[var(--accent)]'

interface LabelProps extends ComponentPropsWithoutRef<'label'> {
  required?: boolean
  children: ReactNode
}

interface TextProps extends ComponentPropsWithoutRef<'input'> {
  prompt?: boolean
  left?: ReactNode
  right?: ReactNode
  variant?: 'default' | 'chat'
}

const containerVariants = {
  default:
    'flex items-center gap-2.5 px-3.5 py-2.5 bg-[var(--surface)] border border-[var(--border)] rounded-[10px] transition-[border-color] duration-150 focus-within:border-[var(--accent)]',
  chat: 'flex items-center gap-2 py-2.5 px-3 bg-[var(--surface-2)] border border-[var(--border)] rounded-[10px] transition-[border-color] duration-150 focus-within:border-[var(--accent)]',
}

const inputVariants = {
  default: 'text-[13px]',
  chat: 'text-[13.5px]',
}

const Field = ({ children, className = '', ...props }: ComponentPropsWithoutRef<'div'>) => (
  <div className={`${fieldCls} ${className}`} {...props}>
    {children}
  </div>
)

const Label = ({ required, children, className = '', ...props }: LabelProps) => (
  <label className={`${labelCls} ${className}`} {...props}>
    {children}
    {required && <span className="text-[var(--accent)] ml-1">*</span>}
  </label>
)

const PromptCaret = () => (
  <span
    className="font-[family-name:var(--font-mono)] text-[var(--accent)] text-[13px]"
    aria-hidden="true"
  >
    ›
  </span>
)

const Text = forwardRef<HTMLInputElement, TextProps>(
  ({ prompt, left, right, variant = 'default', className = '', ...props }, ref) => {
    if (prompt || left || right) {
      return (
        <div className={containerVariants[variant]}>
          {prompt && <PromptCaret />}
          {left}
          <input
            ref={ref}
            className={`flex-1 font-[family-name:var(--font-mono)] ${inputVariants[variant]} text-[var(--text-bright)] bg-transparent border-none outline-none placeholder:text-[var(--text-faint)] ${className}`}
            {...props}
          />
          {right}
        </div>
      )
    }

    return <input ref={ref} className={`${inputCls} ${className}`} {...props} />
  },
)
Text.displayName = 'Input.Text'

const Textarea = ({ className = '', ...props }: ComponentPropsWithoutRef<'textarea'>) => (
  <textarea className={`${inputCls} resize-y min-h-[110px] ${className}`} {...props} />
)

const Input = { Field, Label, Text, Textarea }

export default Input

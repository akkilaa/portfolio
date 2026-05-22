'use client'

import type { ComponentPropsWithoutRef } from 'react'

interface ChipProps extends ComponentPropsWithoutRef<'button'> {
  label: string
  highlighted?: boolean
  count?: number
}

const Chip = ({ label, highlighted = false, count, className = '', ...props }: ChipProps) => (
  <button
    className={`font-[family-name:var(--font-mono)] text-[11.5px] py-1.5 px-2.5 border rounded-full whitespace-nowrap transition-[border-color,color,background] duration-150 disabled:opacity-40 disabled:cursor-not-allowed ${
      highlighted
        ? 'text-[var(--accent)] border-[var(--accent)] bg-[var(--accent-dim)]'
        : 'text-[var(--text-dim)] border-[var(--border)] bg-[var(--surface-2)] hover:text-[var(--accent)] hover:border-[var(--accent)]'
    } ${className}`}
    {...props}
  >
    {label}
    {count !== undefined && (
      <span
        className={`ml-1.5 ${highlighted ? 'text-[var(--accent)] opacity-70' : 'text-[var(--text-faint)]'}`}
      >
        {count}
      </span>
    )}
  </button>
)

export default Chip

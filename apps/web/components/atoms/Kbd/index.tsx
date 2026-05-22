import type { ReactNode } from 'react'

const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="font-[family-name:var(--font-mono)] text-[10.5px] px-[7px] py-[3px] border border-[var(--border-strong)] rounded-[4px] text-[var(--text-dim)] bg-[var(--bg)]">
    {children}
  </kbd>
)

export default Kbd

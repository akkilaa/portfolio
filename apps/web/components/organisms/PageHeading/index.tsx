import type { ReactNode } from 'react'

interface Props {
  title: ReactNode
  leadingDollar?: boolean
  middle?: string
  description?: ReactNode
}

const PageHeading = ({ title, leadingDollar, middle, description }: Props) => (
  <>
    <h1 className="font-[family-name:var(--font-mono)] font-medium text-[clamp(40px,6vw,72px)] leading-[1.02] tracking-[-0.04em] mt-0 mb-5 text-[var(--text-bright)]">
      {leadingDollar && <span className="text-[var(--text-faint)] font-light">$ </span>}
      {title}
      <span
        className="inline-block w-[0.55ch] h-[1em] bg-[var(--accent)] ml-1 [vertical-align:-10%] animate-[blink_1.05s_steps(2)_infinite]"
        aria-hidden="true"
      />
    </h1>
    {middle && (
      <p className="font-[family-name:var(--font-mono)] text-[14px] text-[var(--text-dim)] tracking-[-0.005em] mt-0 mb-7">
        {middle}
      </p>
    )}
    {description && (
      <p className="text-[17px] leading-[1.65] text-[var(--text)] max-w-[52ch] mt-0 mb-9 text-pretty">
        {description}
      </p>
    )}
  </>
)

export default PageHeading

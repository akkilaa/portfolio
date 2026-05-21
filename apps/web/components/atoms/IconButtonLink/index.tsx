import type { ReactNode } from 'react'
import Link from 'next/link'

interface IconButtonLinkProps {
  href: string
  icon: ReactNode
  label: string
  external?: boolean
}

const IconButtonLink = ({ href, icon, label, external = false }: IconButtonLinkProps) => (
  <Link
    href={href}
    className="relative grid place-items-center w-10 h-10 p-0 border border-[var(--border-strong)] rounded-lg text-[var(--text-bright)] bg-[var(--surface)] shrink-0 transition-[border-color,background,transform,color] duration-[180ms] hover:border-[var(--accent)] hover:text-[var(--accent)] active:translate-y-px"
    aria-label={label}
    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
  >
    {icon}
  </Link>
)

export default IconButtonLink

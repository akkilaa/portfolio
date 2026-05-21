'use client'

import './styles.css'
import ThemeToggle from '@/components/atoms/ThemeToggle'
import Logo from '@/components/atoms/Logo'
import Link from 'next/link'
import useHighlightActiveSection from '@/hooks/useHighlightActiveSection'

const baseLink =
  "py-2 px-[14px] font-[family-name:var(--font-mono)] text-[13px] rounded-[6px] transition-[color,background] duration-150 hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)] before:content-['~/'] before:opacity-40 before:mr-px"
const dimLink = `${baseLink} text-[var(--text-dim)]`
const activeLink = `${baseLink} text-[var(--accent)]`

const sections = [
  { id: 'top', href: '#top', label: 'home' },
  { id: 'projects', href: '#projects', label: 'projects' },
  { id: 'contact', href: '#contact', label: 'contact' },
]
const sectionIds = sections.map((s) => s.id)

const TopBar = () => {
  const active = useHighlightActiveSection(sectionIds)

  return (
    <header className="topbar sticky top-0 z-50 backdrop-blur-[12px] border-b border-[var(--border)]">
      <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between gap-6">
        <Logo />
        <nav className="flex gap-1 items-center" aria-label="Primary">
          {sections.map(({ id, href, label }) => (
            <Link key={id} href={href} className={active === id ? activeLink : dimLink}>
              {label}
            </Link>
          ))}
        </nav>
        <ThemeToggle />
      </div>
    </header>
  )
}

export default TopBar

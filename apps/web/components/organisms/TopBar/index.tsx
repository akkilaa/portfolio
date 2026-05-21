import './styles.css'
import ThemeToggle from '@/components/atoms/ThemeToggle'
import Logo from '@/components/atoms/Logo'
import Link from 'next/link'

const link =
  "py-2 px-[14px] font-[family-name:var(--font-mono)] text-[13px] text-[var(--text-dim)] rounded-[6px] transition-[color,background] duration-150 hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)] before:content-['~/'] before:opacity-40 before:mr-px"

const TopBar = () => (
  <header className="topbar sticky top-0 z-50 backdrop-blur-[12px] border-b border-[var(--border)]">
    <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between gap-6">
      <Logo />
      <nav className="flex gap-1 items-center" aria-label="Primary">
        <Link href="#chat" className={`${link} text-[var(--accent)]`}>
          home
        </Link>
        <Link href="#projects" className={link}>
          projects
        </Link>
        <Link href="#contact" className={link}>
          contact
        </Link>
      </nav>
      <ThemeToggle />
    </div>
  </header>
)

export default TopBar

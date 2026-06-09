'use client'

import './styles.css'
import ThemeToggle from '@/components/atoms/ThemeToggle'
import Logo from '@/components/atoms/Logo'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import useHighlightActiveSection from '@/hooks/useHighlightActiveSection'
import { useEscapeKey } from '@/hooks/useEscapeKey'
import { useBodyScrollLock } from '@/hooks/useBodyScrollLock'
import HamburgerButton from './HamburgerButton'
import MobileNavDrawer from './MobileNavDrawer'

const baseLink =
  "py-2 px-[14px] font-[family-name:var(--font-mono)] text-[13px] rounded-[6px] transition-[color,background] duration-150 hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)] before:content-['~/'] before:opacity-40 before:mr-px"
const dimLink = `${baseLink} text-[var(--text-dim)]`
const activeLink = `${baseLink} text-[var(--accent)]`

const sectionIds = ['top', 'projects', 'contact']

const navItems = [
  { id: 'top', href: '/#top', label: 'home' },
  { id: 'projects', href: '/#projects', label: 'projects' },
  { id: 'contact', href: '/#contact', label: 'contact' },
  { id: 'blog', href: '/blog', label: 'blog' },
  { id: 'about', href: '/about', label: 'about' },
  { id: 'recommendations', href: '/recommendations', label: 'recommendations' },
]

const TopBar = () => {
  const pathname = usePathname()
  const onBlog = pathname.startsWith('/blog')
  const onRecommendations = pathname.startsWith('/recommendations')
  const onAbout = pathname.startsWith('/about')
  const onSubpage = onBlog || onRecommendations || onAbout
  const sectionActive = useHighlightActiveSection(onSubpage ? [] : sectionIds)
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  const isActive = (id: string) => {
    if (id === 'blog') return onBlog
    if (id === 'recommendations') return onRecommendations
    if (id === 'about') return onAbout
    return !onSubpage && sectionActive === id
  }

  // Close mobile menu when Escape key is pressed
  useEscapeKey(closeMenu, menuOpen)

  // Lock body scroll while mobile menu is open
  useBodyScrollLock(menuOpen)

  return (
    <>
      <header className="topbar sticky top-0 z-50 backdrop-blur-[12px] border-b border-[var(--border)]">
        <div className="max-w-[1200px] mx-auto px-8 py-4 flex items-center justify-between gap-6">
          <Logo />
          <nav className="hidden lg:flex gap-1 items-center" aria-label="Primary">
            {navItems.map(({ id, href, label }) => (
              <Link key={id} href={href} className={isActive(id) ? activeLink : dimLink}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <HamburgerButton isOpen={menuOpen} onClick={() => setMenuOpen(true)} />
          </div>
        </div>
      </header>

      <MobileNavDrawer
        isOpen={menuOpen}
        onClose={closeMenu}
        navItems={navItems}
        isActive={isActive}
      />
    </>
  )
}

export default TopBar

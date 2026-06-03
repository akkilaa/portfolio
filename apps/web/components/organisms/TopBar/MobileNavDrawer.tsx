import Link from 'next/link'
import Logo from '@/components/atoms/Logo'

const mobileBaseLink =
  "block py-3 px-4 font-[family-name:var(--font-mono)] text-[14px] rounded-[6px] transition-[color,background] duration-150 hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)] before:content-['~/'] before:opacity-40 before:mr-px"
const mobileDimLink = `${mobileBaseLink} text-[var(--text-dim)]`
const mobileActiveLink = `${mobileBaseLink} text-[var(--accent)]`

interface NavItem {
  id: string
  href: string
  label: string
}

interface MobileNavDrawerProps {
  isOpen: boolean
  onClose: () => void
  navItems: NavItem[]
  isActive: (id: string) => boolean
}

const MobileNavDrawer = ({ isOpen, onClose, navItems, isActive }: MobileNavDrawerProps) => (
  <>
    <div
      className={`fixed inset-0 z-[100] bg-black/40 backdrop-blur-[2px] lg:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-hidden="true"
    />

    <aside
      className={`fixed top-0 right-0 h-full w-[280px] z-[101] lg:hidden flex flex-col border-l border-[var(--border)] transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ background: 'var(--bg)' }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
        <Logo />
        <button
          className="p-2 rounded-[6px] text-[var(--text-dim)] hover:text-[var(--text-bright)] hover:bg-[var(--surface-2)] transition-[color,background] duration-150"
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path
              d="M5 5l10 10M15 5L5 15"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <nav className="flex flex-col gap-1 p-4" aria-label="Mobile Primary">
        {navItems.map(({ id, href, label }) => (
          <Link
            key={id}
            href={href}
            className={isActive(id) ? mobileActiveLink : mobileDimLink}
            onClick={onClose}
          >
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  </>
)

export default MobileNavDrawer

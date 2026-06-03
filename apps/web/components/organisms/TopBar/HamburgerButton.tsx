import IconButton from '@/components/atoms/IconButton'

const MenuIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path
      d="M2 4h12M2 8h12M2 12h12"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

interface HamburgerButtonProps {
  isOpen: boolean
  onClick: () => void
}

const HamburgerButton = ({ isOpen, onClick }: HamburgerButtonProps) => (
  <IconButton
    icon={<MenuIcon />}
    label="Open menu"
    aria-expanded={isOpen}
    onClick={onClick}
    className="lg:hidden"
  />
)

export default HamburgerButton

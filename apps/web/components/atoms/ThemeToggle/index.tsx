'use client'

import { useEffect, useState } from 'react'
import IconButton from '@/components/atoms/IconButton'
import SunIcon from '@/components/atoms/SunIcon'
import MoonIcon from '@/components/atoms/MoonIcon'

const ThemeToggle = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'dark' | 'light' | null
    if (stored && stored !== 'dark') {
      setTheme(stored)
      document.documentElement.dataset.theme = stored
    }
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    document.documentElement.dataset.theme = next
    localStorage.setItem('theme', next)
  }

  return (
    <IconButton
      icon={theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      className="grid place-items-center w-9 h-9 border border-[var(--border)] rounded-lg text-[var(--text-dim)] transition-[border-color,color] duration-150 hover:border-[var(--accent)] hover:text-[var(--accent)]"
      onClick={toggle}
    />
  )
}

export default ThemeToggle

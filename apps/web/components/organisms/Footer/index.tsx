import Link from 'next/link'

import { SITE_AUTHOR } from '@/lib/site'

const footLink = 'hover:text-[var(--accent)]'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className="relative z-[1] max-w-[1200px] mx-auto px-8 border-t border-[var(--border)] pt-8 pb-14 font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] flex justify-between items-center gap-4 flex-wrap">
      <div>
        <span>© {year} akkila</span>
        <span className="text-[var(--text-faint)]"> · built fullstack, deployed to a $5 VPS</span>
      </div>
      <div className="flex gap-5">
        <Link href="/rss.xml" className={footLink}>
          /rss.xml
        </Link>
        <Link href="/sitemap.xml" className={footLink}>
          /sitemap.xml
        </Link>
        <Link href={SITE_AUTHOR.github} className={footLink}>
          github
        </Link>
        <Link href={SITE_AUTHOR.linkedin} className={footLink}>
          linkedin
        </Link>
      </div>
    </footer>
  )
}

export default Footer

const footLink = 'hover:text-[var(--accent)]'

const Footer = () => (
  <footer className="relative z-[1] max-w-[1200px] mx-auto px-8 border-t border-[var(--border)] pt-8 pb-14 font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] flex justify-between items-center gap-4 flex-wrap">
    <div>
      <span>© 2026 akkila</span>
      <span className="text-[var(--text-faint)]"> · built fullstack, deployed to a $5 VPS</span>
    </div>
    <div className="flex gap-5">
      <a href="/rss.xml" className={footLink}>
        /rss.xml
      </a>
      <a href="/sitemap.xml" className={footLink}>
        /sitemap.xml
      </a>
      <a href="https://github.com/akkila" className={footLink}>
        github
      </a>
      <a href="https://linkedin.com/in/akkila" className={footLink}>
        linkedin
      </a>
    </div>
  </footer>
)

export default Footer

const Rss = () => (
  <div className="flex gap-3 flex-wrap items-center mt-2 mb-20 p-5 border border-dashed border-[var(--border-strong)] rounded-[12px] bg-[var(--surface)]">
    <div className="w-9 h-9 grid place-items-center bg-[var(--accent-dim)] text-[var(--accent)] rounded-[8px] shrink-0">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M6.18 15.64a2.18 2.18 0 1 1 0 4.36 2.18 2.18 0 0 1 0-4.36zM4 4.44C12.51 4.44 19.56 11.49 19.56 20H16.5C16.5 13.18 10.82 7.5 4 7.5V4.44zm0 5.6c5.43 0 9.92 4.49 9.92 9.92H10.86c0-3.79-3.07-6.86-6.86-6.86v-3.06z" />
      </svg>
    </div>
    <div className="flex-1 min-w-[200px]">
      <strong className="font-[family-name:var(--font-mono)] font-medium text-[14px] text-[var(--text-bright)]">
        Subscribe via RSS
      </strong>
      <p className="text-[13px] text-[var(--text-dim)] mt-1 mb-0">
        New posts hit your reader instantly — no email, no tracking.
      </p>
    </div>
    <a
      href="/rss.xml"
      className="font-[family-name:var(--font-mono)] text-[12px] py-2 px-4 border border-[var(--border-strong)] rounded-[8px] text-[var(--text-dim)] transition-[color,border-color] duration-150 hover:text-[var(--accent)] hover:border-[var(--accent)]"
    >
      /rss.xml
    </a>
  </div>
)

export default Rss

import Link from 'next/link'

const PostFooter = () => {
  return (
    <div className="mt-16 pt-8 border-t border-[var(--border)] flex justify-between gap-6 flex-wrap">
      <div className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] flex gap-3.5 items-center flex-wrap">
        <span className="text-[var(--text-faint)]">share:</span>
        {['twitter', 'linkedin', 'copy link'].map((l) => (
          <Link
            href="#"
            key={l}
            className="transition-colors duration-150 hover:text-[var(--accent)]"
          >
            {l}
          </Link>
        ))}
      </div>
      {/* <Link
        href="#"
        className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] inline-flex items-center gap-1.5 transition-colors duration-150 hover:text-[var(--accent)]"
      >
        // TODO: Separate this to svg bundle and use an icon component
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
          <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        edit on github
      </Link> */}
    </div>
  )
}

export default PostFooter

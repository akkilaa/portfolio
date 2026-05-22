'use client'

import useHighlightActiveSection from '@/hooks/useHighlightActiveSection'
import type { TocItem } from '@/lib/markdown'

const PostToc = ({ items }: { items: TocItem[] }) => {
  const ids = items.map((i) => i.id)
  const active = useHighlightActiveSection(ids, ids[0])

  return (
    <aside
      className="sticky top-24 self-start font-[family-name:var(--font-mono)] text-[12.5px] max-h-[calc(100vh-120px)] overflow-y-auto max-[1040px]:hidden"
      aria-label="table of contents"
    >
      <div className="text-[var(--text-dim)] tracking-[0.06em] mb-4 pb-2 border-b border-[var(--border)]">
        <span className="text-[var(--accent)]">##</span> ON THIS PAGE
      </div>
      <ol className="list-none p-0 m-0 flex flex-col gap-0.5">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={`block py-1.5 border-l transition-[color,border-color,padding] duration-180 leading-[1.4] hover:text-[var(--text-bright)] hover:border-l-[var(--accent)] ${
                item.level === 3 ? 'pl-[26px] text-[11.5px]' : 'pl-3.5'
              } ${
                active === item.id
                  ? 'text-[var(--accent)] border-l-[var(--accent)] ' +
                    (item.level === 3 ? 'pl-[30px]' : 'pl-[18px]')
                  : 'text-[var(--text-dim)] border-l-[var(--border)]'
              }`}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  )
}

export default PostToc

import type { PostResponse } from '@portfolio/shared'

interface PostListProps {
  posts: PostResponse[]
  selectedId: string | null
  isCreating: boolean
  onSelect: (post: PostResponse) => void
  onNew: () => void
}

const PostList = ({ posts, selectedId, isCreating, onSelect, onNew }: PostListProps) => (
  <aside className="w-64 shrink-0 border-r border-[var(--border)] bg-[var(--surface)] flex flex-col overflow-hidden">
    <div className="px-4 py-3 border-b border-[var(--border)] shrink-0 flex items-center justify-between">
      <p className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)] uppercase tracking-wider">
        posts ({posts.length})
      </p>
      <button
        onClick={onNew}
        className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--accent)] hover:opacity-70 transition-opacity cursor-pointer"
      >
        + new
      </button>
    </div>
    <ul className="overflow-y-auto flex-1">
      {isCreating && (
        <li>
          <div className="w-full text-left px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)] border-l-2 border-l-[var(--accent)] pl-[14px]">
            <p className="text-sm text-[var(--text-bright)] truncate italic">new post…</p>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="inline-block w-1.5 h-1.5 rounded-full shrink-0 bg-[var(--text-faint)]" />
              <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)]">
                draft
              </span>
            </div>
          </div>
        </li>
      )}
      {posts.map((p) => {
        const published = p.publishedAt !== null
        return (
          <li key={p.id}>
            <button
              onClick={() => onSelect(p)}
              className={`w-full text-left px-4 py-3 border-b border-[var(--border)] transition-colors hover:bg-[var(--surface-2)] ${
                !isCreating && selectedId === p.id
                  ? 'bg-[var(--surface-2)] border-l-2 border-l-[var(--accent)] pl-[14px]'
                  : ''
              }`}
            >
              <p className="text-sm text-[var(--text-bright)] truncate">{p.title}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <span
                  className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${published ? 'bg-[var(--accent)]' : 'bg-[var(--text-faint)]'}`}
                />
                <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)]">
                  {published ? 'live' : 'draft'}
                </span>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  </aside>
)

export default PostList

import type { PostResponse } from '@portfolio/shared'
import Button from '@/components/atoms/Button'
import Input from '@/components/molecules/Input'
import MarkdownEditor from '../AdminProjectsShell/MarkdownEditor'

export type EditorState = {
  title: string
  slug: string
  excerpt: string
  contentMd: string
  coverImage: string
  tags: string
}

export function postToEditor(p: PostResponse): EditorState {
  return {
    title: p.title,
    slug: p.slug,
    excerpt: p.excerpt,
    contentMd: p.contentMd,
    coverImage: p.coverImage ?? '',
    tags: p.tags.map((t) => t.slug).join(', '),
  }
}

export const emptyEditor = (): EditorState => ({
  title: '',
  slug: '',
  excerpt: '',
  contentMd: '',
  coverImage: '',
  tags: '',
})

interface PostEditorProps {
  post: PostResponse | null
  editor: EditorState
  saving: boolean
  saved: boolean
  error: string
  onChange: (key: keyof EditorState, value: string) => void
  onSave: () => void
  onTogglePublish?: () => void
}

const PostEditor = ({
  post,
  editor,
  saving,
  saved,
  error,
  onChange,
  onSave,
  onTogglePublish,
}: PostEditorProps) => {
  const isNew = post === null
  const published = !isNew && post.publishedAt !== null

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--surface)] shrink-0 gap-4 flex-wrap">
        {isNew ? (
          <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)]">
            new post
          </span>
        ) : (
          <span className="flex gap-1.5 items-center">
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${published ? 'bg-[var(--accent)]' : 'bg-[var(--text-faint)]'}`}
            />
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)]">
              {published ? 'live' : 'draft'}
            </span>
            <span className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-faint)]">
              · {post.readingMinutes} min read
            </span>
          </span>
        )}

        <div className="flex items-center gap-2 ml-auto flex-wrap">
          {error && (
            <span className="font-[family-name:var(--font-mono)] text-xs text-red-400">
              {error}
            </span>
          )}
          {saved && (
            <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent)]">
              saved
            </span>
          )}

          {!isNew && onTogglePublish && (
            <Button
              variant="ghost"
              onClick={onTogglePublish}
              className={
                published
                  ? 'hover:border-red-400/50 hover:text-red-400'
                  : 'border-[var(--accent)] text-[var(--accent)]'
              }
            >
              {published ? 'unpublish' : 'publish'}
            </Button>
          )}

          <Button variant="primary" onClick={onSave} disabled={saving}>
            {saving ? (isNew ? 'creating…' : 'saving…') : isNew ? 'create' : 'save'}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-2 gap-x-5 gap-y-0 max-[700px]:grid-cols-1">
          <Input.Field>
            <Input.Label>TITLE</Input.Label>
            <Input.Text value={editor.title} onChange={(e) => onChange('title', e.target.value)} />
          </Input.Field>
          <Input.Field>
            <Input.Label>SLUG</Input.Label>
            <Input.Text value={editor.slug} onChange={(e) => onChange('slug', e.target.value)} />
          </Input.Field>
          <Input.Field className="col-span-2 max-[700px]:col-span-1">
            <Input.Label>EXCERPT</Input.Label>
            <Input.Textarea
              value={editor.excerpt}
              onChange={(e) => onChange('excerpt', e.target.value)}
              className="min-h-[80px]"
            />
          </Input.Field>
          <Input.Field className="col-span-2 max-[700px]:col-span-1">
            <Input.Label>COVER IMAGE</Input.Label>
            <Input.Text
              type="url"
              placeholder="https://…"
              value={editor.coverImage}
              onChange={(e) => onChange('coverImage', e.target.value)}
            />
          </Input.Field>
          <Input.Field className="col-span-2 max-[700px]:col-span-1">
            <Input.Label>KEYWORDS / TAGS</Input.Label>
            <Input.Text
              placeholder="turborepo, prisma, devops"
              value={editor.tags}
              onChange={(e) => onChange('tags', e.target.value)}
            />
          </Input.Field>
        </div>

        <MarkdownEditor
          label="content (markdown)"
          value={editor.contentMd}
          onChange={(v) => onChange('contentMd', v)}
        />
      </div>
    </main>
  )
}

export default PostEditor

import type { ProjectResponse } from '@portfolio/shared'
import Button from '@/components/atoms/Button'
import Input from '@/components/molecules/Input'
import StatusBadge from './StatusBadge'
import MarkdownEditor from './MarkdownEditor'

export type EditorState = {
  title: string
  slug: string
  tagline: string
  shortDescription: string
  descriptionMd: string
  liveUrl: string
  repoUrl: string
  role: string
  startedAt: string
  endedAt: string
}

export function projectToEditor(p: ProjectResponse): EditorState {
  return {
    title: p.title,
    slug: p.slug,
    tagline: p.tagline ?? '',
    shortDescription: p.shortDescription,
    descriptionMd: p.descriptionMd,
    liveUrl: p.liveUrl ?? '',
    repoUrl: p.repoUrl ?? '',
    role: p.role ?? '',
    startedAt: p.startedAt ? p.startedAt.slice(0, 10) : '',
    endedAt: p.endedAt ? p.endedAt.slice(0, 10) : '',
  }
}

interface ProjectEditorProps {
  project: ProjectResponse
  editor: EditorState
  saving: boolean
  saved: boolean
  error: string
  onChange: (key: keyof EditorState, value: string) => void
  onSave: () => void
  onTogglePublish: () => void
  onToggleFeatured: () => void
}

const ProjectEditor = ({
  project,
  editor,
  saving,
  saved,
  error,
  onChange,
  onSave,
  onTogglePublish,
  onToggleFeatured,
}: ProjectEditorProps) => (
  <main className="flex-1 flex flex-col overflow-hidden">
    <div className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--surface)] shrink-0 gap-4 flex-wrap">
      <StatusBadge published={project.published} featured={project.featured} />

      <div className="flex items-center gap-2 ml-auto flex-wrap">
        {error && (
          <span className="font-[family-name:var(--font-mono)] text-xs text-red-400">{error}</span>
        )}
        {saved && (
          <span className="font-[family-name:var(--font-mono)] text-xs text-[var(--accent)]">
            saved
          </span>
        )}

        <Button
          variant="ghost"
          onClick={onToggleFeatured}
          className={project.featured ? 'border-amber-400/50 text-amber-400' : ''}
        >
          {project.featured ? 'unfeature' : 'feature'}
        </Button>

        <Button
          variant="ghost"
          onClick={onTogglePublish}
          className={
            project.published
              ? 'hover:border-red-400/50 hover:text-red-400'
              : 'border-[var(--accent)] text-[var(--accent)]'
          }
        >
          {project.published ? 'unpublish' : 'publish'}
        </Button>

        <Button variant="primary" onClick={onSave} disabled={saving}>
          {saving ? 'saving…' : 'save'}
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
        <Input.Field>
          <Input.Label>TAGLINE</Input.Label>
          <Input.Text
            value={editor.tagline}
            onChange={(e) => onChange('tagline', e.target.value)}
          />
        </Input.Field>
        <Input.Field>
          <Input.Label>ROLE</Input.Label>
          <Input.Text value={editor.role} onChange={(e) => onChange('role', e.target.value)} />
        </Input.Field>
        <Input.Field className="col-span-2 max-[700px]:col-span-1">
          <Input.Label>SHORT DESCRIPTION</Input.Label>
          <Input.Text
            value={editor.shortDescription}
            onChange={(e) => onChange('shortDescription', e.target.value)}
          />
        </Input.Field>
        <Input.Field>
          <Input.Label>LIVE URL</Input.Label>
          <Input.Text
            type="url"
            value={editor.liveUrl}
            onChange={(e) => onChange('liveUrl', e.target.value)}
          />
        </Input.Field>
        <Input.Field>
          <Input.Label>REPO URL</Input.Label>
          <Input.Text
            type="url"
            value={editor.repoUrl}
            onChange={(e) => onChange('repoUrl', e.target.value)}
          />
        </Input.Field>
        <Input.Field>
          <Input.Label>STARTED AT</Input.Label>
          <Input.Text
            type="date"
            value={editor.startedAt}
            onChange={(e) => onChange('startedAt', e.target.value)}
          />
        </Input.Field>
        <Input.Field>
          <div className="flex items-center justify-between mb-1.5">
            <Input.Label className="mb-0">ENDED AT</Input.Label>
            {editor.endedAt ? (
              <button
                type="button"
                onClick={() => onChange('endedAt', '')}
                className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)] hover:text-[var(--accent)] transition-colors cursor-pointer"
              >
                mark ongoing
              </button>
            ) : null}
          </div>
          {editor.endedAt ? (
            <Input.Text
              type="date"
              value={editor.endedAt}
              onChange={(e) => onChange('endedAt', e.target.value)}
            />
          ) : (
            <div className="flex items-center justify-between w-full bg-[var(--bg)] border border-[var(--border-strong)] rounded-lg py-[11px] px-[14px]">
              <span className="font-[family-name:var(--font-mono)] text-[13px] text-[var(--accent)]">
                ongoing
              </span>
              <button
                type="button"
                onClick={() => onChange('endedAt', new Date().toISOString().slice(0, 10))}
                className="font-[family-name:var(--font-mono)] text-[11px] text-[var(--text-dim)] hover:text-[var(--text-bright)] transition-colors cursor-pointer"
              >
                set date
              </button>
            </div>
          )}
        </Input.Field>
      </div>

      <MarkdownEditor value={editor.descriptionMd} onChange={(v) => onChange('descriptionMd', v)} />
    </div>
  </main>
)

export default ProjectEditor

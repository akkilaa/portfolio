'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import type { ProjectResponse } from '@portfolio/shared'
import Button from '@/components/atoms/Button'
import {
  adminGetProjects,
  adminUpdateProject,
  adminPublishProject,
  adminUnpublishProject,
  adminFeatureProject,
  adminUnfeatureProject,
  adminLogout,
} from '@/services/admin'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import ProjectList from './ProjectList'
import ProjectEditor, { type EditorState, projectToEditor } from './ProjectEditor'

const AdminProjectsShell = () => {
  const router = useRouter()
  const [projects, setProjects] = useState<ProjectResponse[]>([])
  const [selected, setSelected] = useState<ProjectResponse | null>(null)
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async () => {
    const items = await adminGetProjects()
    setProjects(items)
  }, [])

  useEffect(() => {
    load().catch(() => router.push('/admin/login'))
  }, [load, router])

  function selectProject(p: ProjectResponse) {
    setSelected(p)
    setEditor(projectToEditor(p))
    setSaveError('')
    setSaved(false)
  }

  function updateField(key: keyof EditorState, value: string) {
    setEditor((prev) => (prev ? { ...prev, [key]: value } : prev))
    setSaved(false)
  }

  function flashSaved() {
    setSaved(true)
    if (savedTimer.current) clearTimeout(savedTimer.current)
    savedTimer.current = setTimeout(() => setSaved(false), 2000)
  }

  function syncProject(updated: ProjectResponse) {
    setSelected(updated)
    setProjects((prev) => prev.map((p) => (p.id === updated.id ? updated : p)))
  }

  async function handleSave() {
    if (!selected || !editor) return
    setSaving(true)
    setSaveError('')
    try {
      const updated = await adminUpdateProject(selected.id, {
        title: editor.title,
        slug: editor.slug,
        tagline: editor.tagline || null,
        shortDescription: editor.shortDescription,
        descriptionMd: editor.descriptionMd,
        liveUrl: editor.liveUrl || null,
        repoUrl: editor.repoUrl || null,
        role: editor.role || null,
      })
      syncProject(updated)
      flashSaved()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  useSaveShortcut(handleSave)

  async function handleTogglePublish() {
    if (!selected) return
    try {
      const updated = selected.published
        ? await adminUnpublishProject(selected.id)
        : await adminPublishProject(selected.id)
      syncProject(updated)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Action failed')
    }
  }

  async function handleToggleFeatured() {
    if (!selected) return
    try {
      const updated = selected.featured
        ? await adminUnfeatureProject(selected.id)
        : await adminFeatureProject(selected.id)
      syncProject(updated)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Action failed')
    }
  }

  async function handleLogout() {
    await adminLogout()
    router.push('/admin/login')
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
        <span className="font-[family-name:var(--font-mono)] text-sm">
          <span className="text-[var(--text-faint)]">~/</span>
          <span className="text-[var(--text-bright)]">admin</span>
        </span>
        <Button variant="plain" onClick={handleLogout}>
          logout
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <ProjectList
          projects={projects}
          selectedId={selected?.id ?? null}
          onSelect={selectProject}
        />

        {editor && selected ? (
          <ProjectEditor
            project={selected}
            editor={editor}
            saving={saving}
            saved={saved}
            error={saveError}
            onChange={updateField}
            onSave={handleSave}
            onTogglePublish={handleTogglePublish}
            onToggleFeatured={handleToggleFeatured}
          />
        ) : (
          <main className="flex-1 flex items-center justify-center">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--text-faint)]">
              select a project to edit
            </p>
          </main>
        )}
      </div>
    </div>
  )
}

export default AdminProjectsShell

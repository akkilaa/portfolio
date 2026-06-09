'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import type { PostResponse } from '@portfolio/shared'
import Button from '@/components/atoms/Button'
import {
  adminGetMe,
  adminGetPosts,
  adminCreatePost,
  adminUpdatePost,
  adminPublishPost,
  adminUnpublishPost,
  adminLogout,
} from '@/services/admin'
import { useSaveShortcut } from '@/hooks/useSaveShortcut'
import PostList from './PostList'
import PostEditor, { type EditorState, postToEditor, emptyEditor } from './PostEditor'

const AdminBlogShell = () => {
  const router = useRouter()
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [selected, setSelected] = useState<PostResponse | null>(null)
  const [editor, setEditor] = useState<EditorState | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [saved, setSaved] = useState(false)
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const load = useCallback(async () => {
    const [items, me] = await Promise.all([adminGetPosts(), adminGetMe()])
    setPosts(items)
    setCurrentUserId(me.id)
  }, [])

  useEffect(() => {
    load().catch(() => router.push('/admin/login'))
  }, [load, router])

  function selectPost(p: PostResponse) {
    setIsCreating(false)
    setSelected(p)
    setEditor(postToEditor(p))
    setSaveError('')
    setSaved(false)
  }

  function startNew() {
    setIsCreating(true)
    setSelected(null)
    setEditor(emptyEditor())
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

  function syncPost(updated: PostResponse) {
    setSelected(updated)
    setIsCreating(false)
    setPosts((prev) => {
      const exists = prev.some((p) => p.id === updated.id)
      return exists ? prev.map((p) => (p.id === updated.id ? updated : p)) : [updated, ...prev]
    })
  }

  async function handleSave() {
    if (!editor) return
    setSaving(true)
    setSaveError('')
    try {
      const tagSlugs = editor.tags
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      if (isCreating) {
        if (!currentUserId) throw new Error('User not loaded')
        const created = await adminCreatePost({
          title: editor.title,
          slug: editor.slug,
          excerpt: editor.excerpt,
          contentMd: editor.contentMd,
          authorId: currentUserId,
          ...(editor.coverImage ? { coverImage: editor.coverImage } : {}),
          ...(tagSlugs.length ? { tagSlugs } : {}),
        })
        syncPost(created)
        flashSaved()
      } else {
        if (!selected) return
        const updated = await adminUpdatePost(selected.id, {
          title: editor.title,
          slug: editor.slug,
          excerpt: editor.excerpt,
          contentMd: editor.contentMd,
          coverImage: editor.coverImage || null,
          tagSlugs,
        })
        syncPost(updated)
        flashSaved()
      }
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
      const published = selected.publishedAt !== null
      const updated = published
        ? await adminUnpublishPost(selected.id)
        : await adminPublishPost(selected.id)
      syncPost(updated)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Action failed')
    }
  }

  async function handleLogout() {
    await adminLogout()
    router.push('/admin/login')
  }

  const showEditor = editor !== null && (isCreating || selected !== null)

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-3 border-b border-[var(--border)] bg-[var(--surface)] shrink-0">
        <div className="flex items-center gap-4">
          <span className="font-[family-name:var(--font-mono)] text-sm">
            <span className="text-[var(--text-faint)]">~/</span>
            <span className="text-[var(--text-bright)]">admin</span>
          </span>
          <nav className="flex items-center gap-1">
            <Link
              href="/admin"
              className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] hover:text-[var(--accent)] px-2 py-1 rounded transition-colors"
            >
              projects
            </Link>
            <span className="text-[var(--border-strong)]">/</span>
            <span className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--accent)] px-2 py-1">
              blog
            </span>
            <span className="text-[var(--border-strong)]">/</span>
            <Link
              href="/admin/recommendations"
              className="font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)] hover:text-[var(--accent)] px-2 py-1 rounded transition-colors"
            >
              recommendations
            </Link>
          </nav>
        </div>
        <Button variant="plain" onClick={handleLogout}>
          logout
        </Button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <PostList
          posts={posts}
          selectedId={selected?.id ?? null}
          isCreating={isCreating}
          onSelect={selectPost}
          onNew={startNew}
        />

        {showEditor ? (
          <PostEditor
            post={selected}
            editor={editor}
            saving={saving}
            saved={saved}
            error={saveError}
            onChange={updateField}
            onSave={handleSave}
            onTogglePublish={isCreating ? undefined : handleTogglePublish}
          />
        ) : (
          <main className="flex-1 flex items-center justify-center">
            <p className="font-[family-name:var(--font-mono)] text-sm text-[var(--text-faint)]">
              select a post to edit
            </p>
          </main>
        )}
      </div>
    </div>
  )
}

export default AdminBlogShell

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeRaw from 'rehype-raw'
import type { Highlighter } from 'shiki'
import { getHighlighter, codeBlockTransformer } from '@/lib/shiki'
import CopyButton from '../../atoms/CopyButton'

import './style.css'

function makePre(highlighter: Highlighter) {
  return function Pre({ children }: { children?: React.ReactNode }) {
    const child = Array.isArray(children) ? children[0] : children
    if (!child || typeof child !== 'object' || !('props' in child)) {
      return <pre>{children}</pre>
    }

    const childProps = (child as React.ReactElement<Record<string, unknown>>).props
    const lang = /language-(\w+)/.exec(String(childProps.className ?? ''))?.[1]
    if (!lang) return <pre>{children}</pre>

    const code = String(childProps.children ?? '').replace(/\n$/, '')

    const html = highlighter
      .codeToHtml(code, {
        lang,
        theme: 'houston',
        transformers: [codeBlockTransformer],
      })
      .replace(/#4BF3C8/gi, 'var(--accent)')

    return (
      <div className="rounded-[8px] border border-[var(--border)] overflow-hidden my-[1.4em]">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--surface-2)]">
          <div className="flex items-center gap-2 font-[family-name:var(--font-mono)] text-[12px] text-[var(--text-dim)]">
            <span className="w-[7px] h-[7px] rounded-full bg-[var(--accent)] shrink-0" />
            <span>{lang}</span>
          </div>
          <CopyButton code={code} />
        </div>
        <div dangerouslySetInnerHTML={{ __html: html }} />
      </div>
    )
  }
}

const MarkdownContent = async ({ children }: { children: string }) => {
  const highlighter = await getHighlighter()
  const Pre = makePre(highlighter)

  return (
    <article className="post-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug]}
        components={{ pre: Pre }}
      >
        {children}
      </ReactMarkdown>
    </article>
  )
}

export default MarkdownContent

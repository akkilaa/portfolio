import { unified } from 'unified'
import remarkParse from 'remark-parse'
import GithubSlugger from 'github-slugger'

export interface TocItem {
  id: string
  text: string
  level: number
}

export function extractToc(md: string): TocItem[] {
  const tree = unified().use(remarkParse).parse(md)
  const slugger = new GithubSlugger()
  const items: TocItem[] = []

  for (const node of tree.children) {
    if (node.type !== 'heading' || node.depth < 2 || node.depth > 3) continue
    const text = (node.children as Array<{ type: string; value?: string }>)
      .filter((c) => c.type === 'text' || c.type === 'inlineCode')
      .map((c) => c.value ?? '')
      .join('')
    items.push({ id: slugger.slug(text), text, level: node.depth })
  }

  return items
}

import { createHighlighter, type Highlighter } from 'shiki'

let promise: Promise<Highlighter> | null = null

export function getHighlighter(): Promise<Highlighter> {
  if (!promise) {
    promise = createHighlighter({
      themes: ['houston'],
      langs: [
        'typescript',
        'javascript',
        'tsx',
        'jsx',
        'bash',
        'sh',
        'json',
        'css',
        'html',
        'sql',
        'yaml',
        'markdown',
        'python',
        'rust',
        'ini',
        'toml',
        'dockerfile',
        'go',
        'diff',
        'xml',
        'text',
      ],
    })
  }
  return promise
}

const CODE_BLOCK_STYLE = 'padding:20px 24px;margin:0;border-radius:0'

export const codeBlockTransformer = {
  pre(node: { properties: { style?: string } }) {
    node.properties.style = `${node.properties.style ?? ''};${CODE_BLOCK_STYLE}`
  },
}

'use client'

import { cn } from '@/lib/utils'

interface MarkdownRendererProps {
  content: string
  className?: string
}

// 簡単なMarkdown to HTMLコンバーター
const markdownToHtml = (markdown: string): string => {
  // リスト項目を先に処理
  let html = markdown
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^\* (.*$)/gim, '<li>$1</li>')
    .replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>')

  // 段落を処理（連続する改行で区切られたテキストブロックを<p>タグで囲む）
  const paragraphs = html.split(/\n\s*\n/)
  const processedParagraphs = paragraphs.map(paragraph => {
    // リスト項目が含まれている場合はそのまま
    if (paragraph.includes('<ul>') || paragraph.includes('<li>')) {
      return paragraph
    }
    // 通常のテキストは改行を<br>に変換して<p>で囲む
    return `<p>${paragraph.replace(/\n/g, '<br>')}</p>`
  })

  return processedParagraphs.join('')
}

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  if (!content) {
    return null
  }

  return (
    <div
      className={cn(
        "prose prose-sm max-w-none",
        "prose-headings:mt-2 prose-headings:mb-1",
        "prose-p:my-1 prose-ul:my-0 prose-li:my-0",
        "prose-ul:pl-4 prose-ol:pl-4",
        "break-words overflow-wrap-anywhere",
        className
      )}
      dangerouslySetInnerHTML={{ __html: markdownToHtml(content) }}
    />
  )
}
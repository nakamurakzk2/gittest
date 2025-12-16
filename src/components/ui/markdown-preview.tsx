'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Eye, Edit } from 'lucide-react'

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  rows?: number
  error?: boolean
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

export function MarkdownEditor({
  value,
  onChange,
  placeholder,
  className,
  rows = 4,
  error = false
}: MarkdownEditorProps) {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit')

  return (
    <div className={cn("border rounded-md", className)}>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'edit' | 'preview')}>
        <div className="flex items-center justify-between border-b px-3 py-2 bg-muted/50">
          <TabsList className="grid w-fit grid-cols-2 bg-background">
            <TabsTrigger value="edit" className="flex items-center gap-1">
              <Edit className="h-3 w-3" />
              編集
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              プレビュー
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="edit" className="m-0">
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            className={cn(
              "border-0 focus-visible:ring-0 rounded-none",
              error && "border-red-500 focus-visible:ring-red-500"
            )}
          />
        </TabsContent>

        <TabsContent value="preview" className="m-0">
          <div
            className={cn(
              "min-h-[100px] p-3 prose prose-sm max-w-none",
              "prose-headings:mt-2 prose-headings:mb-1",
              "prose-p:my-1 prose-ul:my-1 prose-li:my-0"
            )}
            style={{ minHeight: `${rows * 24 + 24}px` }}
          >
            {value ? (
              <div dangerouslySetInnerHTML={{ __html: markdownToHtml(value) }} />
            ) : (
              <p className="text-muted-foreground italic">{placeholder || 'プレビューはここに表示されます'}</p>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
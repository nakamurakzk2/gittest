import { useState } from "react"
import { X } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

type Props = {
  tags: string[]
  suggestedTags: string[]
  onAddTag: (tag: string) => void
  onRemoveTag: (tag: string) => void
  className?: string
}

export default function TagInput({ tags, suggestedTags, onAddTag, onRemoveTag, className }: Props) {
  const [tagInput, setTagInput] = useState("")
  const [isTagPopoverOpen, setIsTagPopoverOpen] = useState(false)

  const onClickAddTag = (tag: string) => {
    const trimmedTag = tag.trim()
    if (trimmedTag && !tags.includes(trimmedTag)) {
      onAddTag(trimmedTag)
    }
    setTagInput("")
    setIsTagPopoverOpen(false)
  }

  const onKeyDownTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput) {
      e.preventDefault()
      const newTags = tagInput.split(',').map((t: string) => t.trim()).filter((t: string) => t && !tags.includes(t))
      newTags.forEach((tag: string) => onAddTag(tag))
      setTagInput("")
    }
  }

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2 mb-2">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
            {tag}
            <button
              onClick={() => onRemoveTag(tag)}
              className="hover:bg-accent rounded-full"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
      <div className="flex gap-2">
        <Popover open={isTagPopoverOpen} onOpenChange={setIsTagPopoverOpen}>
          <PopoverTrigger asChild>
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={onKeyDownTagInput}
              className="max-w-md"
            />
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandInput
                placeholder="タグを入力"
                value={tagInput}
                onValueChange={setTagInput}
              />
              <CommandList>
                <CommandGroup heading="既存タグ">
                  {suggestedTags
                    .filter(tag =>
                      tag.toLowerCase().includes(tagInput.toLowerCase()) &&
                      !tags.includes(tag)
                    )
                    .map(tag => (
                      <CommandItem
                        key={tag}
                        value={tag}
                        onSelect={() => onClickAddTag(tag)}
                      >
                        {tag}
                      </CommandItem>
                    ))
                  }
                </CommandGroup>
                <CommandGroup heading="新規追加">
                  {tagInput.length > 0 && (
                    <CommandItem onSelect={() => onClickAddTag(tagInput)}>
                      {tagInput}を追加
                    </CommandItem>
                  )}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
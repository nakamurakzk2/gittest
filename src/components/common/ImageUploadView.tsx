'use client'

import { useState } from "react"
import { Upload, ImageIcon } from "lucide-react"
import Image from "next/image"

// Components
import { Button } from "@/components/ui/button"

// Providers
import { toast } from "@/components/hooks/use-toast"
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as ImageUploadLogic from "@/logic/image/image-upload-logic"

type Props = {
  image: string
  setImage: (value: string) => void
  type: 'product' | 'form' | 'town'
  description?: string
  placeholder?: string
  className?: string
}

export default function ImageUploadView({
  image,
  setImage,
  type,
  description = "画像ここにドラッグ&ドロップ",
  placeholder = "または",
  className = ""
}: Props) {
  const { onFetch } = useDialog()
  const [isDragging, setIsDragging] = useState(false)

  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'エラー',
        description: '画像ファイルを選択してください。',
        variant: 'destructive',
      })
      return
    }
    await onFetch(async () => {
      let imageUrl = ''
      switch (type) {
        case 'product': {
          imageUrl = await ImageUploadLogic.uploadProductImage(file)
          break
        }
        case 'form': {
          imageUrl = await ImageUploadLogic.uploadFormImage(file)
          break
        }
        case 'town': {
          imageUrl = await ImageUploadLogic.uploadTownImage(file)
          break
        }
      }
      setImage(imageUrl)
    })
  }

  const onImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      await handleImageUpload(file)
    }
  }

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const onDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) {
      await handleImageUpload(file)
    }
  }

  const inputId = `image-upload-${Math.random().toString(36).substring(2, 11)}`

  return (
    <div className={className}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
      >
        {image ? (
          <div className="text-center space-y-4">
            <div className="relative w-32 h-32 mx-auto">
              <Image
                src={image}
                alt='画像'
                fill
                className="object-cover rounded-lg"
              />
            </div>
            <Button variant="outline" onClick={() => setImage('')}>
              画像を削除
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{description}</p>
              <p className="text-xs text-gray-500">{placeholder}</p>
            </div>
            <Button variant="outline" onClick={() => document.getElementById(inputId)?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              画像を選択
            </Button>
            <input
              id={inputId}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </div>
        )}
      </div>
    </div>
  )
}
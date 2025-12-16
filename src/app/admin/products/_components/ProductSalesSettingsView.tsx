'use client'

import { X, Plus } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUploadView from "@/components/common/ImageUploadView"
import IntegerInput from "@/components/ui/integer-input"

interface ProductSalesSettingsViewProps {
  price: number
  setPrice: (price: number) => void
  images: string[]
  setImages: (images: string[]) => void
  stock: number
  setStock: (stock: number) => void
  buyLimit: number | null
  setBuyLimit: (buyLimit: number | null) => void
  hideStock: boolean
  setHideStock: (hideStock: boolean) => void
  chatEnabled: boolean
  setChatEnabled: (chatEnabled: boolean) => void
}

export default function ProductSalesSettingsView({
  price,
  setPrice,
  images,
  setImages,
  stock,
  setStock,
  buyLimit,
  setBuyLimit,
  hideStock,
  setHideStock,
  chatEnabled,
  setChatEnabled
}: ProductSalesSettingsViewProps) {
  const addImage = () => {
    setImages([...images, ""])
  }

  const updateImage = (index: number, imageUrl: string) => {
    const newImages = [...images]
    newImages[index] = imageUrl
    setImages(newImages)
  }

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index))
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">販売設定</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-0 space-y-6">
        {/* 価格 */}
        <div>
          <Label htmlFor="price" className="text-sm font-medium">
            価格 <span className="text-red-500">*</span>
          </Label>
          <IntegerInput
            id="price"
            value={price}
            onChange={setPrice}
            placeholder="0"
            min={0}
            prefix="¥"
          />
        </div>

        {/* 商品画像 */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">
              商品画像 <span className="text-muted-foreground text-xs">(任意)</span>
            </Label>
            <Button type="button" onClick={addImage} size="sm" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              画像を追加
            </Button>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <ImageUploadView
                    image={imageUrl}
                    setImage={(url) => updateImage(index, url)}
                    type="product"
                    description={`商品画像 ${index + 1}`}
                    placeholder="画像をアップロード"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 z-10"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {images.length === 0 && (
            <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
              <p className="text-sm">画像が追加されていません</p>
              <p className="text-xs mt-1">「画像を追加」ボタンをクリックして画像をアップロードしてください</p>
            </div>
          )}
        </div>

        {/* 在庫設定 */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="stock" className="text-sm font-medium">
              在庫数 <span className="text-red-500">*</span>
            </Label>
            <IntegerInput
              id="stock"
              value={stock}
              onChange={setStock}
              placeholder="0"
              min={0}
            />
          </div>
          <div>
            <Label htmlFor="buyLimit" className="text-sm font-medium">
              1ユーザ当たりの購入上限数 <span className="text-muted-foreground text-xs">(任意)</span>
            </Label>
            <Input
              id="buyLimit"
              type="number"
              min="1"
              value={buyLimit || ""}
              onChange={(e) => setBuyLimit(Number(e.target.value))}
              placeholder="空欄で制限なし"
            />
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/50">
          <Switch
            id="hideStock"
            checked={hideStock}
            onCheckedChange={(checked) => setHideStock(checked)}
          />
          <div>
            <Label htmlFor="hideStock" className="text-sm font-medium cursor-pointer">
              在庫数を非表示にする
            </Label>
            <p className="text-xs text-muted-foreground">
              商品ページで在庫数を表示しない設定です
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-3 rounded-lg border bg-muted/50">
          <Switch
            id="chatEnabled"
            checked={chatEnabled}
            onCheckedChange={(checked) => setChatEnabled(checked)}
          />
          <div>
            <Label htmlFor="chatEnabled" className="text-sm font-medium cursor-pointer">
              事前相談を有効にする
            </Label>
            <p className="text-xs text-muted-foreground">
              購入前にユーザーが相談できる機能を有効にします
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
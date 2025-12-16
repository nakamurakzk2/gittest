"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, ArrowLeft, Copy, ExternalLink } from "lucide-react"
import { useRouter } from "next/navigation"

// Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ImageUploadView from "@/components/common/ImageUploadView"

// Entity
import { DEFAULT_CHAIN_ID } from "@/define/contract"
import { Collection, Attribute, CollectionDraft } from "@/entity/product/contract"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider"
import { useDialog } from "@/providers/dialog-provider"
import { toast } from "@/components/hooks/use-toast"

// Logic
import * as AdminContractServerLogic from "@/logic/server/admin/admin-contract-server-logic"
import * as CommonLogic from "@/logic/common-logic"
import { AdminUserType } from "@/entity/admin/user"

interface Props {
  productId: string
  collection?: Collection | null
  collectionDraft?: CollectionDraft | null
}

export default function CollectionEditView({ productId, collection, collectionDraft }: Props) {
  const chainId = DEFAULT_CHAIN_ID

  const router = useRouter()
  const { onFetch } = useDialog()
  const { simpleAdminUser } = useAdminSession()

  const [name, setName] = useState("")
  const [symbol, setSymbol] = useState("")
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [image, setImage] = useState("")
  const [attributes, setAttributes] = useState<Attribute[]>([])

  const isEditMode = !!collection
  const isDraftMode = simpleAdminUser != null && simpleAdminUser.adminUserType === AdminUserType.BUSINESS

  // 編集モードの場合、既存データをセット
  useEffect(() => {
    if (collection) {
      setName(collection.name)
      setSymbol(collection.symbol)
      setTitle(collection.title)
      setDescription(collection.description)
      setImage(collection.image)
      setAttributes(collection.attributes || [])
    }
  }, [collection])
  useEffect(() => {
    if (collectionDraft) {
      setName(collectionDraft.name)
      setSymbol(collectionDraft.symbol)
      setTitle(collectionDraft.title)
      setDescription(collectionDraft.description)
      setImage(collectionDraft.image)
      setAttributes(collectionDraft.attributes || [])
    }
  }, [collectionDraft])

  /**
   * 戻るボタン
   */
  const onClickBack = () => {
    router.back()
  }

  /**
   * 属性追加
   */
  const onClickAddAttribute = () => {
    setAttributes([...attributes, { trait_type: "", value: "" }])
  }

  /**
   * 属性削除
   */
  const onClickRemoveAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index))
  }

  /**
   * 属性更新
   */
  const onChangeAttribute = (index: number, field: keyof Attribute, value: string) => {
    const newAttributes = [...attributes]
    newAttributes[index] = { ...newAttributes[index], [field]: value }
    setAttributes(newAttributes)
  }

  /**
   * コントラクトアドレスをコピー
   */
  const onClickCopyAddress = async () => {
    if (collection == null || collection.contractAddress == null) {
      return
    }
    await navigator.clipboard.writeText(collection.contractAddress)
    toast({
      title: "コピー完了",
      description: "コントラクトアドレスをクリップボードにコピーしました。"
    })
  }

  /**
   * Explorerを開く
   */
  const onClickOpenExplorer = () => {
    if (collection == null || collection.contractAddress == null) {
      return
    }
    const explorerUrl = CommonLogic.getExplorerAddressUrl(chainId, collection.contractAddress)
    window.open(explorerUrl, '_blank')
  }

  /**
   * コレクション作成/更新実行
   */
  const onClickSubmit = async () => {
    if (!name.trim() || !symbol.trim() || !image.trim()) {
      return
    }

    await onFetch(async () => {
      if (isEditMode && collection) {
        // 編集モード
        const updatedCollection: Collection = {
          ...collection,
          name: name.trim(),
          symbol: symbol.trim().toUpperCase(),
          title: title.trim(),
          description: description.trim(),
          image: image.trim(),
          attributes: attributes.filter(attr => attr.trait_type.trim() && attr.value.trim())
        }
        await AdminContractServerLogic.updateCollection(updatedCollection)
        toast({
          title: "更新完了",
          description: "NFT情報を更新しました。"
        })
      } else if (isDraftMode) {
        await AdminContractServerLogic.createCollectionDraft(
          productId,
          chainId,
          name.trim(),
          symbol.trim().toUpperCase(),
          image.trim(),
          title.trim(),
          description.trim(),
          attributes.filter(attr => attr.trait_type.trim() && attr.value.trim())
        )
        toast({
          title: "作成完了",
          description: "NFTコレクションの下書きを作成しました。"
        })
      } else {
        await AdminContractServerLogic.createCollection(
          productId,
          chainId,
          name.trim(),
          symbol.trim().toUpperCase(),
          image.trim(),
          title.trim(),
          description.trim(),
          attributes.filter(attr => attr.trait_type.trim() && attr.value.trim())
        )
        toast({
          title: "作成完了",
          description: "NFTコレクションを作成しました。"
        })
      }
      router.push(`/admin/products`)
    })
  }

  const isFormValid = name.trim() && symbol.trim() && image.trim()

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{isDraftMode ? "NFTコレクション下書き編集" : isEditMode ? "NFTコレクション編集" : "NFTコレクション作成"}</CardTitle>
          <Button variant="outline" onClick={onClickBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            戻る
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* コントラクトアドレス（編集時のみ表示） */}
        {isEditMode && collection?.contractAddress && (
          <div className="space-y-2">
            <Label>コントラクトアドレス</Label>
            <div className="flex items-center space-x-2">
              <div className="flex-1 p-3 bg-gray-50 border rounded-md font-mono text-sm text-gray-700">
                {collection.contractAddress}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClickCopyAddress}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onClickOpenExplorer}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {/* コレクション名 */}
        <div className="space-y-2">
          <Label htmlFor="collection-name">コレクション名（英語のみ）</Label>
          {isEditMode ? (
            <div className="p-3 bg-gray-50 border rounded-md font-mono text-sm text-gray-700">
              {name}
            </div>
          ) : (
            <Input
              id="collection-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例）CryptoNinjaPartners"
            />
          )}
        </div>

        {/* シンボル */}
        <div className="space-y-2">
          <Label htmlFor="collection-symbol">シンボル（大文字英語）</Label>
          {isEditMode ? (
            <div className="p-3 bg-gray-50 border rounded-md font-mono text-sm text-gray-700">
              {symbol}
            </div>
          ) : (
            <Input
              id="collection-symbol"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value.toUpperCase())}
              placeholder="例）CNP"
              maxLength={10}
            />
          )}
        </div>

        {/* タイトル */}
        <div className="space-y-2">
          <Label htmlFor="collection-title">NFTのタイトル</Label>
          <Input
            id="collection-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例）Crypto Ninja Partners"
          />
          <div className="text-sm text-gray-500">
            (例) {`${title} #001`}
          </div>
        </div>

        {/* 説明 */}
        <div className="space-y-2">
          <Label htmlFor="collection-description">説明</Label>
          <Textarea
            id="collection-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="コレクションの説明を入力してください"
            rows={3}
          />
        </div>

        {/* 画像 */}
        <div className="space-y-2">
          <Label>NFTの画像</Label>
          <ImageUploadView
            image={image}
            setImage={setImage}
            type="product"
            description="コレクション画像をアップロード"
            placeholder="または"
            className="w-full"
          />
        </div>

        {/* 属性 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>属性</Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onClickAddAttribute}
            >
              <Plus className="h-3 w-3 mr-1" />
              属性追加
            </Button>
          </div>
          {attributes.map((attribute, index) => (
            <div key={index} className="flex space-x-2">
              <Input
                placeholder="属性名"
                value={attribute.trait_type}
                onChange={(e) => onChangeAttribute(index, "trait_type", e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="値"
                value={attribute.value}
                onChange={(e) => onChangeAttribute(index, "value", e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onClickRemoveAttribute(index)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>

        {/* ボタン */}
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClickBack}>
            キャンセル
          </Button>
          <Button onClick={onClickSubmit} disabled={!isFormValid}>
            {isDraftMode ? "下書きを保存" : isEditMode ? "更新" : "作成"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

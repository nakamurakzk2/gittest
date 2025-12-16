"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { HomeIcon } from "lucide-react"
import Link from "next/link"

// Components
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import CollectionEditView from "@/app/admin/products/_components/CollectionEditView"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Entity
import { ProductItem } from "@/entity/product/product"
import { Collection, CollectionDraft } from "@/entity/product/contract"

// Logic
import * as AdminContractServerLogic from "@/logic/server/admin/admin-contract-server-logic"


export default function CollectionEditPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const productId = params.productId as string
  const isDraft = searchParams.get("draft") === "true"

  const { onFetch } = useDialog()
  const [productItem, setProductItem] = useState<ProductItem | null>(null)
  const [collection, setCollection] = useState<Collection | null>(null)
  const [collectionDraft, setCollectionDraft] = useState<CollectionDraft | null>(null)

  const reload = async () => {
    await onFetch(async () => {
      if (isDraft) {
        const { productItem, collectionDraft } = await AdminContractServerLogic.fetchCollectionDraft(productId)
        setProductItem(productItem)
        setCollectionDraft(collectionDraft)
      } else {
        const { productItem, collection } = await AdminContractServerLogic.fetchCollection(productId)
        setProductItem(productItem)
        setCollection(collection)
      }
    })
  }

  useEffect(() => {
    reload()
  }, [productId])

  if (productItem == null) {
    return null
  }

  return (
    <main className="max-w-4xl mx-auto px-2 py-6">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin" className="flex items-center gap-1">
                <HomeIcon className="h-4 w-4" /> Admin
              </Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/admin/products">商品管理</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{productItem.title.ja} NFT{collection == null ? "作成" : "編集"}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <CollectionEditView
        productId={productId}
        collection={collection}
        collectionDraft={collectionDraft}
      />
    </main>
  )
}

"use client"

import { ProductItem, SimpleProductItem } from "@/entity/product/product"
import HoverImageView from "./HoverImageView"
import { useLanguageSession } from "@/providers/language-provider"

type Props = {
  productItems: SimpleProductItem[]
  itemsPerRow?: number
}

export default function ProductItemImagesView({ productItems, itemsPerRow = 3 }: Props) {
  const { getLocalizedText } = useLanguageSession()

  return (
    <div className={`grid grid-cols-${itemsPerRow} gap-2`}>
      {productItems.map((productItem) => (
        <div key={productItem.productId}>
          <HoverImageView
            href={`/product/${productItem.productGroupId}?productId=${productItem.productId}`}
            imageSrc={productItem.images[0]}
            imageAlt={getLocalizedText(productItem.title)}
            hoverText={productItem.title}
          />
        </div>
      ))}
    </div>
  )
}

'use client'

import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

// Entity
import { SimpleProductItem } from "@/entity/product/product"
import { SimpleBusiness } from "@/entity/town/business"

// Components
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { MarkdownRenderer } from "@/components/ui/markdown-renderer"

// Providers
import { useLanguageSession } from "@/providers/language-provider"

// Define
import { LANGUAGE_LIST } from "@/define/language"

interface ProductDetailCollapsibleProps {
  product: SimpleProductItem
  business: SimpleBusiness
}

export default function ProductDetailCollapsible({ product, business }: ProductDetailCollapsibleProps) {
  const { getLocalizedText } = useLanguageSession()
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false)
  const [isPaymentOpen, setIsPaymentOpen] = useState(false)
  const [isBusinessOpen, setIsBusinessOpen] = useState(false)

  return (
    <div className="space-y-4">
      <Collapsible open={isDeliveryOpen} onOpenChange={setIsDeliveryOpen} className="border-b">
        <CollapsibleTrigger className="flex items-center justify-between w-full pb-3">
          <span className="font-medium">{getLocalizedText(LANGUAGE_LIST.DeliveryInfo)}</span>
          {isDeliveryOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="py-5">
          <MarkdownRenderer
            content={getLocalizedText(product.deliveryText)}
            className="text-xs text-gray-600"
          />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={isPaymentOpen} onOpenChange={setIsPaymentOpen} className="border-b">
        <CollapsibleTrigger className="flex items-center justify-between w-full pb-3">
          <span className="font-medium">{getLocalizedText(LANGUAGE_LIST.PaymentInfo)}</span>
          {isPaymentOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="py-5">
          <MarkdownRenderer
            content={getLocalizedText(product.paymentText)}
            className="text-xs text-gray-600"
          />
        </CollapsibleContent>
      </Collapsible>

      <Collapsible open={isBusinessOpen} onOpenChange={setIsBusinessOpen} className="border-b">
        <CollapsibleTrigger className="flex items-center justify-between w-full pb-3">
          <span className="font-medium">{getLocalizedText(LANGUAGE_LIST.BusinessInfo)}</span>
          {isBusinessOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </CollapsibleTrigger>
        <CollapsibleContent className="py-5">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <span className="font-bold">{business.name}</span>
          </div>
          <MarkdownRenderer
            content={getLocalizedText(business.description)}
            className="text-xs text-gray-600"
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  )
}

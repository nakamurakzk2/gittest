'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

// Components
import { Button } from "@/components/ui/button"

export default function CustomerSupportNavigation() {
  const pathname = usePathname()

  const navigationItems = [
    {
      href: "/admin/customer-support/product-chat",
      label: "商品チャット",
      isActive: pathname === "/admin/customer-support/product-chat"
    },
    {
      href: "/admin/customer-support/pre-talk-chat",
      label: "事前相談",
      isActive: pathname === "/admin/customer-support/pre-talk-chat"
    },
    {
      href: "/admin/customer-support/form-answers",
      label: "フォーム回答",
      isActive: pathname === "/admin/customer-support/form-answers"
    },
    {
      href: "/admin/customer-support/own-products",
      label: "商品購入ユーザ",
      isActive: pathname === "/admin/customer-support/own-products"
    }
  ]

  return (
    <div className="w-full bg-muted p-1 rounded-lg">
      <div className="grid grid-cols-4 gap-1">
        {navigationItems.map((item) => (
          <Button
            key={item.href}
            asChild
            variant={item.isActive ? "default" : "ghost"}
            size="sm"
            className="w-full"
          >
            <Link href={item.href}>
              {item.label}
            </Link>
          </Button>
        ))}
      </div>
    </div>
  )
}

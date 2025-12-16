'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"

// Components
import { Button } from "@/components/ui/button"

export default function PageManagementNavigation() {
  const pathname = usePathname()

  const navigationItems = [
    {
      href: "/admin/page-management/top-banners",
      label: "TOPバナー",
      isActive: pathname === "/admin/page-management/top-banners"
    },
    {
      href: "/admin/page-management/top-pickups",
      label: "ピックアップ",
      isActive: pathname === "/admin/page-management/top-pickups"
    },
    {
      href: "/admin/page-management/campaign-banners",
      label: "特集バナー",
      isActive: pathname === "/admin/page-management/campaign-banners"
    }
  ]

  return (
    <div className="w-full bg-muted p-1 rounded-lg">
      <div className="grid grid-cols-3 gap-1">
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

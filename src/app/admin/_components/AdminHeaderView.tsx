'use client'

import { useRouter } from "next/navigation"
import { ChevronDown, HomeIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useAdminSession } from "@/providers/admin-session-provider"
import * as CommonLogic from '@/logic/common-logic'

export default function AdminHeaderView() {
  const router = useRouter()
  const { simpleAdminUser, logout } = useAdminSession()

  return (
    <header className="w-full border-b px-4 py-3 flex justify-between items-center bg-black text-background h-[55px]">
      <h1 className="hidden sm:block text-base font-bold text-white">
        TOKKEN 管理者ページ
      </h1>
      <div className="block sm:hidden">
        <HomeIcon className="size-4" />
      </div>

      {simpleAdminUser && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 text-white hover:text-white/90">
              [{CommonLogic.getAdminTypeLabel(simpleAdminUser.adminUserType)}]
              {simpleAdminUser.name}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={logout}>
              ログアウト
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </header>
  )
}

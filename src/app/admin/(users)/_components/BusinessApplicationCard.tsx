"use client"

import { CheckIcon, XIcon, Mail, User, ChevronDown } from "lucide-react"
import { useState } from "react"

// Providers
import { toast } from "@/components/hooks/use-toast"

// Entity
import { BusinessApplication } from "@/entity/admin/user-application"
import { Business } from "@/entity/town/business"
import { AdminUserType } from "@/entity/admin/user"

// Components
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Logic
import * as CommonLogic from "@/logic/common-logic"
import * as AdminApplicationServerLogic from "@/logic/server/admin/admin-application-server-logic"

type Props = {
  application: BusinessApplication
  businesses: Business[]
  townId: string
  onReload: () => void
}

export default function BusinessApplicationCard({
  application,
  businesses,
  townId,
  onReload
}: Props) {
  const [selectedBusinessId, setSelectedBusinessId] = useState<string>("")
  const [selectedAdminUserType, setSelectedAdminUserType] = useState<AdminUserType | null>(null)

  /**
   * 申請を承認
   */
  const onClickApprove = async () => {
    if (!selectedBusinessId || !selectedAdminUserType) {
      toast({
        title: "エラー",
        description: "事業者と管理者タイプを選択してください",
        variant: "destructive",
      })
      return
    }

    try {
      await AdminApplicationServerLogic.approveBusinessApplication(application.userId, selectedAdminUserType, townId, selectedBusinessId)
      const typeLabel = selectedAdminUserType === AdminUserType.BUSINESS ? "事業者管理者" : "事業者閲覧者"
      const business = businesses.find(b => b.businessId === selectedBusinessId)
      const businessName = business ? business.name : "不明な事業者"
      toast({
        title: "申請を承認しました",
        description: `ユーザーID: ${application.userId} (${businessName} - ${typeLabel})`,
      })
      // 選択状態をリセット
      setSelectedBusinessId("")
      setSelectedAdminUserType(null)
      onReload()
    } catch (error) {
      toast({
        title: "エラー",
        description: "承認に失敗しました",
        variant: "destructive",
      })
    }
  }

  /**
   * 申請を却下
   */
  const onClickReject = async () => {
    try {
      await AdminApplicationServerLogic.rejectBusinessApplication(application.userId, townId)
      toast({
        title: "申請を却下しました",
        description: `ユーザーID: ${application.userId}`,
      })
      onReload()
    } catch (error) {
      toast({
        title: "エラー",
        description: "却下に失敗しました",
        variant: "destructive",
      })
    }
  }
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center space-x-2 text-base">
          <User className="h-6 w-6 text-muted-foreground" />
          <div>
            <div className="font-medium text-sm">{application.name}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Mail className="h-3 w-3 mr-1" />
              {application.email}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <div className="text-xs font-medium text-muted-foreground">申請された事業者名</div>
              <div className="text-sm font-medium">{application.businessName}</div>
            </div>
            <div>
              <div className="text-xs font-medium text-muted-foreground">申請日時</div>
              <div className="text-sm">
                {CommonLogic.formatDate(application.createdAt, "yyyy/MM/dd hh:mm:ss")}
              </div>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="text-xs font-medium text-muted-foreground mb-2">承認設定</div>
            <div className="flex flex-wrap gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1 h-7 text-xs"
                  >
                    <span>
                      {selectedBusinessId
                        ? businesses.find(b => b.businessId === selectedBusinessId)?.name || "事業者を選択"
                        : "事業者を選択"
                      }
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  {businesses.map((business) => (
                    <DropdownMenuItem
                      key={business.businessId}
                      onClick={() => setSelectedBusinessId(business.businessId)}
                    >
                      {business.name}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center space-x-1 h-7 text-xs"
                  >
                    <span>
                      {selectedAdminUserType === AdminUserType.BUSINESS ? "事業者の管理権限" :
                        selectedAdminUserType === AdminUserType.BUSINESS_VIEWER ? "事業者の閲覧権限" :
                        "管理者タイプを選択"}
                    </span>
                    <ChevronDown className="h-3 w-3" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start">
                  <DropdownMenuItem
                    onClick={() => setSelectedAdminUserType(AdminUserType.BUSINESS)}
                  >
                    事業者の管理権限
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSelectedAdminUserType(AdminUserType.BUSINESS_VIEWER)}
                  >
                    事業者の閲覧権限
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex justify-end space-x-1 mt-3">
              <Button
                variant="outline"
                size="sm"
                onClick={onClickApprove}
                className="flex items-center space-x-1 text-green-600 hover:text-green-700 h-7 text-xs"
                disabled={!selectedBusinessId || !selectedAdminUserType}
              >
                <CheckIcon className="h-3 w-3" />
                <span>承認</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={onClickReject}
                className="flex items-center space-x-1 text-red-600 hover:text-red-700 h-7 text-xs"
              >
                <XIcon className="h-3 w-3" />
                <span>拒否</span>
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

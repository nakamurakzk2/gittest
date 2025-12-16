import { useEffect, useState } from "react"

// Components
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

// Entity
import { Business } from "@/entity/town/business"

// Providers
import { useDialog } from "@/providers/dialog-provider"

// Logic
import * as AdminBusinessServerLogic from "@/logic/server/admin/admin-business-server-logic"


type Props = {
  townId: string
  businessId: string
  setBusinessId: (businessId: string) => void
}


export default function BusinessSelectCard({ townId, businessId, setBusinessId }: Props) {
  const { onFetch } = useDialog()
  const [businesses, setBusinesses] = useState<Business[]>([])

  const reload = async () => {
    await onFetch(async () => {
      const { businesses } = await AdminBusinessServerLogic.fetchBusinesses(townId)
      setBusinesses(businesses)
    })
  }

  useEffect(() => {
    reload()
  }, [townId])

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">事業者を選択してください</label>
            {businessId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setBusinessId("")}
              >
                <X className="mr-1 h-3 w-3" />
                選択解除
              </Button>
            )}
          </div>
          <Select value={businessId || ""} onValueChange={setBusinessId}>
            <SelectTrigger>
              <SelectValue placeholder="事業者を選択..." />
            </SelectTrigger>
            <SelectContent>
              {businesses.map(business => (
                <SelectItem key={business.businessId} value={business.businessId}>
                  {business.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
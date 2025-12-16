import { Card, CardContent } from "@/components/ui/card";
import { useAdminSession } from "@/providers/admin-session-provider";

export default function NoPermissionView() {
  const { simpleAdminUser } = useAdminSession()

  if (simpleAdminUser == null) {
    return null
  }

  return (
    <main className="max-w-4xl mx-auto px-2 py-6">
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="text-lg font-medium text-muted-foreground mb-2">
              アクセス権限がありません
            </div>
            <div className="text-sm text-muted-foreground">
              この機能にアクセスするには、エンジニア権限が必要です。
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
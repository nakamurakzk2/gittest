import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

// Components
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Providers
import { useAdminSession } from "@/providers/admin-session-provider";

type Props = {
  townId: string
  setTownId: (townId: string) => void
}


export default function TownSelectCard({ townId, setTownId }: Props) {
  const { simpleTowns } = useAdminSession()

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">自治体を選択してください</label>
            {townId && (
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0 text-muted-foreground hover:text-foreground"
                onClick={() => setTownId("")}
              >
                <X className="mr-1 h-3 w-3" />
                選択解除
              </Button>
            )}
          </div>
          <Select value={townId || ""} onValueChange={setTownId}>
            <SelectTrigger>
              <SelectValue placeholder="自治体を選択..." />
            </SelectTrigger>
            <SelectContent>
              {simpleTowns.map(town => (
                <SelectItem key={town.townId} value={town.townId}>
                  {town.name.ja}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import { ja } from "date-fns/locale"
import { cn } from "@/lib/utils"

interface ProductPublicationSettingsViewProps {
  isDraft: boolean
  setIsDraft: (value: boolean) => void
  startTime: number | null
  setStartTime: (value: number | null) => void
  endTime: number | null
  setEndTime: (value: number | null) => void
}

export default function ProductPublicationSettingsView({
  isDraft,
  setIsDraft,
  startTime,
  setStartTime,
  endTime,
  setEndTime
}: ProductPublicationSettingsViewProps) {
  const handleStartTimeClear = () => {
    setStartTime(null)
  }

  const handleEndTimeClear = () => {
    setEndTime(null)
  }

  const handleStartTimeChange = (date: Date | undefined) => {
    if (date) {
      setStartTime(date.getTime())
    }
  }

  const handleEndTimeChange = (date: Date | undefined) => {
    if (date) {
      setEndTime(date.getTime())
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>公開設定</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* 下書き状態 */}
        <div className="flex items-center space-x-2">
          <Switch
            id="isDraft"
            checked={isDraft}
            onCheckedChange={setIsDraft}
          />
          <Label htmlFor="isDraft">下書きとして保存</Label>
        </div>

        {/* 公開期間設定 */}
        <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>公開開始日時</Label>
                {startTime && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleStartTimeClear}
                    className="h-6 px-2 text-xs"
                  >
                    クリア
                  </Button>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startTime && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startTime ? format(new Date(startTime), "yyyy年MM月dd日 HH:mm", { locale: ja }) : "開始日時を選択（未設定の場合は即座に公開）"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startTime ? new Date(startTime) : undefined}
                    onSelect={handleStartTimeChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>公開終了日時</Label>
                {endTime && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEndTimeClear}
                    className="h-6 px-2 text-xs"
                  >
                    クリア
                  </Button>
                )}
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endTime && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endTime ? format(new Date(endTime), "yyyy年MM月dd日 HH:mm", { locale: ja }) : "終了日時を選択（未設定の場合は無期限公開）"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endTime ? new Date(endTime) : undefined}
                    onSelect={handleEndTimeChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
      </CardContent>
    </Card>
  )
}

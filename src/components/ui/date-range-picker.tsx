import * as React from "react"
import { addDays, format, startOfYear, endOfYear } from "date-fns"
import { ja } from "date-fns/locale"
import { Calendar as CalendarIcon, XIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface CalendarDateRangePickerProps {
  value: DateRange
  onChange: (value: DateRange) => void
  className?: string
}

export function CalendarDateRangePicker({
  value,
  onChange,
  className,
}: CalendarDateRangePickerProps) {
  const onClickReset = () => {
    onChange({ from: undefined, to: undefined })
  }

  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: currentYear - 2020 }, (_, i) => currentYear - i)

  const onClickYear = (year: number) => {
    const from = startOfYear(new Date(year, 0))
    const to = endOfYear(new Date(year, 0))
    onChange({ from, to })
  }

  return (
    <div className={cn("grid grid-cols-[1fr_auto] gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value?.from ? (
              value.to ? (
                <>
                  {format(value.from, "yyyy/MM/dd", { locale: ja })} -{" "}
                  {format(value.to, "yyyy/MM/dd", { locale: ja })}
                </>
              ) : (
                format(value.from, "yyyy/MM/dd", { locale: ja })
              )
            ) : (
              <span>日付を選択</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <div className="p-3 border-b">
            <div className="flex flex-wrap gap-2">
              {years.map((year) => (
                <Button
                  key={year}
                  variant="outline"
                  size="sm"
                  onClick={() => onClickYear(year)}
                >
                  {year}年
                </Button>
              ))}
            </div>
          </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={value?.from}
            selected={value}
            onSelect={(range) => range && onChange(range)}
            numberOfMonths={2}
            locale={ja}
          />
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="icon"
        onClick={onClickReset}
        disabled={!value?.from && !value?.to}
      >
        <XIcon className="h-4 w-4" />
      </Button>
    </div>
  )
}
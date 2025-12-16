import { Input } from "@/components/ui/input"

interface IntegerInputProps {
  id?: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
  min?: number
  max?: number
  className?: string
  prefix?: string
  suffix?: string
  disabled?: boolean
}

export default function IntegerInput({
  id,
  value,
  onChange,
  placeholder = "0",
  min = 0,
  max,
  className = "",
  prefix,
  suffix,
  disabled = false
}: IntegerInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    if (inputValue === "") {
      onChange(0)
      return
    }

    const numValue = Number(inputValue)
    if (!isNaN(numValue) && Number.isInteger(numValue)) {
      // min/maxの制限をチェック
      let finalValue = numValue
      if (min !== undefined && numValue < min) {
        finalValue = min
      }
      if (max !== undefined && numValue > max) {
        finalValue = max
      }
      onChange(finalValue)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 小数点、マイナス記号、e、E、+の入力を防ぐ
    if (e.key === '.' || e.key === '-' || e.key === 'e' || e.key === 'E' || e.key === '+') {
      e.preventDefault()
    }
  }

  const displayValue = value === 0 ? "" : value.toString()

  return (
    <div className="relative">
      {prefix && (
        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          {prefix}
        </span>
      )}
      <Input
        id={id}
        type="number"
        min={min}
        max={max}
        step="1"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`${prefix ? "pl-8" : ""} ${suffix ? "pr-8" : ""} ${className}`}
        disabled={disabled}
      />
      {suffix && (
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
          {suffix}
        </span>
      )}
    </div>
  )
}

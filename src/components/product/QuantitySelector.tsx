'use client'

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuantitySelectorProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  disabled?: boolean
}

export default function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false
}: QuantitySelectorProps) {
  const onClickDecrease = () => {
    if (value > min) {
      onChange(value - 1)
    }
  }

  const onClickIncrease = () => {
    if (value < max) {
      onChange(value + 1)
    }
  }

  const handleInputChange = (inputValue: string) => {
    const num = parseInt(inputValue) || min
    if (num >= min && num <= max) {
      onChange(num)
    }
  }

  return (
    <div className="flex items-center border border-gray-300 rounded-full bg-white overflow-hidden h-[50px]">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClickDecrease}
        disabled={disabled || value <= min}
        className="px-4 py-2 hover:bg-gray-100 rounded-none h-full"
      >
        <Minus className="h-4 w-4" />
      </Button>
      <input
        type="number"
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        className="w-16 text-center border-0 focus:ring-0 focus:outline-none bg-transparent [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        min={min}
        max={max}
        disabled={disabled}
      />
      <Button
        variant="ghost"
        size="sm"
        onClick={onClickIncrease}
        disabled={disabled || value >= max}
        className="px-4 py-2 hover:bg-gray-100 rounded-none h-full"
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  )
}

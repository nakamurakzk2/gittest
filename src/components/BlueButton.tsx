interface BlueButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  variant?: "default" | "outline" | "destructive"
  type?: "button" | "submit" | "reset"
}

export default function BlueButton({ children, onClick, className = "", disabled = false, variant = "default", type = "button" }: BlueButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 px-4 rounded-full font-medium transition-colors text-sm ${
        disabled
          ? "bg-white text-gray-400 border border-gray-200"
          : variant === "default"
          ? "text-white hover:opacity-90"
          : variant === "outline"
          ? "bg-white text-black-600 border border-black-600 hover:bg-gray-50"
          : "bg-white text-gray-400 border border-gray-200"
      } ${className}`}
      style={{
        backgroundColor: disabled ? undefined : variant === "default" ? "#2b2b2b" : undefined
      }}
    >
      {children}
    </button>
  )
}
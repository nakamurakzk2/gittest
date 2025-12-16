interface RedButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
  variant?: "default" | "outline" | "destructive"
}

export default function RedButton({ children, onClick, className = "", disabled = false, variant = "default" }: RedButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full py-2 px-4 rounded-full font-medium transition-colors text-sm ${
        disabled
          ? "bg-white text-gray-400 border border-gray-200"
          : variant === "default"
          ? "text-white hover:opacity-90"
          : variant === "outline"
          ? "bg-white text-red-600 border border-red-600 hover:bg-red-50"
          : "bg-white text-gray-400 border border-gray-200"
      } ${className}`}
      style={{
        backgroundColor: disabled ? undefined : variant === "default" ? "#9B001F" : undefined
      }}
    >
      {children}
    </button>
  )
}

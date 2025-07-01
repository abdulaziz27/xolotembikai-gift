import * as React from "react"
import { cn, actionButtonVariants } from "@/lib/utils/table"

interface ActionButtonProps {
  onClick?: () => void
  variant?: keyof typeof actionButtonVariants
  icon: React.ReactNode
  tooltip?: string
  disabled?: boolean
  className?: string
  "aria-label"?: string
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  variant = "secondary",
  icon,
  tooltip,
  disabled = false,
  className,
  "aria-label": ariaLabel,
}) => (
  <button
    onClick={onClick}
    disabled={disabled}
    title={tooltip}
    aria-label={ariaLabel || tooltip}
    className={cn(
      "inline-flex items-center justify-center w-8 h-8 p-1 rounded-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
      actionButtonVariants[variant],
      className
    )}
  >
    {icon}
  </button>
) 
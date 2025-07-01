import * as React from "react"
import { cn, statusBadgeVariants } from "@/lib/utils/table"

interface StatusBadgeProps {
  status: keyof typeof statusBadgeVariants
  children: React.ReactNode
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  children, 
  className 
}) => (
  <span
    className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
      statusBadgeVariants[status],
      className
    )}
  >
    {children}
  </span>
) 
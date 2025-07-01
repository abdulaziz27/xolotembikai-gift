import * as React from "react"
import { cn } from "@/lib/utils/table"

/**
 * InputProps extends the standard HTML input element props to maintain type safety
 * while allowing for custom styling and behavior through className and other props.
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  // This interface can be extended with custom props in the future
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input } 
import * as React from "react"
import { cn } from "../../lib/utils"

const badgeVariants = {
  variant: {
    default: "bg-indigo-600 text-white hover:bg-indigo-700",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    destructive: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 text-gray-900",
    success: "bg-green-600 text-white hover:bg-green-700",
  },
}

function Badge({ className, variant = "default", ...props }) {
  const variantClass = badgeVariants.variant[variant] || badgeVariants.variant.default
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2",
        variantClass,
        className
      )}
      {...props}
    />
  )
}

export { Badge, badgeVariants }

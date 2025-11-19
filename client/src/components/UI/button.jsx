import * as React from "react"
import { cn } from "../../lib/utils"

const buttonVariants = {
  variant: {
    default: "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md",
    destructive: "bg-red-600 text-white hover:bg-red-700 shadow-md",
    outline: "border border-gray-300 bg-white hover:bg-gray-100 text-gray-900",
    secondary: "bg-gray-200 text-gray-900 hover:bg-gray-300",
    ghost: "hover:bg-gray-100 text-gray-900",
    link: "text-indigo-600 underline-offset-4 hover:underline",
  },
  size: {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3 text-sm",
    lg: "h-11 rounded-md px-8 text-lg",
    icon: "h-10 w-10",
  },
}

const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  ...props 
}, ref) => {
  const variantClass = buttonVariants.variant[variant] || buttonVariants.variant.default
  const sizeClass = buttonVariants.size[size] || buttonVariants.size.default
  
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
        variantClass,
        sizeClass,
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button, buttonVariants }

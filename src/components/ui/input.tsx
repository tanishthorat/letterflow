import * as React from "react"
import { useState, useEffect, useRef } from "react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"

function Input({
  className,
  type,
  error,
  errorAsPop = false,
  ...props
}: React.ComponentProps<"input"> & {
  error?: string
  errorAsPop?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const hasError = Boolean(error)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Auto-show tooltip when error appears, auto-hide after 3s
  useEffect(() => {
    if (hasError) {
      setIsOpen(true)
      // Clear any existing timeout
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
      // Set new timeout to hide after 3 seconds
      timeoutRef.current = setTimeout(() => {
        if (!isHovering) {
          setIsOpen(false)
        }
      }, 3000)
    } else {
      setIsOpen(false)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [hasError, isHovering])

  const handleMouseEnter = () => {
    setIsHovering(true)
    setIsOpen(true)
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (hasError) {
      // Restart the timeout to hide after 3 seconds
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false)
      }, 3000)
    }
  }

  // base classes include aria-invalid styles so callers don't need to manually set border classes
  const baseClasses = cn(
    "h-10 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
    className
  )

  if (errorAsPop) {
    return (
      <Tooltip open={isOpen} delayDuration={0}>
        <TooltipTrigger asChild>
          <input
            type={type}
            data-slot="input"
            aria-invalid={hasError}
            className={baseClasses}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            {...props}
          />
        </TooltipTrigger>
        <TooltipContent
          side="top"
          align="start"
          sideOffset={2}
          className={cn(
            "max-w-xs font-medium",
            hasError && "bg-destructive text-destructive-foreground"
          )}
          arrowClassName="bg-destructive fill-destructive"
        >
          {error}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <input
      type={type}
      data-slot="input"
      aria-invalid={hasError}
      className={baseClasses}
      {...props}
    />
  )
}

export { Input }

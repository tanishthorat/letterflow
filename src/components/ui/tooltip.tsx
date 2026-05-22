"use client"

import * as React from "react"
import { Tooltip as TooltipPrimitive } from "radix-ui"

import { cn } from "@/lib/utils"

// Color variants for tooltips
const tooltipVariants = {
  default: {
    content: "bg-foreground text-background",
    arrow: "bg-foreground fill-foreground"
  },
  error: {
    content: "bg-destructive text-destructive-foreground",
    arrow: "bg-destructive fill-destructive"
  },
  success: {
    content: "bg-accent text-foreground",
    arrow: "bg-accent fill-accent"
  },
  warning: {
    content: "bg-yellow-600 text-white",
    arrow: "bg-yellow-600 fill-yellow-600"
  },
  info: {
    content: "bg-blue-600 text-white",
    arrow: "bg-blue-600 fill-blue-600"   
  }
} as const

type TooltipVariant = keyof typeof tooltipVariants

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

function Tooltip({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...props} />
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  children,
  arrowClassName,
  variant = "default",
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content> & {
  arrowClassName?: string
  variant?: TooltipVariant
}) {
  const variantStyles = tooltipVariants[variant]
  
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        className={cn(
          "z-50 inline-flex w-fit max-w-xs origin-(--radix-tooltip-content-transform-origin) items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium has-data-[slot=kbd]:pr-1.5 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 **:data-[slot=kbd]:relative **:data-[slot=kbd]:isolate **:data-[slot=kbd]:z-50 **:data-[slot=kbd]:rounded-sm data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0 data-[state=delayed-open]:zoom-in-95 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          variantStyles.content,
          className
        )}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow className={cn("z-50 size-2.5 translate-y-[calc(-50%_-_2px)] translate-x-[calc(-50%_-_2px)] rotate-45 rounded-[2px]", arrowClassName || variantStyles.arrow)} />
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, type TooltipVariant }

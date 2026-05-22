"use client"

import * as React from "react"
import { Delete, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

export interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
  containerClassName?: string;
}

export const SearchBar = React.forwardRef<HTMLInputElement, SearchBarProps>(
  ({ className, containerClassName, value, defaultValue, onChange, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null)
    const [hasValue, setHasValue] = React.useState(
      Boolean(value || defaultValue)
    )

    // Sync external value changes if controlled
    React.useEffect(() => {
      if (value !== undefined) {
        setHasValue(Boolean(value))
      }
    }, [value])

    // Merge external ref with internal ref
    const mergedRef = React.useCallback(
      (node: HTMLInputElement) => {
        inputRef.current = node
        if (typeof ref === "function") {
          ref(node)
        } else if (ref) {
          ref.current = node
        }
      },
      [ref]
    )

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(Boolean(e.target.value))
      onChange?.(e)
    }

    const handleClear = () => {
      // Create a synthetic event object that matches React.ChangeEvent<HTMLInputElement>
      const event = {
        target: { value: "" },
        currentTarget: { value: "" }
      } as React.ChangeEvent<HTMLInputElement>;
      
      // Call onChange directly with our fake event
      onChange?.(event);
      
      // Focus the input element
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }

    return (
      <div className={cn("relative w-full group", containerClassName)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors pointer-events-none" />
        <Input
          type="search"
          ref={mergedRef}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          className={cn(
            "w-full pl-10 pr-10 bg-muted/40 border-border focus-visible:ring-1 focus-visible:ring-primary focus-visible:border-primary transition-all shadow-sm",
            // Hide the default browser clear 'x' button to use our custom one
            "[&::-webkit-search-cancel-button]:appearance-none",
            className
          )}
          {...props}
        />
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-0.5 rounded-sm"
            aria-label="Clear search"
          >
            <Delete className="h-4 w-4" />
          </button>
        )}
      </div>
    )
  }
)
SearchBar.displayName = "SearchBar"

"use client";

import { Minus, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface NumberStepperProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
}

export function NumberStepper({
  value,
  onChange,
  min,
  max,
  step = 10,
  className
}: NumberStepperProps) {
  const [inputValue, setInputValue] = useState(String(value));

  // Sync state with external value changes
  useEffect(() => {
    setInputValue(String(value));
  }, [value]);

  const handleMinus = () => {
    const newValue = Math.max(min, value - step);
    onChange(newValue);
  };

  const handlePlus = () => {
    const newValue = Math.min(max, value + step);
    onChange(newValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleBlurOrEnter = () => {
    let num = parseInt(inputValue, 10);
    if (isNaN(num)) {
      setInputValue(String(value));
      return;
    }
    // Clamp to min/max boundaries
    const clamped = Math.max(min, Math.min(max, num));
    onChange(clamped);
    setInputValue(String(clamped));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleBlurOrEnter();
    }
  };

  return (
    <div className={cn("flex items-center bg-muted/50 rounded-md border border-border h-9 select-none", className)}>
      <button
        type="button"
        disabled={value <= min}
        onClick={handleMinus}
        className="h-full px-2.5 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer shrink-0 rounded-l-md"
      >
        <Minus className="w-3.5 h-3.5" />
      </button>
      
      <input
        type="number"
        min={min}
        max={max}
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleBlurOrEnter}
        onKeyDown={handleKeyDown}
        className="w-16 h-full text-center text-sm font-medium bg-transparent border-0 outline-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none text-foreground shrink-0 font-mono"
      />

      <button
        type="button"
        disabled={value >= max}
        onClick={handlePlus}
        className="h-full px-2.5 hover:bg-muted text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent transition-colors cursor-pointer shrink-0 rounded-r-md"
      >
        <Plus className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

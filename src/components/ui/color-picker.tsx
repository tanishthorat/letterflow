"use client";

import React, { useState } from "react";
import { ChevronDown, Pipette } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  className?: string;
  align?: "left" | "right" | "center";
}

const PRESET_COLORS = [
  { name: "Transparent", value: "transparent" },
  { name: "White", value: "#ffffff" },
  { name: "Light Gray", value: "#f6f6f6" },
  { name: "Border Gray", value: "#eaeaea" },
  { name: "Muted Gray", value: "#999999" },
  { name: "Charcoal", value: "#222222" },
  { name: "Black", value: "#111111" },
  { name: "Brand Green", value: "#33cc4a" },
  { name: "Vibrant Blue", value: "#3b82f6" },
  { name: "Warning Orange", value: "#f59e0b" },
  { name: "Danger Red", value: "#ef4444" },
  { name: "Creative Purple", value: "#8b5cf6" },
];

export function ColorPicker({ value, onChange, className, align = "right" }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const activeColor = value || "transparent";

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value;
    if (val !== "transparent" && !val.startsWith("#")) {
      val = `#${val}`;
    }
    onChange(val);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "flex items-center justify-between w-full h-10 px-3 py-2 bg-background border border-input rounded-md text-sm text-foreground hover:bg-muted/30 transition-all cursor-pointer select-none",
            className
          )}
        >
          <div className="flex items-center gap-2">
            {/* Color preview circle */}
            <div
              className="w-5 h-5 rounded-full border border-border relative overflow-hidden shrink-0"
              style={{
                backgroundColor: activeColor === "transparent" ? "transparent" : activeColor,
              }}
            >
              {activeColor === "transparent" && (
                <div className="absolute inset-0 bg-white flex items-center justify-center">
                  {/* Red slash for transparent */}
                  <div className="w-[120%] h-[1.5px] bg-red-500 rotate-45 transform origin-center"></div>
                </div>
              )}
            </div>
            <span className="font-mono text-xs uppercase text-foreground/80">
              {activeColor === "transparent" ? "transparent" : activeColor}
            </span>
          </div>
          <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align={align === "left" ? "start" : align === "right" ? "end" : "center"}
        sideOffset={8}
        className="w-64 p-3 bg-popover border border-border rounded-lg shadow-xl"
      >
        <div className="space-y-3">
          {/* Header / Preset label */}
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            Presets
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-6 gap-2">
            {PRESET_COLORS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                title={preset.name}
                onClick={() => {
                  onChange(preset.value);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-7 h-7 rounded-md border border-border/80 relative overflow-hidden hover:scale-110 active:scale-95 transition-all cursor-pointer",
                  activeColor === preset.value && "ring-2 ring-primary ring-offset-2 ring-offset-popover"
                )}
                style={{
                  backgroundColor: preset.value === "transparent" ? "transparent" : preset.value,
                }}
              >
                {preset.value === "transparent" && (
                  <div className="absolute inset-0 bg-white flex items-center justify-center">
                    <div className="w-[120%] h-[1.5px] bg-red-500 rotate-45 transform origin-center"></div>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Custom Color Input Row */}
          <div className="pt-2 border-t border-border space-y-2">
            <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              Custom Color
            </div>
            <div className="flex items-center gap-2">
              {/* Visual Picker Icon using native input color */}
              <div className="relative w-8 h-8 rounded-md border border-border bg-muted flex items-center justify-center shrink-0 cursor-pointer overflow-hidden group">
                <Pipette className="w-4 h-4 text-foreground/75 group-hover:text-foreground transition-colors" />
                <input
                  type="color"
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  value={activeColor.startsWith("#") ? activeColor : "#ffffff"}
                  onChange={(e) => onChange(e.target.value)}
                />
              </div>
              {/* Hex text input */}
              <input
                type="text"
                placeholder="#ffffff"
                value={activeColor}
                onChange={handleHexChange}
                className="flex h-8 w-full rounded-md border border-input bg-transparent px-2.5 py-1 text-xs font-mono uppercase text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

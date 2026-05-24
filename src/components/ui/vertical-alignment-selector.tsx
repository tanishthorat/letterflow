"use client";

import { AlignVerticalJustifyStart, AlignVerticalJustifyCenter, AlignVerticalJustifyEnd } from "lucide-react";
import { cn } from "@/lib/utils";

interface VerticalAlignmentSelectorProps {
  value: "top" | "middle" | "bottom";
  onChange: (value: "top" | "middle" | "bottom") => void;
  className?: string;
}

export function VerticalAlignmentSelector({ value, onChange, className }: VerticalAlignmentSelectorProps) {
  const options = [
    { id: "top" as const, icon: AlignVerticalJustifyStart, label: "Align Top" },
    { id: "middle" as const, icon: AlignVerticalJustifyCenter, label: "Align Middle" },
    { id: "bottom" as const, icon: AlignVerticalJustifyEnd, label: "Align Bottom" },
  ];

  return (
    <div className={cn("flex bg-muted rounded-md p-1 w-fit shrink-0", className)}>
      {options.map((opt) => {
        const Icon = opt.icon;
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            title={opt.label}
            onClick={() => onChange(opt.id)}
            className={cn(
              "p-1.5 rounded-sm transition-colors cursor-pointer text-muted-foreground hover:text-foreground",
              isActive && "bg-background shadow-sm text-foreground"
            )}
          >
            <Icon className="w-4 h-4" />
          </button>
        );
      })}
    </div>
  );
}

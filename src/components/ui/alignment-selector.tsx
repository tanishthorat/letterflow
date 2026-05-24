"use client";

import { AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlignmentSelectorProps {
  value: "left" | "center" | "right";
  onChange: (value: "left" | "center" | "right") => void;
  className?: string;
}

export function AlignmentSelector({ value, onChange, className }: AlignmentSelectorProps) {
  const options = [
    { id: "left" as const, icon: AlignLeft, label: "Align Left" },
    { id: "center" as const, icon: AlignCenter, label: "Align Center" },
    { id: "right" as const, icon: AlignRight, label: "Align Right" },
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

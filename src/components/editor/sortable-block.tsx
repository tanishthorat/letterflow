"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface SortableBlockItemProps {
  id: string;
  isSelected: boolean;
  onSelect: () => void;
  children: React.ReactNode;
}

export function SortableBlockItem({ id, isSelected, onSelect, children }: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={cn(
        "relative group cursor-pointer outline-2 outline-transparent transition-all mb-1",
        isSelected 
          ? "outline-primary z-10" 
          : "hover:outline-primary/40",
        isDragging && "outline-dashed outline-2 outline-primary bg-background/50 backdrop-blur-sm"
      )}
    >
      <div 
        ref={setActivatorNodeRef}
        {...attributes}
        {...listeners}
        className={cn(
          "absolute -left-8 top-1/2 -translate-y-1/2 p-1 bg-card border border-border rounded shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing z-20",
          isSelected && "opacity-100 bg-primary text-primary-foreground border-primary",
          isDragging && "opacity-0"
        )}
      >
        <GripVertical className="w-4 h-4" />
      </div>
      {children}
    </div>
  );
}

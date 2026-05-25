import React from "react";
import { Grip, Copy, Trash2 } from "lucide-react";
import { NODE_COLORS } from "@/lib/editor/config";
import { cn } from "@/lib/utils";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { AIHelper } from "./ai-helper";

export function SelectionToolbar({
  type,
  label,
  attributes,
  listeners,
  onDuplicate,
  onRemove,
  blockType,
  content,
  onRewrite
}: {
  type: keyof typeof NODE_COLORS;
  label?: string;
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap;
  onDuplicate?: () => void;
  onRemove: () => void;
  blockType?: string;
  content?: string;
  onRewrite?: (newContent: string) => void;
}) {


  const showAiRewrite = type === "block" && (blockType === "text" || blockType === "button");

  return (
    <div className={cn(
      "absolute -bottom-9 left-0 text-white rounded-full px-2 py-1 flex items-center gap-2 z-30 shadow-xl pointer-events-auto whitespace-nowrap",
      NODE_COLORS[type].bg
    )}>
      {label && <span className="text-xs font-semibold mr-1">{label}</span>}
      {attributes && listeners && (
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing hover:bg-white/20 p-1 rounded-sm transition-colors flex items-center justify-center">
          <Grip className="w-4 h-4" />
        </div>
      )}
      
      {showAiRewrite && (
        <AIHelper content={content} blockType={blockType} onRewrite={onRewrite} />
      )}

      {onDuplicate && (
        <button onClick={(e) => { e.stopPropagation(); onDuplicate(); }} className="hover:bg-white/20 p-1 rounded-sm transition-colors flex items-center justify-center">
          <Copy className="w-4 h-4" />
        </button>
      )}
      <button onClick={(e) => { e.stopPropagation(); onRemove(); }} className="hover:bg-white/20 p-1 rounded-sm transition-colors flex items-center justify-center text-white">
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}


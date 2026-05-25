import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "@/lib/editor/store";
import { BLOCK_REGISTRY } from "@/lib/editor/registry";
import { NODE_COLORS } from "@/lib/editor/config";
import { cn } from "@/lib/utils";
import { SelectionToolbar } from "./selection-toolbar";
import { EditorBlock, TextBlock, ButtonBlock } from "@/lib/editor/types";

export function EditorBlockWrapper({ block, stripeId, structureId, colId }: { block: EditorBlock, stripeId: string, structureId: string, colId: string }) {
  const { selectedNode, selectNode, duplicateBlock, removeBlock, updateBlock } = useEditorStore();
  const config = BLOCK_REGISTRY[block.type as keyof typeof BLOCK_REGISTRY];
  const isSelected = selectedNode?.type === 'block' && selectedNode.blockId === block.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: block.id,
    data: { type: "block", stripeId, structureId, colId, blockId: block.id }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative ring-2 ring-inset ring-transparent transition-colors group",
        isSelected && `${NODE_COLORS.block.ring} z-20`,
        NODE_COLORS.block.hoverRing
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectNode({ type: 'block', stripeId, structureId, columnId: colId, blockId: block.id });
      }}
    >
      {isSelected && (
        <SelectionToolbar
          type="block"
          blockType={block.type}
          content={
            block.type === "text"
              ? (block as TextBlock).props.content
              : block.type === "button"
              ? (block as ButtonBlock).props.text
              : undefined
          }
          onRewrite={(newContent) => {
            if (block.type === "text") {
              updateBlock(stripeId, structureId, colId, block.id, { content: newContent });
            } else if (block.type === "button") {
              updateBlock(stripeId, structureId, colId, block.id, { text: newContent });
            }
          }}
          attributes={attributes}
          listeners={listeners}
          onDuplicate={() => duplicateBlock(stripeId, structureId, colId, block.id)}
          onRemove={() => removeBlock(stripeId, structureId, colId, block.id)}
        />
      )}
      {config?.renderCanvas({ 
        block: block as any, 
        onChange: (newProps) => updateBlock(stripeId, structureId, colId, block.id, newProps) 
      })}
    </div>
  );
}
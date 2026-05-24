"use client";

import { 
  DndContext, 
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
  DragOverlay,
  pointerWithin,
  Active,
  Over,
  CollisionDetection,
  Modifier
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEditorStore } from "@/lib/editor/store";
import { BLOCK_REGISTRY } from "@/lib/editor/registry";
import React, { useState } from "react";
import type { BlockType } from "@/lib/editor/types";

export function EditorDndWrapper({ children }: { children: React.ReactNode }) {
  const store = useEditorStore();
  const { stripes } = store;

  const [activeNode, setActiveNode] = useState<Active | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveNode(event.active);
  };

  const getOverlayIcon = (active: Active | null) => {
    if (!active) return null;
    const isNew = active.data.current?.isNew as boolean | undefined;
    const declaredType = active.data.current?.type as string | undefined;

    // If dragging from the sidebar (new block), the `type` is the block type
    if (isNew && declaredType) {
      return BLOCK_REGISTRY[declaredType as keyof typeof BLOCK_REGISTRY]?.icon ?? null;
    }

    // If dragging an existing block from the canvas, find the block by id
    const blockId = active.data.current?.blockId as string | undefined;
    if (blockId) {
      for (const s of stripes) {
        for (const struct of s.structures) {
          for (const col of struct.columns) {
            const b = col.blocks.find((b) => b.id === blockId);
            if (b) {
              return BLOCK_REGISTRY[b.type as keyof typeof BLOCK_REGISTRY]?.icon ?? null;
            }
          }
        }
      }
    }

    return null;
  };

  const customCollisionDetection: CollisionDetection = (args) => {
    const pointerIntersections = pointerWithin(args);
    
    if (pointerIntersections.length > 0) {
      const typePriority: Record<string, number> = {
        "structure-drop": 6,
        "block-drop": 5,
        block: 4,
        column: 3,
        structure: 2,
        stripe: 1,
        canvas: 0
      };

      const sorted = [...pointerIntersections].sort((a, b) => {
        const aContainer = args.droppableContainers.find((c) => c.id === a.id);
        const bContainer = args.droppableContainers.find((c) => c.id === b.id);
        const aType = aContainer?.data?.current?.type as string | undefined;
        const bType = bContainer?.data?.current?.type as string | undefined;
        const aScore = aType ? typePriority[aType] || 0 : 0;
        const bScore = bType ? typePriority[bType] || 0 : 0;
        return bScore - aScore;
      });

      return sorted;
    }

    return [];
  };

  const snapCenterToCursor: Modifier = ({ transform, activeNodeRect }) => {
    // In dnd-kit v6, pointerCoordinates isn't directly available in the Modifier arguments,
    // but the transform.x and transform.y represent the current cursor delta.
    // If the activeNodeRect was larger/smaller than our 80x80 overlay, we can adjust the origin.
    // The overlay is 80x80 (w-20 h-20)
    if (!activeNodeRect) {
      return transform;
    }
    const overlaySize = 80;

    return {
      ...transform,
      x: transform.x + activeNodeRect.width / 2 - overlaySize / 2,
      y: transform.y + activeNodeRect.height / 2 - overlaySize / 2,
    };
  };

  const handleSidebarDrop = (active: Active, over: Over, activeType: string, targetType: string) => {
    const payload = active.data.current?.payload;

    if (activeType === "structure") {
      if (targetType === "structure-drop") {
        const stripeId = over.data.current?.stripeId as string;
        const insertIndex = over.data.current?.index as number;
        store.addStructure(stripeId, payload, insertIndex);
        return;
      }

      let targetStripeId = over.data.current?.stripeId as string | undefined;
      if (!targetStripeId && stripes.length > 0) {
        targetStripeId = stripes[stripes.length - 1].id;
      }
      if (!targetStripeId) {
        targetStripeId = store.addStripe();
      }
      store.addStructure(targetStripeId, payload);
      return;
    }

    // Dropping a block from sidebar
    const blockType = activeType as BlockType;

    if (targetType === "block-drop") {
      const stripeId = over.data.current?.stripeId as string;
      const structureId = over.data.current?.structureId as string;
      const colId = over.data.current?.colId as string;
      const insertIndex = over.data.current?.index as number;
      store.addBlockToColumn(blockType, stripeId, structureId, colId, insertIndex, payload);
      return;
    }

    if (targetType === "column" || targetType === "block") {
      const targetStripeId = over.data.current?.stripeId as string;
      const targetStructureId = over.data.current?.structureId as string;
      const targetColId = over.data.current?.colId as string;
      
      let insertIndex: number | undefined = undefined;
      if (targetType === "block") {
        const stripe = stripes.find(s => s.id === targetStripeId);
        const struct = stripe?.structures.find(s => s.id === targetStructureId);
        const col = struct?.columns.find(c => c.id === targetColId);
        const index = col?.blocks.findIndex(b => b.id === over.id);
        if (index !== undefined && index !== -1) {
          insertIndex = index;
        }
      }
      store.addBlockToColumn(blockType, targetStripeId, targetStructureId, targetColId, insertIndex, payload);
    } else if (targetType === "structure") {
      const targetStripeId = over.data.current?.stripeId as string;
      const targetStructureId = over.data.current?.structureId as string;
      const stripe = stripes.find(s => s.id === targetStripeId);
      const struct = stripe?.structures.find(s => s.id === targetStructureId);
      if (struct && struct.columns.length > 0) {
        store.addBlockToColumn(blockType, targetStripeId, targetStructureId, struct.columns[0].id, undefined, payload);
      }
    } else if (targetType === "stripe") {
      const targetStripeId = over.data.current?.stripeId as string;
      const stripe = stripes.find(s => s.id === targetStripeId);
      if (stripe && stripe.structures.length > 0 && stripe.structures[0].columns.length > 0) {
        store.addBlockToColumn(blockType, targetStripeId, stripe.structures[0].id, stripe.structures[0].columns[0].id, undefined, payload);
      }
    } else if (targetType === "canvas") {
      store.addBlockToCanvas(blockType, payload);
    }
  };

  const handleStripeReorder = (active: Active, over: Over) => {
    const oldIndex = stripes.findIndex((s) => s.id === active.id);
    const newIndex = stripes.findIndex((s) => s.id === over.id);
    if (oldIndex !== -1 && newIndex !== -1) {
      store.reorderStripes(oldIndex, newIndex);
    }
  };

  const handleStructureReorder = (active: Active, over: Over) => {
    const stripeId = active.data.current?.stripeId as string;
    if (stripeId === over.data.current?.stripeId) {
      const stripe = stripes.find(s => s.id === stripeId);
      if (stripe) {
        const oldIndex = stripe.structures.findIndex(s => s.id === active.id);
        const newIndex = stripe.structures.findIndex(s => s.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          store.reorderStructures(stripeId, oldIndex, newIndex);
        }
      }
    }
  };

  const handleBlockMove = (active: Active, over: Over, targetType: string) => {
    const sourceStripeId = active.data.current?.stripeId as string;
    const sourceStructureId = active.data.current?.structureId as string;
    const sourceColId = active.data.current?.colId as string;

    const sourceStripe = stripes.find(s => s.id === sourceStripeId);
    const sourceStruct = sourceStripe?.structures.find(s => s.id === sourceStructureId);
    const sourceCol = sourceStruct?.columns.find(c => c.id === sourceColId);
    const sourceIndex = sourceCol?.blocks.findIndex(b => b.id === active.id);

    if (sourceIndex === undefined || sourceIndex === -1) return;

    if (targetType === "column" || targetType === "block") {
      const targetStripeId = over.data.current?.stripeId as string;
      const targetStructureId = over.data.current?.structureId as string;
      const targetColId = over.data.current?.colId as string;

      const targetStripe = stripes.find(s => s.id === targetStripeId);
      const targetStruct = targetStripe?.structures.find(s => s.id === targetStructureId);
      const targetCol = targetStruct?.columns.find(c => c.id === targetColId);

      let targetIndex = targetCol?.blocks.length ?? 0;
      if (targetType === "block") {
        const idx = targetCol?.blocks.findIndex(b => b.id === over.id);
        if (idx !== undefined && idx !== -1) {
          targetIndex = idx;
        }
      }

      store.moveBlock(
        { stripeId: sourceStripeId, structureId: sourceStructureId, columnId: sourceColId, index: sourceIndex },
        { stripeId: targetStripeId, structureId: targetStructureId, columnId: targetColId, index: targetIndex }
      );
    } else if (targetType === "structure") {
      const targetStripeId = over.data.current?.stripeId as string;
      const targetStructureId = over.data.current?.structureId as string;
      const targetStripe = stripes.find(s => s.id === targetStripeId);
      const targetStruct = targetStripe?.structures.find(s => s.id === targetStructureId);
      
      if (targetStruct && targetStruct.columns.length > 0) {
        store.moveBlock(
          { stripeId: sourceStripeId, structureId: sourceStructureId, columnId: sourceColId, index: sourceIndex },
          { stripeId: targetStripeId, structureId: targetStructureId, columnId: targetStruct.columns[0].id, index: targetStruct.columns[0].blocks.length }
        );
      }
    } else if (targetType === "stripe") {
      const targetStripeId = over.data.current?.stripeId as string;
      const targetStripe = stripes.find(s => s.id === targetStripeId);
      
      if (targetStripe && targetStripe.structures.length > 0 && targetStripe.structures[0].columns.length > 0) {
        store.moveBlock(
          { stripeId: sourceStripeId, structureId: sourceStructureId, columnId: sourceColId, index: sourceIndex },
          { stripeId: targetStripeId, structureId: targetStripe.structures[0].id, columnId: targetStripe.structures[0].columns[0].id, index: targetStripe.structures[0].columns[0].blocks.length }
        );
      }
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveNode(null);
    const { active, over } = event;
    if (!over) return;

    const isSidebarItem = active.data.current?.isNew as boolean | undefined;
    const activeType = active.data.current?.type as string | undefined;
    const targetType = over.data.current?.type as string | undefined;

    if (!activeType || !targetType) return;

    if (isSidebarItem) {
      handleSidebarDrop(active, over, activeType, targetType);
      return;
    }

    if (activeType === "stripe" && targetType === "stripe" && active.id !== over.id) {
      handleStripeReorder(active, over);
      return;
    }

    if (activeType === "structure" && targetType === "structure" && active.id !== over.id) {
      handleStructureReorder(active, over);
      return;
    }

    if (activeType === "block") {
      handleBlockMove(active, over, targetType);
    }
  };

  return (
    <DndContext 
      sensors={sensors}
      collisionDetection={customCollisionDetection}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
      <DragOverlay dropAnimation={null} modifiers={[snapCenterToCursor]}>
        {activeNode ? (
          <div className="bg-zinc-900 border-2 border-primary shadow-2xl rounded-lg flex items-center justify-center p-3 opacity-100 scale-105 pointer-events-none w-20 h-20">
             <div className="w-12 h-12 border border-dashed border-zinc-500 rounded bg-zinc-800 flex items-center justify-center text-zinc-400">
               {(() => {
                 const Icon = getOverlayIcon(activeNode) as React.ElementType | null;
                 if (Icon) {
                   return <Icon className="w-6 h-6 text-white" />;
                 }
                 return (
                   <span className="text-[10px] font-medium uppercase tracking-wider">
                     {(activeNode.data.current?.type as string)?.replace('-drop', '') || 'Move'}
                   </span>
                 );
               })()}
             </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

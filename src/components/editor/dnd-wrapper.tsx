"use client";

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  pointerWithin
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { useEditorStore } from "@/lib/editor/store";
import React, { useState } from "react";

export function EditorDndWrapper({ children }: { children: React.ReactNode }) {
  const { 
    stripes, 
    reorderStripes, 
    reorderStructures,
    addStripe,
    addStructure,
    addBlockToColumn, 
    moveBlock 
  } = useEditorStore();
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const customCollisionDetection = (args: any) => {
    const pointerIntersections = pointerWithin(args);
    
    if (pointerIntersections.length > 0) {
      const typePriority: Record<string, number> = {
        block: 4,
        column: 3,
        structure: 2,
        stripe: 1,
        canvas: 0
      };

      const sorted = [...pointerIntersections].sort((a, b) => {
        const aContainer = args.droppableContainers.find((c: any) => c.id === a.id);
        const bContainer = args.droppableContainers.find((c: any) => c.id === b.id);
        const aType = aContainer?.data?.current?.type;
        const bType = bContainer?.data?.current?.type;
        const aScore = aType ? typePriority[aType] || 0 : 0;
        const bScore = bType ? typePriority[bType] || 0 : 0;
        return bScore - aScore;
      });

      return sorted;
    }

    return closestCenter(args);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;

    const isSidebarItem = active.data.current?.isNew;
    const activeType = active.data.current?.type;

    // 1. Dropping from Sidebar
    if (isSidebarItem) {
      if (activeType === "structure") {
        let targetStripeId = over.data.current?.stripeId;
        if (!targetStripeId && stripes.length > 0) {
          targetStripeId = stripes[stripes.length - 1].id;
        }
        if (!targetStripeId) {
          targetStripeId = addStripe();
        }
        addStructure(targetStripeId, active.data.current?.payload);
      } else {
        // Dropping a content block
        const targetType = over.data.current?.type;
        if (targetType === "column" || targetType === "block") {
          const targetStripeId = over.data.current?.stripeId;
          const targetStructureId = over.data.current?.structureId;
          const targetColId = over.data.current?.colId;
          
          let insertIndex = undefined;
          if (targetType === "block") {
            const stripe = stripes.find(s => s.id === targetStripeId);
            const struct = stripe?.structures.find(s => s.id === targetStructureId);
            const col = struct?.columns.find(c => c.id === targetColId);
            const index = col?.blocks.findIndex(b => b.id === over.id);
            if (index !== undefined && index !== -1) {
              insertIndex = index;
            }
          }
          addBlockToColumn(activeType as any, targetStripeId, targetStructureId, targetColId, insertIndex, active.data.current?.payload);
        } else if (targetType === "structure") {
          const targetStripeId = over.data.current?.stripeId;
          const targetStructureId = over.data.current?.structureId;
          const stripe = stripes.find(s => s.id === targetStripeId);
          const struct = stripe?.structures.find(s => s.id === targetStructureId);
          if (struct && struct.columns.length > 0) {
            addBlockToColumn(activeType as any, targetStripeId, targetStructureId, struct.columns[0].id, undefined, active.data.current?.payload);
          }
        } else if (targetType === "stripe") {
          const targetStripeId = over.data.current?.stripeId;
          const stripe = stripes.find(s => s.id === targetStripeId);
          if (stripe && stripe.structures.length > 0 && stripe.structures[0].columns.length > 0) {
            addBlockToColumn(activeType as any, targetStripeId, stripe.structures[0].id, stripe.structures[0].columns[0].id, undefined, active.data.current?.payload);
          }
        }
      }
      return;
    }

    // 2. Stripe Reordering
    if (active.data.current?.type === "stripe" && over.data.current?.type === "stripe" && active.id !== over.id) {
      const oldIndex = stripes.findIndex((s) => s.id === active.id);
      const newIndex = stripes.findIndex((s) => s.id === over.id);
      reorderStripes(oldIndex, newIndex);
      return;
    }

    // 3. Structure Reordering
    if (active.data.current?.type === "structure" && over.data.current?.type === "structure" && active.id !== over.id) {
      const stripeId = active.data.current?.stripeId;
      if (stripeId === over.data.current?.stripeId) {
        const stripe = stripes.find(s => s.id === stripeId);
        if (stripe) {
          const oldIndex = stripe.structures.findIndex(s => s.id === active.id);
          const newIndex = stripe.structures.findIndex(s => s.id === over.id);
          reorderStructures(stripeId, oldIndex, newIndex);
        }
      }
      return;
    }

    // 4. Block Reordering / Cross-Column Moving
    if (active.data.current?.type === "block") {
      const targetType = over.data.current?.type;
      if (targetType === "column" || targetType === "block") {
        const sourceStripeId = active.data.current?.stripeId;
        const sourceStructureId = active.data.current?.structureId;
        const sourceColId = active.data.current?.colId;
        
        const targetStripeId = over.data.current?.stripeId;
        const targetStructureId = over.data.current?.structureId;
        const targetColId = over.data.current?.colId;
        
        // Find insert index
        const sourceStripe = stripes.find(s => s.id === sourceStripeId);
        const sourceStruct = sourceStripe?.structures.find(s => s.id === sourceStructureId);
        const sourceCol = sourceStruct?.columns.find(c => c.id === sourceColId);
        const sourceIndex = sourceCol?.blocks.findIndex(b => b.id === active.id);
        
        const targetStripe = stripes.find(s => s.id === targetStripeId);
        const targetStruct = targetStripe?.structures.find(s => s.id === targetStructureId);
        const targetCol = targetStruct?.columns.find(c => c.id === targetColId);
        
        if (sourceIndex === undefined || sourceIndex === -1) return;

        let targetIndex = targetCol?.blocks.length || 0;
        
        if (targetType === "block") {
          targetIndex = targetCol?.blocks.findIndex(b => b.id === over.id) ?? targetIndex;
        }

        moveBlock(
          { stripeId: sourceStripeId, structureId: sourceStructureId, columnId: sourceColId, index: sourceIndex },
          { stripeId: targetStripeId, structureId: targetStructureId, columnId: targetColId, index: targetIndex }
        );
      } else if (targetType === "structure") {
        const sourceStripeId = active.data.current?.stripeId;
        const sourceStructureId = active.data.current?.structureId;
        const sourceColId = active.data.current?.colId;
        
        const targetStripeId = over.data.current?.stripeId;
        const targetStructureId = over.data.current?.structureId;
        
        const sourceStripe = stripes.find(s => s.id === sourceStripeId);
        const sourceStruct = sourceStripe?.structures.find(s => s.id === sourceStructureId);
        const sourceCol = sourceStruct?.columns.find(c => c.id === sourceColId);
        const sourceIndex = sourceCol?.blocks.findIndex(b => b.id === active.id);
        
        const targetStripe = stripes.find(s => s.id === targetStripeId);
        const targetStruct = targetStripe?.structures.find(s => s.id === targetStructureId);
        
        if (sourceIndex !== undefined && sourceIndex !== -1 && targetStruct && targetStruct.columns.length > 0) {
          moveBlock(
            { stripeId: sourceStripeId, structureId: sourceStructureId, columnId: sourceColId, index: sourceIndex },
            { stripeId: targetStripeId, structureId: targetStructureId, columnId: targetStruct.columns[0].id, index: targetStruct.columns[0].blocks.length }
          );
        }
      } else if (targetType === "stripe") {
        const sourceStripeId = active.data.current?.stripeId;
        const sourceStructureId = active.data.current?.structureId;
        const sourceColId = active.data.current?.colId;
        
        const targetStripeId = over.data.current?.stripeId;
        
        const sourceStripe = stripes.find(s => s.id === sourceStripeId);
        const sourceStruct = sourceStripe?.structures.find(s => s.id === sourceStructureId);
        const sourceCol = sourceStruct?.columns.find(c => c.id === sourceColId);
        const sourceIndex = sourceCol?.blocks.findIndex(b => b.id === active.id);
        
        const targetStripe = stripes.find(s => s.id === targetStripeId);
        
        if (sourceIndex !== undefined && sourceIndex !== -1 && targetStripe && targetStripe.structures.length > 0 && targetStripe.structures[0].columns.length > 0) {
          moveBlock(
            { stripeId: sourceStripeId, structureId: sourceStructureId, columnId: sourceColId, index: sourceIndex },
            { stripeId: targetStripeId, structureId: targetStripe.structures[0].id, columnId: targetStripe.structures[0].columns[0].id, index: targetStripe.structures[0].columns[0].blocks.length }
          );
        }
      }
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
      <DragOverlay>
        {activeId ? (
          <div className="bg-primary/20 border-2 border-primary w-full h-16 rounded-md backdrop-blur-sm pointer-events-none" />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

"use client";

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  useDroppable,
  DragOverlay
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "@/lib/editor/store";
import { BLOCK_REGISTRY } from "@/lib/editor/registry";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { Copy, Trash2, Rows, BoxSelect } from "lucide-react";

function EmptyDropZone() {
  const { isOver, setNodeRef } = useDroppable({
    id: "empty-canvas",
    data: { type: "canvas" }
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground text-sm border-2 border-dashed m-4 rounded-xl transition-colors",
        isOver ? "border-primary bg-primary/5 text-primary" : "border-transparent opacity-60"
      )}
    >
      <p>No stripes added yet.</p>
      <p className="text-xs mt-1">Click 'Add Stripe' or drag a layout from the sidebar to begin.</p>
    </div>
  );
}

function BlockItem({ block, stripeId, structureId, colId }: { block: any, stripeId: string, structureId: string, colId: string }) {
  const { selectedNode, selectNode } = useEditorStore();
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
        "relative cursor-grab active:cursor-grabbing border-2 border-transparent transition-colors",
        isSelected && "border-blue-500 z-10",
        "hover:border-blue-300"
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectNode({ type: 'block', stripeId, structureId, columnId: colId, blockId: block.id });
      }}
      {...attributes}
      {...listeners}
    >
      {config?.renderCanvas({ block })}
    </div>
  );
}

function ColumnZone({ col, stripeId, structureId }: { col: any, stripeId: string, structureId: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${col.id}`,
    data: { type: "column", stripeId, structureId, colId: col.id }
  });

  const { selectedNode, selectNode } = useEditorStore();
  const isSelected = selectedNode?.type === 'column' && selectedNode.columnId === col.id;

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        e.stopPropagation();
        selectNode({ type: 'column', stripeId, structureId, columnId: col.id });
      }}
      className={cn(
        "flex flex-col relative transition-colors min-h-[60px] border-2",
        isSelected ? "border-[#7faeef] z-10" : "border-transparent hover:border-[#7faeef]/50 border-dashed",
        isOver && "bg-[#7faeef]/10 border-[#7faeef]"
      )}
      style={{
        flex: col.widthRatio,
        backgroundColor: col.props.backgroundColor || "transparent",
        paddingTop: col.props.paddingTop || 0,
        paddingBottom: col.props.paddingBottom || 0,
        paddingLeft: col.props.paddingLeft || 0,
        paddingRight: col.props.paddingRight || 0,
        justifyContent: col.props.verticalAlign === 'middle' ? 'center' : col.props.verticalAlign === 'bottom' ? 'flex-end' : 'flex-start'
      }}
    >
      {isSelected && (
        <div className="absolute -bottom-7 left-0 bg-[#7faeef] text-white rounded-b-md px-2 py-1 flex items-center gap-1 z-30 text-xs font-medium">
          Container
        </div>
      )}
      <SortableContext items={col.blocks.map((b:any) => b.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col min-h-full">
          {col.blocks.length > 0 ? (
            col.blocks.map((block: any) => (
              <BlockItem key={block.id} block={block} stripeId={stripeId} structureId={structureId} colId={col.id} />
            ))
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-[#7faeef] opacity-80 pointer-events-none">
               <span className="text-[11px] font-medium tracking-wide">Drop content here</span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function StructureItem({ structure, stripeId }: { structure: any, stripeId: string }) {
  const { selectedNode, selectNode, duplicateStructure, removeStructure } = useEditorStore();
  const isSelected = selectedNode?.type === 'structure' && selectedNode.structureId === structure.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: structure.id,
    data: { type: "structure", stripeId, structureId: structure.id }
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
        "relative group border-2 transition-colors",
        isSelected ? "border-[#a75d5d] z-20" : "border-transparent hover:border-[#a75d5d]/50"
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectNode({ type: 'structure', stripeId, structureId: structure.id });
      }}
    >
      {isSelected && (
        <div className="absolute -bottom-7 left-0 bg-[#a75d5d] text-white rounded-b-md px-2 py-1 flex items-center gap-1 z-30 text-xs font-medium">
          Structure
          <div className="w-px h-3 bg-white/30 mx-1" />
          <div {...attributes} {...listeners} className="cursor-grab p-0.5 hover:bg-white/20 rounded">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 9h8M8 15h8"/></svg>
          </div>
          <button onClick={(e) => { e.stopPropagation(); duplicateStructure(stripeId, structure.id); }} className="p-0.5 hover:bg-white/20 rounded">
            <Copy className="w-3 h-3" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); removeStructure(stripeId, structure.id); }} className="p-0.5 hover:bg-white/20 rounded">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      <div 
        className={cn("w-full mx-auto flex")}
        style={{
          backgroundColor: structure.props.backgroundColor || "transparent",
          paddingTop: structure.props.paddingTop || 0,
          paddingBottom: structure.props.paddingBottom || 0,
          paddingLeft: structure.props.paddingLeft || 0,
          paddingRight: structure.props.paddingRight || 0,
          gap: structure.props.columnGap ? `${structure.props.columnGap}px` : undefined,
        }}
      >
        {structure.columns.map((col: any) => (
          <ColumnZone key={col.id} col={col} stripeId={stripeId} structureId={structure.id} />
        ))}
      </div>
    </div>
  );
}

function StripeItem({ stripe }: { stripe: any }) {
  const { selectedNode, selectNode, duplicateStripe, removeStripe } = useEditorStore();
  const isSelected = selectedNode?.type === 'stripe' && selectedNode.stripeId === stripe.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: stripe.id,
    data: { type: "stripe", stripeId: stripe.id }
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
        "relative group border-2 transition-colors",
        isSelected ? "border-[#5c6e99] z-20" : "border-transparent hover:border-[#5c6e99]/50"
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectNode({ type: 'stripe', stripeId: stripe.id });
      }}
    >
      {isSelected && (
        <div className="absolute -bottom-7 left-0 bg-[#5c6e99] text-white rounded-b-md px-2 py-1 flex items-center gap-1 z-30 text-xs font-medium">
          Stripe
          <div className="w-px h-3 bg-white/30 mx-1" />
          <div {...attributes} {...listeners} className="cursor-grab p-0.5 hover:bg-white/20 rounded">
            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 9h8M8 15h8"/></svg>
          </div>
          <button onClick={(e) => { e.stopPropagation(); duplicateStripe(stripe.id); }} className="p-0.5 hover:bg-white/20 rounded">
            <Copy className="w-3 h-3" />
          </button>
          <button onClick={(e) => { e.stopPropagation(); removeStripe(stripe.id); }} className="p-0.5 hover:bg-white/20 rounded">
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      )}

      <div 
        className={cn("w-full mx-auto")}
        style={{
          backgroundColor: stripe.props.backgroundColor || "transparent",
          backgroundImage: stripe.props.backgroundImageUrl ? `url(${stripe.props.backgroundImageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          paddingTop: stripe.props.paddingTop || 0,
          paddingBottom: stripe.props.paddingBottom || 0,
        }}
      >
        <div 
          className="mx-auto" 
          style={{ width: stripe.props.fullWidth ? "100%" : "inherit" }}
        >
          <SortableContext items={stripe.structures.map((s:any) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col relative w-full h-full min-h-[40px]">
              {stripe.structures.map((structure: any) => (
                <StructureItem key={structure.id} structure={structure} stripeId={stripe.id} />
              ))}
            </div>
          </SortableContext>
        </div>
      </div>
    </div>
  );
}

export function Canvas() {
  const { 
    stripes, 
    globalStyles, 
    selectNode
  } = useEditorStore();

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center relative"
      style={{ backgroundColor: globalStyles.bodyBackgroundColor }}
      onClick={() => selectNode(null)}
    >
      <div 
        className="shadow-2xl min-h-[800px] transition-all relative border border-border/50 my-auto"
        style={{ 
          width: "100%",
          maxWidth: `${globalStyles.contentWidth}px`,
          backgroundColor: globalStyles.contentBackgroundColor,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {stripes.length === 0 ? (
          <EmptyDropZone />
        ) : (
          <SortableContext items={stripes.map(s => s.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col relative w-full h-full pb-32">
              {stripes.map((stripe) => (
                <StripeItem key={stripe.id} stripe={stripe} />
              ))}
            </div>
          </SortableContext>
        )}
      </div>
    </div>
  );
}

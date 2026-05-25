"use client";

import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEditorStore } from "@/lib/editor/store";
import { cn } from "@/lib/utils";
import React from "react";
import { useDndContext } from "@dnd-kit/core";
import { DropZoneHint } from "./drop-zone-hint";
import { EditorBlockWrapper } from "./editor-block-wrapper";
import { NODE_COLORS } from "@/lib/editor/config";
import { SelectionToolbar } from "./selection-toolbar";
import { Stripe, Structure, Column, EditorBlock } from "@/lib/editor/types";

function BlockDropZone({ stripeId, structureId, colId, index }: { stripeId: string, structureId: string, colId: string, index: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `block-drop-${stripeId}-${structureId}-${colId}-${index}`,
    data: { type: "block-drop", stripeId, structureId, colId, index }
  });

  const { active } = useDndContext();
  const activeType = active?.data.current?.type as string | undefined;
  const isNewBlock = activeType && ["text", "image", "button", "divider"].includes(activeType);

  if (!isNewBlock) return null;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-full transition-all relative z-50 flex items-center justify-center",
        isOver ? "h-8 -my-4 opacity-100" : "h-4 -my-2 opacity-0"
      )}
    >
      <DropZoneHint isOver={isOver} label="Drop block here" colorClass={NODE_COLORS.block.bg} />
    </div>
  );
}

function StructureDropZone({ stripeId, index }: { stripeId: string, index: number }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `structure-drop-${stripeId}-${index}`,
    data: { type: "structure-drop", stripeId, index }
  });

  const { active } = useDndContext();
  const isDraggingSidebarStructure = active?.data.current?.type === "structure";

  if (!isDraggingSidebarStructure) return null;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "w-full transition-all relative z-50 flex items-center justify-center",
        isOver ? "h-12 -my-6 opacity-100" : "h-6 -my-3 opacity-0"
      )}
    >
      <DropZoneHint isOver={isOver} label="Drop layout here" colorClass={NODE_COLORS.structure.bg} />
    </div>
  );
}

function EmptyDropZone() {
  const { isOver, setNodeRef } = useDroppable({
    id: "empty-canvas",
    data: { type: "canvas" }
  });

  const { active } = useDndContext();
  const activeType = active?.data.current?.type as string | undefined;
  const isValid = activeType && ["structure", "block", "text", "image", "button", "divider"].includes(activeType);
  const showHighlight = isOver && isValid;

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex flex-col items-center justify-center h-full min-h-100 text-muted-foreground text-sm border-2 border-dashed m-4 rounded-xl transition-colors",
        showHighlight ? "border-primary bg-primary/5 text-primary" : "border-transparent opacity-60"
      )}
    >
      <p>No stripes added yet.</p>
      <p className="text-xs mt-1">Click &apos;Add Stripe&apos; or drag a layout from the sidebar to begin.</p>
    </div>
  );
}

function ColumnZone({ col, stripeId, structureId }: { col: Column, stripeId: string, structureId: string }) {
  const { setNodeRef, isOver } = useDroppable({
    id: `col-${col.id}`,
    data: { type: "column", stripeId, structureId, colId: col.id }
  });

  const { active } = useDndContext();
  const activeType = active?.data.current?.type as string | undefined;
  const isBlock = activeType && ["block", "text", "image", "button", "divider"].includes(activeType);
  const showHighlight = isOver && isBlock;

  const { selectedNode, selectNode, removeColumn } = useEditorStore();
  const isSelected = selectedNode?.type === 'column' && selectedNode.columnId === col.id;

  return (
    <div
      ref={setNodeRef}
      onClick={(e) => {
        e.stopPropagation();
        selectNode({ type: 'column', stripeId, structureId, columnId: col.id });
      }}
      className={cn(
        "flex flex-col relative transition-colors min-h-15 ring-2 ring-inset",
        isSelected ? `${NODE_COLORS.column.ring} z-10` : `ring-transparent ${NODE_COLORS.column.hoverRing}`,
        showHighlight && `${NODE_COLORS.column.lightBg} ${NODE_COLORS.column.ring}`
      )}
      style={{
        flex: col.widthRatio,
        backgroundColor: col.props.backgroundColor || "transparent",
        paddingTop: col.props.paddingTop || 0,
        paddingBottom: col.props.paddingBottom || 0,
        paddingLeft: col.props.paddingLeft || 0,
        paddingRight: col.props.paddingRight || 0
      }}
    >
      {isSelected && (
        <SelectionToolbar
          type="column"
          label="Column"
          onRemove={() => removeColumn(stripeId, structureId, col.id)}
        />
      )}
      {showHighlight && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40">
          <div className={cn("text-white text-[11px] font-medium px-3 py-1 rounded-full shadow-md whitespace-nowrap", NODE_COLORS.block.bg)}>
            Drop block here
          </div>
        </div>
      )}
      <SortableContext items={col.blocks.map((b: EditorBlock) => b.id)} strategy={verticalListSortingStrategy}>
        <div
          className="flex flex-col flex-1"
          style={{
            justifyContent: col.props.verticalAlign === 'middle' ? 'center' : col.props.verticalAlign === 'bottom' ? 'flex-end' : 'flex-start'
          }}
        >
          {col.blocks.length > 0 ? (
            <>
              <BlockDropZone stripeId={stripeId} structureId={structureId} colId={col.id} index={0} />
              {col.blocks.map((block: EditorBlock, index: number) => (
                <React.Fragment key={block.id}>
                  <EditorBlockWrapper block={block} stripeId={stripeId} structureId={structureId} colId={col.id} />
                  <BlockDropZone stripeId={stripeId} structureId={structureId} colId={col.id} index={index + 1} />
                </React.Fragment>
              ))}
            </>
          ) : (
            <div
              className={cn(
                "absolute inset-1 flex flex-col items-center justify-center border border-dashed opacity-80 pointer-events-none rounded-md",
                NODE_COLORS.column.lightBg
              )}
              style={{ color: NODE_COLORS.column.color, borderColor: NODE_COLORS.column.color }}
            >
              <span className="text-[11px] font-medium tracking-wide">Drop content here</span>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function StructureItem({ structure, stripeId }: { structure: Structure, stripeId: string }) {
  const { selectedNode, selectNode, duplicateStructure, removeStructure, globalStyles } = useEditorStore();
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
        "relative group transition-colors",
        isSelected ? "z-20" : ""
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectNode({ type: 'structure', stripeId, structureId: structure.id });
      }}
    >
      {isSelected && (
        <SelectionToolbar
          type="structure"
          label="Structure"
          attributes={attributes}
          listeners={listeners}
          onDuplicate={() => duplicateStructure(stripeId, structure.id)}
          onRemove={() => removeStructure(stripeId, structure.id)}
        />
      )}

      {/* Ring Highlight Overlay */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-all z-10",
          isSelected
            ? "ring-2 ring-inset ring-[#a75d5d]"
            : "ring-transparent group-hover:ring-2 group-hover:ring-inset group-hover:ring-[#a75d5d]/40"
        )}
      />

      <div
        className={cn("mx-auto flex", "box-border")}
        style={{
          backgroundColor: structure.props.backgroundColor && structure.props.backgroundColor !== "transparent"
            ? structure.props.backgroundColor
            : globalStyles.contentBackgroundColor,
          paddingTop: structure.props.paddingTop || 0,
          paddingBottom: structure.props.paddingBottom || 0,
          paddingLeft: structure.props.paddingLeft || 0,
          paddingRight: structure.props.paddingRight || 0,
          marginTop: structure.props.marginTop || 0,
          marginBottom: structure.props.marginBottom || 0,
          marginLeft: structure.props.marginLeft || 0,
          marginRight: structure.props.marginRight || 0,
          gap: structure.props.columnGap ? `${structure.props.columnGap}px` : undefined,
        }}
      >
        {structure.columns.map((col: Column) => (
          <ColumnZone key={col.id} col={col} stripeId={stripeId} structureId={structure.id} />
        ))}
      </div>
    </div>
  );
}

function StripeItem({ stripe }: { stripe: Stripe }) {
  const { selectedNode, selectNode, duplicateStripe, removeStripe, globalStyles } = useEditorStore();
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
        "relative group transition-colors",
        isSelected ? "z-20" : ""
      )}
      onClick={(e) => {
        e.stopPropagation();
        selectNode({ type: 'stripe', stripeId: stripe.id });
      }}
    >
      {isSelected && (
        <SelectionToolbar
          type="stripe"
          label="Stripe"
          attributes={attributes}
          listeners={listeners}
          onDuplicate={() => duplicateStripe(stripe.id)}
          onRemove={() => removeStripe(stripe.id)}
        />
      )}

      {/* Ring Highlight Overlay */}
      <div
        className={cn(
          "absolute inset-0 pointer-events-none transition-all z-10",
          isSelected
            ? `ring-2 ring-inset ${NODE_COLORS.stripe.ring}`
            : `ring-transparent group-hover:ring-2 group-hover:ring-inset ${NODE_COLORS.stripe.hoverRing}`
        )}
      />

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
          style={{
            width: "100%",
            maxWidth: stripe.props.fullWidth ? "100%" : `${globalStyles.contentWidth - 40}px`,
            marginLeft: globalStyles.messageAlignment === "left" ? "0" : "auto",
            marginRight: globalStyles.messageAlignment === "right" ? "0" : "auto",
          }}
        >
          <SortableContext items={stripe.structures.map((s: Structure) => s.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col relative w-full h-full min-h-10">
              <StructureDropZone stripeId={stripe.id} index={0} />
              {stripe.structures.map((structure: Structure, index: number) => (
                <React.Fragment key={structure.id}>
                  <StructureItem structure={structure} stripeId={stripe.id} />
                  <StructureDropZone stripeId={stripe.id} index={index + 1} />
                </React.Fragment>
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
      onClick={() => selectNode(null)}
    >
      <div
        className="shadow-2xl min-h-200 transition-all relative border border-border/50 my-auto"
        style={{
          width: "100%",
          maxWidth: "100%",
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

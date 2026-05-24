"use client";

import React, { useState } from "react";
import { BLOCK_LIST } from "@/lib/editor/registry";
import { useEditorStore } from "@/lib/editor/store";
import { LAYOUT_PRESETS, type LayoutPreset } from "@/lib/editor/layoutPresets";
import type { ContentBlock, BlockType } from "@/lib/editor/types";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { Plus, Rows3 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type BlockSidebarItemProps = {
  id: string;
  type: BlockType;
  label: string;
  icon?: React.ElementType;
  payload?: Partial<ContentBlock["props"]>;
  children?: React.ReactNode;
};

type StructureSidebarItemProps = {
  id: string;
  type: "structure";
  label: string;
  icon?: React.ElementType;
  payload: LayoutPreset;
  children?: React.ReactNode;
};

type DraggableSidebarItemProps = BlockSidebarItemProps | StructureSidebarItemProps;

function DraggableSidebarItem({ id, type, label, icon: Icon, payload, children }: DraggableSidebarItemProps) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `sidebar-${id}`,
    data: {
      isNew: true,
      type,
      payload
    }
  });

  const { addStripe, addStructure, stripes, selectedNode } = useEditorStore();

  const handleClick = () => {
    if (type === "structure") {
      let targetStripeId = selectedNode?.type === 'stripe' ? selectedNode.stripeId : null;
      if (!targetStripeId && selectedNode && 'stripeId' in selectedNode) {
        targetStripeId = selectedNode.stripeId;
      }
      if (!targetStripeId && stripes.length > 0) {
        targetStripeId = stripes[stripes.length - 1].id;
      }
      if (!targetStripeId) {
        targetStripeId = addStripe();
      }
      addStructure(targetStripeId, payload);
    } else {
      // For block clicks, it's harder without context. Usually DnD is preferred.
    }
  };

  return (
    <button
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onClick={handleClick}
      className={cn(
        "flex flex-col items-center justify-center p-3 md:p-4 border border-border rounded-lg bg-background hover:bg-muted transition-colors group aspect-square md:aspect-auto cursor-grab active:cursor-grabbing w-full",
        isDragging && "opacity ring-2 ring-primary"
      )}
      title={`Add ${label}`}
    >
      {children ? (
        <div className="w-full mb-0 md:mb-2 pointer-events-none px-2">{children}</div>
      ) : Icon ? (
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary mb-0 md:mb-2 pointer-events-none" />
      ) : null}
      <span className="text-xs font-medium text-foreground hidden md:block pointer-events-none">{label}</span>
    </button>
  );
}

function LayoutThumbnail({ columns, mini = false }: { columns: number[]; mini?: boolean }) {
  const totalWeight = columns.reduce((a, b) => a + b, 0);
  return (
    <div className={cn("flex w-full gap-1 rounded", mini ? "h-5 p-0.5" : "h-8 p-1 border border-border/50 bg-muted/20")}>
      {columns.map((col, i) => (
        <div
          key={i}
          className="h-full border border-dashed border-blue-400 bg-blue-400/30 rounded-sm"
          style={{ flex: col / totalWeight }}
        />
      ))}
    </div>
  );
}

function AddStripeDropdown() {
  const { addStripe, addStructure } = useEditorStore();

  const handleSelectLayout = (preset: LayoutPreset) => {
    const newStripeId = addStripe();
    addStructure(newStripeId, preset);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-2 px-4 rounded transition-colors">
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium hidden md:inline">Add Stripe</span>
          <Rows3 className="w-3.5 h-3.5 opacity-70 hidden md:inline" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="start"
        side="top"
        sideOffset={6}
        className="w-56"
      >
        <DropdownMenuLabel className="flex items-center gap-2">
          <Rows3 className="w-3.5 h-3.5" />
          Choose a layout
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LAYOUT_PRESETS.slice(0, 6).map((preset) => (
          <DropdownMenuItem
            key={preset.id}
            onSelect={() => handleSelectLayout(preset)}
            className="flex items-center gap-3 py-2 cursor-pointer"
          >
            <div className="w-20 shrink-0">
              <LayoutThumbnail columns={preset.columns} mini />
            </div>
            <span className="text-xs font-medium truncate">{preset.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SidebarLeft() {
  const [activeTab, setActiveTab] = useState<"blocks" | "structures">("blocks");

  return (
    <div className="w-20 md:w-64 border-r border-border bg-card h-full flex flex-col z-10 shrink-0">
      <div className="flex border-b border-border">
        <button
          className={cn("flex-1 py-3 text-xs font-semibold border-b-2 transition-colors", activeTab === "blocks" ? "border-primary text-primary" : "border-transparent text-muted-foreground")}
          onClick={() => setActiveTab("blocks")}
        >
          Blocks
        </button>
        <button
          className={cn("flex-1 py-3 text-xs font-semibold border-b-2 transition-colors", activeTab === "structures" ? "border-primary text-primary" : "border-transparent text-muted-foreground")}
          onClick={() => setActiveTab("structures")}
        >
          Layouts
        </button>
      </div>

      <div className="p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto">
        {activeTab === "blocks" && BLOCK_LIST.map((block) => (
          <DraggableSidebarItem
            key={block.type}
            id={block.type}
            type={block.type}
            label={block.label}
            icon={block.icon}
          />
        ))}

        {activeTab === "structures" && LAYOUT_PRESETS.map((layout) => (
          <DraggableSidebarItem
            key={layout.id}
            id={layout.id}
            type="structure"
            label={layout.label}
            payload={layout}
          >
            <LayoutThumbnail columns={layout.columns} />
          </DraggableSidebarItem>
        ))}
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <AddStripeDropdown />
      </div>
    </div>
  );
}

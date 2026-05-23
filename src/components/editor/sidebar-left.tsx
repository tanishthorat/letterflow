"use client";

import { useState } from "react";
import { BLOCK_LIST } from "@/lib/editor/registry";
import { useEditorStore } from "@/lib/editor/store";
import { LAYOUT_PRESETS } from "@/lib/editor/layoutPresets";
import { cn } from "@/lib/utils";
import { useDraggable } from "@dnd-kit/core";
import { Plus } from "lucide-react";

function DraggableSidebarItem({ id, type, label, icon: Icon, payload, children }: any) {
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
        isDragging && "opacity-50 ring-2 ring-primary"
      )}
      title={`Add ${label}`}
    >
      {children ? (
        <div className="w-full mb-0 md:mb-2 pointer-events-none px-2">{children}</div>
      ) : (
        <Icon className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary mb-0 md:mb-2 pointer-events-none" />
      )}
      <span className="text-xs font-medium text-foreground hidden md:block pointer-events-none">{label}</span>
    </button>
  );
}

function LayoutThumbnail({ columns }: { columns: number[] }) {
  const totalWeight = columns.reduce((a, b) => a + b, 0);
  return (
    <div className="flex w-full h-8 gap-1 p-1 border border-border/50 rounded bg-muted/20">
      {columns.map((col, i) => (
        <div 
          key={i} 
          className="h-full border border-dashed border-blue-400 bg-blue-50/50 rounded-sm"
          style={{ flex: col / totalWeight }}
        />
      ))}
    </div>
  );
}

export function SidebarLeft() {
  const [activeTab, setActiveTab] = useState<"blocks" | "structures">("blocks");
  const { addStripe } = useEditorStore();

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

      <div className="p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto flex-1">
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
        <button 
          onClick={() => addStripe()}
          className="w-full flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 text-primary py-2 px-4 rounded transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span className="text-sm font-medium">Add Stripe</span>
        </button>
      </div>
    </div>
  );
}

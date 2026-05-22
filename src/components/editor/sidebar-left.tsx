"use client";

import { BLOCK_LIST } from "@/lib/editor/registry";
import { useEditorStore } from "@/lib/editor/store";

export function SidebarLeft() {
  const addBlock = useEditorStore((state) => state.addBlock);

  return (
    <div className="w-20 md:w-64 border-r border-border bg-card h-full flex flex-col z-10 shrink-0">
      <div className="p-4 border-b border-border hidden md:block">
        <h3 className="text-sm font-semibold text-foreground">Blocks</h3>
        <p className="text-xs text-muted-foreground mt-1">Click to add to your email</p>
      </div>
      <div className="p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-2 overflow-y-auto">
        {BLOCK_LIST.map((block) => {
          const Icon = block.icon;
          return (
            <button
              key={block.type}
              onClick={() => addBlock(block.type)}
              className="flex flex-col items-center justify-center p-3 md:p-4 border border-border rounded-lg bg-background hover:bg-muted transition-colors group aspect-square md:aspect-auto"
              title={`Add ${block.label}`}
            >
              <Icon className="w-5 h-5 md:w-6 md:h-6 text-muted-foreground group-hover:text-primary mb-0 md:mb-2" />
              <span className="text-xs font-medium text-foreground hidden md:block">{block.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

"use client";

import { useEditorStore } from "@/lib/editor/store";
import { BLOCK_REGISTRY } from "@/lib/editor/registry";
import { cn } from "@/lib/utils";

export function Canvas() {
  const { blocks, selectedBlockId, selectBlock, globalStyles } = useEditorStore();

  return (
    <div 
      className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center relative"
      style={{ backgroundColor: globalStyles.bodyBackgroundColor }}
      onClick={() => selectBlock(null)} // Deselect when clicking outside
    >
      {/* Main Canvas Email Wrapper */}
      <div 
        className="shadow-2xl min-h-[800px] transition-all relative border border-border/50 my-auto"
        style={{ 
          width: "100%",
          maxWidth: `${globalStyles.contentWidth}px`,
          backgroundColor: globalStyles.contentBackgroundColor,
        }}
        onClick={(e) => e.stopPropagation()} // Prevent deselection when clicking inside canvas wrapper
      >
        {blocks.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-muted-foreground text-sm opacity-60 pointer-events-none select-none">
            <p>No blocks added yet.</p>
            <p className="text-xs mt-1">Click a block from the left panel to begin.</p>
          </div>
        ) : (
          <div className="flex flex-col relative">
            {blocks.map((block) => {
              const config = BLOCK_REGISTRY[block.type];
              const isSelected = selectedBlockId === block.id;
              
              return (
                <div 
                  key={block.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    selectBlock(block.id);
                  }}
                  className={cn(
                    "relative group cursor-pointer outline-2 outline-transparent transition-all",
                    isSelected 
                      ? "outline-primary z-10" 
                      : "hover:outline-primary/40"
                  )}
                >
                  <div className="p-4" style={{
                    fontFamily: globalStyles.defaultFontFamily,
                    color: globalStyles.defaultTextColor,
                    fontSize: `${globalStyles.defaultFontSize}px`
                  }}>
                    {config.renderCanvas({ block })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

"use client";

import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useEditorStore } from "@/lib/editor/store";
import { BLOCK_REGISTRY } from "@/lib/editor/registry";
import { SortableBlockItem } from "@/components/editor/sortable-block";
import { cn } from "@/lib/utils";

export function Canvas() {
  const { blocks, selectedBlockId, selectBlock, globalStyles, reorderBlocks } = useEditorStore();

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = blocks.findIndex((block) => block.id === active.id);
      const newIndex = blocks.findIndex((block) => block.id === over.id);
      reorderBlocks(oldIndex, newIndex);
    }
  };

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
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={blocks.map(b => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="flex flex-col relative w-full h-full pb-32">
                {blocks.map((block) => {
                  const config = BLOCK_REGISTRY[block.type];
                  const isSelected = selectedBlockId === block.id;
                  
                  return (
                    <SortableBlockItem 
                      key={block.id} 
                      id={block.id} 
                      isSelected={isSelected}
                      onSelect={() => selectBlock(block.id)}
                    >
                      <div className="p-4" style={{
                        fontFamily: globalStyles.defaultFontFamily,
                        color: globalStyles.defaultTextColor,
                        fontSize: `${globalStyles.defaultFontSize}px`
                      }}>
                        {config.renderCanvas({ block })}
                      </div>
                    </SortableBlockItem>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}

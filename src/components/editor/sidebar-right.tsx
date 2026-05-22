"use client";

import { useEditorStore } from "@/lib/editor/store";
import { BLOCK_REGISTRY } from "@/lib/editor/registry";
import { Trash2, Copy, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SidebarRight() {
  const { 
    blocks, selectedBlockId, updateBlock, removeBlock, duplicateBlock, 
    globalStyles, updateGlobalStyles 
  } = useEditorStore();

  const selectedBlock = blocks.find((b) => b.id === selectedBlockId);

  return (
    <div className="w-80 border-l border-border bg-card h-full flex flex-col z-10 shrink-0 shadow-[-4px_0_24px_-10px_rgba(0,0,0,0.1)]">
      {selectedBlock ? (
        <>
          <div className="p-4 border-b border-border flex items-center justify-between sticky top-0 bg-card z-10">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">
                {BLOCK_REGISTRY[selectedBlock.type].label} Settings
              </h3>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-foreground" onClick={() => duplicateBlock(selectedBlock.id)}>
                <Copy className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => removeBlock(selectedBlock.id)}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 overflow-y-auto flex-1 custom-scrollbar">
            {BLOCK_REGISTRY[selectedBlock.type].renderInspector({
              block: selectedBlock,
              onChange: (newProps) => updateBlock(selectedBlock.id, newProps)
            })}
          </div>
        </>
      ) : (
        <>
          <div className="p-4 border-b border-border sticky top-0 bg-card z-10">
            <div className="flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Global Styles</h3>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Applies to the whole template</p>
          </div>
          <div className="p-4 space-y-6 overflow-y-auto flex-1 custom-scrollbar">
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Layout</h4>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Content Width (px)</Label>
                <Input 
                  type="number" 
                  value={globalStyles.contentWidth} 
                  onChange={(e) => updateGlobalStyles({ contentWidth: Number(e.target.value) })} 
                />
              </div>
            </div>

            <div className="h-px bg-border w-full" />

            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Colors</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Page Base</Label>
                  <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
                    <input 
                      type="color" 
                      className="w-full h-full border-none bg-transparent cursor-pointer"
                      value={globalStyles.bodyBackgroundColor} 
                      onChange={(e) => updateGlobalStyles({ bodyBackgroundColor: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Content</Label>
                  <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
                    <input 
                      type="color" 
                      className="w-full h-full border-none bg-transparent cursor-pointer"
                      value={globalStyles.contentBackgroundColor} 
                      onChange={(e) => updateGlobalStyles({ contentBackgroundColor: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Default Text</Label>
                  <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
                    <input 
                      type="color" 
                      className="w-full h-full border-none bg-transparent cursor-pointer"
                      value={globalStyles.defaultTextColor} 
                      onChange={(e) => updateGlobalStyles({ defaultTextColor: e.target.value })} 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Links</Label>
                  <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
                    <input 
                      type="color" 
                      className="w-full h-full border-none bg-transparent cursor-pointer"
                      value={globalStyles.linkColor} 
                      onChange={(e) => updateGlobalStyles({ linkColor: e.target.value })} 
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="h-px bg-border w-full" />

            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider">Typography</h4>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Font Family</Label>
                <select 
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                  value={globalStyles.defaultFontFamily} 
                  onChange={(e) => updateGlobalStyles({ defaultFontFamily: e.target.value })}
                >
                  <option value="Inter, sans-serif">Inter</option>
                  <option value="Arial, sans-serif">Arial</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', serif">Courier New</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Base Size (px)</Label>
                <Input 
                  type="number" 
                  value={globalStyles.defaultFontSize} 
                  onChange={(e) => updateGlobalStyles({ defaultFontSize: Number(e.target.value) })} 
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

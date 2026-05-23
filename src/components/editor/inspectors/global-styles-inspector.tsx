"use client";

import { useEditorStore } from "@/lib/editor/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Paintbrush, AlignLeft, AlignCenter, AlignRight, Plus, Minus } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";

export function GlobalStylesInspector() {
  const { globalStyles, updateGlobalStyles } = useEditorStore();

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <Paintbrush className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Global Styles & Layout</h3>
      </div>
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Content Background</Label>
          <ColorPicker 
            value={globalStyles.contentBackgroundColor} 
            onChange={(color) => updateGlobalStyles({ contentBackgroundColor: color })} 
            className="w-[140px]"
          />
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Background Image</Label>
            <Switch 
              checked={!!globalStyles.backgroundImage} 
              onCheckedChange={(checked) => updateGlobalStyles({ backgroundImage: checked ? "https://placehold.co/800x600/333/fff?text=Background" : "" })}
            />
          </div>
          {!!globalStyles.backgroundImage && (
            <Input 
              type="text" 
              placeholder="Image URL" 
              value={globalStyles.backgroundImage} 
              onChange={(e) => updateGlobalStyles({ backgroundImage: e.target.value })} 
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Message Content Width</Label>
          <div className="flex items-center bg-muted/50 rounded-md border border-border">
            <button 
              className="p-2 hover:bg-muted text-muted-foreground transition-colors"
              onClick={() => updateGlobalStyles({ contentWidth: Math.max(300, globalStyles.contentWidth - 10) })}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-12 text-center text-sm font-medium">{globalStyles.contentWidth}</span>
            <button 
              className="p-2 hover:bg-muted text-muted-foreground transition-colors"
              onClick={() => updateGlobalStyles({ contentWidth: Math.min(1200, globalStyles.contentWidth + 10) })}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Message Alignment</Label>
          <div className="flex bg-muted rounded-md p-1">
            <button 
              className={`p-1.5 rounded-sm transition-colors ${globalStyles.messageAlignment === 'left' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => updateGlobalStyles({ messageAlignment: 'left' })}
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button 
              className={`p-1.5 rounded-sm transition-colors ${globalStyles.messageAlignment === 'center' || !globalStyles.messageAlignment ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => updateGlobalStyles({ messageAlignment: 'center' })}
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button 
              className={`p-1.5 rounded-sm transition-colors ${globalStyles.messageAlignment === 'right' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => updateGlobalStyles({ messageAlignment: 'right' })}
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-border pt-4">
          <Label className="text-sm font-medium">Underline Links</Label>
          <Switch 
            checked={globalStyles.underlineLinks !== false} 
            onCheckedChange={(checked) => updateGlobalStyles({ underlineLinks: checked })}
          />
        </div>

        <div className="space-y-3 border-t border-border pt-4">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Responsive Design</Label>
            <Switch 
              checked={globalStyles.responsiveDesign !== false} 
              onCheckedChange={(checked) => updateGlobalStyles({ responsiveDesign: checked })}
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Your email will automatically adjust for smaller screens by displaying content in a single column. Side-by-side blocks will be stacked vertically.
          </p>
        </div>

        <div className="border-t border-border pt-4 space-y-4">
          <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Typography</h4>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Font Family</Label>
            <select 
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
              value={globalStyles.defaultFontFamily} 
              onChange={(e) => updateGlobalStyles({ defaultFontFamily: e.target.value })}
            >
              <option value="Inter, sans-serif">Inter</option>
              <option value="Arial, sans-serif">Arial</option>
              <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
              <option value="Georgia, serif">Georgia</option>
              <option value="'Times New Roman', Times, serif">Times New Roman</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size (px)</Label>
              <Input 
                type="number" 
                value={globalStyles.defaultFontSize} 
                onChange={(e) => updateGlobalStyles({ defaultFontSize: Number(e.target.value) })} 
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <ColorPicker 
                value={globalStyles.defaultTextColor} 
                onChange={(color) => updateGlobalStyles({ defaultTextColor: color })} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEditorStore } from "@/lib/editor/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Paintbrush } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";
import { NumberStepper } from "@/components/ui/number-stepper";
import { AlignmentSelector } from "@/components/ui/alignment-selector";

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

        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Message Content Width</Label>
          <NumberStepper
            value={globalStyles.contentWidth}
            onChange={(val) => updateGlobalStyles({ contentWidth: val })}
            min={320}
            max={900}
            step={10}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Message Alignment</Label>
          <AlignmentSelector
            value={(globalStyles.messageAlignment || "center") as "left" | "center" | "right"}
            onChange={(val) => updateGlobalStyles({ messageAlignment: val })}
          />
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
      </div>
    </div>
  );
}

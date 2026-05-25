"use client";

import { useEditorStore } from "@/lib/editor/store";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Paintbrush } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";
import { NumberStepper } from "@/components/ui/number-stepper";
import { AlignmentSelector } from "@/components/ui/alignment-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function GlobalStylesInspector() {
  const { globalStyles, updateGlobalStyles } = useEditorStore();

  const metadata = useEditorStore((s) => s.metadata);

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <Paintbrush className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Email Settings & Global Styles</h3>
      </div>

      <div className="space-y-6">
        <div className="space-y-4 border-b border-border pb-6">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Subject Line</Label>
            <Input
              type="text"
              placeholder="Enter email subject"
              value={metadata.subject || ""}
              onChange={(e) => useEditorStore.getState().updateMetadata({ subject: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Preheader Text</Label>
            <Input
              type="text"
              placeholder="Enter preview text"
              value={metadata.preheader || ""}
              onChange={(e) => useEditorStore.getState().updateMetadata({ preheader: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Status</Label>
            <Select
              value={metadata.status || "draft"}
              onValueChange={(val) => useEditorStore.getState().updateMetadata({ status: val as any })}
            >
              <SelectTrigger className="w-full bg-background border-input text-foreground h-9">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="published">Published</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Tag / Category</Label>
            <Select
              value={metadata.category || "other"}
              onValueChange={(val) => useEditorStore.getState().updateMetadata({ category: val as any })}
            >
              <SelectTrigger className="w-full bg-background border-input text-foreground h-9">
                <SelectValue placeholder="Select tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transactional">Transactional</SelectItem>
                <SelectItem value="marketing">Marketing</SelectItem>
                <SelectItem value="support">Support</SelectItem>
                <SelectItem value="billing">Billing</SelectItem>
                <SelectItem value="system">System</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
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

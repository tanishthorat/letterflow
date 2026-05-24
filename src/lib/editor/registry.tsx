import React from "react";
import { BlockType, ContentBlock, TextBlock, ImageBlock, ButtonBlock, DividerBlock } from "./types";
import { Type, Image as ImageIcon, MousePointerClick, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Text as EmailText, Img as EmailImg, Button as EmailButton, Hr as EmailHr, Section } from "@react-email/components";
import { ColorPicker } from "@/components/ui/color-picker";
import { AlignmentSelector } from "@/components/ui/alignment-selector";
import { NumberStepper } from "@/components/ui/number-stepper";
import { SpacingControl } from "@/components/ui/spacing-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export interface BlockConfig<T extends ContentBlock> {
  type: BlockType;
  label: string;
  icon: React.ElementType;
  defaultProps: T["props"];
  renderCanvas: (props: { block: T; onChange?: (newProps: Partial<T["props"]>) => void }) => React.ReactNode;
  renderInspector: (props: { block: T; onChange: (newProps: Partial<T["props"]>) => void }) => React.ReactNode;
  renderEmail: (props: { block: T }) => React.ReactNode;
}

const TextBlockConfig: BlockConfig<TextBlock> = {
  type: "text",
  label: "Text",
  icon: Type,
  defaultProps: {
    content: "",
    fontSize: 16,
    color: "#111111",
    align: "left",
    fontFamily: "Arial, sans-serif",
    fontSizeDesktop: 16,
    fontWeight: "normal",
    italic: false,
    underline: false,
    strikethrough: false,
    paragraphStyle: "p",
    alignDesktop: "left",
    padding: { top: 10, right: 10, bottom: 10, left: 10, linked: true },
  },
  renderCanvas: ({ block, onChange }) => {
    const p = block.props;
    const activeFontSize = p.fontSizeDesktop ?? p.fontSize ?? 16;
    const activeAlign = p.alignDesktop ?? p.align ?? "left";
    const textDecoration = [
      p.underline ? "underline" : "",
      p.strikethrough ? "line-through" : ""
    ].filter(Boolean).join(" ");

    return (
      <div style={{
        textAlign: activeAlign as any,
        backgroundColor: p.blockBackgroundColor || "transparent",
        paddingTop: `${p.padding?.top ?? 10}px`,
        paddingRight: `${p.padding?.right ?? 10}px`,
        paddingBottom: `${p.padding?.bottom ?? 10}px`,
        paddingLeft: `${p.padding?.left ?? 10}px`,
      }}>
        <Textarea
          ref={(node) => {
            if (node) {
              node.style.height = 'inherit';
              node.style.height = `${node.scrollHeight}px`;
            }
          }}
          value={p.content || ""}
          onChange={(e) => {
            e.target.style.height = 'inherit';
            e.target.style.height = `${e.target.scrollHeight}px`;
            onChange?.({ content: e.target.value });
          }}
          onFocus={(e) => {
            e.target.style.height = 'inherit';
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
          className="w-full !bg-transparent !border-none !shadow-none !ring-0 !outline-none focus-visible:!ring-0 focus-visible:!ring-offset-0 focus-visible:!outline-none hover:!bg-transparent focus:!bg-transparent resize-none overflow-hidden m-0 p-1"
          style={{
            minHeight: '40px',
            color: p.color || "inherit",
            textAlign: 'inherit',
            fontSize: `${activeFontSize}px`,
            fontFamily: p.fontFamily || "inherit",
            fontWeight: p.fontWeight || "normal",
            fontStyle: p.italic ? "italic" : "normal",
            textDecoration: textDecoration || "none",
            lineHeight: p.lineHeightDesktop || "normal",
          }}
          placeholder="Enter text here..."
        />
      </div>
    );
  },
  renderInspector: ({ block, onChange }) => {
    const p = block.props;
    const padding = p.padding || { top: 10, right: 10, bottom: 10, left: 10, linked: true };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Content</Label>
          <Textarea
            value={p.content || ""}
            onChange={(e) => onChange({ content: e.target.value })}
            className="min-h-[100px]"
          />
        </div>

        {/* Typography */}
        <div className="space-y-3 border-t pt-3">
          <Label className="text-sm font-medium">Typography</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Family</Label>
              <Select
                value={p.fontFamily || "Arial, sans-serif"}
                onValueChange={(val) => onChange({ fontFamily: val })}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Select font" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                  <SelectItem value="'Helvetica Neue', Helvetica, Arial, sans-serif">Helvetica</SelectItem>
                  <SelectItem value="'Times New Roman', Times, serif">Times New Roman</SelectItem>
                  <SelectItem value="'Courier New', Courier, monospace">Courier New</SelectItem>
                  <SelectItem value="Georgia, serif">Georgia</SelectItem>
                  <SelectItem value="Verdana, Geneva, sans-serif">Verdana</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Size (px)</Label>
              <NumberStepper
                value={p.fontSizeDesktop ?? p.fontSize ?? 16}
                onChange={(val) => onChange({ fontSizeDesktop: val })}
                min={8}
                max={120}
                step={1}
                className="w-full h-9"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Font Weight</Label>
              <Select
                value={String(p.fontWeight || "normal")}
                onValueChange={(val) => onChange({ fontWeight: val as typeof TextBlockConfig.defaultProps.fontWeight })}
              >
                <SelectTrigger className="w-full h-9">
                  <SelectValue placeholder="Weight" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="300">Light</SelectItem>
                  <SelectItem value="600">Semi Bold</SelectItem>
                  <SelectItem value="800">Extra Bold</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Line Height</Label>
              <Input
                type="text"
                placeholder="normal"
                value={p.lineHeightDesktop ?? ""}
                onChange={(e) => onChange({ lineHeightDesktop: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => onChange({ italic: !p.italic })} className={`px-3 py-1 text-sm border rounded font-serif italic ${p.italic ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>I</button>
            <button onClick={() => onChange({ underline: !p.underline })} className={`px-3 py-1 text-sm border rounded underline ${p.underline ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>U</button>
            <button onClick={() => onChange({ strikethrough: !p.strikethrough })} className={`px-3 py-1 text-sm border rounded line-through ${p.strikethrough ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>S</button>
          </div>
        </div>

        {/* Colors */}
        <div className="space-y-3 border-t pt-3">
          <Label className="text-sm font-medium">Colors</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <ColorPicker
                value={p.color || "#111111"}
                onChange={(color) => onChange({ color })}
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background</Label>
              <ColorPicker
                value={p.blockBackgroundColor || "transparent"}
                onChange={(color) => onChange({ blockBackgroundColor: color })}
              />
            </div>
          </div>
        </div>

        {/* Alignment & Padding */}
        <div className="space-y-3 border-t pt-3">
          <Label className="text-sm font-medium">Layout</Label>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Alignment</Label>
            <AlignmentSelector
              value={(p.alignDesktop ?? p.align ?? "left") as "left" | "center" | "right"}
              onChange={(val) => onChange({ alignDesktop: val })}
            />
          </div>

          <div className="pt-2">
            <SpacingControl
              label="Padding on Desktop"
              top={padding.top}
              right={padding.right}
              bottom={padding.bottom}
              left={padding.left}
              linked={padding.linked}
              onChangeTop={(v) => onChange({ padding: { ...padding, top: v } })}
              onChangeRight={(v) => onChange({ padding: { ...padding, right: v } })}
              onChangeBottom={(v) => onChange({ padding: { ...padding, bottom: v } })}
              onChangeLeft={(v) => onChange({ padding: { ...padding, left: v } })}
              onChangeAll={(v) => onChange({ padding: { ...padding, top: v, right: v, bottom: v, left: v } })}
              onToggleLink={(linked) => onChange({ padding: { ...padding, linked } })}
            />
          </div>
        </div>
      </div>
    );
  },
  renderEmail: ({ block }) => {
    const p = block.props;
    const activeFontSize = p.fontSizeDesktop ?? p.fontSize ?? 16;
    const activeAlign = p.alignDesktop ?? p.align ?? "left";
    const textDecoration = [
      p.underline ? "underline" : "",
      p.strikethrough ? "line-through" : ""
    ].filter(Boolean).join(" ");

    return (
      <div style={{
        textAlign: activeAlign as any,
        backgroundColor: p.blockBackgroundColor || "transparent",
        paddingTop: `${p.padding?.top ?? 10}px`,
        paddingRight: `${p.padding?.right ?? 10}px`,
        paddingBottom: `${p.padding?.bottom ?? 10}px`,
        paddingLeft: `${p.padding?.left ?? 10}px`,
      }}>
        <EmailText style={{
          fontSize: `${activeFontSize}px`,
          color: p.color || "#111111",
          margin: 0,
          fontFamily: p.fontFamily || "inherit",
          fontWeight: p.fontWeight || "normal",
          fontStyle: p.italic ? "italic" : "normal",
          textDecoration: textDecoration || "none",
          lineHeight: p.lineHeightDesktop || "normal",
        }}>
          {p.content}
        </EmailText>
      </div>
    );
  }
};

const ImageBlockConfig: BlockConfig<ImageBlock> = {
  type: "image",
  label: "Image",
  icon: ImageIcon,
  defaultProps: {
    src: "https://placehold.co/600x200/2a2a2a/ffffff?text=Image+Placeholder",
    alt: "Placeholder",
    width: "auto",
    height: "auto",
    align: "center",
  },
  renderCanvas: ({ block }) => (
    <div style={{ textAlign: block.props.align, width: "100%" }}>
      <img
        src={block.props.src}
        alt={block.props.alt}
        style={{
          maxWidth: "100%",
          width: block.props.width === "auto" ? "auto" : `${block.props.width}px`,
          height: block.props.height === "auto" ? "auto" : `${block.props.height}px`,
          display: "inline-block"
        }}
      />
    </div>
  ),
  renderInspector: ({ block, onChange }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Image URL</Label>
        <Input
          type="text"
          value={block.props.src || ""}
          onChange={(e) => onChange({ src: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Alt Text</Label>
        <Input
          type="text"
          value={block.props.alt || ""}
          onChange={(e) => onChange({ alt: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Width</Label>
          <Input
            type="text"
            value={block.props.width || "auto"}
            onChange={(e) => onChange({ width: e.target.value === "auto" ? "auto" : Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Height</Label>
          <Input
            type="text"
            value={block.props.height || "auto"}
            onChange={(e) => onChange({ height: e.target.value === "auto" ? "auto" : Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Alignment</Label>
        <AlignmentSelector
          value={(block.props.align || "center") as "left" | "center" | "right"}
          onChange={(val) => onChange({ align: val })}
        />
      </div>
    </div>
  ),
  renderEmail: ({ block }) => (
    <div style={{ textAlign: block.props.align as any, padding: "16px" }}>
      <EmailImg
        src={block.props.src}
        alt={block.props.alt}
        width={block.props.width === "auto" ? undefined : block.props.width}
        height={block.props.height === "auto" ? undefined : block.props.height}
        style={{ display: "inline-block", maxWidth: "100%" }}
      />
    </div>
  )
};

const ButtonBlockConfig: BlockConfig<ButtonBlock> = {
  type: "button",
  label: "Button",
  icon: MousePointerClick,
  defaultProps: {
    text: "Click Me",
    url: "#",
    backgroundColor: "#33cc4a",
    textColor: "#ffffff",
    borderRadius: 4,
    padding: 12,
    align: "center",
  },
  renderCanvas: ({ block }) => (
    <div style={{ textAlign: block.props.align }}>
      <a
        href={block.props.url}
        onClick={(e) => e.preventDefault()}
        style={{
          display: "inline-block",
          backgroundColor: block.props.backgroundColor,
          color: block.props.textColor,
          borderRadius: `${block.props.borderRadius}px`,
          padding: `${block.props.padding}px ${block.props.padding * 2}px`,
          textDecoration: "none",
          fontWeight: "bold",
          fontFamily: "sans-serif"
        }}
      >
        {block.props.text}
      </a>
    </div>
  ),
  renderInspector: ({ block, onChange }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Button Text</Label>
        <Input
          type="text"
          value={block.props.text || ""}
          onChange={(e) => onChange({ text: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">URL</Label>
        <Input
          type="text"
          value={block.props.url || ""}
          onChange={(e) => onChange({ url: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Background</Label>
          <ColorPicker
            value={block.props.backgroundColor || "#33cc4a"}
            onChange={(color) => onChange({ backgroundColor: color })}
            align="left"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Text Color</Label>
          <ColorPicker
            value={block.props.textColor || "#ffffff"}
            onChange={(color) => onChange({ textColor: color })}
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Radius (px)</Label>
          <Input
            type="number"
            value={block.props.borderRadius || 0}
            onChange={(e) => onChange({ borderRadius: Number(e.target.value) })}
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Padding (px)</Label>
          <Input
            type="number"
            value={block.props.padding || 0}
            onChange={(e) => onChange({ padding: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">TextAlignment</Label>
        <AlignmentSelector
          value={(block.props.align || "center") as "left" | "center" | "right"}
          onChange={(val) => onChange({ align: val })}
        />
      </div>
    </div>
  ),
  renderEmail: ({ block }) => (
    <div style={{ textAlign: block.props.align as any, padding: "16px" }}>
      <EmailButton
        href={block.props.url}
        style={{
          backgroundColor: block.props.backgroundColor,
          color: block.props.textColor,
          borderRadius: `${block.props.borderRadius}px`,
          padding: `${block.props.padding}px ${block.props.padding * 2}px`,
          textDecoration: "none",
          fontWeight: "bold",
          display: "inline-block"
        }}
      >
        {block.props.text}
      </EmailButton>
    </div>
  )
};

const DividerBlockConfig: BlockConfig<DividerBlock> = {
  type: "divider",
  label: "Divider",
  icon: Minus,
  defaultProps: {
    lineColor: "#e5e7eb",
    lineWidth: 1,
    padding: 20,
  },
  renderCanvas: ({ block }) => (
    <div style={{ padding: `${block.props.padding}px 0` }}>
      <hr style={{ borderColor: block.props.lineColor, borderWidth: `${block.props.lineWidth}px`, borderStyle: 'solid', margin: 0 }} />
    </div>
  ),
  renderInspector: ({ block, onChange }) => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Line Color</Label>
          <ColorPicker
            value={block.props.lineColor || "#e5e7eb"}
            onChange={(color) => onChange({ lineColor: color })}
            align="left"
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Height (px)</Label>
          <Input
            type="number"
            value={block.props.lineWidth || 1}
            onChange={(e) => onChange({ lineWidth: Number(e.target.value) })}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Vertical Padding (px)</Label>
        <Input
          type="number"
          value={block.props.padding || 20}
          onChange={(e) => onChange({ padding: Number(e.target.value) })}
        />
      </div>
    </div>
  ),
  renderEmail: ({ block }) => (
    <div style={{ padding: `${block.props.padding}px 0` }}>
      <EmailHr style={{ borderColor: block.props.lineColor, borderWidth: `${block.props.lineWidth}px`, borderStyle: 'solid', margin: 0 }} />
    </div>
  )
};

export const BLOCK_REGISTRY: Record<BlockType, BlockConfig<any>> = {
  text: TextBlockConfig,
  image: ImageBlockConfig,
  button: ButtonBlockConfig,
  divider: DividerBlockConfig,
};

export const BLOCK_LIST = Object.values(BLOCK_REGISTRY);

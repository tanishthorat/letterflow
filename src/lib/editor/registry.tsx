import React from "react";
import { BlockType, ContentBlock, TextBlock, ImageBlock, ButtonBlock, DividerBlock } from "./types";
import { Type, Image as ImageIcon, MousePointerClick, Minus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Text as EmailText, Img as EmailImg, Button as EmailButton, Hr as EmailHr, Section } from "@react-email/components";

export interface BlockConfig<T extends ContentBlock> {
  type: BlockType;
  label: string;
  icon: React.ElementType;
  defaultProps: T["props"];
  renderCanvas: (props: { block: T }) => React.ReactNode;
  renderInspector: (props: { block: T; onChange: (newProps: Partial<T["props"]>) => void }) => React.ReactNode;
  renderEmail: (props: { block: T }) => React.ReactNode; 
}

const TextBlockConfig: BlockConfig<TextBlock> = {
  type: "text",
  label: "Text",
  icon: Type,
  defaultProps: {
    content: "Enter your text here",
    fontSize: 16,
    color: "#ffffff",
    align: "left",
  },
  renderCanvas: ({ block }) => (
    <div style={{ textAlign: block.props.align, fontSize: `${block.props.fontSize}px`, color: block.props.color }}>
      {block.props.content}
    </div>
  ),
  renderInspector: ({ block, onChange }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Content</Label>
        <Textarea 
          value={block.props.content || ""} 
          onChange={(e) => onChange({ content: e.target.value })} 
          className="min-h-[100px]"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Font Size (px)</Label>
          <Input 
            type="number" 
            value={block.props.fontSize || 16} 
            onChange={(e) => onChange({ fontSize: Number(e.target.value) })} 
          />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Color</Label>
          <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
            <input 
              type="color" 
              className="w-full h-full border-none bg-transparent cursor-pointer"
              value={block.props.color || "#ffffff"} 
              onChange={(e) => onChange({ color: e.target.value })} 
            />
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Alignment</Label>
        <select 
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          value={block.props.align || "left"} 
          onChange={(e) => onChange({ align: e.target.value as "left" | "center" | "right" })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
      </div>
    </div>
  ),
  renderEmail: ({ block }) => (
    <div style={{ textAlign: block.props.align as any, padding: "16px" }}>
      <EmailText style={{ fontSize: `${block.props.fontSize}px`, color: block.props.color, margin: 0 }}>
        {block.props.content}
      </EmailText>
    </div>
  )
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
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Alignment</Label>
        <select 
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          value={block.props.align || "center"} 
          onChange={(e) => onChange({ align: e.target.value as "left" | "center" | "right" })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
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
          <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
            <input 
              type="color" 
              className="w-full h-full border-none bg-transparent cursor-pointer"
              value={block.props.backgroundColor || "#33cc4a"} 
              onChange={(e) => onChange({ backgroundColor: e.target.value })} 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Text Color</Label>
          <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
            <input 
              type="color" 
              className="w-full h-full border-none bg-transparent cursor-pointer"
              value={block.props.textColor || "#ffffff"} 
              onChange={(e) => onChange({ textColor: e.target.value })} 
            />
          </div>
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
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Alignment</Label>
        <select 
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
          value={block.props.align || "center"} 
          onChange={(e) => onChange({ align: e.target.value as "left" | "center" | "right" })}
        >
          <option value="left">Left</option>
          <option value="center">Center</option>
          <option value="right">Right</option>
        </select>
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
          <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
            <input 
              type="color" 
              className="w-full h-full border-none bg-transparent cursor-pointer"
              value={block.props.lineColor || "#e5e7eb"} 
              onChange={(e) => onChange({ lineColor: e.target.value })} 
            />
          </div>
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

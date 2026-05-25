import React from "react";
import { BlockType, ContentBlock, TextBlock, ImageBlock, ButtonBlock, DividerBlock, BaseBlockProps } from "./types";
import { Type, Image as ImageIcon, MousePointerClick, Minus, AlignStartVertical, AlignCenterVertical, AlignEndVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Heading as EmailHeading, Text as EmailText, Img as EmailImg, Button as EmailButton, Hr as EmailHr, Section, Link as EmailLink } from "@react-email/components";
import { ColorPicker } from "@/components/ui/color-picker";
import { AlignmentSelector } from "@/components/ui/alignment-selector";
import { NumberStepper } from "@/components/ui/number-stepper";
import { SpacingControl } from "@/components/ui/spacing-control";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ImageUpload } from "@/components/editor/ImageUpload";
import { LinkInput } from "@/components/editor/LinkInput";

export interface BlockConfig<T extends ContentBlock> {
  type: BlockType;
  label: string;
  icon: React.ElementType;
  defaultProps: T["props"];
  renderCanvas: (props: { block: T; onChange?: (newProps: Partial<T["props"]>) => void }) => React.ReactNode;
  renderInspector: (props: { block: T; onChange: (newProps: Partial<T["props"]>) => void }) => React.ReactNode;
  renderEmail: (props: { block: T }) => React.ReactNode;
}

export function getBaseBlockWrapperStyles(p: BaseBlockProps): React.CSSProperties {
  return {
    backgroundColor: p.blockBackgroundColor || "transparent",
    textAlign: p.alignDesktop,
    paddingTop: `${p.paddingDesktop?.top ?? 0}px`,
    paddingRight: `${p.paddingDesktop?.right ?? 0}px`,
    paddingBottom: `${p.paddingDesktop?.bottom ?? 0}px`,
    paddingLeft: `${p.paddingDesktop?.left ?? 0}px`,
    marginTop: `${p.marginDesktop?.top ?? 0}px`,
    marginRight: `${p.marginDesktop?.right ?? 0}px`,
    marginBottom: `${p.marginDesktop?.bottom ?? 0}px`,
    marginLeft: `${p.marginDesktop?.left ?? 0}px`,
    width: "100%",
    boxSizing: "border-box",
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// TEXT BLOCK
// ─────────────────────────────────────────────────────────────────────────────

const TextBlockConfig: BlockConfig<TextBlock> = {
  type: "text",
  label: "Text",
  icon: Type,
  defaultProps: {
    content: "",
    color: "#111111",
    fontFamily: "Arial, sans-serif",
    fontSizeDesktop: 16,
    fontWeight: "normal",
    italic: false,
    underline: false,
    strikethrough: false,
    paragraphStyle: "p",
    alignDesktop: "left",
    paddingDesktop: { top: 10, right: 10, bottom: 10, left: 10, linked: true },
    marginDesktop: { top: 0, right: 0, bottom: 0, left: 0, linked: true },
    blockBackgroundColor: "transparent",
  },
  renderCanvas: ({ block, onChange }) => {
    const p = block.props;
    const activeFontSize = p.fontSizeDesktop ?? p.fontSize ?? 16;
    const textDecoration = [
      p.underline ? "underline" : "",
      p.strikethrough ? "line-through" : ""
    ].filter(Boolean).join(" ");

    return (
      <div style={getBaseBlockWrapperStyles(p)}>
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
    const padding = p.paddingDesktop ?? p.padding ?? { top: 10, right: 10, bottom: 10, left: 10, linked: true };
    const margin = p.marginDesktop ?? { top: 0, right: 0, bottom: 0, left: 0, linked: true };

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

        {/* Insert Merge Tags */}
        <div className="space-y-3 border-t pt-3">
          <Label className="text-sm font-medium">Insert</Label>
          <Select
            value=""
            onValueChange={(val) => {
              if (val) {
                onChange({ content: (p.content || "") + val });
              }
            }}
          >
            <SelectTrigger className="w-full h-9">
              <SelectValue placeholder="Merge Tags" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="{{firstName}}">First Name {"{{firstName}}"}</SelectItem>
              <SelectItem value="{{lastName}}">Last Name {"{{lastName}}"}</SelectItem>
              <SelectItem value="{{email}}">Email {"{{email}}"}</SelectItem>
              <SelectItem value="{{currentDate}}">Current Date {"{{currentDate}}"}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Paragraph Style */}
        <div className="space-y-3 border-t pt-3">
          <Label className="text-sm font-medium">Paragraph Style</Label>
          <div className="flex border rounded-md overflow-hidden border-input">
            {(["p", "h1", "h2", "h3", "h4", "h5", "h6"] as const).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onChange({ paragraphStyle: tag })}
                className={`flex-1 py-1.5 text-xs font-semibold uppercase border-r border-input last:border-r-0 transition-colors ${(p.paragraphStyle || "p") === tag
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
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

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Text Style</Label>
            <div className="flex gap-2">
              <button onClick={() => onChange({ italic: !p.italic })} className={`px-3 py-1 text-sm border rounded font-serif italic ${p.italic ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>I</button>
              <button onClick={() => onChange({ underline: !p.underline })} className={`px-3 py-1 text-sm border rounded underline ${p.underline ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>U</button>
              <button onClick={() => onChange({ strikethrough: !p.strikethrough })} className={`px-3 py-1 text-sm border rounded line-through ${p.strikethrough ? 'bg-primary text-primary-foreground' : 'bg-background'}`}>S</button>
            </div>
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
              onChangeTop={(v) => onChange({ paddingDesktop: { ...padding, top: v } })}
              onChangeRight={(v) => onChange({ paddingDesktop: { ...padding, right: v } })}
              onChangeBottom={(v) => onChange({ paddingDesktop: { ...padding, bottom: v } })}
              onChangeLeft={(v) => onChange({ paddingDesktop: { ...padding, left: v } })}
              onChangeAll={(v) => onChange({ paddingDesktop: { ...padding, top: v, right: v, bottom: v, left: v } })}
              onToggleLink={(linked) => onChange({ paddingDesktop: { ...padding, linked } })}
            />
          </div>
          <div className="pt-2">
            <SpacingControl
              label="Margin on Desktop"
              top={margin.top}
              right={margin.right}
              bottom={margin.bottom}
              left={margin.left}
              linked={margin.linked}
              onChangeTop={(v) => onChange({ marginDesktop: { ...margin, top: v } })}
              onChangeRight={(v) => onChange({ marginDesktop: { ...margin, right: v } })}
              onChangeBottom={(v) => onChange({ marginDesktop: { ...margin, bottom: v } })}
              onChangeLeft={(v) => onChange({ marginDesktop: { ...margin, left: v } })}
              onChangeAll={(v) => onChange({ marginDesktop: { ...margin, top: v, right: v, bottom: v, left: v } })}
              onToggleLink={(linked) => onChange({ marginDesktop: { ...margin, linked } })}
            />
          </div>
        </div>
      </div>
    );
  },
  renderEmail: ({ block }) => {
    const p = block.props;
    const activeFontSize = p.fontSizeDesktop ?? p.fontSize ?? 16;
    const textDecoration = [
      p.underline ? "underline" : "",
      p.strikethrough ? "line-through" : ""
    ].filter(Boolean).join(" ");

    return (
      <div style={getBaseBlockWrapperStyles(p)}>
        {p.paragraphStyle && p.paragraphStyle !== "p" ? (
          <EmailHeading as={p.paragraphStyle as any} style={{
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
          </EmailHeading>
        ) : (
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
        )}
      </div>
    );
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE BLOCK — Canvas
// ─────────────────────────────────────────────────────────────────────────────

function ImageCanvas({ block }: { block: ImageBlock }) {
  const p = block.props;

  const imgStyle: React.CSSProperties = {
    display: "block",
    maxWidth: "100%",
    width: p.width === "auto" ? "100%" : `${p.width}px`,
    height: p.fixedHeight && typeof p.height === "number" ? `${p.height}px` : "auto",
    objectFit: p.fixedHeight ? (p.imageFit ?? "cover") : undefined,
    objectPosition: p.fixedHeight ? (p.imagePosition ?? "center") : undefined,
    borderRadius: p.borderRadius ? `${p.borderRadius}px` : undefined,
  };

  const img = (
    <img
      src={p.src}
      alt={p.alt}
      title={p.addAltToTitle ? p.alt : p.title}
      style={imgStyle}
    />
  );

  return (
    <div style={getBaseBlockWrapperStyles(p)}>
      {p.href ? (
        <a href={p.href} onClick={(e) => e.preventDefault()} style={{ display: "inline-block" }}>
          {img}
        </a>
      ) : (
        <span style={{ display: "inline-block" }}>{img}</span>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE BLOCK — Inspector
// ─────────────────────────────────────────────────────────────────────────────

function ImageInspector({
  block,
  onChange,
}: {
  block: ImageBlock;
  onChange: (newProps: Partial<ImageBlock["props"]>) => void;
}) {
  const p = block.props;
  const padding = p.paddingDesktop ?? { top: 0, right: 0, bottom: 0, left: 0, linked: true };
  const margin = p.marginDesktop ?? { top: 0, right: 0, bottom: 0, left: 0, linked: true };

  const PLACEHOLDER_SRC = "https://placehold.co/600x200/2a2a2a/ffffff?text=Image+Placeholder";

  return (
    <div className="space-y-5">

      {/* ── Image Source & Upload ── */}
      <section className="space-y-3">
        <Label className="text-sm font-semibold text-foreground">Image</Label>

        <ImageUpload
          currentSrc={p.src}
          onUploadSuccess={(url, fileName, w, h) =>
            onChange({
              src: url,
              fileName,
              originalWidth: w,
              originalHeight: h,
              width: w > 600 ? 600 : w,
            })
          }
          onRemove={() =>
            onChange({
              src: PLACEHOLDER_SRC,
              fileName: undefined,
              originalWidth: undefined,
              originalHeight: undefined,
            })
          }
        />

        {/* File info badge */}
        {p.fileName && (
          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-muted/40 border border-border/50">
            <ImageIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{p.fileName}</p>
              {p.originalWidth && p.originalHeight && (
                <p className="text-[10px] text-muted-foreground">
                  {p.originalWidth} × {p.originalHeight} px
                </p>
              )}
            </div>
          </div>
        )}

        {/* Manual URL */}
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Image URL</Label>
          <Input
            type="text"
            placeholder="https://..."
            value={p.src || ""}
            onChange={(e) => onChange({ src: e.target.value })}
          />
        </div>
      </section>

      {/* ── Accessibility ── */}
      <section className="space-y-3 border-t border-border/50 pt-4">
        <Label className="text-sm font-semibold text-foreground">Accessibility</Label>

        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Alt Text</Label>
          <Input
            type="text"
            placeholder="Describe the image..."
            value={p.alt || ""}
            onChange={(e) => onChange({ alt: e.target.value })}
          />
        </div>

        <div className="flex items-center justify-between py-0.5">
          <Label className="text-xs text-muted-foreground">Use alt as title attribute</Label>
          <Switch
            checked={p.addAltToTitle ?? false}
            onCheckedChange={(v) => onChange({ addAltToTitle: v })}
            size="sm"
          />
        </div>

        {!p.addAltToTitle && (
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Title Attribute</Label>
            <Input
              type="text"
              placeholder="Optional tooltip"
              value={p.title || ""}
              onChange={(e) => onChange({ title: e.target.value })}
            />
          </div>
        )}
      </section>

      {/* ── Link / Action ── */}
      <section className="space-y-3 border-t border-border/50 pt-4">
        <LinkInput
          linkType={p.linkType ?? "url"}
          href={p.href ?? ""}
          onChange={(updates) => onChange(updates as any)}
        />
      </section>

      {/* ── Size on Desktop ── */}
      <section className="space-y-3 border-t border-border/50 pt-4">
        <Label className="text-sm font-semibold text-foreground">Size on Desktop</Label>

        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Width</Label>
          <div className="flex items-center gap-2">
            <NumberStepper
              value={p.width === "auto" ? 600 : (p.width as number)}
              onChange={(v) => onChange({ width: v })}
              min={20}
              max={1200}
              step={1}
              className="w-28 h-8"
            />
            <button
              type="button"
              onClick={() => onChange({ width: "auto" })}
              className={`px-2 py-1 text-xs rounded border transition-colors ${p.width === "auto"
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input text-muted-foreground hover:bg-muted"
                }`}
            >
              Auto
            </button>
          </div>
        </div>

        {/* Fixed Height toggle */}
        <div className="flex items-center justify-between py-0.5">
          <Label className="text-xs text-muted-foreground">Fixed Height</Label>
          <Switch
            checked={p.fixedHeight ?? false}
            onCheckedChange={(v) => onChange({ fixedHeight: v, height: v ? 200 : "auto" })}
            size="sm"
          />
        </div>

        {p.fixedHeight && (
          <div className="space-y-3 pl-3 border-l-2 border-primary/30">
            <div className="flex items-center justify-between">
              <Label className="text-xs text-muted-foreground">Height (px)</Label>
              <NumberStepper
                value={typeof p.height === "number" ? p.height : 200}
                onChange={(v) => onChange({ height: v })}
                min={20}
                max={1200}
                step={1}
                className="w-28 h-8"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Image Fit</Label>
              <div className="flex border rounded-md overflow-hidden border-input">
                {(["cover", "contain", "fill"] as const).map((fit) => (
                  <button
                    key={fit}
                    type="button"
                    onClick={() => onChange({ imageFit: fit })}
                    className={`flex-1 py-1.5 text-xs capitalize border-r border-input last:border-r-0 transition-colors ${(p.imageFit ?? "cover") === fit
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    {fit}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Vertical Position</Label>
              <div className="flex border rounded-md overflow-hidden border-input">
                {([
                  { val: "top" as const, Icon: AlignStartVertical },
                  { val: "center" as const, Icon: AlignCenterVertical },
                  { val: "bottom" as const, Icon: AlignEndVertical },
                ]).map(({ val, Icon }) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => onChange({ imagePosition: val })}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 text-xs border-r border-input last:border-r-0 transition-colors ${(p.imagePosition ?? "center") === val
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-muted-foreground hover:bg-muted"
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span className="capitalize">{val}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ── Alignment ── */}
      <section className="space-y-3 border-t border-border/50 pt-4">
        <Label className="text-sm font-semibold text-foreground">Layout</Label>
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Alignment</Label>
          <AlignmentSelector
            value={(p.alignDesktop ?? p.align ?? "center") as "left" | "center" | "right"}
            onChange={(val) => onChange({ alignDesktop: val })}
          />
        </div>
      </section>

      {/* ── Border Radius ── */}
      <section className="space-y-3 border-t border-border/50 pt-4">
        <Label className="text-sm font-semibold text-foreground">Radius on Desktop</Label>
        <div className="flex items-center justify-between">
          <Label className="text-xs text-muted-foreground">Corner Radius (px)</Label>
          <NumberStepper
            value={p.borderRadius ?? 0}
            onChange={(v) => onChange({ borderRadius: v })}
            min={0}
            max={200}
            step={1}
            className="w-28 h-8"
          />
        </div>
      </section>

      {/* ── Margins & Padding ── */}
      <section className="space-y-3 border-t border-border/50 pt-4">
        <div className="pt-2">
          <SpacingControl
            label="Padding on Desktop"
            top={padding.top}
            right={padding.right}
            bottom={padding.bottom}
            left={padding.left}
            linked={padding.linked}
            onChangeTop={(v) => onChange({ paddingDesktop: { ...padding, top: v } })}
            onChangeRight={(v) => onChange({ paddingDesktop: { ...padding, right: v } })}
            onChangeBottom={(v) => onChange({ paddingDesktop: { ...padding, bottom: v } })}
            onChangeLeft={(v) => onChange({ paddingDesktop: { ...padding, left: v } })}
            onChangeAll={(v) => onChange({ paddingDesktop: { ...padding, top: v, right: v, bottom: v, left: v } })}
            onToggleLink={(linked) => onChange({ paddingDesktop: { ...padding, linked } })}
          />
        </div>
        <div className="pt-2">
          <SpacingControl
            label="Margin on Desktop"
            top={margin.top}
            right={margin.right}
            bottom={margin.bottom}
            left={margin.left}
            linked={margin.linked}
            onChangeTop={(v) => onChange({ marginDesktop: { ...margin, top: v } })}
            onChangeRight={(v) => onChange({ marginDesktop: { ...margin, right: v } })}
            onChangeBottom={(v) => onChange({ marginDesktop: { ...margin, bottom: v } })}
            onChangeLeft={(v) => onChange({ marginDesktop: { ...margin, left: v } })}
            onChangeAll={(v) => onChange({ marginDesktop: { ...margin, top: v, right: v, bottom: v, left: v } })}
            onToggleLink={(linked) => onChange({ marginDesktop: { ...margin, linked } })}
          />
        </div>
      </section>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE BLOCK — Email Renderer
// ─────────────────────────────────────────────────────────────────────────────

function ImageEmailRenderer({ block }: { block: ImageBlock }) {
  const p = block.props;
  const computedWidth = p.width === "auto" ? undefined : (p.width as number);
  const computedHeight =
    p.fixedHeight && typeof p.height === "number" ? p.height : undefined;

  const imgStyle: React.CSSProperties = {
    display: "block",
    maxWidth: "100%",
    borderRadius: p.borderRadius ? `${p.borderRadius}px` : undefined,
    ...(p.fixedHeight && {
      objectFit: p.imageFit ?? "cover",
      objectPosition: p.imagePosition ?? "center",
      height: computedHeight ? `${computedHeight}px` : undefined,
    }),
  };

  const wrapperStyle: React.CSSProperties = {
    textAlign: p.align as any,
    marginTop: `${p.margin?.top ?? 0}px`,
    marginRight: `${p.margin?.right ?? 0}px`,
    marginBottom: `${p.margin?.bottom ?? 0}px`,
    marginLeft: `${p.margin?.left ?? 0}px`,
  };

  const img = (
    <EmailImg
      src={p.src}
      alt={p.alt}
      title={p.addAltToTitle ? p.alt : p.title}
      width={computedWidth}
      height={computedHeight}
      style={imgStyle}
    />
  );

  const inner = p.href ? (
    <EmailLink href={p.href} style={{ display: "inline-block" }}>
      {img}
    </EmailLink>
  ) : (
    <span style={{ display: "inline-block" }}>{img}</span>
  );

  return (
    <div style={getBaseBlockWrapperStyles(p)}>
      {inner}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IMAGE BLOCK CONFIG
// ─────────────────────────────────────────────────────────────────────────────

const ImageBlockConfig: BlockConfig<ImageBlock> = {
  type: "image",
  label: "Image",
  icon: ImageIcon,
  defaultProps: {
    // Legacy / backward-compat (kept as-is)
    src: "https://placehold.co/600x200/2a2a2a/ffffff?text=Image+Placeholder",
    alt: "",
    width: "auto",
    height: "auto",
    // New desktop-focused
    addAltToTitle: false,
    title: "",
    fileName: undefined,
    originalWidth: undefined,
    originalHeight: undefined,
    linkType: "url",
    href: "",
    fixedHeight: false,
    imageFit: "cover",
    imagePosition: "center",
    borderRadius: 0,
    radiusMode: "uniform",
    blockBackgroundColor: "transparent",
    alignDesktop: "center",
    paddingDesktop: { top: 0, right: 0, bottom: 0, left: 0, linked: true },
    marginDesktop: { top: 0, right: 0, bottom: 0, left: 0, linked: true },
  },
  renderCanvas: ({ block }) => <ImageCanvas block={block} />,
  renderInspector: ({ block, onChange }) => (
    <ImageInspector block={block} onChange={onChange} />
  ),
  renderEmail: ({ block }) => <ImageEmailRenderer block={block} />,
};

// ─────────────────────────────────────────────────────────────────────────────
// BUTTON BLOCK
// ─────────────────────────────────────────────────────────────────────────────

const ButtonBlockConfig: BlockConfig<ButtonBlock> = {
  type: "button",
  label: "Button",
  icon: MousePointerClick,
  defaultProps: {
    text: "Click Me",
    linkType: "url",
    href: "",
    buttonColor: "#33cc4a",
    textColor: "#ffffff",
    blockBackgroundColor: "transparent",
    fontFamily: "Arial, sans-serif",
    fontSizeDesktop: 16,
    fontWeight: "normal",
    bold: false,
    italic: false,
    alignDesktop: "center",
    fitToContainerDesktop: false,
    fixedHeight: false,
    heightDesktop: 40,
    borderRadius: 4,
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "#000000",
    paddingDesktop: { top: 10, right: 20, bottom: 10, left: 20, linked: false },
    marginDesktop: { top: 0, right: 0, bottom: 0, left: 0, linked: true },
  },
  renderCanvas: ({ block }) => {
    const p = block.props;
    
    // The button itself
    const buttonStyle: React.CSSProperties = {
      display: p.fitToContainerDesktop ? "block" : "inline-block",
      width: p.fitToContainerDesktop ? "100%" : "auto",
      backgroundColor: p.buttonColor,
      color: p.textColor,
      borderRadius: `${p.borderRadius ?? 0}px`,
      paddingTop: `${p.paddingDesktop?.top ?? 10}px`,
      paddingRight: `${p.paddingDesktop?.right ?? 20}px`,
      paddingBottom: `${p.paddingDesktop?.bottom ?? 10}px`,
      paddingLeft: `${p.paddingDesktop?.left ?? 20}px`,
      textDecoration: "none",
      fontFamily: p.fontFamily || "Arial, sans-serif",
      fontSize: `${p.fontSizeDesktop ?? 16}px`,
      fontWeight: p.bold ? "bold" : (p.fontWeight || "normal"),
      fontStyle: p.italic ? "italic" : "normal",
      borderWidth: `${p.borderWidth ?? 0}px`,
      borderStyle: p.borderStyle || "solid",
      borderColor: p.borderColor || "#000000",
      height: p.fixedHeight ? `${p.heightDesktop ?? 40}px` : "auto",
      lineHeight: p.fixedHeight ? `${(p.heightDesktop ?? 40) - (p.paddingDesktop?.top ?? 0) - (p.paddingDesktop?.bottom ?? 0)}px` : "normal",
      boxSizing: "border-box",
    };

    return (
      <div style={getBaseBlockWrapperStyles(p)}>
        <a
          href={p.href || "#"}
          onClick={(e) => e.preventDefault()}
          style={buttonStyle}
        >
          {p.text}
        </a>
      </div>
    );
  },
  renderInspector: ({ block, onChange }) => {
    const p = block.props;
    const padding = p.paddingDesktop ?? { top: 10, right: 20, bottom: 10, left: 20, linked: false };
    const margin = p.marginDesktop ?? { top: 0, right: 0, bottom: 0, left: 0, linked: true };

    return (
      <div className="space-y-5">
        
        {/* ── Link & Text ── */}
        <section className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">Content</Label>
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Button Text</Label>
            <Input
              type="text"
              value={p.text || ""}
              onChange={(e) => onChange({ text: e.target.value })}
            />
          </div>
          
          <LinkInput
            linkType={p.linkType ?? "url"}
            href={p.href ?? ""}
            onChange={(updates) => onChange(updates as any)}
          />
        </section>

        {/* ── Alignment & Size ── */}
        <section className="space-y-3 border-t border-border/50 pt-4">
          <Label className="text-sm font-semibold text-foreground">Size & Layout</Label>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Alignment</Label>
            <AlignmentSelector
              value={(p.alignDesktop ?? "center") as "left" | "center" | "right"}
              onChange={(val) => onChange({ alignDesktop: val })}
            />
          </div>

          <div className="flex items-center justify-between py-0.5">
            <Label className="text-xs text-muted-foreground">Stretch to full width</Label>
            <Switch
              checked={p.fitToContainerDesktop ?? false}
              onCheckedChange={(v) => onChange({ fitToContainerDesktop: v })}
              size="sm"
            />
          </div>

          <div className="flex items-center justify-between py-0.5">
            <Label className="text-xs text-muted-foreground">Fixed Height</Label>
            <Switch
              checked={p.fixedHeight ?? false}
              onCheckedChange={(v) => onChange({ fixedHeight: v, heightDesktop: v ? 40 : undefined })}
              size="sm"
            />
          </div>

          {p.fixedHeight && (
            <div className="flex items-center justify-between pl-3 border-l-2 border-primary/30">
              <Label className="text-xs text-muted-foreground">Height (px)</Label>
              <NumberStepper
                value={p.heightDesktop ?? 40}
                onChange={(v) => onChange({ heightDesktop: v })}
                min={20}
                max={200}
                step={1}
                className="w-28 h-8"
              />
            </div>
          )}
        </section>

        {/* ── Typography ── */}
        <section className="space-y-3 border-t border-border/50 pt-4">
          <Label className="text-sm font-semibold text-foreground">Typography</Label>
          
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
              <Label className="text-xs text-muted-foreground">Size (px)</Label>
              <NumberStepper
                value={p.fontSizeDesktop ?? 16}
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
              <Label className="text-xs text-muted-foreground">Weight</Label>
              <Select
                value={String(p.fontWeight || "normal")}
                onValueChange={(val) => onChange({ fontWeight: val })}
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
              <Label className="text-xs text-muted-foreground">Style</Label>
              <div className="flex gap-2">
                <button type="button" onClick={() => onChange({ bold: !p.bold })} className={`flex-1 h-9 flex items-center justify-center text-sm border rounded font-bold ${p.bold ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}>B</button>
                <button type="button" onClick={() => onChange({ italic: !p.italic })} className={`flex-1 h-9 flex items-center justify-center text-sm border rounded font-serif italic ${p.italic ? 'bg-primary text-primary-foreground border-primary' : 'bg-background hover:bg-muted'}`}>I</button>
              </div>
            </div>
          </div>
        </section>

        {/* ── Colors ── */}
        <section className="space-y-3 border-t border-border/50 pt-4">
          <Label className="text-sm font-semibold text-foreground">Colors</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Button Color</Label>
              <ColorPicker
                value={p.buttonColor || "#33cc4a"}
                onChange={(color) => onChange({ buttonColor: color })}
                align="left"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Text Color</Label>
              <ColorPicker
                value={p.textColor || "#ffffff"}
                onChange={(color) => onChange({ textColor: color })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label className="text-xs text-muted-foreground">Block Background</Label>
              <ColorPicker
                value={p.blockBackgroundColor || "transparent"}
                onChange={(color) => onChange({ blockBackgroundColor: color })}
                align="left"
              />
            </div>
          </div>
        </section>

        {/* ── Borders ── */}
        <section className="space-y-3 border-t border-border/50 pt-4">
          <Label className="text-sm font-semibold text-foreground">Borders</Label>
          
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Corner Radius (px)</Label>
            <NumberStepper
              value={p.borderRadius ?? 4}
              onChange={(v) => onChange({ borderRadius: v })}
              min={0}
              max={100}
              step={1}
              className="w-28 h-8"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Border Width (px)</Label>
            <NumberStepper
              value={p.borderWidth ?? 0}
              onChange={(v) => onChange({ borderWidth: v })}
              min={0}
              max={20}
              step={1}
              className="w-28 h-8"
            />
          </div>

          {p.borderWidth ? p.borderWidth > 0 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Border Style</Label>
                <Select
                  value={p.borderStyle || "solid"}
                  onValueChange={(val: any) => onChange({ borderStyle: val })}
                >
                  <SelectTrigger className="w-full h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="solid">Solid</SelectItem>
                    <SelectItem value="dashed">Dashed</SelectItem>
                    <SelectItem value="dotted">Dotted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Border Color</Label>
                <ColorPicker
                  value={p.borderColor || "#000000"}
                  onChange={(color) => onChange({ borderColor: color })}
                />
              </div>
            </div>
          ) : null}
        </section>

        {/* ── Spacing ── */}
        <section className="space-y-3 border-t border-border/50 pt-4">
          <SpacingControl
            label="Padding on Desktop"
            top={padding.top}
            right={padding.right}
            bottom={padding.bottom}
            left={padding.left}
            linked={padding.linked}
            onChangeTop={(v) => onChange({ paddingDesktop: { ...padding, top: v } })}
            onChangeRight={(v) => onChange({ paddingDesktop: { ...padding, right: v } })}
            onChangeBottom={(v) => onChange({ paddingDesktop: { ...padding, bottom: v } })}
            onChangeLeft={(v) => onChange({ paddingDesktop: { ...padding, left: v } })}
            onChangeAll={(v) => onChange({ paddingDesktop: { ...padding, top: v, right: v, bottom: v, left: v } })}
            onToggleLink={(linked) => onChange({ paddingDesktop: { ...padding, linked } })}
          />

          <div className="pt-2">
            <SpacingControl
              label="Margin on Desktop"
              top={margin.top}
              right={margin.right}
              bottom={margin.bottom}
              left={margin.left}
              linked={margin.linked}
              onChangeTop={(v) => onChange({ marginDesktop: { ...margin, top: v } })}
              onChangeRight={(v) => onChange({ marginDesktop: { ...margin, right: v } })}
              onChangeBottom={(v) => onChange({ marginDesktop: { ...margin, bottom: v } })}
              onChangeLeft={(v) => onChange({ marginDesktop: { ...margin, left: v } })}
              onChangeAll={(v) => onChange({ marginDesktop: { ...margin, top: v, right: v, bottom: v, left: v } })}
              onToggleLink={(linked) => onChange({ marginDesktop: { ...margin, linked } })}
            />
          </div>
        </section>
      </div>
    );
  },
  renderEmail: ({ block }) => {
    const p = block.props;

    const buttonStyle: React.CSSProperties = {
      display: p.fitToContainerDesktop ? "block" : "inline-block",
      width: p.fitToContainerDesktop ? "100%" : "auto",
      backgroundColor: p.buttonColor,
      color: p.textColor,
      borderRadius: `${p.borderRadius ?? 0}px`,
      paddingTop: `${p.paddingDesktop?.top ?? 10}px`,
      paddingRight: `${p.paddingDesktop?.right ?? 20}px`,
      paddingBottom: `${p.paddingDesktop?.bottom ?? 10}px`,
      paddingLeft: `${p.paddingDesktop?.left ?? 20}px`,
      textDecoration: "none",
      fontFamily: p.fontFamily || "Arial, sans-serif",
      fontSize: `${p.fontSizeDesktop ?? 16}px`,
      fontWeight: p.bold ? "bold" : (p.fontWeight || "normal"),
      fontStyle: p.italic ? "italic" : "normal",
      borderWidth: `${p.borderWidth ?? 0}px`,
      borderStyle: p.borderStyle || "solid",
      borderColor: p.borderColor || "#000000",
      height: p.fixedHeight ? `${p.heightDesktop ?? 40}px` : "auto",
      lineHeight: p.fixedHeight ? `${(p.heightDesktop ?? 40) - (p.paddingDesktop?.top ?? 0) - (p.paddingDesktop?.bottom ?? 0)}px` : "normal",
      boxSizing: "border-box",
    };

    return (
      <div style={getBaseBlockWrapperStyles(p)}>
        <EmailButton href={p.href || "#"} style={buttonStyle}>
          {p.text}
        </EmailButton>
      </div>
    );
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// DIVIDER BLOCK
// ─────────────────────────────────────────────────────────────────────────────

const DividerBlockConfig: BlockConfig<DividerBlock> = {
  type: "divider",
  label: "Divider",
  icon: Minus,
  defaultProps: {
    color: "#e5e7eb",
    lineWidth: 1,
    widthDesktop: 100,
    borderStyle: "solid",
    blockBackgroundColor: "transparent",
    alignDesktop: "center",
    paddingDesktop: { top: 20, right: 0, bottom: 20, left: 0, linked: false },
    marginDesktop: { top: 0, right: 0, bottom: 0, left: 0, linked: true },
  },
  renderCanvas: ({ block }) => {
    const p = block.props;
    return (
      <div style={getBaseBlockWrapperStyles(p)}>
        <hr style={{ 
          borderColor: p.color, 
          borderWidth: `${p.lineWidth}px`, 
          borderStyle: p.borderStyle || 'solid', 
          width: `${p.widthDesktop ?? 100}%`,
          display: 'inline-block',
          margin: 0
        }} />
      </div>
    );
  },
  renderInspector: ({ block, onChange }) => {
    const p = block.props;
    const padding = p.paddingDesktop ?? { top: 20, right: 0, bottom: 20, left: 0, linked: false };
    const margin = p.marginDesktop ?? { top: 0, right: 0, bottom: 0, left: 0, linked: true };

    return (
      <div className="space-y-4">
        {/* ── Line Style ── */}
        <section className="space-y-3">
          <Label className="text-sm font-semibold text-foreground">Line Style</Label>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Width (%)</Label>
            <NumberStepper
              value={p.widthDesktop ?? 100}
              onChange={(v) => onChange({ widthDesktop: v })}
              min={10}
              max={100}
              step={5}
              className="w-28 h-8"
            />
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Thickness (px)</Label>
            <NumberStepper
              value={p.lineWidth || 1}
              onChange={(v) => onChange({ lineWidth: v })}
              min={1}
              max={20}
              step={1}
              className="w-28 h-8"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Border Style</Label>
            <Select
              value={p.borderStyle || "solid"}
              onValueChange={(val: any) => onChange({ borderStyle: val })}
            >
              <SelectTrigger className="w-full h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid</SelectItem>
                <SelectItem value="dashed">Dashed</SelectItem>
                <SelectItem value="dotted">Dotted</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* ── Colors ── */}
        <section className="space-y-3 border-t border-border/50 pt-4">
          <Label className="text-sm font-semibold text-foreground">Colors</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Line Color</Label>
              <ColorPicker
                value={p.color || "#e5e7eb"}
                onChange={(color) => onChange({ color })}
                align="left"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Background</Label>
              <ColorPicker
                value={p.blockBackgroundColor || "transparent"}
                onChange={(color) => onChange({ blockBackgroundColor: color })}
                align="right"
              />
            </div>
          </div>
        </section>

        {/* ── Layout ── */}
        <section className="space-y-3 border-t border-border/50 pt-4">
          <Label className="text-sm font-semibold text-foreground">Layout</Label>
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Alignment</Label>
            <AlignmentSelector
              value={(p.alignDesktop ?? "center") as "left" | "center" | "right"}
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
              onChangeTop={(v) => onChange({ paddingDesktop: { ...padding, top: v } })}
              onChangeRight={(v) => onChange({ paddingDesktop: { ...padding, right: v } })}
              onChangeBottom={(v) => onChange({ paddingDesktop: { ...padding, bottom: v } })}
              onChangeLeft={(v) => onChange({ paddingDesktop: { ...padding, left: v } })}
              onChangeAll={(v) => onChange({ paddingDesktop: { ...padding, top: v, right: v, bottom: v, left: v } })}
              onToggleLink={(linked) => onChange({ paddingDesktop: { ...padding, linked } })}
            />
          </div>
          <div className="pt-2">
            <SpacingControl
              label="Margin on Desktop"
              top={margin.top}
              right={margin.right}
              bottom={margin.bottom}
              left={margin.left}
              linked={margin.linked}
              onChangeTop={(v) => onChange({ marginDesktop: { ...margin, top: v } })}
              onChangeRight={(v) => onChange({ marginDesktop: { ...margin, right: v } })}
              onChangeBottom={(v) => onChange({ marginDesktop: { ...margin, bottom: v } })}
              onChangeLeft={(v) => onChange({ marginDesktop: { ...margin, left: v } })}
              onChangeAll={(v) => onChange({ marginDesktop: { ...margin, top: v, right: v, bottom: v, left: v } })}
              onToggleLink={(linked) => onChange({ marginDesktop: { ...margin, linked } })}
            />
          </div>
        </section>
      </div>
    );
  },
  renderEmail: ({ block }) => {
    const p = block.props;
    return (
      <div style={getBaseBlockWrapperStyles(p)}>
        <EmailHr style={{ 
          borderColor: p.color, 
          borderWidth: `${p.lineWidth}px`, 
          borderStyle: p.borderStyle || 'solid', 
          width: `${p.widthDesktop ?? 100}%`,
          margin: 0,
          display: "inline-block"
        }} />
      </div>
    );
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// REGISTRY EXPORTS
// ─────────────────────────────────────────────────────────────────────────────

export const BLOCK_REGISTRY: Record<BlockType, BlockConfig<any>> = {
  text: TextBlockConfig,
  image: ImageBlockConfig,
  button: ButtonBlockConfig,
  divider: DividerBlockConfig,
};

export const BLOCK_LIST = Object.values(BLOCK_REGISTRY);

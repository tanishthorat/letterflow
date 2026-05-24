export type BlockType = "text" | "image" | "button" | "divider";

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface BaseBlockProps {
  blockBackgroundColor?: string;
  alignDesktop?: "left" | "center" | "right" | "justify";
  paddingDesktop?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    linked: boolean;
  };
  marginDesktop?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    linked: boolean;
  };
}

export interface TextBlock extends BaseBlock {
  type: "text";
  props: BaseBlockProps & {
    content: string;
    fontSize?: number; // legacy
    color?: string;
    align?: "left" | "center" | "right" | "justify"; // legacy

    fontFamily?: string;
    fontSizeDesktop?: number;
    fontSizeMobile?: number;
    fontWeight?: "normal" | "bold" | number;
    italic?: boolean;
    underline?: boolean;
    strikethrough?: boolean;
    subscript?: boolean;
    superscript?: boolean;
    backgroundColor?: string;
    lineHeightDesktop?: number | string;
    lineHeightMobile?: number | string;
    paragraphStyle?: "p" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
    alignMobile?: "left" | "center" | "right" | "justify";
    indent?: number;
    direction?: "ltr" | "rtl";
    fixedHeight?: boolean;
    fixedHeightValue?: number;
    padding?: { // legacy
      top: number;
      right: number;
      bottom: number;
      left: number;
      linked: boolean;
    };
  };
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  props: BaseBlockProps & {
    src: string;
    alt: string;
    width: number | "auto";
    height: number | "auto";
    align?: "left" | "center" | "right"; // legacy
    
    addAltToTitle?: boolean;
    title?: string;
    fileName?: string;
    originalWidth?: number;
    originalHeight?: number;
    linkType?: "url" | "email" | "phone" | "sms";
    href?: string;
    fixedHeight?: boolean;
    imageFit?: "cover" | "contain" | "fill";
    imagePosition?: "top" | "center" | "bottom";
    borderRadius?: number;
    radiusMode?: "uniform" | "individual";
    margin?: { // legacy
      top: number;
      right: number;
      bottom: number;
      left: number;
      linked: boolean;
    };
  };
}

export interface ButtonBlock extends BaseBlock {
  type: "button";
  props: BaseBlockProps & {
    text: string;
    linkType?: "url" | "email" | "phone" | "sms";
    href: string;
    buttonColor: string;
    textColor: string;
    fontFamily?: string;
    fontSizeDesktop?: number;
    fontWeight?: "normal" | "bold" | string;
    bold?: boolean;
    italic?: boolean;
    fitToContainerDesktop?: boolean;
    fixedHeight?: boolean;
    heightDesktop?: number;
    borderRadius?: number;
    borderWidth?: number;
    borderStyle?: "solid" | "dashed" | "dotted";
    borderColor?: string;
  };
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
  props: BaseBlockProps & {
    color: string;
    lineWidth: number;
    widthDesktop?: number;
    borderStyle?: "solid" | "dashed" | "dotted";
  };
}

export type ContentBlock = TextBlock | ImageBlock | ButtonBlock | DividerBlock;
export type EditorBlock = ContentBlock; // Alias for backwards compatibility

export interface ColumnProps {
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  verticalAlign?: 'top' | 'middle' | 'bottom';
  backgroundColor?: string;
}

export interface Column {
  id: string;
  widthRatio: number;
  blocks: ContentBlock[];
  props: ColumnProps;
}

export interface StructureProps {
  backgroundColor?: string;
  paddingTop?: number;
  paddingBottom?: number;
  paddingLeft?: number;
  paddingRight?: number;
  marginTop?: number;
  marginBottom?: number;
  marginLeft?: number;
  marginRight?: number;
  columnGap?: number;
}

export interface Structure {
  id: string;
  type: 'structure';
  columns: Column[];
  props: StructureProps;
}

export interface StripeProps {
  backgroundColor?: string;
  backgroundImageUrl?: string;
  paddingTop?: number;
  paddingBottom?: number;
  fullWidth?: boolean;
}

export interface Stripe {
  id: string;
  type: 'stripe';
  label?: string;
  structures: Structure[];
  props: StripeProps;
}

export interface GlobalStyles {
  contentBackgroundColor: string;
  contentWidth: number;
  messageAlignment?: 'left' | 'center' | 'right';
  underlineLinks?: boolean;
  responsiveDesign?: boolean;
}

export interface TemplateMetadata {
  subject?: string | null;
  preheader?: string | null;
  status?: "draft" | "published" | "archived";
}

export interface TemplateDesign {
  version: '2.0';
  stripes: Stripe[];
  globalStyles: GlobalStyles;
}

export type BlockAddress = {
  stripeId: string;
  structureId: string;
  columnId: string;
  index: number;
};

export type SelectedNode =
  | { type: 'stripe', stripeId: string }
  | { type: 'structure', stripeId: string, structureId: string }
  | { type: 'column', stripeId: string, structureId: string, columnId: string }
  | { type: 'block', stripeId: string, structureId: string, columnId: string, blockId: string }
  | null;


export type BlockType = "text" | "image" | "button" | "divider";

export interface BaseBlock {
  id: string;
  type: BlockType;
}

export interface TextBlock extends BaseBlock {
  type: "text";
  props: {
    content: string;
    fontSize: number;
    color: string;
    align: "left" | "center" | "right";
  };
}

export interface ImageBlock extends BaseBlock {
  type: "image";
  props: {
    src: string;
    alt: string;
    width: number | "auto";
    height: number | "auto";
    align: "left" | "center" | "right";
  };
}

export interface ButtonBlock extends BaseBlock {
  type: "button";
  props: {
    text: string;
    url: string;
    backgroundColor: string;
    textColor: string;
    borderRadius: number;
    padding: number;
    align: "left" | "center" | "right";
  };
}

export interface DividerBlock extends BaseBlock {
  type: "divider";
  props: {
    lineColor: string;
    lineWidth: number;
    padding: number;
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
  bodyBackgroundColor: string;
  contentBackgroundColor: string;
  contentWidth: number;
  defaultFontFamily: string;
  defaultFontSize: number;
  defaultTextColor: string;
  linkColor: string;
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


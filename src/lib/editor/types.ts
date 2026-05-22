export type BlockType = "text" | "image" | "button";

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

export type EditorBlock = TextBlock | ImageBlock | ButtonBlock;

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
  version: string;
  blocks: EditorBlock[];
  globalStyles: GlobalStyles;
}

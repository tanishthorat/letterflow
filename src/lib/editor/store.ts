import { create } from "zustand";
import type { EditorBlock, GlobalStyles, TemplateDesign, BlockType } from "./types";
import { BLOCK_REGISTRY } from "./registry";

const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
  bodyBackgroundColor: "#0b0d0f",
  contentBackgroundColor: "#111418",
  contentWidth: 600,
  defaultFontFamily: "Inter, sans-serif",
  defaultFontSize: 16,
  defaultTextColor: "#e6eaf0",
  linkColor: "#33cc4a",
};

interface EditorState {
  blocks: EditorBlock[];
  globalStyles: GlobalStyles;
  selectedBlockId: string | null;
  isDirty: boolean;
  
  addBlock: (type: BlockType) => void;
  updateBlock: (id: string, props: Partial<EditorBlock["props"]>) => void;
  removeBlock: (id: string) => void;
  duplicateBlock: (id: string) => void;
  reorderBlocks: (startIndex: number, endIndex: number) => void;
  selectBlock: (id: string | null) => void;
  updateGlobalStyles: (styles: Partial<GlobalStyles>) => void;
  
  loadDesign: (design: any, globalStyles: any) => void;
  getDesign: () => TemplateDesign;
  clearDirty: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  blocks: [],
  globalStyles: DEFAULT_GLOBAL_STYLES,
  selectedBlockId: null,
  isDirty: false,

  addBlock: (type: BlockType) => {
    const id = crypto.randomUUID();
    const blockConfig = BLOCK_REGISTRY[type];
    const newBlock = { id, type, props: { ...blockConfig.defaultProps } } as EditorBlock;
    set((state) => ({ 
      blocks: [...state.blocks, newBlock], 
      selectedBlockId: id,
      isDirty: true
    }));
  },
  
  updateBlock: (id, props) => {
    set((state) => ({
      blocks: state.blocks.map((b) => 
        b.id === id ? { ...b, props: { ...b.props, ...props } } : b
      ) as EditorBlock[],
      isDirty: true
    }));
  },
  
  removeBlock: (id) => {
    set((state) => ({
      blocks: state.blocks.filter((b) => b.id !== id),
      selectedBlockId: state.selectedBlockId === id ? null : state.selectedBlockId,
      isDirty: true
    }));
  },
  
  duplicateBlock: (id) => {
    set((state) => {
      const blockToCopy = state.blocks.find(b => b.id === id);
      if (!blockToCopy) return state;
      const newBlock = { ...blockToCopy, id: crypto.randomUUID(), props: { ...blockToCopy.props } } as EditorBlock;
      const index = state.blocks.findIndex(b => b.id === id);
      const newBlocks = [...state.blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      return { blocks: newBlocks, selectedBlockId: newBlock.id, isDirty: true };
    });
  },
  
  reorderBlocks: (startIndex, endIndex) => {
    set((state) => {
      const result = Array.from(state.blocks);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return { blocks: result, isDirty: true };
    });
  },
  
  selectBlock: (id) => set({ selectedBlockId: id }),
  
  updateGlobalStyles: (styles) => set((state) => ({ 
    globalStyles: { ...state.globalStyles, ...styles },
    isDirty: true 
  })),
  
  loadDesign: (design, globalStyles) => {
    const blocks = design?.blocks || [];
    const loadedStyles = { ...DEFAULT_GLOBAL_STYLES, ...(globalStyles || {}) };
    set({ blocks, globalStyles: loadedStyles, isDirty: false, selectedBlockId: null });
  },
  
  getDesign: () => {
    const { blocks, globalStyles } = get();
    return { version: "1.0", blocks, globalStyles };
  },
  
  clearDirty: () => set({ isDirty: false })
}));

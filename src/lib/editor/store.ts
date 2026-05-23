import { create } from "zustand";
import type { 
  ContentBlock, 
  GlobalStyles, 
  TemplateDesign, 
  BlockType, 
  Stripe, 
  Structure, 
  StripeProps, 
  StructureProps, 
  ColumnProps,
  BlockAddress,
  SelectedNode
} from "./types";
import { LayoutPreset } from "./layoutPresets";
import {
  DEFAULT_GLOBAL_STYLES,
  createBlock,
  cloneStripe,
  cloneStructure,
  cloneBlock,
  updateStripeById,
  updateStructureById,
  updateColumnById,
  clearSelectionIfRemoved,
  parseDesign
} from "./utils";

interface EditorState {
  stripes: Stripe[];
  globalStyles: GlobalStyles;
  selectedNode: SelectedNode;
  isDirty: boolean;
  
  // Stripe Actions
  addStripe: (label?: string) => string;
  removeStripe: (stripeId: string) => void;
  duplicateStripe: (stripeId: string) => void;
  moveStripe: (stripeId: string, direction: 'up' | 'down') => void;
  updateStripeProps: (stripeId: string, props: Partial<StripeProps>) => void;
  reorderStripes: (startIndex: number, endIndex: number) => void;

  // Structure Actions
  addStructure: (stripeId: string, preset: LayoutPreset) => void;
  removeStructure: (stripeId: string, structureId: string) => void;
  duplicateStructure: (stripeId: string, structureId: string) => void;
  moveStructure: (stripeId: string, structureId: string, direction: 'up' | 'down') => void;
  updateStructureProps: (stripeId: string, structureId: string, props: Partial<StructureProps>) => void;
  reorderStructures: (stripeId: string, startIndex: number, endIndex: number) => void;

  // Column Actions
  updateColumnProps: (stripeId: string, structureId: string, columnId: string, props: Partial<ColumnProps>) => void;

  // Block Actions
  addBlock: (stripeId: string, structureId: string, columnId: string, blockType: BlockType, payload?: Partial<ContentBlock["props"]>, insertIndex?: number) => void;
  addBlockToColumn: (type: BlockType, stripeId: string, structureId: string, columnId: string, insertIndex?: number, payload?: Partial<ContentBlock["props"]>) => void;
  addBlockToCanvas: (type: BlockType, payload?: Partial<ContentBlock["props"]>) => void;
  removeBlock: (stripeId: string, structureId: string, columnId: string, blockId: string) => void;
  duplicateBlock: (stripeId: string, structureId: string, columnId: string, blockId: string) => void;
  updateBlock: (stripeId: string, structureId: string, columnId: string, blockId: string, props: Partial<ContentBlock["props"]>) => void;
  moveBlock: (from: BlockAddress, to: BlockAddress) => void;

  // Selection & Global
  selectNode: (node: SelectedNode) => void;
  updateGlobalStyles: (styles: Partial<GlobalStyles>) => void;
  loadDesign: (design: unknown, globalStyles: unknown) => void;
  getDesign: () => TemplateDesign;
  clearDirty: () => void;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  stripes: [],
  globalStyles: DEFAULT_GLOBAL_STYLES,
  selectedNode: null,
  isDirty: false,

  addStripe: (label) => {
    const newStripe: Stripe = {
      id: crypto.randomUUID(),
      type: 'stripe',
      label: label || 'New Stripe',
      props: { backgroundColor: "transparent", paddingTop: 10, paddingBottom: 10 },
      structures: []
    };
    set((state) => ({ 
      stripes: [...state.stripes, newStripe], 
      selectedNode: { type: 'stripe', stripeId: newStripe.id }, 
      isDirty: true 
    }));
    return newStripe.id;
  },

  removeStripe: (stripeId) => set((state) => ({
    stripes: state.stripes.filter(s => s.id !== stripeId),
    selectedNode: clearSelectionIfRemoved(state.selectedNode, 'stripe', stripeId),
    isDirty: true
  })),

  duplicateStripe: (stripeId) => set((state) => {
    const stripeIndex = state.stripes.findIndex(s => s.id === stripeId);
    if (stripeIndex === -1) return state;
    
    const newStripe = cloneStripe(state.stripes[stripeIndex]);
    const stripes = [...state.stripes];
    stripes.splice(stripeIndex + 1, 0, newStripe);
    
    return { stripes, selectedNode: { type: 'stripe', stripeId: newStripe.id }, isDirty: true };
  }),

  moveStripe: (stripeId, direction) => set((state) => {
    const index = state.stripes.findIndex(s => s.id === stripeId);
    if (index === -1) return state;
    if (direction === 'up' && index === 0) return state;
    if (direction === 'down' && index === state.stripes.length - 1) return state;
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const stripes = [...state.stripes];
    [stripes[index], stripes[targetIndex]] = [stripes[targetIndex], stripes[index]];
    return { stripes, isDirty: true };
  }),

  reorderStripes: (startIndex, endIndex) => set((state) => {
    const stripes = [...state.stripes];
    const [removed] = stripes.splice(startIndex, 1);
    stripes.splice(endIndex, 0, removed);
    return { stripes, isDirty: true };
  }),

  updateStripeProps: (stripeId, props) => set((state) => ({
    stripes: updateStripeById(state.stripes, stripeId, s => ({ ...s, props: { ...s.props, ...props } })),
    isDirty: true
  })),

  addStructure: (stripeId, preset) => set((state) => {
    const newStructure: Structure = {
      id: crypto.randomUUID(),
      type: 'structure',
      props: { backgroundColor: "transparent", paddingTop: 10, paddingBottom: 10, paddingLeft: 0, paddingRight: 0 },
      columns: preset.columns.map(ratio => ({
        id: crypto.randomUUID(),
        widthRatio: ratio,
        blocks: [],
        props: {}
      }))
    };
    return {
      stripes: updateStripeById(state.stripes, stripeId, s => ({ ...s, structures: [...s.structures, newStructure] })),
      selectedNode: { type: 'structure', stripeId, structureId: newStructure.id },
      isDirty: true
    };
  }),

  removeStructure: (stripeId, structureId) => set((state) => ({
    stripes: updateStripeById(state.stripes, stripeId, s => ({
      ...s, structures: s.structures.filter(str => str.id !== structureId)
    })),
    selectedNode: clearSelectionIfRemoved(state.selectedNode, 'structure', structureId),
    isDirty: true
  })),

  duplicateStructure: (stripeId, structureId) => set((state) => {
    let newStructId = "";
    const stripes = updateStripeById(state.stripes, stripeId, s => {
      const index = s.structures.findIndex(str => str.id === structureId);
      if (index === -1) return s;
      
      const newStructure = cloneStructure(s.structures[index]);
      newStructId = newStructure.id;
      
      const structures = [...s.structures];
      structures.splice(index + 1, 0, newStructure);
      return { ...s, structures };
    });

    if (!newStructId) return state;
    return { stripes, selectedNode: { type: 'structure', stripeId, structureId: newStructId }, isDirty: true };
  }),

  moveStructure: (stripeId, structureId, direction) => set((state) => ({
    stripes: updateStripeById(state.stripes, stripeId, s => {
      const index = s.structures.findIndex(str => str.id === structureId);
      if (index === -1) return s;
      if (direction === 'up' && index === 0) return s;
      if (direction === 'down' && index === s.structures.length - 1) return s;
      
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      const structures = [...s.structures];
      [structures[index], structures[targetIndex]] = [structures[targetIndex], structures[index]];
      return { ...s, structures };
    }),
    isDirty: true
  })),

  updateStructureProps: (stripeId, structureId, props) => set((state) => ({
    stripes: updateStructureById(state.stripes, stripeId, structureId, str => ({
      ...str, props: { ...str.props, ...props }
    })),
    isDirty: true
  })),

  reorderStructures: (stripeId, startIndex, endIndex) => set((state) => ({
    stripes: updateStripeById(state.stripes, stripeId, s => {
      const structures = [...s.structures];
      const [removed] = structures.splice(startIndex, 1);
      structures.splice(endIndex, 0, removed);
      return { ...s, structures };
    }),
    isDirty: true
  })),

  updateColumnProps: (stripeId, structureId, columnId, props) => set((state) => ({
    stripes: updateColumnById(state.stripes, stripeId, structureId, columnId, col => ({
      ...col, props: { ...col.props, ...props }
    })),
    isDirty: true
  })),

  addBlock: (stripeId, structureId, columnId, type, payload, insertIndex) => set((state) => {
    const newBlock = createBlock(type, payload);
    if (!newBlock) return state;

    return {
      stripes: updateColumnById(state.stripes, stripeId, structureId, columnId, col => {
        const blocks = [...col.blocks];
        if (insertIndex !== undefined && insertIndex >= 0 && insertIndex <= blocks.length) {
          blocks.splice(insertIndex, 0, newBlock);
        } else {
          blocks.push(newBlock);
        }
        return { ...col, blocks };
      }),
      selectedNode: { type: 'block', stripeId, structureId, columnId, blockId: newBlock.id },
      isDirty: true
    };
  }),

  addBlockToColumn: (type, stripeId, structureId, columnId, insertIndex, payload) => {
    get().addBlock(stripeId, structureId, columnId, type, payload, insertIndex);
  },

  addBlockToCanvas: (type, payload) => {
    const newBlock = createBlock(type, payload);
    if (!newBlock) return;
    
    const newStripeId = crypto.randomUUID();
    const newStructureId = crypto.randomUUID();
    const newColumnId = crypto.randomUUID();

    const newStripe: Stripe = {
      id: newStripeId,
      type: 'stripe',
      label: 'New Stripe',
      props: { backgroundColor: "transparent", paddingTop: 10, paddingBottom: 10 },
      structures: [{
        id: newStructureId,
        type: 'structure',
        props: { backgroundColor: "transparent", paddingTop: 10, paddingBottom: 10, paddingLeft: 0, paddingRight: 0 },
        columns: [{
          id: newColumnId,
          widthRatio: 1,
          blocks: [newBlock],
          props: {}
        }]
      }]
    };

    set((state) => ({
      stripes: [...state.stripes, newStripe],
      selectedNode: { type: 'block', stripeId: newStripeId, structureId: newStructureId, columnId: newColumnId, blockId: newBlock.id },
      isDirty: true
    }));
  },

  removeBlock: (stripeId, structureId, columnId, blockId) => set((state) => ({
    stripes: updateColumnById(state.stripes, stripeId, structureId, columnId, col => ({
      ...col, blocks: col.blocks.filter(b => b.id !== blockId)
    })),
    selectedNode: clearSelectionIfRemoved(state.selectedNode, 'block', blockId),
    isDirty: true
  })),

  duplicateBlock: (stripeId, structureId, columnId, blockId) => set((state) => ({
    stripes: updateColumnById(state.stripes, stripeId, structureId, columnId, col => {
      const index = col.blocks.findIndex(b => b.id === blockId);
      if (index === -1) return col;
      
      const newBlock = cloneBlock(col.blocks[index]);
      const blocks = [...col.blocks];
      blocks.splice(index + 1, 0, newBlock);
      return { ...col, blocks };
    }),
    isDirty: true
  })),

  updateBlock: (stripeId, structureId, columnId, blockId, props) => set((state) => ({
    stripes: updateColumnById(state.stripes, stripeId, structureId, columnId, col => ({
      ...col,
      blocks: col.blocks.map((b): ContentBlock => b.id === blockId ? ({ ...b, props: { ...b.props, ...props } }) as ContentBlock : b)
    })),
    isDirty: true
  })),

  moveBlock: (from, to) => set((state) => {
    const stripes = structuredClone(state.stripes);
    
    const fromStripe = stripes.find(s => s.id === from.stripeId);
    const fromStructure = fromStripe?.structures.find(s => s.id === from.structureId);
    const fromColumn = fromStructure?.columns.find(c => c.id === from.columnId);
    if (!fromColumn) return state;

    const blockToMove = fromColumn.blocks[from.index];
    fromColumn.blocks.splice(from.index, 1);

    const toStripe = stripes.find(s => s.id === to.stripeId);
    const toStructure = toStripe?.structures.find(s => s.id === to.structureId);
    const toColumn = toStructure?.columns.find(c => c.id === to.columnId);
    if (!toColumn) return state;
    
    toColumn.blocks.splice(to.index, 0, blockToMove);

    return { stripes, isDirty: true };
  }),

  selectNode: (node) => set({ selectedNode: node }),

  updateGlobalStyles: (styles) => set((state) => ({ 
    globalStyles: { ...state.globalStyles, ...styles },
    isDirty: true 
  })),

  loadDesign: (design, globalStyles) => {
    const parsed = parseDesign(design);
    if (globalStyles && typeof globalStyles === 'object') {
        parsed.globalStyles = { ...parsed.globalStyles, ...globalStyles };
    }
    set({
      stripes: parsed.stripes,
      globalStyles: parsed.globalStyles,
      isDirty: false 
    });
  },

  getDesign: () => {
    const state = get();
    return {
      version: '2.0',
      stripes: state.stripes,
      globalStyles: state.globalStyles
    };
  },

  clearDirty: () => set({ isDirty: false }),
}));
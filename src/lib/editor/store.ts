import { create } from "zustand";
import type { 
  ContentBlock, 
  GlobalStyles, 
  TemplateDesign, 
  BlockType, 
  Stripe, 
  Structure, 
  Column, 
  StripeProps, 
  StructureProps, 
  ColumnProps,
  BlockAddress
} from "./types";
import { BLOCK_REGISTRY } from "./registry";
import { LayoutPreset } from "./layoutPresets";

const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
  bodyBackgroundColor: "#212121",
  contentBackgroundColor: "#212121",
  contentWidth: 600,
  defaultFontFamily: "Inter, sans-serif",
  defaultFontSize: 16,
  defaultTextColor: "#e6eaf0",
  linkColor: "#33cc4a",
};

export type SelectedNode = 
  | { type: 'stripe', stripeId: string }
  | { type: 'structure', stripeId: string, structureId: string }
  | { type: 'column', stripeId: string, structureId: string, columnId: string }
  | { type: 'block', stripeId: string, structureId: string, columnId: string, blockId: string }
  | null;

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
  addBlock: (stripeId: string, structureId: string, columnId: string, blockType: BlockType, payload?: any, insertIndex?: number) => void;
  addBlockToColumn: (type: BlockType, stripeId: string, structureId: string, columnId: string, insertIndex?: number, payload?: any) => void;
  removeBlock: (stripeId: string, structureId: string, columnId: string, blockId: string) => void;
  duplicateBlock: (stripeId: string, structureId: string, columnId: string, blockId: string) => void;
  updateBlock: (stripeId: string, structureId: string, columnId: string, blockId: string, props: Partial<ContentBlock["props"]>) => void;
  moveBlock: (from: BlockAddress, to: BlockAddress) => void;

  // Selection & Global
  selectNode: (node: SelectedNode) => void;
  updateGlobalStyles: (styles: Partial<GlobalStyles>) => void;
  loadDesign: (design: any, globalStyles: any) => void;
  getDesign: () => TemplateDesign;
  clearDirty: () => void;
}

export function migrateDesign(oldDesign: any): TemplateDesign {
  if (!oldDesign) return { version: "2.0", stripes: [], globalStyles: DEFAULT_GLOBAL_STYLES };
  
  // Already v2.0
  if (oldDesign.version === '2.0' && oldDesign.stripes) {
    return { ...oldDesign };
  }

  // Version 1.x with rows
  if (oldDesign.rows) {
    const stripes: Stripe[] = oldDesign.rows.map((row: any) => {
      const structures: Structure[] = [
        {
          id: crypto.randomUUID(),
          type: 'structure',
          props: {
            backgroundColor: "transparent",
            paddingTop: 10,
            paddingBottom: 10,
          },
          columns: row.columns || []
        }
      ];
      
      return {
        id: row.id,
        type: 'stripe',
        label: 'Migrated Stripe',
        props: {
          backgroundColor: row.props?.backgroundColor || "transparent",
          paddingTop: row.props?.paddingTop || 0,
          paddingBottom: row.props?.paddingBottom || 0,
          fullWidth: row.props?.fullWidth || false
        },
        structures
      };
    });
    
    return {
      version: "2.0",
      stripes,
      globalStyles: oldDesign.globalStyles || DEFAULT_GLOBAL_STYLES
    };
  }

  // Version 1.x flat blocks
  const oldBlocks = oldDesign.blocks || [];
  
  const stripes: Stripe[] = oldBlocks.map((block: any) => {
    let columns: Column[] = [];
    
    if (block.type === 'columns') {
      columns = (block.props?.columns || []).map((c: any) => ({
        id: crypto.randomUUID(),
        widthRatio: c.width || 1,
        blocks: c.blocks || [],
        props: {}
      }));
    } else {
      columns = [{
        id: crypto.randomUUID(),
        widthRatio: 1,
        blocks: [block],
        props: {}
      }];
    }
    
    const structure: Structure = {
      id: crypto.randomUUID(),
      type: 'structure',
      props: {
        backgroundColor: block.props?.backgroundColor || "transparent",
        paddingTop: block.props?.padding || 10,
        paddingBottom: block.props?.padding || 10,
      },
      columns
    };

    return {
      id: crypto.randomUUID(),
      type: 'stripe',
      label: 'Migrated Block',
      props: { backgroundColor: "transparent" },
      structures: [structure]
    };
  });

  return {
    version: "2.0",
    stripes,
    globalStyles: oldDesign.globalStyles || DEFAULT_GLOBAL_STYLES
  };
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
    set((state) => ({ stripes: [...state.stripes, newStripe], selectedNode: { type: 'stripe', stripeId: newStripe.id }, isDirty: true }));
    return newStripe.id;
  },

  removeStripe: (stripeId) => set((state) => {
    const stripes = state.stripes.filter(s => s.id !== stripeId);
    let selectedNode = state.selectedNode;
    if (selectedNode?.type === 'stripe' && selectedNode.stripeId === stripeId) selectedNode = null;
    return { stripes, selectedNode, isDirty: true };
  }),

  duplicateStripe: (stripeId) => set((state) => {
    const stripeIndex = state.stripes.findIndex(s => s.id === stripeId);
    if (stripeIndex === -1) return state;
    const stripeToCopy = state.stripes[stripeIndex];
    
    const newStripe: Stripe = {
      ...stripeToCopy,
      id: crypto.randomUUID(),
      structures: stripeToCopy.structures.map(structure => ({
        ...structure,
        id: crypto.randomUUID(),
        columns: structure.columns.map(col => ({
          ...col,
          id: crypto.randomUUID(),
          blocks: col.blocks.map(b => ({ ...b, id: crypto.randomUUID() }))
        }))
      }))
    };
    
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
    const stripes = Array.from(state.stripes);
    const [removed] = stripes.splice(startIndex, 1);
    stripes.splice(endIndex, 0, removed);
    return { stripes, isDirty: true };
  }),

  updateStripeProps: (stripeId, props) => set((state) => ({
    stripes: state.stripes.map(s => s.id === stripeId ? { ...s, props: { ...s.props, ...props } } : s),
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
      stripes: state.stripes.map(s => s.id === stripeId ? { ...s, structures: [...s.structures, newStructure] } : s),
      selectedNode: { type: 'structure', stripeId, structureId: newStructure.id },
      isDirty: true
    };
  }),

  removeStructure: (stripeId, structureId) => set((state) => {
    return {
      stripes: state.stripes.map(s => s.id === stripeId ? { ...s, structures: s.structures.filter(str => str.id !== structureId) } : s),
      isDirty: true
    };
  }),

  duplicateStructure: (stripeId, structureId) => set((state) => {
    const stripeIndex = state.stripes.findIndex(s => s.id === stripeId);
    if (stripeIndex === -1) return state;
    const stripe = state.stripes[stripeIndex];
    const structureIndex = stripe.structures.findIndex(s => s.id === structureId);
    if (structureIndex === -1) return state;
    
    const structureToCopy = stripe.structures[structureIndex];
    const newStructure: Structure = {
      ...structureToCopy,
      id: crypto.randomUUID(),
      columns: structureToCopy.columns.map(col => ({
        ...col,
        id: crypto.randomUUID(),
        blocks: col.blocks.map(b => ({ ...b, id: crypto.randomUUID() }))
      }))
    };
    
    const structures = [...stripe.structures];
    structures.splice(structureIndex + 1, 0, newStructure);
    
    const stripes = [...state.stripes];
    stripes[stripeIndex] = { ...stripe, structures };
    return { stripes, selectedNode: { type: 'structure', stripeId, structureId: newStructure.id }, isDirty: true };
  }),

  moveStructure: (stripeId, structureId, direction) => set((state) => {
    const stripeIndex = state.stripes.findIndex(s => s.id === stripeId);
    if (stripeIndex === -1) return state;
    const stripe = state.stripes[stripeIndex];
    const index = stripe.structures.findIndex(s => s.id === structureId);
    if (index === -1) return state;
    
    if (direction === 'up' && index === 0) return state;
    if (direction === 'down' && index === stripe.structures.length - 1) return state;
    
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const structures = [...stripe.structures];
    [structures[index], structures[targetIndex]] = [structures[targetIndex], structures[index]];
    
    const stripes = [...state.stripes];
    stripes[stripeIndex] = { ...stripe, structures };
    return { stripes, isDirty: true };
  }),

  updateStructureProps: (stripeId, structureId, props) => set((state) => {
    return {
      stripes: state.stripes.map(stripe => stripe.id === stripeId ? {
        ...stripe,
        structures: stripe.structures.map(structure => structure.id === structureId ? {
          ...structure,
          props: { ...structure.props, ...props }
        } : structure)
      } : stripe),
      isDirty: true
    };
  }),

  reorderStructures: (stripeId, startIndex, endIndex) => set((state) => {
    return {
      stripes: state.stripes.map(stripe => {
        if (stripe.id === stripeId) {
          const structures = Array.from(stripe.structures);
          const [removed] = structures.splice(startIndex, 1);
          structures.splice(endIndex, 0, removed);
          return { ...stripe, structures };
        }
        return stripe;
      }),
      isDirty: true
    };
  }),

  updateColumnProps: (stripeId, structureId, columnId, props) => set((state) => {
    return {
      stripes: state.stripes.map(stripe => stripe.id === stripeId ? {
        ...stripe,
        structures: stripe.structures.map(structure => structure.id === structureId ? {
          ...structure,
          columns: structure.columns.map(column => column.id === columnId ? {
            ...column,
            props: { ...column.props, ...props }
          } : column)
        } : structure)
      } : stripe),
      isDirty: true
    };
  }),

  addBlock: (stripeId, structureId, columnId, type, payload, insertIndex) => set((state) => {
    const config = BLOCK_REGISTRY[type];
    if (!config) return state;

    const newBlock = { id: crypto.randomUUID(), type, props: { ...config.defaultProps, ...payload } } as ContentBlock;

    return {
      stripes: state.stripes.map(stripe => stripe.id === stripeId ? {
        ...stripe,
        structures: stripe.structures.map(structure => structure.id === structureId ? {
          ...structure,
          columns: structure.columns.map(column => {
            if (column.id === columnId) {
              const blocks = [...column.blocks];
              if (insertIndex !== undefined) {
                blocks.splice(insertIndex, 0, newBlock);
              } else {
                blocks.push(newBlock);
              }
              return { ...column, blocks };
            }
            return column;
          })
        } : structure)
      } : stripe),
      selectedNode: { type: 'block', stripeId, structureId, columnId, blockId: newBlock.id },
      isDirty: true
    };
  }),

  addBlockToColumn: (type, stripeId, structureId, columnId, insertIndex, payload) => {
    get().addBlock(stripeId, structureId, columnId, type, payload, insertIndex);
  },

  removeBlock: (stripeId, structureId, columnId, blockId) => set((state) => {
    return {
      stripes: state.stripes.map(stripe => stripe.id === stripeId ? {
        ...stripe,
        structures: stripe.structures.map(structure => structure.id === structureId ? {
          ...structure,
          columns: structure.columns.map(column => column.id === columnId ? {
            ...column,
            blocks: column.blocks.filter(b => b.id !== blockId)
          } : column)
        } : structure)
      } : stripe),
      isDirty: true
    };
  }),

  duplicateBlock: (stripeId, structureId, columnId, blockId) => set((state) => {
    return {
      stripes: state.stripes.map(stripe => stripe.id === stripeId ? {
        ...stripe,
        structures: stripe.structures.map(structure => structure.id === structureId ? {
          ...structure,
          columns: structure.columns.map(column => {
            if (column.id === columnId) {
              const index = column.blocks.findIndex(b => b.id === blockId);
              if (index === -1) return column;
              const newBlock = { ...column.blocks[index], id: crypto.randomUUID() };
              const blocks = [...column.blocks];
              blocks.splice(index + 1, 0, newBlock);
              return { ...column, blocks };
            }
            return column;
          })
        } : structure)
      } : stripe),
      isDirty: true
    };
  }),

  updateBlock: (stripeId, structureId, columnId, blockId, props) => set((state) => {
    return {
      stripes: state.stripes.map(stripe => stripe.id === stripeId ? {
        ...stripe,
        structures: stripe.structures.map(structure => structure.id === structureId ? {
          ...structure,
          columns: structure.columns.map(column => column.id === columnId ? {
            ...column,
            blocks: column.blocks.map(block => block.id === blockId ? {
              ...block,
              props: { ...block.props, ...props } as any
            } : block)
          } : column)
        } : structure)
      } : stripe),
      isDirty: true
    };
  }),

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

  loadDesign: (design, globalStyles) => set({ 
    ...migrateDesign({ ...design, globalStyles }),
    isDirty: false 
  }),

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

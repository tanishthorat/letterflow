import type { 
  ContentBlock, 
  GlobalStyles, 
  TemplateDesign, 
  BlockType, 
  Stripe, 
  Structure, 
  Column, 
  SelectedNode
} from "./types";
import { BLOCK_REGISTRY } from "./registry";

export const DEFAULT_GLOBAL_STYLES: GlobalStyles = {
  contentBackgroundColor: "#ffffff",
  backgroundImage: "",
  contentWidth: 900,
  messageAlignment: 'center',
  underlineLinks: true,
  responsiveDesign: true,
  defaultFontFamily: "Inter, sans-serif",
  defaultFontSize: 16,
  defaultTextColor: "#333333",
  linkColor: "#33cc4a",
};

// ============================================================================
// ENTITY FACTORIES & CLONING HELPERS
// ============================================================================

export function createBlock(type: BlockType, payload?: Partial<ContentBlock["props"]>): ContentBlock | null {
  const config = BLOCK_REGISTRY[type];
  if (!config) return null;
  return { 
    id: crypto.randomUUID(), 
    type, 
    props: { ...config.defaultProps, ...(payload || {}) } 
  } as ContentBlock;
}

export function cloneBlock(block: ContentBlock): ContentBlock {
  return { ...block, id: crypto.randomUUID() };
}

export function cloneColumn(column: Column): Column {
  return {
    ...column,
    id: crypto.randomUUID(),
    blocks: column.blocks.map(cloneBlock)
  };
}

export function cloneStructure(structure: Structure): Structure {
  return {
    ...structure,
    id: crypto.randomUUID(),
    columns: structure.columns.map(cloneColumn)
  };
}

export function cloneStripe(stripe: Stripe): Stripe {
  return {
    ...stripe,
    id: crypto.randomUUID(),
    structures: stripe.structures.map(cloneStructure)
  };
}

// ============================================================================
// IMMUTABLE UPDATERS
// ============================================================================

export function updateStripeById(stripes: Stripe[], stripeId: string, updater: (stripe: Stripe) => Stripe): Stripe[] {
  return stripes.map(s => s.id === stripeId ? updater(s) : s);
}

export function updateStructureById(stripes: Stripe[], stripeId: string, structureId: string, updater: (structure: Structure) => Structure): Stripe[] {
  return updateStripeById(stripes, stripeId, s => ({
    ...s,
    structures: s.structures.map(str => str.id === structureId ? updater(str) : str)
  }));
}

export function updateColumnById(stripes: Stripe[], stripeId: string, structureId: string, columnId: string, updater: (column: Column) => Column): Stripe[] {
  return updateStructureById(stripes, stripeId, structureId, str => ({
    ...str,
    columns: str.columns.map(col => col.id === columnId ? updater(col) : col)
  }));
}

export function clearSelectionIfRemoved(selectedNode: SelectedNode, type: string, id: string): SelectedNode {
  if (!selectedNode) return null;
  if (type === 'stripe' && selectedNode.stripeId === id) return null;
  if (type === 'structure' && selectedNode.type !== 'stripe' && selectedNode.structureId === id) return null;
  if (type === 'column' && (selectedNode.type === 'column' || selectedNode.type === 'block') && selectedNode.columnId === id) return null;
  if (type === 'block' && selectedNode.type === 'block' && selectedNode.blockId === id) return null;
  return selectedNode;
}

// ============================================================================
// PARSING & VALIDATION
// ============================================================================

export function normalizeGlobalStyles(styles: unknown): GlobalStyles {
  if (!styles || typeof styles !== 'object') {
    return DEFAULT_GLOBAL_STYLES;
  }
  return { ...DEFAULT_GLOBAL_STYLES, ...styles };
}

export function parseDesign(design: unknown): TemplateDesign {
  if (!design || typeof design !== 'object') {
    return { 
      version: "2.0", 
      stripes: [], 
      globalStyles: normalizeGlobalStyles(undefined) 
    };
  }

  const d = design as Partial<TemplateDesign>;

  return {
    version: "2.0",
    stripes: Array.isArray(d.stripes) ? d.stripes : [],
    globalStyles: normalizeGlobalStyles(d.globalStyles)
  };
}

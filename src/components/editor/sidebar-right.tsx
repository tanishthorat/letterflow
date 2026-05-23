"use client";

import { useEditorStore } from "@/lib/editor/store";
import { BLOCK_REGISTRY } from "@/lib/editor/registry";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Paintbrush, BoxSelect, Trash2, Rows } from "lucide-react";

function StripeInspector({ stripeId, stripes, updateStripeProps, removeStripe }: any) {
  const stripe = stripes.find((s: any) => s.id === stripeId);
  if (!stripe) return null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <Rows className="w-4 h-4 text-purple-500" />
          Stripe Settings
        </h3>
        <button onClick={() => removeStripe(stripeId)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Label</Label>
          <Input type="text" value={stripe.label || ""} onChange={(e) => updateStripeProps(stripeId, { label: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Background Color</Label>
          <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
            <input 
              type="color" 
              className="w-full h-full border-none bg-transparent cursor-pointer"
              value={stripe.props.backgroundColor !== "transparent" ? stripe.props.backgroundColor : "#ffffff"} 
              onChange={(e) => updateStripeProps(stripeId, { backgroundColor: e.target.value })} 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Padding Top</Label>
            <Input type="number" value={stripe.props.paddingTop} onChange={(e) => updateStripeProps(stripeId, { paddingTop: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Padding Bottom</Label>
            <Input type="number" value={stripe.props.paddingBottom} onChange={(e) => updateStripeProps(stripeId, { paddingBottom: Number(e.target.value) })} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="checkbox" 
            id="fullWidth" 
            checked={!!stripe.props.fullWidth} 
            onChange={(e) => updateStripeProps(stripeId, { fullWidth: e.target.checked })} 
          />
          <Label htmlFor="fullWidth" className="text-xs">Full Width Background</Label>
        </div>
      </div>
    </div>
  );
}

function StructureInspector({ stripeId, structureId, stripes, updateStructureProps, removeStructure }: any) {
  const stripe = stripes.find((s: any) => s.id === stripeId);
  const structure = stripe?.structures.find((s: any) => s.id === structureId);
  if (!structure) return null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <BoxSelect className="w-4 h-4 text-orange-500" />
          Structure Settings
        </h3>
        <button onClick={() => removeStructure(stripeId, structureId)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Background Color</Label>
          <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
            <input 
              type="color" 
              className="w-full h-full border-none bg-transparent cursor-pointer"
              value={structure.props.backgroundColor !== "transparent" ? structure.props.backgroundColor : "#ffffff"} 
              onChange={(e) => updateStructureProps(stripeId, structureId, { backgroundColor: e.target.value })} 
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Column Gap</Label>
            <Input type="number" value={structure.props.columnGap || 0} onChange={(e) => updateStructureProps(stripeId, structureId, { columnGap: Number(e.target.value) })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Padding Top</Label>
            <Input type="number" value={structure.props.paddingTop} onChange={(e) => updateStructureProps(stripeId, structureId, { paddingTop: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Padding Bottom</Label>
            <Input type="number" value={structure.props.paddingBottom} onChange={(e) => updateStructureProps(stripeId, structureId, { paddingBottom: Number(e.target.value) })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Padding Left</Label>
            <Input type="number" value={structure.props.paddingLeft} onChange={(e) => updateStructureProps(stripeId, structureId, { paddingLeft: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Padding Right</Label>
            <Input type="number" value={structure.props.paddingRight} onChange={(e) => updateStructureProps(stripeId, structureId, { paddingRight: Number(e.target.value) })} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ColumnInspector({ stripeId, structureId, columnId, stripes, updateColumnProps }: any) {
  const stripe = stripes.find((s: any) => s.id === stripeId);
  const structure = stripe?.structures.find((s: any) => s.id === structureId);
  const column = structure?.columns.find((c: any) => c.id === columnId);
  if (!column) return null;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <BoxSelect className="w-4 h-4 text-emerald-500" />
          Column Settings
        </h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Background Color</Label>
          <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
            <input 
              type="color" 
              className="w-full h-full border-none bg-transparent cursor-pointer"
              value={column.props.backgroundColor || "#ffffff"} 
              onChange={(e) => updateColumnProps(stripeId, structureId, columnId, { backgroundColor: e.target.value })} 
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Vertical Alignment</Label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            value={column.props.verticalAlign || 'top'} 
            onChange={(e) => updateColumnProps(stripeId, structureId, columnId, { verticalAlign: e.target.value })}
          >
            <option value="top">Top</option>
            <option value="middle">Middle</option>
            <option value="bottom">Bottom</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Padding Top</Label>
            <Input type="number" value={column.props.paddingTop} onChange={(e) => updateColumnProps(stripeId, structureId, columnId, { paddingTop: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Padding Bottom</Label>
            <Input type="number" value={column.props.paddingBottom} onChange={(e) => updateColumnProps(stripeId, structureId, columnId, { paddingBottom: Number(e.target.value) })} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Padding Left</Label>
            <Input type="number" value={column.props.paddingLeft} onChange={(e) => updateColumnProps(stripeId, structureId, columnId, { paddingLeft: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Padding Right</Label>
            <Input type="number" value={column.props.paddingRight} onChange={(e) => updateColumnProps(stripeId, structureId, columnId, { paddingRight: Number(e.target.value) })} />
          </div>
        </div>
      </div>
    </div>
  );
}

function GlobalStylesInspector() {
  const { globalStyles, updateGlobalStyles } = useEditorStore();

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <Paintbrush className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-semibold">Global Styles</h3>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Canvas Width (px)</Label>
          <Input 
            type="number" 
            value={globalStyles.contentWidth} 
            onChange={(e) => updateGlobalStyles({ contentWidth: Number(e.target.value) })} 
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Body Color</Label>
            <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
              <input 
                type="color" 
                className="w-full h-full border-none bg-transparent cursor-pointer"
                value={globalStyles.bodyBackgroundColor} 
                onChange={(e) => updateGlobalStyles({ bodyBackgroundColor: e.target.value })} 
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Content Color</Label>
            <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
              <input 
                type="color" 
                className="w-full h-full border-none bg-transparent cursor-pointer"
                value={globalStyles.contentBackgroundColor} 
                onChange={(e) => updateGlobalStyles({ contentBackgroundColor: e.target.value })} 
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Font Family</Label>
          <select 
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
            value={globalStyles.defaultFontFamily} 
            onChange={(e) => updateGlobalStyles({ defaultFontFamily: e.target.value })}
          >
            <option value="Inter, sans-serif">Inter</option>
            <option value="Arial, sans-serif">Arial</option>
            <option value="'Helvetica Neue', Helvetica, sans-serif">Helvetica</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="'Times New Roman', Times, serif">Times New Roman</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Font Size</Label>
            <Input 
              type="number" 
              value={globalStyles.defaultFontSize} 
              onChange={(e) => updateGlobalStyles({ defaultFontSize: Number(e.target.value) })} 
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Text Color</Label>
            <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
              <input 
                type="color" 
                className="w-full h-full border-none bg-transparent cursor-pointer"
                value={globalStyles.defaultTextColor} 
                onChange={(e) => updateGlobalStyles({ defaultTextColor: e.target.value })} 
              />
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Link Color</Label>
          <div className="flex h-9 w-full rounded-md border border-input bg-background px-1 py-1">
            <input 
              type="color" 
              className="w-full h-full border-none bg-transparent cursor-pointer"
              value={globalStyles.linkColor} 
              onChange={(e) => updateGlobalStyles({ linkColor: e.target.value })} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SidebarRight() {
  const { selectedNode, stripes, updateBlock, removeBlock, updateStructureProps, removeStructure, updateColumnProps, updateStripeProps, removeStripe } = useEditorStore();

  let content = <GlobalStylesInspector />;

  if (selectedNode) {
    if (selectedNode.type === 'stripe') {
      content = <StripeInspector stripeId={selectedNode.stripeId} stripes={stripes} updateStripeProps={updateStripeProps} removeStripe={removeStripe} />;
    } else if (selectedNode.type === 'structure') {
      content = <StructureInspector stripeId={selectedNode.stripeId} structureId={selectedNode.structureId} stripes={stripes} updateStructureProps={updateStructureProps} removeStructure={removeStructure} />;
    } else if (selectedNode.type === 'column') {
      content = <ColumnInspector stripeId={selectedNode.stripeId} structureId={selectedNode.structureId} columnId={selectedNode.columnId} stripes={stripes} updateColumnProps={updateColumnProps} />;
    } else if (selectedNode.type === 'block') {
      const stripe = stripes.find(s => s.id === selectedNode.stripeId);
      const structure = stripe?.structures.find(s => s.id === selectedNode.structureId);
      const column = structure?.columns.find(c => c.id === selectedNode.columnId);
      const block = column?.blocks.find(b => b.id === selectedNode.blockId);

      if (block) {
        const config = BLOCK_REGISTRY[block.type];
        if (config) {
          content = (
            <div className="p-4 space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <h3 className="text-sm font-semibold flex items-center gap-2">
                  <Settings2 className="w-4 h-4 text-blue-500" />
                  {config.label} Settings
                </h3>
                <button onClick={() => removeBlock(selectedNode.stripeId, selectedNode.structureId, selectedNode.columnId, selectedNode.blockId)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              {config.renderInspector({
                block,
                onChange: (props) => updateBlock(selectedNode.stripeId, selectedNode.structureId, selectedNode.columnId, selectedNode.blockId, props),
              })}
            </div>
          );
        }
      }
    }
  }

  return (
    <div className="w-80 border-l border-border bg-card h-full flex flex-col z-10 shrink-0 hidden lg:flex">
      <Tabs defaultValue="inspector" className="flex-1 flex flex-col">
        <TabsList className="w-full justify-start rounded-none border-b border-border h-12 px-4 bg-transparent">
          <TabsTrigger value="inspector" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none px-4">
            Inspector
          </TabsTrigger>
        </TabsList>
        <TabsContent value="inspector" className="flex-1 overflow-y-auto m-0">
          {content}
        </TabsContent>
      </Tabs>
    </div>
  );
}

"use client";

import { useEditorStore } from "@/lib/editor/store";
import { BLOCK_REGISTRY } from "@/lib/editor/registry";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings2, Paintbrush, BoxSelect, Trash2, Rows, AlignLeft, AlignCenter, AlignRight, Plus, Minus } from "lucide-react";
import { Switch } from "@/components/ui/switch";

import { StripeInspector } from "./inspectors/stripe-inspector";
import { StructureInspector } from "./inspectors/structure-inspector";
import { ColumnInspector } from "./inspectors/column-inspector";
import { GlobalStylesInspector } from "./inspectors/global-styles-inspector";

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

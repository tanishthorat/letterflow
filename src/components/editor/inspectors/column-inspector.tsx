"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BoxSelect } from "lucide-react";

export function ColumnInspector({ stripeId, structureId, columnId, stripes, updateColumnProps }: any) {
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
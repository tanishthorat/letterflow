"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { BoxSelect, Trash2, Lock, Unlock, Plus, Minus } from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";

function SpacingControl({ 
  label, 
  top, right, bottom, left, 
  onChangeTop, onChangeRight, onChangeBottom, onChangeLeft,
  onChangeAll
}: {
  label: string,
  top: number, right: number, bottom: number, left: number,
  onChangeTop: (v: number) => void,
  onChangeRight: (v: number) => void,
  onChangeBottom: (v: number) => void,
  onChangeLeft: (v: number) => void,
  onChangeAll: (v: number) => void,
}) {
  const [isLocked, setIsLocked] = useState(false);

  const handleTop = (v: number) => { if(isLocked) onChangeAll(v); else onChangeTop(v); };
  const handleRight = (v: number) => { if(isLocked) onChangeAll(v); else onChangeRight(v); };
  const handleBottom = (v: number) => { if(isLocked) onChangeAll(v); else onChangeBottom(v); };
  const handleLeft = (v: number) => { if(isLocked) onChangeAll(v); else onChangeLeft(v); };

  const NumberInput = ({ val, onChange }: { val: number, onChange: (v: number) => void }) => (
    <div className="flex items-center bg-zinc-900 rounded-full border border-zinc-800 shrink-0 shadow-sm">
      <button 
        className="px-2 py-1 hover:bg-zinc-800 rounded-l-full text-zinc-400 hover:text-white transition-colors"
        onClick={() => onChange(Math.max(0, val - 1))}
      >
        <Minus className="w-3 h-3" />
      </button>
      <span className="w-8 text-center text-xs font-medium text-white">{val}</span>
      <button 
        className="px-2 py-1 hover:bg-zinc-800 rounded-r-full text-zinc-400 hover:text-white transition-colors"
        onClick={() => onChange(val + 1)}
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        <Label className="text-xs font-medium text-zinc-300">{label}</Label>
      </div>

      <div className="relative flex flex-col items-center gap-2 py-2">
        {/* Connection lines when locked */}
        {isLocked && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
             <div className="w-24 h-24 border border-emerald-500/30 rounded-full" />
             <div className="absolute w-full h-px bg-emerald-500/30" />
             <div className="absolute h-full w-px bg-emerald-500/30" />
          </div>
        )}

        <NumberInput val={top} onChange={handleTop} />
        <div className="flex items-center justify-between w-full max-w-[200px] px-2 relative z-10">
          <NumberInput val={left} onChange={handleLeft} />
          
          <button 
            className={`p-2 rounded-full border transition-colors ${isLocked ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-700'}`}
            onClick={() => setIsLocked(!isLocked)}
          >
            {isLocked ? <Lock className="w-4 h-4" /> : <Unlock className="w-4 h-4" />}
          </button>

          <NumberInput val={right} onChange={handleRight} />
        </div>
        <NumberInput val={bottom} onChange={handleBottom} />
      </div>
    </div>
  );
}


export function StructureInspector({ stripeId, structureId, stripes, updateStructureProps, removeStructure }: any) {
  const stripe = stripes.find((s: any) => s.id === stripeId);
  const structure = stripe?.structures.find((s: any) => s.id === structureId);
  if (!structure) return null;

  return (
    <div className="p-4 space-y-6 text-zinc-100">
      <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <BoxSelect className="w-4 h-4 text-orange-500" />
          Structure Settings
        </h3>
        <button onClick={() => removeStructure(stripeId, structureId)} className="text-red-500 hover:bg-red-500/10 p-1.5 rounded-md transition-colors">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-6 divide-y divide-zinc-800">

        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <Label className="text-xs font-medium text-zinc-300">Containers Gap on Desktop</Label>
            </div>
            <div className="flex items-center bg-zinc-900 rounded-full border border-zinc-800 shadow-sm">
              <button 
                className="px-2 py-1 hover:bg-zinc-800 rounded-l-full text-zinc-400 hover:text-white transition-colors"
                onClick={() => updateStructureProps(stripeId, structureId, { columnGap: Math.max(0, (structure.props.columnGap || 0) - 1) })}
              >
                <Minus className="w-3 h-3" />
              </button>
              <span className="w-8 text-center text-xs font-medium text-white">{structure.props.columnGap || 0}</span>
              <button 
                className="px-2 py-1 hover:bg-zinc-800 rounded-r-full text-zinc-400 hover:text-white transition-colors"
                onClick={() => updateStructureProps(stripeId, structureId, { columnGap: (structure.props.columnGap || 0) + 1 })}
              >
                <Plus className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <SpacingControl 
            label="Padding on Desktop"
            top={structure.props.paddingTop || 0}
            right={structure.props.paddingRight || 0}
            bottom={structure.props.paddingBottom || 0}
            left={structure.props.paddingLeft || 0}
            onChangeTop={(v) => updateStructureProps(stripeId, structureId, { paddingTop: v })}
            onChangeRight={(v) => updateStructureProps(stripeId, structureId, { paddingRight: v })}
            onChangeBottom={(v) => updateStructureProps(stripeId, structureId, { paddingBottom: v })}
            onChangeLeft={(v) => updateStructureProps(stripeId, structureId, { paddingLeft: v })}
            onChangeAll={(v) => updateStructureProps(stripeId, structureId, { paddingTop: v, paddingRight: v, paddingBottom: v, paddingLeft: v })}
          />
        </div>

        <div className="pt-6">
          <SpacingControl 
            label="Margins on Desktop"
            top={structure.props.marginTop || 0}
            right={structure.props.marginRight || 0}
            bottom={structure.props.marginBottom || 0}
            left={structure.props.marginLeft || 0}
            onChangeTop={(v) => updateStructureProps(stripeId, structureId, { marginTop: v })}
            onChangeRight={(v) => updateStructureProps(stripeId, structureId, { marginRight: v })}
            onChangeBottom={(v) => updateStructureProps(stripeId, structureId, { marginBottom: v })}
            onChangeLeft={(v) => updateStructureProps(stripeId, structureId, { marginLeft: v })}
            onChangeAll={(v) => updateStructureProps(stripeId, structureId, { marginTop: v, marginRight: v, marginBottom: v, marginLeft: v })}
          />
        </div>

        <div className="pt-4 space-y-4">
          <Label className="text-xs font-medium text-zinc-300">Background Color</Label>
          <div className="flex h-9 w-full rounded-md border border-zinc-800 bg-zinc-900 px-1 py-1">
            <input 
              type="color" 
              className="w-full h-full border-none bg-transparent cursor-pointer"
              value={structure.props.backgroundColor !== "transparent" ? structure.props.backgroundColor : "#ffffff"} 
              onChange={(e) => updateStructureProps(stripeId, structureId, { backgroundColor: e.target.value })} 
            />
          </div>
        </div>

      </div>
    </div>
  );
}
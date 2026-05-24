"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { BoxSelect, Trash2, Lock, Unlock } from "lucide-react";
import { useEditorStore } from "@/lib/editor/store";
import { ColorPicker } from "@/components/ui/color-picker";
import { NumberStepper } from "@/components/ui/number-stepper";
import { SpacingControl } from "@/components/ui/spacing-control";



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

      <div className="space-y-4">

        <div className="pt-4 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <Label className="text-xs font-medium text-zinc-300">Containers Gap on Desktop</Label>
            </div>
            <NumberStepper
              value={structure.props.columnGap || 0}
              onChange={(val) => updateStructureProps(stripeId, structureId, { columnGap: val })}
              min={0}
              max={100}
              step={1}
              className="w-24 h-8"
            />
          </div>
        </div>

        <div className="">
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

        <div className="">
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

        <div className="space-y-2">
          <Label className="text-xs font-medium text-zinc-300">Background Color</Label>
          <ColorPicker
            value={structure.props.backgroundColor}
            onChange={(color) => updateStructureProps(stripeId, structureId, { backgroundColor: color })}
          />
        </div>

      </div>
    </div>
  );
}
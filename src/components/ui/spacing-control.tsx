"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Lock, Unlock } from "lucide-react";
import { NumberStepper } from "@/components/ui/number-stepper";

interface SpacingControlProps {
  label: string;
  top: number;
  right: number;
  bottom: number;
  left: number;
  linked?: boolean;
  onChangeTop: (v: number) => void;
  onChangeRight: (v: number) => void;
  onChangeBottom: (v: number) => void;
  onChangeLeft: (v: number) => void;
  onChangeAll: (v: number) => void;
  onToggleLink?: (linked: boolean) => void;
}

export function SpacingControl({
  label,
  top, right, bottom, left,
  linked,
  onChangeTop, onChangeRight, onChangeBottom, onChangeLeft,
  onChangeAll,
  onToggleLink
}: SpacingControlProps) {
  const [internalLocked, setInternalLocked] = useState(linked ?? true);
  const isLocked = linked !== undefined ? linked : internalLocked;

  const handleToggleLock = () => {
    const newValue = !isLocked;
    setInternalLocked(newValue);
    if (onToggleLink) {
      onToggleLink(newValue);
    }
  };

  const handleTop = (v: number) => { if (isLocked) onChangeAll(v); else onChangeTop(v); };
  const handleRight = (v: number) => { if (isLocked) onChangeAll(v); else onChangeRight(v); };
  const handleBottom = (v: number) => { if (isLocked) onChangeAll(v); else onChangeBottom(v); };
  const handleLeft = (v: number) => { if (isLocked) onChangeAll(v); else onChangeLeft(v); };

  const baseLabel = label.split(" ")[0]; // "Padding" or "Margin"

  return (
    <div className="space-y-3">
      {/* Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <Label className="text-xs font-semibold text-muted-foreground">{label}</Label>
        </div>

        {/* Figma Style Lock/Unlock Toggle */}
        <button
          type="button"
          title={isLocked ? "Unlock side values" : "Lock values together"}
          className={`p-1.5 rounded-md border transition-colors cursor-pointer ${isLocked
            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 hover:bg-emerald-500/20'
            : 'bg-secondary border-border text-muted-foreground hover:text-foreground hover:bg-secondary/80'
            }`}
          onClick={handleToggleLock}
        >
          {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Inputs Layout */}
      {isLocked ? (
        <div className="flex items-center justify-between gap-4 p-2.5 rounded-lg border border-border">
          <span className="text-xs text-muted-foreground font-medium pl-1">All Sides</span>
          <NumberStepper
            value={top}
            onChange={onChangeAll}
            min={0}
            max={200}
            step={1}
            className="w-28 h-8"
          />
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 p-2.5 rounded-lg border border-border">
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground font-medium">{baseLabel} Top</span>
            <NumberStepper
              value={top}
              onChange={handleTop}
              min={0}
              max={200}
              step={1}
              className="w-full h-8"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground font-medium">{baseLabel} Bottom</span>
            <NumberStepper
              value={bottom}
              onChange={handleBottom}
              min={0}
              max={200}
              step={1}
              className="w-full h-8"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground font-medium">{baseLabel} Left</span>
            <NumberStepper
              value={left}
              onChange={handleLeft}
              min={0}
              max={200}
              step={1}
              className="w-full h-8"
            />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] text-muted-foreground font-medium">{baseLabel} Right</span>
            <NumberStepper
              value={right}
              onChange={handleRight}
              min={0}
              max={200}
              step={1}
              className="w-full h-8"
            />
          </div>
        </div>
      )}
    </div>
  );
}

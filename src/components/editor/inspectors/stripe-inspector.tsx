"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trash2, Rows } from "lucide-react";
import { ColorPicker } from "@/components/ui/color-picker";
import { NumberStepper } from "@/components/ui/number-stepper";
import { Switch } from "@/components/ui/switch";

export function StripeInspector({ stripeId, stripes, updateStripeProps, updateStripe, removeStripe }: any) {
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
          <Input type="text" value={stripe.label || ""} onChange={(e) => updateStripe(stripeId, { label: e.target.value })} />
        </div>
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground">Background Color</Label>
          <ColorPicker 
            value={stripe.props.backgroundColor} 
            onChange={(color) => updateStripeProps(stripeId, { backgroundColor: color })} 
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Padding Top (px)</Label>
            <NumberStepper 
              value={stripe.props.paddingTop || 0} 
              onChange={(val) => updateStripeProps(stripeId, { paddingTop: val })} 
              min={0}
              max={200}
              step={5}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Padding Bottom (px)</Label>
            <NumberStepper 
              value={stripe.props.paddingBottom || 0} 
              onChange={(val) => updateStripeProps(stripeId, { paddingBottom: val })} 
              min={0}
              max={200}
              step={5}
            />
          </div>
        </div>
        <div className="flex items-center justify-between py-2 border-t border-border">
          <Label htmlFor="fullWidth" className="text-xs font-medium">Full Width Background</Label>
          <Switch 
            id="fullWidth" 
            checked={!!stripe.props.fullWidth} 
            onCheckedChange={(checked) => updateStripeProps(stripeId, { fullWidth: checked })} 
          />
        </div>
      </div>
    </div>
  );
}
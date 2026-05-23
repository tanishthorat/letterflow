"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Trash2, Rows } from "lucide-react";

export function StripeInspector({ stripeId, stripes, updateStripeProps, removeStripe }: any) {
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
"use client";

import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ExternalLink, X } from "lucide-react";

interface LinkInputProps {
  linkType: "url" | "email" | "phone" | "sms";
  href: string;
  onChange: (updates: { linkType?: "url" | "email" | "phone" | "sms"; href?: string }) => void;
}

const linkPrefixMap: Record<string, string> = {
  url: "",
  email: "mailto:",
  phone: "tel:",
  sms: "sms:",
};

export function LinkInput({ linkType, href, onChange }: LinkInputProps) {
  const [localValue, setLocalValue] = useState("");

  // Sync incoming href to local display value
  useEffect(() => {
    const prefix = linkPrefixMap[linkType] ?? "";
    if (linkType !== "url" && prefix && href.startsWith(prefix)) {
      setLocalValue(href.slice(prefix.length));
    } else {
      setLocalValue(href);
    }
  }, [href, linkType]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalValue(val);

    if (linkType === "url") {
      onChange({ href: val });
    } else {
      const prefix = linkPrefixMap[linkType] ?? "";
      onChange({ href: val ? `${prefix}${val}` : "" });
    }
  };

  const handleBlur = () => {
    if (linkType === "url" && localValue) {
      // Auto-prefix with https:// if user omitted protocol and it's not a special link
      if (!/^https?:\/\//i.test(localValue) && !localValue.startsWith("#") && !localValue.startsWith("mailto:") && !localValue.startsWith("tel:")) {
        const corrected = `https://${localValue}`;
        setLocalValue(corrected);
        onChange({ href: corrected });
      }
    }
  };

  const clearInput = () => {
    setLocalValue("");
    onChange({ href: "" });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-foreground">Link</Label>
      </div>
      <div className="flex rounded-md border border-input overflow-hidden focus-within:ring-1 focus-within:ring-ring">
        <Select
          value={linkType || "url"}
          onValueChange={(val: any) => {
            onChange({ linkType: val, href: "" });
            setLocalValue("");
          }}
        >
          <SelectTrigger className="w-20 h-9 border-0 border-r border-input rounded-none bg-muted focus:ring-0 focus:ring-offset-0 font-medium text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="url">Site</SelectItem>
            <SelectItem value="email">Mail</SelectItem>
            <SelectItem value="phone">Phone</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
          </SelectContent>
        </Select>

        <div className="relative flex-1 flex items-center bg-background">
          <Input
            type="text"
            placeholder={
              linkType === "email" ? "name@example.com" :
                linkType === "phone" ? "+1234567890" :
                  linkType === "sms" ? "+1234567890" :
                    "https://..."
            }
            value={localValue}
            onChange={handleChange}
            onBlur={handleBlur}
            className="border-0 h-9 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0 pr-8 bg-transparent text-xs"
          />
          {localValue && (
            <button
              type="button"
              onClick={clearInput}
              className="absolute right-2 flex items-center justify-center w-4 h-4 rounded bg-muted-foreground/30 text-foreground hover:bg-muted-foreground/50 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

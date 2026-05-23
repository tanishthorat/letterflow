"use client";

import { useState, useEffect, useRef } from "react";
import { useEditorStore } from "@/lib/editor/store";
import { X, Loader2, Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PreviewModal({ isOpen, onClose }: PreviewModalProps) {
  const [html, setHtml] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const { getDesign } = useEditorStore();

  useEffect(() => {
    if (isOpen) {
      const fetchPreview = async () => {
        setLoading(true);
        setHtml(null);
        try {
          const design = getDesign();
          const res = await fetch("/api/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(design),
          });
          if (res.ok) {
            const htmlContent = await res.text();
            setHtml(htmlContent);
          }
        } catch (error) {
          console.error("Preview generation failed", error);
        } finally {
          setLoading(false);
        }
      };

      fetchPreview();
    }
  }, [isOpen, getDesign]);

  useEffect(() => {
    // Write the raw HTML directly to the iframe document
    if (iframeRef.current && html) {
      const doc = iframeRef.current.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(html);
        doc.close();
      }
    }
  }, [html]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-background/95 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="font-semibold text-foreground">Email Preview</h2>
          {loading && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground ml-2" />}
        </div>
        
        <div className="flex items-center bg-muted rounded-md p-1">
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-7 px-3 text-xs gap-2 rounded-sm", viewMode === "desktop" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
            onClick={() => setViewMode("desktop")}
          >
            <Monitor className="w-4 h-4" />
            Desktop
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={cn("h-7 px-3 text-xs gap-2 rounded-sm", viewMode === "mobile" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground")}
            onClick={() => setViewMode("mobile")}
          >
            <Smartphone className="w-4 h-4" />
            Mobile
          </Button>
        </div>

        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </Button>
      </div>
      
      <div className="flex-1 bg-muted/30 overflow-y-auto p-4 flex justify-center py-8">
        <div 
          className={cn(
            "bg-white shadow-2xl transition-all duration-300 rounded-md overflow-hidden flex flex-col border border-border/50",
            viewMode === "mobile" ? "w-[375px]" : "w-full max-w-[800px]"
          )}
        >
          <iframe 
            ref={iframeRef} 
            className="w-full h-full min-h-[600px] flex-1 bg-white" 
            title="Email Preview"
          />
        </div>
      </div>
    </div>
  );
}

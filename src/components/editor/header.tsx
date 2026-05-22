"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserNav } from "@/components/dashboard/user-nav";
import { useTemplateStore } from "@/lib/stores/template";
import { useEditorStore } from "@/lib/editor/store";
import { 
  ArrowLeft, CloudUpload, ChevronDown, Undo, History, Redo, 
  Monitor, Smartphone, Code, MonitorSmartphone, ClipboardCheck, 
  Upload, Share2, HelpCircle, Plus, Loader2
} from "lucide-react";
import type { EmailTemplate } from "@/lib/db.types";
import { CompactLogo } from "../ui/logo";

interface EditorHeaderProps {
  template: EmailTemplate;
}

export function EditorHeader({ template }: EditorHeaderProps) {
  const router = useRouter();
  const { updateTemplate } = useTemplateStore();
  const [name, setName] = useState(template.name);
  const [isSaving, setIsSaving] = useState(false);
  const [prevTemplateId, setPrevTemplateId] = useState(template.id);

  // Sync state if template changes (e.g. from undefined to loaded)
  // This approach avoids the generic useEffect set state warning.
  if (template?.id !== prevTemplateId) {
    setPrevTemplateId(template?.id);
    setName(template?.name || "");
  }

  const handleSave = async () => {
    if (!template) return;
    setIsSaving(true);
    
    // Get the latest design state from the Editor store
    const { getDesign, clearDirty } = useEditorStore.getState();
    const design = getDesign();
    
    await updateTemplate(template.id, { 
      name,
      body_design: { version: design.version, blocks: design.blocks },
      global_styles: design.globalStyles 
    });
    
    clearDirty();
    setIsSaving(false);
  };

  return (
    <header className="flex items-center justify-between px-4 h-18 border-b border-border bg-card relative z-50">
      {/* Left Section */}
      <div className="flex items-center gap-1 sm:gap-2">
        <Link href="/dashboard" className="flex items-center justify-center w-8 h-8 mr-1 sm:mr-2 text-primary hover:opacity-80 transition-opacity">
          <CompactLogo className="w8 h8" />
        </Link>

        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground hidden sm:flex" onClick={() => router.push("/dashboard/templates")}>
          <ArrowLeft className="w-4 h-4" />
        </Button>

        <div className="relative group flex items-center ml-1 sm:ml-2">
          <Input 
            value={name} 
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter email message name"
            className="h-8 w-37.5 sm:w-55 border-transparent bg-transparent hover:border-border focus-visible:bg-background focus-visible:border-primary focus-visible:ring-1 px-2 shadow-none font-medium"
          />
        </div>

        <div className="hidden md:flex items-center bg-muted/30 rounded-md border border-border p-0.5 ml-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-7 w-8 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <CloudUpload className="w-4 h-4" />}
          </Button>
          <div className="w-px h-4 bg-border mx-0.5" />
          <Button variant="ghost" size="icon" className="h-7 w-5 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground">
            <ChevronDown className="w-3 h-3" />
          </Button>
        </div>

        <div className="hidden lg:flex items-center bg-muted/30 rounded-md border border-border p-0.5 ml-2">
          <Button variant="ghost" size="icon" disabled className="h-7 w-8 rounded-sm opacity-50">
            <Undo className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-8 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground">
            <History className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="icon" disabled className="h-7 w-8 rounded-sm opacity-50">
            <Redo className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Center Section */}
      <div className="hidden md:flex items-center bg-muted/30 rounded-md border border-border p-0.5 absolute left-1/2 -translate-x-1/2">
        <Button variant="ghost" size="icon" className="h-7 w-8 rounded-sm bg-border text-foreground">
          <Monitor className="w-4 h-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-8 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground">
          <Smartphone className="w-4 h-4" />
        </Button>
        <div className="w-px h-4 bg-border mx-0.5" />
        <Button variant="ghost" size="icon" className="h-7 w-5 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground">
          <ChevronDown className="w-3 h-3" />
        </Button>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-1 sm:gap-1.5">
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground hidden lg:flex">
          <Code className="w-4 h-4" />
        </Button>

        <Button variant="ghost" size="sm" className="h-8 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground gap-2 px-3 hidden md:flex">
          <MonitorSmartphone className="w-4 h-4" />
          Preview
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground hidden lg:flex">
          <ClipboardCheck className="w-4 h-4" />
        </Button>

        <Button size="sm" className="h-8 rounded-md gap-2 px-3 sm:px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
          <Upload className="w-4 h-4" />
          <span className="hidden sm:inline-block">Export</span>
        </Button>

        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground mr-1 sm:mr-2 hidden lg:flex">
          <Share2 className="w-4 h-4" />
        </Button>

        <div className="flex items-center pl-2 sm:pl-4 border-l border-border gap-2 sm:gap-3">
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hidden sm:flex">
            <HelpCircle className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="icon" className="w-7 h-7 rounded-full border-dashed border-muted-foreground/50 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors hidden sm:flex">
            <Plus className="w-3 h-3" />
          </Button>

          <UserNav />
        </div>
      </div>
    </header>
  );
}

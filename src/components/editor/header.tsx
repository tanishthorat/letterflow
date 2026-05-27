"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserNav } from "@/components/dashboard/user-nav";
import { useTemplateStore } from "@/lib/stores/template";
import { useEditorStore } from "@/lib/editor/store";
import { useStore } from "zustand";
import { useDebounce } from "use-debounce";
import { PreviewModal, getMockDefault } from "@/components/editor/preview-modal";
import { ExportModal } from "./export-modal";
import { toast } from "@/lib/toast";
import { extractPlaceholders } from "@/lib/editor/placeholders";
import {
  ArrowLeft, CloudUpload, ChevronDown, Undo, History, Redo,
  Monitor, Smartphone, Code, MonitorSmartphone, ClipboardCheck,
  Upload, Share2, HelpCircle, Plus, Loader2, Check
} from "lucide-react";
import type { EmailTemplate } from "@/lib/db.types";
import { CompactLogo } from "../ui/logo";

interface EditorHeaderProps {
  template: EmailTemplate;
}

export function EditorHeader({ template }: EditorHeaderProps) {
  const router = useRouter();
  const { updateTemplate } = useTemplateStore();
  const { isDirty, getDesign, clearDirty, globalStyles, metadata, viewMode, setViewMode } = useEditorStore();
  const { undo, redo, pastStates, futureStates } = useStore(useEditorStore.temporal, (state) => state);

  const [name, setName] = useState(template.name);
  const [debouncedName] = useDebounce(name, 1000);

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "unsaved" | "error">("saved");
  const [prevTemplateId, setPrevTemplateId] = useState(template.id);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [isExportOpen, setIsExportOpen] = useState(false);

  // Sync state if template changes (e.g. from undefined to loaded)
  if (template?.id !== prevTemplateId) {
    setPrevTemplateId(template?.id);
    setName(template?.name || "");
  }

  // Client-side name validation (mirrors DB constraint: 2–120 chars)
  const isNameTooShort = name.trim().length > 0 && name.trim().length < 2;
  const isNameEmpty = name.trim().length === 0;
  const isNameInvalid = isNameEmpty || isNameTooShort;

  // Handle autosave
  useEffect(() => {
    if (!template?.id) return;

    // Only trigger autosave if name has changed from template or if editor blocks/styles are dirty
    if (debouncedName !== template.name || isDirty) {
      // Skip autosave if name doesn't meet DB constraint (2–120 chars)
      if (debouncedName.trim().length < 2) return;

      const timeoutId = setTimeout(async () => {
        setSaveStatus("saving");
        const design = getDesign();

        try {
          await updateTemplate(template.id, {
            name: debouncedName.trim(),
            body_design: design,
            global_styles: design.globalStyles,
            subject: metadata.subject || undefined,
            preheader: metadata.preheader || undefined,
            status: metadata.status || "draft"
          });

          clearDirty();
          setSaveStatus("saved");
        } catch (error) {
          console.error("Autosave failed", error);
          setSaveStatus("error");
          toast.error("Autosave failed", {
            description: error instanceof Error ? error.message : "Changes may not have been saved.",
          });
        }
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [debouncedName, isDirty, globalStyles, metadata, template.name, template.id, getDesign, clearDirty, updateTemplate]);

  // Prevent accidental navigation if unsaved
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty || saveStatus === "saving" || saveStatus === "unsaved") {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, saveStatus]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check for Ctrl+Z or Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          e.preventDefault();
          redo();
        } else {
          e.preventDefault();
          undo();
        }
      }
      // Check for Ctrl+Y or Cmd+Y
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  // Derived state to replace redundant useEffect that triggered cascading renders
  const currentSaveStatus = isSaving || saveStatus === "saving" ? "saving" :
    saveStatus === "error" ? "error" :
      (isDirty || name !== template?.name) ? "unsaved" : "saved";

  const handleManualSave = async () => {
    if (!template || saveStatus === "saving") return;

    // Guard: don't send invalid name to Supabase
    if (name.trim().length < 2) {
      toast.error("Name too short", {
        description: "Template name must be at least 2 characters.",
      });
      return;
    }

    setIsSaving(true);
    setSaveStatus("saving");

    const design = getDesign();

    try {
      await updateTemplate(template.id, {
        name: name.trim(),
        body_design: { version: design.version, stripes: design.stripes },
        global_styles: design.globalStyles,
        subject: metadata.subject || undefined,
        preheader: metadata.preheader || undefined,
        status: metadata.status || "draft"
      });

      clearDirty();
      setSaveStatus("saved");
      toast.success("Template saved!");
    } catch (error) {
      console.error("Save failed", error);
      setSaveStatus("error");
      toast.error("Save failed", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewClick = async () => {
    if (isPreviewLoading) return;
    setIsPreviewLoading(true);
    try {
      const design = getDesign();
      const detected = extractPlaceholders(design);
      const initialVars: Record<string, string> = {};
      detected.forEach(key => {
        initialVars[key] = getMockDefault(key);
      });

      const res = await fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ design, variables: initialVars }),
      });
      if (res.ok) {
        const htmlContent = await res.text();
        setPreviewHtml(htmlContent);
        setIsPreviewOpen(true);
      } else {
        const errText = await res.text();
        console.error("Failed to generate preview:", errText);
        toast.error("Preview failed", { description: errText.slice(0, 120) });
      }
    } catch (error) {
      console.error("Preview generation failed", error);
      toast.error("Preview failed", {
        description: error instanceof Error ? error.message : "Could not render preview.",
      });
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const renderSaveStatusIcon = () => {
    if (currentSaveStatus === "saving") return <Loader2 className="w-4 h-4 animate-spin text-primary" />;
    if (currentSaveStatus === "error") return <CloudUpload className="w-4 h-4 text-destructive" />;
    if (currentSaveStatus === "unsaved") return <CloudUpload className="w-4 h-4 text-muted-foreground" />;
    return <Check className="w-4 h-4 text-green-500" />;
  };

  return (
    <>
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
              maxLength={120}
              errorAsPop
              error={
                isNameEmpty
                  ? "Name cannot be empty"
                  : isNameTooShort
                    ? "Name must be at least 2 characters"
                    : undefined
              }
              className={`h-8 w-37.5 sm:w-55 border-transparent bg-transparent hover:border-border focus-visible:bg-background focus-visible:ring-1 px-2 shadow-none font-medium ${isNameInvalid
                ? "focus-visible:border-destructive focus-visible:ring-destructive/30"
                : "focus-visible:border-primary"
                }`}
            />
          </div>

          <div className="hidden md:flex items-center bg-muted/30 rounded-md border border-border p-0.5 ml-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-8 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground"
              onClick={handleManualSave}
              disabled={currentSaveStatus === "saving"}
              title={currentSaveStatus === "unsaved" ? "Save changes" : currentSaveStatus === "saving" ? "Saving..." : currentSaveStatus === "error" ? "Save failed" : "Saved"}
            >
              {renderSaveStatusIcon()}
            </Button>
            <div className="w-px h-4 bg-border mx-0.5" />
            <Button variant="ghost" size="icon" className="h-7 w-5 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground">
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>

          <div className="hidden lg:flex items-center bg-muted/30 rounded-md border border-border p-0.5 ml-2">
            <Button variant="ghost" size="icon" disabled={pastStates.length === 0} onClick={() => undo()} className="h-7 w-8 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground">
              <Undo className="w-4 h-4" />
            </Button>
            {/* <Button variant="ghost" size="icon" className="h-7 w-8 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground">
              <History className="w-4 h-4" />
            </Button> */}
            <Button variant="ghost" size="icon" disabled={futureStates.length === 0} onClick={() => redo()} className="h-7 w-8 rounded-sm hover:bg-muted text-muted-foreground hover:text-foreground">
              <Redo className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Center Section */}
        <div className="hidden md:flex items-center bg-muted/30 rounded-md border border-border p-0.5 absolute left-1/2 -translate-x-1/2">
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-7 w-8 rounded-sm ${viewMode === 'desktop' ? 'bg-border text-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
            onClick={() => setViewMode('desktop')}
          >
            <Monitor className="w-4 h-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className={`h-7 w-8 rounded-sm ${viewMode === 'mobile' ? 'bg-border text-foreground shadow-sm' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
            onClick={() => setViewMode('mobile')}
          >
            <Smartphone className="w-4 h-4" />
          </Button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 sm:gap-1.5">

          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground gap-2 px-3 hidden md:flex cursor-pointer"
            onClick={handlePreviewClick}
            disabled={isPreviewLoading}
          >
            {isPreviewLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <MonitorSmartphone className="w-4 h-4" />
            )}
            Preview
          </Button>

          <PreviewModal
            isOpen={isPreviewOpen}
            onClose={() => setIsPreviewOpen(false)}
            templateName={name}
            initialHtml={previewHtml}
          />

          {/* <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground hidden lg:flex">
            <ClipboardCheck className="w-4 h-4" />
          </Button> */}

          <Button
            size="sm"
            onClick={() => setIsExportOpen(true)}
            className="h-8 rounded-md gap-2 px-3 sm:px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-medium cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span className="hidden sm:inline-block">Export</span>
          </Button>

          <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} templateName={name} />

          <div className="flex items-center pl-2 sm:pl-4 border-l border-border gap-2 sm:gap-3">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-md text-muted-foreground hover:text-foreground hidden sm:flex">
              <HelpCircle className="w-4 h-4" />
            </Button>

            {/* for collab featue in future */}
            {/* <Button variant="outline" size="icon" className="w-7 h-7 rounded-full border-dashed border-muted-foreground/50 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors hidden sm:flex">
              <Plus className="w-3 h-3" />
            </Button> */}

            <UserNav />
          </div>
        </div>
      </header>
    </>
  )
}

"use client";

import { useEffect, useMemo, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTemplateStore } from "@/lib/stores/template";
import { useEditorStore } from "@/lib/editor/store";
import { Button } from "@/components/ui/button";
import { EditorHeader } from "@/components/editor/header";
import { SidebarLeft } from "@/components/editor/sidebar-left";
import { SidebarRight } from "@/components/editor/sidebar-right";
import { Canvas } from "@/components/editor/canvas";
import type { EmailTemplate } from "@/lib/db.types";
import { EditorLoader } from "@/components/editor/editor-loader";

import { EditorDndWrapper } from "@/components/editor/dnd-wrapper";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { templates, fetchTemplates, loading } = useTemplateStore();
  const hasLoadedDesign = useRef(false);

  const template = useMemo<EmailTemplate | undefined>(() => {
    return templates.find((t) => t.id === id);
  }, [templates, id]);

  useEffect(() => {
    if (templates.length === 0) {
      fetchTemplates();
    }
  }, [templates.length, fetchTemplates]);

  // Load the design into the editor store when the template is ready
  useEffect(() => {
    if (template && !hasLoadedDesign.current) {
      useEditorStore.getState().loadDesign(template.body_design, template.global_styles, {
        subject: template.subject,
        preheader: template.preheader,
        status: template.status as "draft" | "published" | "archived",
        category: template.category
      });
      hasLoadedDesign.current = true;
    }
  }, [template]);

  if (loading && !template) {
    return <EditorLoader />;
  }

  if (!template && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4 text-muted-foreground">Template not found</p>
        <Button onClick={() => router.push("/dashboard/templates")}>Back to Dashboard</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background overflow-hidden">
      {template && <EditorHeader template={template} />}

      {/* Editor Shell */}
      <EditorDndWrapper>
        <div className="flex-1 flex overflow-hidden">
          <SidebarLeft />
          <Canvas />
          <SidebarRight />
        </div>
      </EditorDndWrapper>
    </div>
  );
}

"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTemplateStore } from "@/lib/stores/template";
import { Button } from "@/components/ui/button";
import { EditorHeader } from "@/components/editor/header";
import type { EmailTemplate } from "@/lib/db.types";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { templates, fetchTemplates, loading } = useTemplateStore();
  
  const template = useMemo<EmailTemplate | undefined>(() => {
    return templates.find((t) => t.id === id);
  }, [templates, id]);

  useEffect(() => {
    if (templates.length === 0) {
      fetchTemplates();
    }
  }, [templates.length, fetchTemplates]);

  if (loading && !template) {
    return <div className="flex items-center justify-center min-h-screen">Loading editor...</div>;
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
    <div className="flex flex-col min-h-screen bg-background">
      {template && <EditorHeader template={template} />}

      {/* Editor Workspace Placeholder */}
      <main className="flex-1 bg-muted p-8 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Editor Workspace</h2>
          <p className="text-muted-foreground">Editing Template ID: {id}</p>
        </div>
      </main>
    </div>
  );
}

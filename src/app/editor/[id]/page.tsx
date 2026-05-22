"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTemplateStore } from "@/lib/stores/template";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditorPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const { templates, fetchTemplates, loading } = useTemplateStore();
  const [template, setTemplate] = useState<any>(null);

  useEffect(() => {
    if (templates.length === 0) {
      fetchTemplates();
    }
  }, [templates.length, fetchTemplates]);

  useEffect(() => {
    if (templates.length > 0) {
      const found = templates.find((t) => t.id === id);
      if (found) {
        setTemplate(found);
      }
    }
  }, [templates, id]);

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
    <div className="flex flex-col min-h-screen">
      {/* Editor Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-background">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/templates")}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-lg font-semibold">{template?.name || "Untitled Template"}</h1>
            <p className="text-xs text-muted-foreground">Status: {template?.status}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">Preview</Button>
          <Button>Save changes</Button>
        </div>
      </header>

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

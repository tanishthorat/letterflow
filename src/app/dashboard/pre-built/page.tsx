"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PRE_BUILT_TEMPLATES, PreBuiltTemplate } from "@/lib/templates/pre-built";
import { useTemplateStore } from "@/lib/stores/template";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink } from "lucide-react";
import { TemplateCard } from "@/components/dashboard/template-card";

export default function PreBuiltTemplatesPage() {
  const router = useRouter();
  const { createTemplate } = useTemplateStore();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleUseTemplate = async (template: PreBuiltTemplate) => {
    setLoadingId(template.id);
    try {
      const newTemplate = await createTemplate({
        name: `${template.name} (Draft)`,
        category: template.category,
        body_design: template.design as any, // Using the preset JSON
        global_styles: template.design.globalStyles as any,
      });

      if (newTemplate) {
        router.push(`/editor/${newTemplate.id}`);
      }
    } catch (error) {
      console.error("Error creating draft from pre-built template:", error);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pre-built Templates</h1>
        <p className="text-muted-foreground mt-2">
          Start your next email design with one of our ready-to-use, high-quality layouts.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {PRE_BUILT_TEMPLATES.map((template) => (
          <div key={template.id} className="relative group flex flex-col h-full">
            <TemplateCard
              template={template}
              isPreBuilt={true}
              onUseTemplate={() => handleUseTemplate(template)}
            />
            {/* Show a loading overlay if this specific template is being prepared */}
            {loadingId === template.id && (
              <div className="absolute inset-0 z-50 bg-background/50 backdrop-blur-sm flex flex-col items-center justify-center rounded-xl border border-border">
                <Loader2 className="w-6 h-6 animate-spin text-primary mb-2" />
                <span className="text-sm font-medium text-foreground">Preparing...</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

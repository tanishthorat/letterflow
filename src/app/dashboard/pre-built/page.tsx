"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PRE_BUILT_TEMPLATES, PreBuiltTemplate } from "@/lib/templates/pre-built";
import { useTemplateStore } from "@/lib/stores/template";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, ExternalLink } from "lucide-react";

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

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {PRE_BUILT_TEMPLATES.map((template) => (
          <Card key={template.id} className="flex flex-col hover:shadow-lg transition-shadow border-border/50">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <Badge variant="secondary" className="capitalize">{template.category}</Badge>
              </div>
              <CardTitle className="text-lg">{template.name}</CardTitle>
              <CardDescription className="line-clamp-2">{template.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 bg-muted/20 relative overflow-hidden flex items-center justify-center p-0 group">
               {/* We can use a miniature renderer or simple placeholder here */}
               {template.thumbnail ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={template.thumbnail} alt={template.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
               ) : (
                 <div className="w-full h-40 flex items-center justify-center text-muted-foreground bg-gradient-to-br from-muted/50 to-muted">
                    <span className="text-sm">Template Preview</span>
                 </div>
               )}
            </CardContent>
            <CardFooter className="pt-4 border-t border-border/50">
              <Button 
                onClick={() => handleUseTemplate(template)} 
                className="w-full"
                disabled={loadingId !== null}
              >
                {loadingId === template.id ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Use Template
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

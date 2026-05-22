"use client";

import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTemplateStore } from "@/lib/stores/template";

const TEMPLATE_OPTIONS = [
  {
    type: "empty",
    title: "Empty Email",
    description: "Create an email from scratch by using Blocks and Modules",
    lightImage: "https://my.stripo.email/resources/account/assets/images/empty-template_light.webp",
    darkImage: "https://my.stripo.email/resources/account/assets/images/empty-template_dark.webp",
  },
  {
    type: "basic",
    title: "Basic Templates",
    description: "Quick start with basic templates",
    lightImage: "https://my.stripo.email/resources/account/assets/images/basic-templates_light.webp",
    darkImage: "https://my.stripo.email/resources/account/assets/images/basic-templates_dark.webp",
  },
  {
    type: "prepared",
    title: "Pre-built Templates",
    description: "Edit and use right away any of templates",
    lightImage: "https://my.stripo.email/resources/account/assets/images/prepared-templates_light.webp",
    darkImage: "https://my.stripo.email/resources/account/assets/images/prepared-templates_dark.webp",
  }
];

export function EmptyTemplatesState() {
  const router = useRouter();
  const { createTemplate } = useTemplateStore();
  const [isCreating, setIsCreating] = useState<string | null>(null);

  const handleCreate = async (type: string, title: string) => {
    setIsCreating(type);
    try {
      const template = await createTemplate({
        name: `New ${title}`,
        category: "other",
      });
      
      if (template) {
        router.push(`/editor/${template.id}`);
      }
    } catch (error) {
      console.error("Failed to create template", error);
    } finally {
      setIsCreating(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center max-w-4xl mx-auto px-4">
      <h1 className="text-3xl font-semibold mb-4 text-foreground">Design Your First Email</h1>
      <p className="text-muted-foreground mb-12 max-w-lg mx-auto text-sm leading-relaxed">
        To get started on your first campaign, just select a template, update its content,
        and your email is ready to go. Export it to the ESP of your choice.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 w-full">
        {TEMPLATE_OPTIONS.map((option, index) => (
          <button 
            key={index}
            disabled={!!isCreating}
            onClick={() => handleCreate(option.type, option.title)}
            className="flex flex-col items-center p-6 bg-card border-2 border-border rounded-xl hover:border-primary/50 transition-colors text-left group relative disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreating === option.type && (
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            )}
            <div className="w-full h-56 relative mb-2 rounded-lg overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform">
              <Image 
                src={option.lightImage} 
                alt={option.title} 
                width={200} 
                height={160}
                className="object-contain dark:hidden"
              />
              <Image 
                src={option.darkImage} 
                alt={option.title} 
                width={200} 
                height={160}
                className="object-contain hidden dark:block"
              />
            </div>
            <div className="w-full">
              <h4 className="font-medium text-center text-lg mb-2 text-muted-foreground">{option.title}</h4>
              <p className="text-sm text-center text-muted-foreground leading-snug">
                {option.description}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Import Design for future*/}
      {/* <div className="flex items-center justify-between w-full max-w-2xl bg-card border border-border rounded-xl p-4 hover:border-primary/50 transition-colors">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-lg border border-border">
            <Download className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="text-left">
            <h4 className="font-semibold text-foreground">Import design</h4>
            <p className="text-sm text-muted-foreground">Start with existing designs</p>
          </div>
        </div>
        <Button variant="outline" className="bg-transparent hover:bg-muted/50 border-border">
          Choose import method
        </Button>
      </div> */}
    </div>
  );
}
"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  History, 
  SlidersHorizontal, 
  Tag, 
  LayoutGrid, 
  ArrowDown, 
  ChevronDown,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyTemplatesState } from "@/components/dashboard/templates/empty-state";
import { useTemplateStore } from "@/lib/stores/template";
import type { EmailTemplate } from "@/lib/db.types";

const SORT_LABELS: Record<string, string> = {
  name_asc: "Name (A-Z)",
  name_desc: "Name (Z-A)",
  date_desc: "Date Created",
  date_asc: "Oldest First",
  modified_desc: "Last Modified",
};

const CATEGORY_LABELS: Record<string, string> = {
  all: "All Tags",
  marketing: "Marketing",
  transactional: "Transactional",
  support: "Support",
  billing: "Billing",
  system: "System",
  other: "Other",
};

export default function TemplatesPage() {
  const router = useRouter();
  const { 
    templates, 
    fetchTemplates, 
    createTemplate, 
    loading, 
    searchQuery,
    sort, setSort,
    category, setCategory,
    viewMode, setViewMode,
    hasMore
  } = useTemplateStore();
  const [isCreating, setIsCreating] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          fetchTemplates(true);
        }
      },
      { threshold: 1.0 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    const currentTarget = observerTarget.current;
    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [observerTarget, hasMore, loading, fetchTemplates]);

  const handleCreateNew = async () => {
    setIsCreating(true);
    try {
      const template = await createTemplate({
        name: "Untitled Template",
        category: "other",
      });
      if (template) {
        router.push(`/editor/${template.id}`);
      }
    } catch (error) {
      console.error("Error creating template", error);
    } finally {
      setIsCreating(false);
    }
  };

  const statusBadgeColor = (status: EmailTemplate["status"]) => {
    switch (status) {
      case "published":
        return "bg-green-500/20 text-green-400";
      case "draft":
        return "bg-yellow-500/20 text-yellow-400";
      case "archived":
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading && templates.length === 0) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (templates.length === 0 && !searchQuery && category === "all") {
    return <EmptyTemplatesState />;
  }

  return (
    <div className="space-y-6">
      {/* Toolbar exactly matching image */}
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Emails</h1>
          <span className="flex items-center justify-center bg-muted text-muted-foreground text-[10px] font-medium rounded-full w-5 h-5">
            {templates.length}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-2 bg-muted/50 hover:bg-muted text-foreground rounded-md h-8 px-3">
            <History className="w-4 h-4" />
            Recents
          </Button>

          <Button variant="secondary" size="icon" className="bg-muted/50 hover:bg-muted rounded-md h-8 w-8">
            <SlidersHorizontal className="w-4 h-4" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2 bg-muted/50 hover:bg-muted rounded-md h-8 px-3">
                <Tag className="w-4 h-4" />
                {CATEGORY_LABELS[category] || "All Tags"}
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <DropdownMenuItem key={key} onClick={() => setCategory(key)}>
                  {label} {category === key && "✓"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2 bg-muted/50 hover:bg-muted rounded-md h-8 px-3">
                {viewMode === "grid" ? <LayoutGrid className="w-4 h-4" /> : <List className="w-4 h-4" />}
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => setViewMode("grid")}>
                Grid View {viewMode === "grid" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setViewMode("list")}>
                List View {viewMode === "list" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2 bg-muted/50 hover:bg-muted rounded-md h-8 px-3">
                <ArrowDown className="w-4 h-4" />
                {SORT_LABELS[sort] || "Sort"}
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {Object.entries(SORT_LABELS).map(([key, label]) => (
                <DropdownMenuItem key={key} onClick={() => setSort(key)}>
                  {label} {sort === key && "✓"}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Templates Grid/List */}
      {templates.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No templates found</p>
            <Button 
              onClick={handleCreateNew} 
              disabled={isCreating}
              className="bg-accent text-accent-foreground hover:bg-accent/90"
            >
              {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
              Create your first template
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {templates.map((template) => (
              <Card key={template.id} className="hover:border-accent/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <CardTitle className="text-base">{template.name}</CardTitle>
                    <Badge className={statusBadgeColor(template.status)} variant="secondary">
                      {template.status}
                    </Badge>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {template.subject || "No subject set"}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <Badge variant="outline">
                      {template.category}
                    </Badge>
                    <span>{template.placeholders?.length || 0} vars</span>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push(`/editor/${template.id}`)}
                  >
                    Edit
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Infinite scroll trigger */}
          <div ref={observerTarget} className="flex justify-center py-4">
            {hasMore && loading && <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />}
          </div>
        </>
      )}
    </div>
  );
}

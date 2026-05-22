"use client";

import { useEffect, useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  History, 
  SlidersHorizontal, 
  Tag, 
  LayoutGrid, 
  ArrowDown, 
  ChevronDown 
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

export default function TemplatesPage() {
  const router = useRouter();
  const { templates, fetchTemplates, createTemplate, loading, searchQuery } = useTemplateStore();
  const [debouncedSearch] = useDebounce(searchQuery, 300);
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

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

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        template.subject.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      return matchesSearch;
    });
  }, [templates, debouncedSearch]);

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

  if (templates.length === 0 && !searchQuery) {
    return <EmptyTemplatesState />;
  }

  return (
    <div className="space-y-6">
      {/* Toolbar exactly matching image */}
      <div className="flex items-center gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Emails</h1>
          <span className="flex items-center justify-center bg-muted text-muted-foreground text-[10px] font-medium rounded-full w-5 h-5">
            {filteredTemplates.length}
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
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>All Tags</DropdownMenuItem>
              <DropdownMenuItem>Marketing</DropdownMenuItem>
              <DropdownMenuItem>Transactional</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2 bg-muted/50 hover:bg-muted rounded-md h-8 px-3">
                <LayoutGrid className="w-4 h-4" />
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Grid View</DropdownMenuItem>
              <DropdownMenuItem>List View</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="sm" className="gap-2 bg-muted/50 hover:bg-muted rounded-md h-8 px-3">
                <ArrowDown className="w-4 h-4" />
                Name
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
              <DropdownMenuItem>Date Created</DropdownMenuItem>
              <DropdownMenuItem>Last Modified</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
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
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:border-accent/50 transition-colors cursor-pointer">
              <CardHeader>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <CardTitle className="text-base">{template.name}</CardTitle>
                  <Badge className={statusBadgeColor(template.status)} variant="secondary">
                    {template.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {template.subject}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <Badge variant="outline">
                    {template.category}
                  </Badge>
                  <span>{template.placeholders.length} vars</span>
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
      )}
    </div>
  );
}

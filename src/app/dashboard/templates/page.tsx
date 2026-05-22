"use client";

import { useEffect, useState, useMemo } from "react";
import { useDebounce } from "use-debounce";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyTemplatesState } from "@/components/dashboard/templates/empty-state";
import { useTemplateStore } from "@/lib/stores/template";
import type { EmailTemplate } from "@/lib/db.types";

type Category = EmailTemplate["category"] | "all";

export default function TemplatesPage() {
  const router = useRouter();
  const { templates, fetchTemplates, createTemplate, loading } = useTemplateStore();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");
  const [debouncedSearch] = useDebounce(search, 300);
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

  const categories: Category[] = [
    "all",
    "transactional",
    "marketing",
    "support",
    "billing",
    "system",
    "other",
  ];

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesSearch =
        template.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        template.subject.toLowerCase().includes(debouncedSearch.toLowerCase());

      const matchesCategory =
        selectedCategory === "all" || template.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [templates, debouncedSearch, selectedCategory]);

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

  if (templates.length === 0 && !search) {
    return <EmptyTemplatesState />;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Email Templates</h1>
          <p className="text-lg text-muted-foreground">
            Manage your email templates
          </p>
        </div>
        <Button 
          onClick={handleCreateNew} 
          disabled={isCreating}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          {isCreating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="w-5 h-5 absolute left-3 top-3 text-muted-foreground" />
          <Input
            placeholder="Search templates by name or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
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

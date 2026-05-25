"use client";

import { useEffect, useState, useRef, useCallback } from "react";
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
import { toast } from "@/lib/toast";
import { EmptyTemplatesState } from "@/components/dashboard/templates/empty-state";
import { TemplateCard } from "@/components/dashboard/template-card";
import { TemplateFilters } from "@/components/dashboard/template-filters";
import { useTemplateStore } from "@/lib/stores/template";
import type { EmailTemplate } from "@/lib/db.types";



export default function TemplatesPage() {
  const router = useRouter();
  const {
    templates,
    fetchTemplates,
    createTemplate,
    loading,
    isInitialized,
    searchQuery,
    sort, setSort,
    category, setCategory,
    statusFilter, setStatusFilter,
    viewMode, setViewMode,
    hasMore
  } = useTemplateStore();
  const [isCreating, setIsCreating] = useState(false);
  const observerTarget = useRef<HTMLDivElement>(null);

  const handleClearFilters = useCallback(() => {
    useTemplateStore.setState({ category: "all", statusFilter: "all", searchQuery: "" });
    fetchTemplates(false);
  }, [fetchTemplates]);

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

  if (!isInitialized || (loading && templates.length === 0)) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (templates.length === 0 && !searchQuery && category === "all" && statusFilter === "all") {
    return <EmptyTemplatesState />;
  }

  return (
    <div className="space-y-6">
      <TemplateFilters
        totalTemplates={templates.length}
        category={category} setCategory={setCategory}
        statusFilter={statusFilter} setStatusFilter={setStatusFilter}
        viewMode={viewMode as "grid" | "list"} setViewMode={setViewMode}
        sort={sort} setSort={setSort}
      />

      {/* Templates Grid/List */}
      {templates.length === 0 ? (
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-muted-foreground mb-4">No templates found matching your filters.</p>
            <Button
              variant="outline"
              onClick={handleClearFilters}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className={`grid gap-4 ${viewMode === "grid" ? "grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" : "grid-cols-1"}`}>
            {templates.map((template) => (
              <TemplateCard key={template.id} template={template} />
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

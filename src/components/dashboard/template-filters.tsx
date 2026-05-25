"use client";

import {
  SlidersHorizontal,
  Tag,
  LayoutGrid,
  ArrowDown,
  ChevronDown,
  List
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

const STATUS_LABELS: Record<string, string> = {
  all: "All Statuses",
  draft: "Draft",
  published: "Published",
  archived: "Archived",
};

interface TemplateFiltersProps {
  totalTemplates: number;
  category: string;
  setCategory: (c: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  viewMode: "grid" | "list";
  setViewMode: (v: "grid" | "list") => void;
  sort: string;
  setSort: (s: string) => void;
}

export function TemplateFilters({
  totalTemplates,
  category, setCategory,
  statusFilter, setStatusFilter,
  viewMode, setViewMode,
  sort, setSort
}: TemplateFiltersProps) {
  return (
    <div className="sticky z-50 top-16  bg-background flex items-center gap-4 border-b border-border pb-4 pt-4 mb-6 -mx-4 px-4 sm:-mx-6 sm:px-6 md:-mx-8 md:px-8">
      <div className="flex items-center gap-2">
        <h1 className="text-lg font-semibold">Emails</h1>
        <span className="flex items-center justify-center bg-muted text-muted-foreground text-[10px] font-medium rounded-full w-5 h-5">
          {totalTemplates}
        </span>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* sort by tags */}
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

        {/* sort by status */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="sm" className="gap-2 bg-muted/50 hover:bg-muted rounded-md h-8 px-3">
              <SlidersHorizontal className="w-4 h-4" />
              {STATUS_LABELS[statusFilter] || "All Statuses"}
              <ChevronDown className="w-3 h-3 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            {Object.entries(STATUS_LABELS).map(([key, label]) => (
              <DropdownMenuItem key={key} onClick={() => setStatusFilter(key)}>
                {label} {statusFilter === key && "✓"}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* view mode */}
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

        {/* sort by date, name */}
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
  );
}

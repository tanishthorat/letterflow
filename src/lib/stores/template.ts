import { create } from "zustand";
import type { EmailTemplate } from "@/lib/db.types";

interface TemplateState {
  templates: EmailTemplate[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  page: number;
  hasMore: boolean;
  sort: string;
  category: string;
  viewMode: "grid" | "list";
  setSort: (sort: string) => void;
  setCategory: (category: string) => void;
  setViewMode: (viewMode: "grid" | "list") => void;
  fetchTemplates: (loadMore?: boolean) => Promise<void>;
  createTemplate: (templateData: Partial<EmailTemplate>) => Promise<EmailTemplate | null>;
  updateTemplate: (id: string, templateData: Partial<EmailTemplate>) => Promise<EmailTemplate | null>;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  loading: false,
  error: null,
  searchQuery: "",
  page: 1,
  hasMore: false,
  sort: "date_desc",
  category: "all",
  viewMode: "grid",

  setSearchQuery: (query) => {
    set({ searchQuery: query });
    get().fetchTemplates(false);
  },
  
  setSort: (sort) => {
    set({ sort });
    get().fetchTemplates(false);
  },
  
  setCategory: (category) => {
    set({ category });
    get().fetchTemplates(false);
  },

  setViewMode: (viewMode) => set({ viewMode }),

  fetchTemplates: async (loadMore = false) => {
    const state = get();
    // Prevent fetching if we are already loading or if there's no more data and we're trying to load more
    if (state.loading) return;
    if (loadMore && !state.hasMore) return;

    const newPage = loadMore ? state.page + 1 : 1;
    set({ loading: true, error: null, page: newPage });
    
    try {
      const params = new URLSearchParams({
        page: newPage.toString(),
        limit: "12",
        search: state.searchQuery,
        category: state.category,
        sort: state.sort,
      });

      const response = await fetch(`/api/templates?${params.toString()}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch templates");
      }

      const { templates, hasMore } = await response.json();
      
      set((currentState) => ({ 
        templates: loadMore ? [...currentState.templates, ...templates] : templates,
        hasMore,
        loading: false 
      }));
    } catch (err: unknown) {
      console.error("Error fetching templates:", err);
      set({ error: err instanceof Error ? err.message : String(err), loading: false });
    }
  },

  createTemplate: async (templateData: Partial<EmailTemplate>) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/templates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create template");
      }

      const { template } = await response.json();

      set((state) => ({
        templates: [template, ...state.templates],
        loading: false,
      }));

      return template;
    } catch (err: unknown) {
      console.error("Error creating template:", err);
      set({ error: err instanceof Error ? err.message : String(err), loading: false });
      return null;
    }
  },

  updateTemplate: async (id: string, templateData: Partial<EmailTemplate>) => {
    try {
      const response = await fetch(`/api/templates/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(templateData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update template");
      }

      const { template } = await response.json();

      set((state) => ({
        templates: state.templates.map((t) => (t.id === id ? template : t)),
      }));

      return template;
    } catch (err: unknown) {
      console.error("Error updating template:", err);
      set({ error: err instanceof Error ? err.message : String(err) });
      return null;
    }
  },
}));

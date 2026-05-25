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
  statusFilter: string;
  viewMode: "grid" | "list";
  setSort: (sort: string) => void;
  setCategory: (category: string) => void;
  setStatusFilter: (status: string) => void;
  setViewMode: (viewMode: "grid" | "list") => void;
  fetchTemplates: (loadMore?: boolean) => Promise<void>;
  createTemplate: (templateData: Partial<EmailTemplate>) => Promise<EmailTemplate | null>;
  updateTemplate: (id: string, templateData: Partial<EmailTemplate>) => Promise<EmailTemplate | null>;
  selectedIds: string[];
  toggleSelection: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  deleteTemplates: (ids: string[]) => () => void;
  duplicateTemplate: (id: string) => Promise<EmailTemplate | null>;
  isInitialized: boolean;
}

export const useTemplateStore = create<TemplateState>((set, get) => ({
  templates: [],
  loading: false,
  isInitialized: false,
  error: null,
  searchQuery: "",
  page: 1,
  hasMore: false,
  sort: "date_desc",
  category: "all",
  statusFilter: "all",
  viewMode: "grid",
  selectedIds: [],

  toggleSelection: (id) => {
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter(selectedId => selectedId !== id)
        : [...state.selectedIds, id]
    }));
  },

  selectAll: () => {
    const { templates } = get();
    set({ selectedIds: templates.map(t => t.id) });
  },

  clearSelection: () => {
    set({ selectedIds: [] });
  },

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

  setStatusFilter: (statusFilter) => {
    set({ statusFilter });
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
        status: state.statusFilter,
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
        loading: false,
        isInitialized: true
      }));
    } catch (err: unknown) {
      console.error("Error fetching templates:", err);
      set({ error: err instanceof Error ? err.message : String(err), loading: false, isInitialized: true });
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

  deleteTemplates: (ids: string[]) => {
    const previousTemplates = get().templates;
    const previousSelected = get().selectedIds;
    
    // Optimistic UI update
    set({ 
      templates: previousTemplates.filter(t => !ids.includes(t.id)),
      selectedIds: previousSelected.filter(id => !ids.includes(id))
    });

    const timeoutId = setTimeout(async () => {
      try {
        await Promise.all(
          ids.map(id => fetch(`/api/templates/${id}`, { method: "DELETE" }))
        );
      } catch (err) {
        console.error("Error deleting templates:", err);
      }
    }, 4000);

    // Return a function to undo the optimistic delete
    return () => {
      clearTimeout(timeoutId);
      set({ 
        templates: previousTemplates,
        selectedIds: previousSelected
      });
    };
  },

  duplicateTemplate: async (id: string) => {
    const templateToDuplicate = get().templates.find(t => t.id === id);
    if (!templateToDuplicate) return null;

    return get().createTemplate({
      name: `${templateToDuplicate.name} (Copy)`,
      category: templateToDuplicate.category,
      body_design: templateToDuplicate.body_design,
      global_styles: templateToDuplicate.global_styles,
    });
  },
}));

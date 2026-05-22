import { create } from "zustand";
import type { EmailTemplate } from "@/lib/db.types";

interface TemplateState {
  templates: EmailTemplate[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fetchTemplates: () => Promise<void>;
  createTemplate: (templateData: Partial<EmailTemplate>) => Promise<EmailTemplate | null>;
  updateTemplate: (id: string, templateData: Partial<EmailTemplate>) => Promise<EmailTemplate | null>;
}

export const useTemplateStore = create<TemplateState>((set) => ({
  templates: [],
  loading: false,
  error: null,
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  fetchTemplates: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch("/api/templates");
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch templates");
      }

      const { templates } = await response.json();
      set({ templates, loading: false });
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

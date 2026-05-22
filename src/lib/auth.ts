import { create } from "zustand";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface AuthStore {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
  getSession: () => Promise<void>;
}

export const useAuth = create<AuthStore>((set) => {
  const supabase = createClient();

  return {
    user: null,
    loading: true,
    setUser: (user) => set({ user }),
    setLoading: (loading) => set({ loading }),

    signUp: async (email: string, password: string) => {
      set({ loading: true });
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        set({ user: data.user });
      } finally {
        set({ loading: false });
      }
    },

    signIn: async (email: string, password: string) => {
      set({ loading: true });
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        set({ user: data.user });
      } finally {
        set({ loading: false });
      }
    },

    signInWithGoogle: async () => {
      set({ loading: true });
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
          },
        });
        if (error) throw error;
      } catch (err) {
        set({ loading: false });
        throw err;
      }
    },

    signInWithGitHub: async () => {
      set({ loading: true });
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "github",
          options: {
            redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/auth/callback`,
          },
        });
        if (error) throw error;
      } catch (err) {
        set({ loading: false });
        throw err;
      }
    },

    signOut: async () => {
      set({ loading: true });
      try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        set({ user: null });
      } finally {
        set({ loading: false });
      }
    },

    getSession: async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        set({ user: data.session?.user ?? null });
      } finally {
        set({ loading: false });
      }
    },
  };
});

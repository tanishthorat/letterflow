"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { ThemeProvider } from "next-themes";
import { createClient } from "@/lib/supabase/client";

function AuthGuard() {
  const { getSession, user, loading, setUser } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    getSession();

    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT") {
        setUser(null);
        router.refresh(); // Clear next.js router cache
      } else if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [getSession, router, setUser]);

  // Client-side route guard: if user hits "Back" to a protected route after logout
  useEffect(() => {
    if (!loading && typeof user !== "undefined" && user === null) {
      if (!pathname) return; // Wait for router to be ready

      const isPublicRoute =
        pathname === "/" ||
        pathname.startsWith("/auth/") ||
        pathname.startsWith("/api/") ||
        pathname === "/login" ||
        pathname === "/signup";

      if (!isPublicRoute) {
        const currentSearch = searchParams?.toString();
        const fullPath = currentSearch ? `${pathname}?${currentSearch}` : pathname;
        const nextUrl = encodeURIComponent(fullPath);
        router.replace(`/login?next=${nextUrl}`);
      }
    }
  }, [user, loading, pathname, searchParams, router]);

  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <Suspense fallback={null}>
        <AuthGuard />
      </Suspense>
      {children}
    </ThemeProvider>
  );
}

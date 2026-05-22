"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { ThemeProvider } from "next-themes";

export function Providers({ children }: { children: React.ReactNode }) {
  const getSession = useAuth((state) => state.getSession);

  useEffect(() => {
    getSession();
  }, [getSession]);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      {children}
    </ThemeProvider>
  );
}

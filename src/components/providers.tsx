"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth";

export function Providers({ children }: { children: React.ReactNode }) {
  const getSession = useAuth((state) => state.getSession);

  useEffect(() => {
    getSession();
  }, [getSession]);

  return <>{children}</>;
}

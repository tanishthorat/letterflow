"use client";

import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  // Sync sidebar collapsed state from localStorage after hydration
  useEffect(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    if (savedState) {
      setCollapsed(JSON.parse(savedState));
    }

    // Listen for storage changes to sync across tabs
    const handleStorageChange = () => {
      const updatedState = localStorage.getItem("sidebarCollapsed");
      if (updatedState) {
        setCollapsed(JSON.parse(updatedState));
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const toggleSidebar = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
  };

  return (
    <div suppressHydrationWarning className="relative w-full">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <Header collapsed={collapsed} />
      <main
        suppressHydrationWarning
        className={cn(
          "mt-16 min-h-screen bg-background transition-all duration-300 ease-in-out",
          collapsed ? "ml-20" : "ml-64"
        )}
      >
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

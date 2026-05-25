import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function EditorLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">

      {/* The Miniature Editor UI acting as a scalable loader */}
      <div className="relative w-[1000px] h-[650px] scale-[0.35] sm:scale-[0.45] origin-center flex flex-col bg-card/40 overflow-hidden rounded-2xl border border-border/40 shadow-2xl">

        {/* Subtle background spotlight */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

        {/* Header Skeleton */}
        <div className="h-14 border-b border-border/50 bg-card/50 flex items-center justify-between px-4 shrink-0 relative z-10">
          <div className="flex items-center gap-4">
            {/* Logo placeholder with primary glow */}
            <div className="flex items-center gap-2">
              <Skeleton className="w-8 h-8 rounded-md bg-primary shadow-[0_0_15px_var(--primary)]" />
              <Skeleton className="w-8 h-8 rounded-md hidden md:block bg-muted/30" />
            </div>
            {/* Template name placeholder */}
            <Skeleton className="w-40 h-5 rounded-md hidden md:block" />
          </div>

          {/* Device switcher placeholder */}
          <div className="hidden md:flex items-center gap-1 bg-muted/50 p-1 rounded-md">
            <Skeleton className="w-8 h-6 rounded-sm" />
            <Skeleton className="w-8 h-6 rounded-sm" />
          </div>

          <div className="flex items-center gap-2">
            {/* Actions placeholder */}
            <Skeleton className="w-20 h-8 rounded-md hidden md:block bg-muted/30" />
            <Skeleton className="w-20 h-8 rounded-md bg-primary shadow-[0_0_10px_var(--primary)] opacity-80" />
            <Skeleton className="w-8 h-8 rounded-full ml-2 bg-muted/30" />
          </div>
        </div>

        {/* Main Shell */}
        <div className="flex-1 flex overflow-hidden relative z-10">

          {/* Left Sidebar Skeleton */}
          <div className="w-20 md:w-64 border-r border-border/50 bg-gradient-to-b from-primary/10 via-card/30 to-card/10 flex flex-col shrink-0 relative">
            <div className="flex border-b border-border/50 h-[45px] items-center px-4 justify-around relative z-10">
              <Skeleton className="w-12 md:w-16 h-4 bg-primary/40 shadow-[0_0_8px_var(--primary)]" />
              <Skeleton className="w-12 md:w-16 h-4 hidden md:block bg-muted/30" />
            </div>
            <div className="p-2 md:p-4 grid grid-cols-1 md:grid-cols-2 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-full aspect-square md:aspect-auto md:h-24 rounded-lg" />
              ))}
            </div>
            <div className="mt-auto p-4 border-t border-border">
              <Skeleton className="w-full h-9 rounded-md" />
            </div>
          </div>

          {/* Canvas Area Skeleton */}
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-900/50 flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-[600px] h-full bg-white dark:bg-card border-x border-border/50 shadow-sm p-8 flex flex-col gap-6 mt-8 rounded-t-sm">
              {/* Header Image/Banner */}
              <Skeleton className="w-full h-48 rounded-md bg-muted/60" />

              {/* Text blocks */}
              <div className="space-y-3 px-4">
                <Skeleton className="w-3/4 h-8 rounded-md bg-muted/60" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="w-full h-3 rounded-md bg-muted/40" />
                  <Skeleton className="w-5/6 h-3 rounded-md bg-muted/40" />
                  <Skeleton className="w-4/6 h-3 rounded-md bg-muted/40" />
                </div>
              </div>

              {/* Button */}
              <div className="flex justify-center pt-4">
                <Skeleton className="w-32 h-10 rounded-md bg-primary/80 shadow-[0_0_15px_var(--primary)]" />
              </div>
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="w-80 border-l border-border bg-gradient-to-t from-primary/10 via-card/30 to-card/10 flex-col shrink-0 hidden lg:flex p-4 overflow-y-auto relative">
            <div className="flex items-center justify-between pb-4 border-b border-border relative z-10">
              <Skeleton className="w-24 h-4 rounded-md" />
              <Skeleton className="w-6 h-6 rounded-md" />
            </div>

            <div className="space-y-6 pt-6">
              <div className="space-y-3">
                <Skeleton className="w-16 h-3 rounded-md" />
                <Skeleton className="w-full h-32 rounded-md" />
                <Skeleton className="w-full h-9 rounded-md" />
              </div>

              <div className="space-y-3">
                <Skeleton className="w-20 h-3 rounded-md" />
                <Skeleton className="w-full h-9 rounded-md" />
                <Skeleton className="w-full h-9 rounded-md" />
              </div>

              <div className="space-y-3">
                <Skeleton className="w-24 h-3 rounded-md bg-muted/30" />
                <div className="grid grid-cols-2 gap-2">
                  <Skeleton className="w-full h-9 rounded-md bg-primary/20 shadow-[0_0_10px_var(--primary)]" />
                  <Skeleton className="w-full h-9 rounded-md bg-muted/20" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Loading Text Below */}
      <div className="mt-[-150px] sm:mt-[-100px] flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">Loading Editor</h2>
        </div>
        <p className="text-sm text-muted-foreground">Preparing your workspace...</p>
      </div>

    </div>
  );
}

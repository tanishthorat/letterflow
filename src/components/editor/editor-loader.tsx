import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2 } from "lucide-react";

export function EditorLoader() {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-background z-50">

      {/* The Miniature Editor UI acting as a scalable loader */}
      <div className="relative w-[350px] sm:w-[450px] h-[227px] sm:h-[292px] flex flex-col bg-card/40 overflow-hidden rounded-md border border-border/40 shadow-2xl">

        {/* Subtle background spotlight */}
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

        {/* Header Skeleton */}
        <div className="h-5 sm:h-6 border-b border-border/50 bg-card/50 flex items-center justify-between px-2 shrink-0 relative z-10">
          <div className="flex items-center gap-1.5">
            {/* Logo placeholder with primary glow */}
            <div className="flex items-center gap-1">
              <Skeleton className="w-3 h-3 rounded-xs bg-primary shadow-[0_0_5px_var(--primary)]" />
              <Skeleton className="w-3 h-3 rounded-xs hidden md:block bg-muted/30" />
            </div>
            {/* Template name placeholder */}
            <Skeleton className="w-16 h-2 rounded-sm hidden md:block" />
          </div>

          {/* Device switcher placeholder */}
          <div className="hidden md:flex items-center gap-0.5 bg-muted/50 p-0.5 rounded-sm">
            <Skeleton className="w-3 h-2 rounded-sm" />
            <Skeleton className="w-3 h-2 rounded-sm" />
          </div>

          <div className="flex items-center gap-1">
            {/* Actions placeholder */}
            <Skeleton className="w-8 h-3 rounded-xs hidden md:block bg-muted/30" />
            <Skeleton className="w-8 h-3 rounded-xs bg-primary shadow-[0_0_5px_var(--primary)] opacity-80" />
            <Skeleton className="w-3 h-3 rounded-xs ml-1 bg-muted/30" />
          </div>
        </div>

        {/* Main Shell */}
        <div className="flex-1 flex overflow-hidden relative z-10">

          {/* Left Sidebar Skeleton */}
          <div className="w-8 md:w-24 border-r border-border/50 bg-linear-to-b from-primary/10 via-card/30 to-card/10 flex flex-col shrink-0 relative">
            <div className="flex border-b border-border/50 h-[18px] items-center px-1 md:px-2 justify-around relative z-10">
              <Skeleton className="w-4 md:w-6 h-1.5 bg-primary/40 shadow-[0_0_3px_var(--primary)]" />
              <Skeleton className="w-4 md:w-6 h-1.5 hidden md:block bg-muted/30" />
            </div>
            <div className="p-1 md:p-1.5 grid grid-cols-1 md:grid-cols-2 gap-1">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="w-full aspect-square md:aspect-auto md:h-10 rounded-sm" />
              ))}
            </div>
            <div className="mt-auto p-1.5 border-t border-border">
              <Skeleton className="w-full h-3 rounded-sm" />
            </div>
          </div>

          {/* Canvas Area Skeleton */}
          <div className="flex-1 bg-zinc-100 dark:bg-zinc-900/50 flex flex-col items-center overflow-hidden">
            <div className="w-full max-w-[240px] h-full bg-white dark:bg-card border-x border-border/50 shadow-sm p-3 flex flex-col gap-2 mt-3 rounded-t-sm">
              {/* Header Image/Banner */}
              <Skeleton className="w-full h-20 rounded-sm bg-muted/60" />

              {/* Text blocks */}
              <div className="space-y-1.5 px-1.5">
                <Skeleton className="w-3/4 h-3 rounded-sm bg-muted/60" />
                <div className="space-y-1 pt-1">
                  <Skeleton className="w-full h-1 rounded-sm bg-muted/40" />
                  <Skeleton className="w-5/6 h-1 rounded-sm bg-muted/40" />
                  <Skeleton className="w-4/6 h-1 rounded-sm bg-muted/40" />
                </div>
              </div>

              {/* Button */}
              <div className="flex justify-center pt-1.5">
                <Skeleton className="w-12 h-3.5 rounded-sm bg-primary/80 shadow-[0_0_5px_var(--primary)]" />
              </div>
            </div>
          </div>

          {/* Right Sidebar Skeleton */}
          <div className="w-32 border-l border-border bg-gradient-to-t from-primary/10 via-card/30 to-card/10 flex-col shrink-0 hidden lg:flex p-1.5 overflow-y-auto relative">
            <div className="flex items-center justify-between pb-1.5 border-b border-border relative z-10">
              <Skeleton className="w-8 h-1.5 rounded-sm" />
              <Skeleton className="w-2 h-2 rounded-sm" />
            </div>

            <div className="space-y-2 pt-2">
              <div className="space-y-1">
                <Skeleton className="w-6 h-1 rounded-sm" />
                <Skeleton className="w-full h-12 rounded-sm" />
                <Skeleton className="w-full h-3 rounded-sm" />
              </div>

              <div className="space-y-1">
                <Skeleton className="w-8 h-1 rounded-sm" />
                <Skeleton className="w-full h-3 rounded-sm" />
                <Skeleton className="w-full h-3 rounded-sm" />
              </div>

              <div className="space-y-1">
                <Skeleton className="w-10 h-1 rounded-sm bg-muted/30" />
                <div className="grid grid-cols-2 gap-1">
                  <Skeleton className="w-full h-3 rounded-sm bg-primary/20 shadow-[0_0_4px_var(--primary)]" />
                  <Skeleton className="w-full h-3 rounded-sm bg-muted/20" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Loading Text Below */}
      <div className="mt-8 flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
        <div className="flex items-center gap-3">
          <Loader2 className="w-5 h-5 text-primary animate-spin" />
          <h2 className="text-xl font-bold tracking-tight text-foreground">Loading Editor</h2>
        </div>
        <p className="text-sm text-muted-foreground">Preparing your workspace...</p>
      </div>

    </div>
  );
}

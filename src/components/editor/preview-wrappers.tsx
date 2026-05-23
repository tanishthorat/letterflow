import React from "react";
import { ChevronLeft, ChevronUp, ChevronDown, Trash2, Folder, Reply, SquarePen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface PreviewDeviceWrapperProps {
  viewMode: "desktop" | "mobile";
  children: React.ReactNode;
  subject?: string;
  workspaceName?: string;
  fileSizeKB?: number;
}

export function PreviewDeviceWrapper({
  viewMode,
  children,
  subject = "Subject line",
  workspaceName = "Workspace",
  fileSizeKB = 0,
}: PreviewDeviceWrapperProps) {
  const isMobile = viewMode === "mobile";

  return (
    <div className="flex flex-col items-center w-full h-full max-h-full shrink-0 gap-4 overflow-hidden pt-4 pb-8 px-4">
      {/* Top Controls Area */}
      <div 
        className={cn(
          "transition-all duration-500 ease-in-out flex flex-col w-full shrink-0",
          isMobile ? "max-w-[375px]" : "max-w-[1200px]"
        )}
      >
        <div className="h-9 relative w-full flex items-center">
           <div className={cn("absolute left-0 transition-opacity duration-500", isMobile ? "opacity-0 pointer-events-none" : "opacity-100")}>
             <span className="bg-[#f59e0b] text-black text-[11px] font-bold px-2.5 py-1 rounded-sm shadow-sm inline-block">
               Preview Emulation Mode
             </span>
           </div>
           
           <div className={cn("absolute inset-0 transition-opacity duration-500", isMobile ? "opacity-100" : "opacity-0 pointer-events-none")}>
             <Select defaultValue="iphone-se">
               <SelectTrigger className="w-full bg-muted/30 border-border h-9 text-xs font-medium">
                 <SelectValue placeholder="Select device" />
               </SelectTrigger>
               <SelectContent>
                 <SelectItem value="iphone-se">iPhone SE (2, 3 Gen), 8, 7, 6S, 6</SelectItem>
                 <SelectItem value="iphone-12">iPhone 12, 13, 14</SelectItem>
                 <SelectItem value="iphone-14-pro">iPhone 14 Pro, 15</SelectItem>
               </SelectContent>
             </Select>
           </div>
        </div>
      </div>

      {/* Device Frame */}
      <div 
        className={cn(
          "bg-background overflow-hidden flex flex-col shadow-2xl relative transition-all duration-500 ease-in-out shrink-0",
          isMobile 
            ? "w-[375px] h-[812px] max-h-[85vh] rounded-[2.5rem] border-[12px] border-[#2a2a2a] dark:border-[#1e1e1e]" 
            : "w-full max-w-[1200px] h-full rounded-lg border border-border"
        )}
      >
        {/* Desktop Header */}
        <div 
          className={cn(
            "flex flex-col w-full transition-all duration-500 ease-in-out overflow-hidden shrink-0",
            isMobile ? "h-0 opacity-0" : "h-[64px] opacity-100"
          )}
        >
          <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border w-full h-[64px]">
            <div className="flex items-center gap-3">
              <Avatar className="w-10 h-10 border border-border">
                <AvatarFallback className="bg-background text-xs font-medium">{workspaceName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-foreground whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-[400px]">
                  {workspaceName}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5 whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] sm:max-w-[400px]">
                  {subject}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-background border border-border shadow-sm">
                <span className="text-xs font-medium text-muted-foreground">~{fileSizeKB.toFixed(1)} KB</span>
                <div className="w-3.5 h-3.5 rounded-full border-[2.5px] border-emerald-500 border-t-transparent" />
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div 
          className={cn(
            "flex flex-col w-full transition-all duration-500 ease-in-out overflow-hidden shrink-0 bg-background text-blue-500",
            isMobile ? "h-14 opacity-100 border-b border-border/50" : "h-0 opacity-0 border-transparent"
          )}
        >
          <div className="flex items-center justify-between px-4 h-14 w-full">
            <div className="flex items-center gap-1 cursor-pointer">
              <ChevronLeft className="w-5 h-5" />
              <span className="text-[15px] font-medium">Inbox</span>
            </div>
            <div className="flex items-center gap-4">
              <ChevronUp className="w-5 h-5 text-muted-foreground/60" />
              <ChevronDown className="w-5 h-5 text-muted-foreground/60" />
            </div>
          </div>
        </div>

        {/* Content (The Email iframe) */}
        <div className="flex-1 bg-white overflow-hidden relative w-full h-full">
          {children}
        </div>

        {/* Mobile Footer */}
        <div 
          className={cn(
            "flex flex-col w-full transition-all duration-500 ease-in-out overflow-hidden shrink-0 bg-background text-blue-500",
            isMobile ? "h-14 opacity-100 border-t border-border/50" : "h-0 opacity-0 border-transparent"
          )}
        >
          <div className="flex items-center justify-between px-6 h-14 w-full pb-1">
            <Trash2 className="w-5 h-5 cursor-pointer stroke-[1.5]" />
            <Folder className="w-5 h-5 cursor-pointer stroke-[1.5]" />
            <Reply className="w-5 h-5 cursor-pointer stroke-[1.5]" />
            <SquarePen className="w-5 h-5 cursor-pointer stroke-[1.5]" />
          </div>
        </div>
      </div>
    </div>
  );
}

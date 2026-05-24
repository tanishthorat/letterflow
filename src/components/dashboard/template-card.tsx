"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Copy, Edit2, MoreVertical, Trash2, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { EmailTemplate } from "@/lib/db.types";
import { useTemplateStore } from "@/lib/stores/template";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface TemplateCardProps {
  template: EmailTemplate;
}

export function TemplateCard({ template }: TemplateCardProps) {
  const router = useRouter();
  const {
    selectedIds,
    toggleSelection,
    deleteTemplates,
    duplicateTemplate,
    updateTemplate
  } = useTemplateStore();

  const isSelected = selectedIds.includes(template.id);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [renameValue, setRenameValue] = useState(template.name);
  const [isDuplicating, setIsDuplicating] = useState(false);

  const handleToggleSelection = () => {
    toggleSelection(template.id);
  };

  const handleEdit = () => {
    router.push(`/editor/${template.id}`);
  };

  const handleDelete = () => {
    setIsDeleteDialogOpen(false);
    const undoAction = deleteTemplates([template.id]);
    toast.success("Template deleted", {
      action: {
        label: "Undo",
        onClick: undoAction,
      },
    });
  };

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    try {
      const duplicated = await duplicateTemplate(template.id);
      if (duplicated) {
        toast.success("Template duplicated successfully");
      }
    } catch (err) {
      toast.error("Failed to duplicate template");
    } finally {
      setIsDuplicating(false);
    }
  };

  const handleRenameSave = async () => {
    if (!renameValue.trim() || renameValue === template.name) {
      setIsRenaming(false);
      return;
    }
    try {
      await updateTemplate(template.id, { name: renameValue.trim() });
      toast.success("Template renamed");
      setIsRenaming(false);
    } catch (err) {
      toast.error("Failed to rename template");
    }
  };

  const ContextMenuItems = () => (
    <>
      <ContextMenuItem onClick={handleEdit}>
        <Edit2 className="w-4 h-4 mr-2" />
        Edit
      </ContextMenuItem>
      
      <Popover open={isRenaming} onOpenChange={setIsRenaming}>
        <PopoverTrigger asChild>
          <ContextMenuItem onSelect={(e) => {
            e.preventDefault();
            setIsRenaming(true);
          }}>
            <Edit2 className="w-4 h-4 mr-2" />
            Rename
          </ContextMenuItem>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" side="right" align="start">
          <div className="flex items-center gap-2">
            <Input 
              value={renameValue} 
              onChange={(e) => setRenameValue(e.target.value)} 
              className="h-8"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSave();
              }}
            />
            <Button size="icon" className="h-8 w-8" onClick={handleRenameSave}>
              <Check className="w-4 h-4" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <ContextMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
        {isDuplicating ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Copy className="w-4 h-4 mr-2" />
        )}
        Duplicate
      </ContextMenuItem>
      
      <ContextMenuSeparator />
      
      <ContextMenuItem 
        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        onSelect={() => setIsDeleteDialogOpen(true)}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </ContextMenuItem>
    </>
  );

  const DropdownMenuItems = () => (
    <>
      <DropdownMenuItem onClick={handleEdit}>
        <Edit2 className="w-4 h-4 mr-2" />
        Edit
      </DropdownMenuItem>
      
      <Popover open={isRenaming} onOpenChange={setIsRenaming}>
        <PopoverTrigger asChild>
          <DropdownMenuItem onSelect={(e) => {
            e.preventDefault();
            setIsRenaming(true);
          }}>
            <Edit2 className="w-4 h-4 mr-2" />
            Rename
          </DropdownMenuItem>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-2" side="right" align="start">
          <div className="flex items-center gap-2">
            <Input 
              value={renameValue} 
              onChange={(e) => setRenameValue(e.target.value)} 
              className="h-8"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameSave();
              }}
            />
            <Button size="icon" className="h-8 w-8" onClick={handleRenameSave}>
              <Check className="w-4 h-4" />
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <DropdownMenuItem onClick={handleDuplicate} disabled={isDuplicating}>
        {isDuplicating ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Copy className="w-4 h-4 mr-2" />
        )}
        Duplicate
      </DropdownMenuItem>
      
      <DropdownMenuSeparator />
      
      <DropdownMenuItem 
        className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        onSelect={() => setIsDeleteDialogOpen(true)}
      >
        <Trash2 className="w-4 h-4 mr-2" />
        Delete
      </DropdownMenuItem>
    </>
  );

  return (
    <>
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <div 
            className={cn(
              "group relative w-full aspect-[2/3] max-h-[400px] flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2",
              isSelected ? "border-primary shadow-md" : "border-transparent bg-muted/20 hover:border-accent/50"
            )}
            onClick={handleEdit}
          >
            {/* Visual Preview Section (Top) */}
            <div className="flex-1 bg-white flex flex-col relative overflow-hidden items-center justify-center pointer-events-none p-4">
              {template.body_html ? (
                <div 
                  className="w-full h-full text-[4px] leading-tight origin-top overflow-hidden opacity-80"
                  dangerouslySetInnerHTML={{ __html: template.body_html }}
                />
              ) : (
                <div className="w-16 h-4 bg-muted rounded animate-pulse" />
              )}
            </div>

            {/* Dark Details Section (Bottom) */}
            <div className="h-[80px] bg-[#2A2A2A] text-white flex flex-col items-center justify-center p-3 relative z-10 m-2 rounded-lg">
              <span className="text-sm font-medium truncate w-full text-center">
                {template.name}
              </span>
              <span className="text-xs text-zinc-400 mt-1">
                {template.created_at ? formatDistanceToNow(new Date(template.created_at), { addSuffix: true }) : "Unknown date"}
              </span>
            </div>

            {/* Absolute positioning overlays */}
            
            <div 
              className={cn(
                "absolute top-3 left-3 z-20 transition-opacity flex items-center justify-center cursor-pointer p-1 rounded-sm",
                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
              onClick={(e) => {
                e.stopPropagation();
                handleToggleSelection();
              }}
            >
              <Checkbox 
                checked={isSelected}
                className="w-5 h-5 bg-white/50 backdrop-blur-md border-zinc-300 data-[state=checked]:bg-primary pointer-events-none"
              />
            </div>

            {/* Top Right Dropdown Trigger */}
            <div 
              className={cn(
                "absolute top-2 right-2 z-20 transition-opacity",
                isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-white/50 hover:bg-white backdrop-blur-md">
                    <MoreVertical className="w-4 h-4 text-zinc-700" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItems />
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
          </div>
        </ContextMenuTrigger>
        
        {/* Context Menu (Right Click) */}
        <ContextMenuContent className="w-48">
          <ContextMenuItems />
        </ContextMenuContent>
      </ContextMenu>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete "{template.name}". This action can be undone within 4 seconds.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

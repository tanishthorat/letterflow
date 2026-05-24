"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { Copy, Edit2, MoreVertical, Trash2, Check, Loader2, X, FolderPen } from "lucide-react";
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
import { DeleteDialog } from "@/components/ui/delete-dialog";

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
    const toastId = toast.success("Template deleted", {
      duration: 4000,
      action: {
        label: "Undo",
        onClick: () => {
          undoAction();
          toast.dismiss(toastId);
        },
      },
    });

    // Force dismiss after 4s so hover doesn't keep the undo button alive
    setTimeout(() => {
      toast.dismiss(toastId);
    }, 4000);
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

      <ContextMenuItem onSelect={() => setIsRenaming(true)}>
        <FolderPen className="w-4 h-4 mr-2" />
        Rename
      </ContextMenuItem>

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

      <DropdownMenuItem onSelect={() => setIsRenaming(true)}>
        <FolderPen className="w-4 h-4 mr-2" />
        Rename
      </DropdownMenuItem>

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
              "group relative w-full aspect-2/3 max-h-80 flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-200 border-2",
              isSelected ? "border-primary shadow-md" : "border-transparent bg-muted/20 hover:border-accent/50"
            )}
            onClick={handleEdit}
          >
            {/* Visual Preview Section (Top) */}
            <div className="flex-1 bg-white flex flex-col relative overflow-hidden items-center justify-center pointer-events-none p-4">
              {template.body_html ? (
                <div className="w-full h-full absolute inset-0 flex items-start justify-center overflow-hidden opacity-80 pointer-events-none p-4">
                  <iframe
                    srcDoc={template.body_html}
                    sandbox=""
                    scrolling="no"
                    tabIndex={-1}
                    className="origin-top border-none bg-transparent"
                    style={{ width: "600px", height: "800px", transform: "scale(0.35)" }}
                  />
                </div>
              ) : (
                <div className="w-16 h-4 bg-muted rounded animate-pulse" />
              )}
            </div>

            {/* Dark Details Section (Bottom) */}
            <div className="absolute w-full max-w-11/12 bottom-0 left-1/2 -translate-x-1/2 bg-background text-white flex flex-col items-center justify-center p-2 z-10 my-2 rounded-lg">
              <Popover open={isRenaming} onOpenChange={setIsRenaming}>
                <PopoverTrigger asChild>
                  <span
                    className="text-sm font-medium truncate w-full text-center cursor-text"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsRenaming(true);
                    }}
                  >
                    {template.name}
                  </span>
                </PopoverTrigger>
                <PopoverContent
                  className="w-64 p-2"
                  side="top"
                  align="center"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <Input
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      className="h-8"
                      autoFocus
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === 'Enter') handleRenameSave();
                      }}
                    />
                    <Button size="icon" className="h-8 w-8" onClick={(e) => {
                      e.stopPropagation();
                      handleRenameSave();
                    }}>
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
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
      <DeleteDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        title="Confirm removal"
        description={
          <>
            Are you sure you want to remove “<b className="text-white font-medium">{template.name}</b>”?
          </>
        }
        onConfirm={handleDelete}
      />
    </>
  );
}

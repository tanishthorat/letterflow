"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Mail, FolderPlus, HelpCircle, Plus, Loader2 } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { UserNav } from "@/components/dashboard/user-nav";
import { useAuth } from "@/lib/auth";
import { useTemplateStore } from "@/lib/stores/template";
import { toast } from "sonner";
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

interface HeaderProps {
  collapsed: boolean;
}

export function Header({ collapsed }: HeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { signOut } = useAuth();
  const { searchQuery, setSearchQuery, createTemplate, loading, selectedIds, clearSelection, deleteTemplates } = useTemplateStore();
  const [isCreating, setIsCreating] = useState(false);
  const [isBatchDeleteDialogOpen, setIsBatchDeleteDialogOpen] = useState(false);

  const [inputValue, setInputValue] = useState(searchQuery);
  const [debouncedValue] = useDebounce(inputValue, 400);

  // Keep input in sync with store (e.g. if cleared from elsewhere)
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    // Only trigger if debouncedValue is different from what's currently in the store
    if (debouncedValue !== searchQuery) {
      setSearchQuery(debouncedValue);
      if (pathname !== "/dashboard/templates" && debouncedValue.trim() !== "") {
        router.push("/dashboard/templates");
      }
    }
  }, [debouncedValue, pathname, router, searchQuery, setSearchQuery]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleCreateNew = async () => {
    setIsCreating(true);
    try {
      const template = await createTemplate({
        name: "Untitled Template",
        category: "other",
      });
      if (template) {
        router.push(`/editor/${template.id}`);
      }
    } catch (error) {
      console.error("Error creating template", error);
      toast.error("Couldn't create template", {
        description: error instanceof Error ? error.message : "Please try again.",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
      toast.error("Sign out failed");
    }
  };

  const handleBatchDelete = () => {
    setIsBatchDeleteDialogOpen(false);
    const count = selectedIds.length;
    const undoAction = deleteTemplates(selectedIds);
    toast.success(`${count} template${count > 1 ? 's' : ''} deleted`, {
      action: {
        label: "Undo",
        onClick: undoAction
      }
    });
  };

  return (
    <>
    <header
      suppressHydrationWarning
      className={cn(
        "fixed top-0 right-0 h-16 bg-card border-b border-border flex items-center justify-between px-4 lg:px-6 transition-all duration-300 ease-in-out z-30",
        collapsed ? "left-18" : "left-64"
      )}
    >
      {/* Left section: Actions */}
      <div className="flex items-center gap-3">
        {/* Split Button for New Message */}
        <div className="flex items-center shadow-sm rounded-md">
          <Button 
            onClick={handleCreateNew} 
            disabled={isCreating}
            className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground border border-primary"
          >
            {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />}
            <span className="hidden sm:inline-block font-medium">New Message</span>
          </Button>
        </div>

        {/* New Folder */}
        <Button variant="outline" size="icon" className="text-muted-foreground hover:text-foreground shadow-sm">
          <FolderPlus className="w-4 h-4" />
        </Button>
      </div>

      {/* Middle section: Search or Batch Actions */}
      <div className="flex-1 max-w-2xl px-4 lg:px-8 hidden md:block">
        {pathname === "/dashboard/templates" && (
          selectedIds.length > 0 ? (
            <div className="flex items-center justify-between bg-muted/50 rounded-md border px-3 py-1.5 h-10 w-full">
              <span className="text-sm font-medium text-muted-foreground">
                {selectedIds.length} template{selectedIds.length > 1 ? 's' : ''} selected
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={() => clearSelection()}>Cancel</Button>
                <Button variant="destructive" size="sm" onClick={() => setIsBatchDeleteDialogOpen(true)}>Delete</Button>
              </div>
            </div>
          ) : (
            <SearchBar
              placeholder="Search by name, subject or ID"
              value={inputValue}
              onChange={handleSearch}
              isLoading={loading}
            />
          )
        )}
      </div>

      {/* Right section: User & notifications */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" className="hidden lg:flex gap-2 text-muted-foreground hover:text-foreground">
          <HelpCircle className="w-5 h-5" />
          <span className="font-medium">Help Center</span>
        </Button>
        
       

        <div className="flex items-center ml-2 pl-4 border-l border-border gap-3">
          <Button variant="outline" size="icon" className="w-8 h-8 rounded-full border-dashed border-muted-foreground/50 text-muted-foreground hover:text-foreground hover:border-foreground transition-colors">
            <Plus className="w-4 h-4" />
          </Button>

          <UserNav />
        </div>
      </div>
    </header>

    {/* Batch Delete Confirmation Dialog */}
    <AlertDialog open={isBatchDeleteDialogOpen} onOpenChange={setIsBatchDeleteDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {selectedIds.length} template{selectedIds.length > 1 ? 's' : ''}?</AlertDialogTitle>
          <AlertDialogDescription>
            This action can be undone within 4 seconds.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleBatchDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    </>
  );
}

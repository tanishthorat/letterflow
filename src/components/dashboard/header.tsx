"use client";

import { Mail, FolderPlus, HelpCircle, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SearchBar } from "@/components/ui/search-bar";
import { UserNav } from "@/components/dashboard/user-nav";
import { useAuth } from "@/lib/auth";

interface HeaderProps {
  collapsed: boolean;
}

export function Header({ collapsed }: HeaderProps) {
  const router = useRouter();
  const { signOut, loading } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  return (
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
          <Button className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground border border-primary">
            <Mail className="w-4 h-4" />
            <span className="hidden sm:inline-block font-medium">New Message</span>
          </Button>
          {/* <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button size="icon" className="rounded-l-none border border-l-primary-foreground/20 border-primary bg-primary hover:bg-primary/90 text-primary-foreground w-9">
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Email Template</DropdownMenuItem>
              <DropdownMenuItem>Blank Message</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
        </div>

        {/* New Folder */}
        <Button variant="outline" size="icon" className="text-muted-foreground hover:text-foreground shadow-sm">
          <FolderPlus className="w-4 h-4" />
        </Button>
      </div>

      {/* Middle section: Search */}
      <div className="flex-1 max-w-2xl px-4 lg:px-8 hidden md:block">
        <SearchBar placeholder="Search by name, ID or preview link" />
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
  );
}

"use client";

import { User, LogOut, Moon, Sun, Monitor, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserNav() {
  const router = useRouter();
  const { signOut, loading } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 border border-border overflow-hidden p-0 ring-2 ring-transparent hover:ring-primary/50 transition-all focus-visible:ring-primary/50">
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <User className="w-5 h-5 text-muted-foreground" />
          </div>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-70 p-2 bg-popover border-border text-popover-foreground shadow-xl" align="end" forceMount>
        {/* Profile */}
        <DropdownMenuLabel className="font-normal p-0 mb-1">
          <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer rounded-md">
            <div className="flex items-center justify-center w-9 h-9 rounded-full border border-border/50 shrink-0">
              <User className="w-4 h-4 text-muted-foreground group-focus/dropdown-menu-item:text-sidebar-foreground" />
            </div>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">MH 27squad</p>
              <p className="text-xs text-muted-foreground">
                Show Profile
              </p>
            </div>
          </DropdownMenuItem>
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="-mx-2 bg-border" />
        
        {/* Theme */}
        <DropdownMenuGroup className="my-1">
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-sm font-medium">Theme</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleTheme}
              className="h-8 px-3 text-xs gap-2 rounded-full border-border bg-transparent"
            >
              {theme === "dark" ? (
                <>
                  <Moon className="w-3.5 h-3.5" />
                  Dark
                </>
              ) : (
                <>
                  <Sun className="w-3.5 h-3.5" />
                  Light
                </>
              )}
            </Button>
          </div>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="-mx-2 bg-border" />

        {/* Workspace */}
        <DropdownMenuGroup className="my-1">
          <DropdownMenuItem className="flex flex-col items-start gap-1.5 p-3 cursor-pointer rounded-md">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-muted-foreground group-focus/dropdown-menu-item:text-sidebar-foreground" />
              <span className="text-sm font-medium">MH 27squad's workspace</span>
            </div>
            <span className="text-xs text-muted-foreground pl-6">Workspace</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        <DropdownMenuSeparator className="-mx-2 bg-border" />

        {/* Sign out */}
        <DropdownMenuItem 
          variant="destructive"
          onClick={handleSignOut} 
          disabled={loading} 
          className="p-3 cursor-pointer mt-1 rounded-md"
        >
          <LogOut className="w-4 h-4 mr-3" />
          {loading ? "Signing out..." : "Sign out"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

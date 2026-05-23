"use client";

import { User, LogOut, Moon, Sun, Monitor, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  const { user, signOut, loading } = useAuth();
  const { theme, setTheme } = useTheme();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.refresh();
      router.push("/login");
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const name = user?.user_metadata?.name || user?.user_metadata?.full_name || "User";
  const email = user?.email || "";
  const avatarUrl = user?.user_metadata?.avatar_url || user?.user_metadata?.picture || "";
  const initials = name.slice(0, 2).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full w-9 h-9 border border-border overflow-hidden p-0 ring-2 ring-transparent hover:ring-primary/50 transition-all focus-visible:ring-primary/50">
          <Avatar className="w-full h-full">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent className="w-70 p-2 bg-popover border-border text-popover-foreground shadow-xl" align="end" forceMount>
        {/* Profile */}
        <DropdownMenuLabel className="font-normal p-0 mb-1">
          <DropdownMenuItem className="flex items-start gap-3 p-3 cursor-pointer rounded-md">
            <Avatar className="w-9 h-9 border border-border/50 shrink-0">
              <AvatarImage src={avatarUrl} alt={name} />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{name}</p>
              <p className="text-xs text-muted-foreground truncate max-w-[150px]">
                {email || "Show Profile"}
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
              <span className="text-sm font-medium">MH 27squad&apos;s workspace</span>
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

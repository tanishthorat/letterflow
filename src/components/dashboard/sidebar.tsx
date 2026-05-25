"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Home, ChevronLeft, ChevronRight, LayoutTemplate } from "lucide-react";
import { cn } from "@/lib/utils";
import Logo, { CompactLogo } from "../ui/logo";

const navigation = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Templates", href: "/dashboard/templates", icon: Mail },
  { name: "Pre-built", href: "/dashboard/pre-built", icon: LayoutTemplate },
  //  coming soon in future
  // { name: "Components", href: "/dashboard/components", icon: Palette }, 
  // { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      suppressHydrationWarning
      className={cn(
        "fixed left-0 top-0 h-screen bg-card border-r border-sidebar-border flex flex-col transition-all duration-300 ease-in-out z-40",
        collapsed ? "w-18" : "w-64"
      )}
    >
      {/* Logo */}
      <div className={cn("px-4 flex items-center justify-between relative transition-all duration-300 ease-in-out")}>
        <Link href="/dashboard" className={cn("flex items-center gap-2 h-20 overflow-hidden transition-all duration-300 ease-in-out")}>
          {!collapsed && (
            <Logo className="w-60 h-60 text-foreground" />
          )}
          {collapsed && (
            <div className="w-28 h-28 text-foreground">
              <CompactLogo className="w-full h-full" />
            </div>
          )}
        </Link>


        {/* Toggle Button */}
        <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 z-50">
          <button
            onClick={onToggle}
            className={cn(
              "flex items-center justify-center bg-sidebar-primary-foreground text-sidebar-accent min-w-0 w-6 h-6 p-0 border border-sidebar-border rounded-full shadow-md hover:shadow-lg transition-all duration-300 ease-in-out hover:scale-110"
            )}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* <hr className="w-full border-sidebar-border" /> */}

      {/* Navigation */}
      <nav className={cn("flex-1 p-4 space-y-2 transition-all duration-300 ease-in-out")}>
        {navigation.map((item) => {
          // For Home, only exact match; for others, prefix match is fine
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg transition-colors",
                collapsed ? "justify-center px-3 py-2" : "px-4 py-2",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-primary/10",
                "transition-all duration-300 ease-in-out"
              )}
              title={collapsed ? item.name : ""}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <span className={cn("font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ease-in-out")}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className={cn("p-4 border-t border-sidebar-border transition-all duration-300 ease-in-out")}>
        {!collapsed ? (
          <div className="text-xs text-sidebar-foreground/60">UI Foundation v1</div>
        ) : (
          <div className="text-xs text-sidebar-foreground/60 text-center">v1</div>
        )}
      </div>
    </aside>
  );
}

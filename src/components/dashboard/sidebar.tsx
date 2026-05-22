"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Palette, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Templates", href: "/dashboard/templates", icon: LayoutGrid },
  { name: "Components", href: "/dashboard/components", icon: Palette },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-accent-foreground">L</span>
          </div>
          <span className="font-bold text-lg">Letterflow</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-primary/10"
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">
          UI Foundation v1
        </div>
      </div>
    </aside>
  );
}

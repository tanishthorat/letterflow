"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, type ToasterProps } from "sonner";

function Toaster({ ...props }: ToasterProps) {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-popover group-[.toaster]:text-popover-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-lg",
          title:
            "group-[.toast]:text-foreground group-[.toast]:text-sm group-[.toast]:font-medium",
          description:
            "group-[.toast]:text-muted-foreground group-[.toast]:text-xs",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-md group-[.toast]:text-xs group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-md group-[.toast]:text-xs",
          closeButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:border-border hover:group-[.toast]:bg-muted/80",
          error:
            "group-[.toaster]:bg-destructive/10 group-[.toaster]:text-destructive group-[.toaster]:border-destructive/30",
          success:
            "group-[.toaster]:bg-primary/10 group-[.toaster]:text-primary group-[.toaster]:border-primary/30",
          warning:
            "group-[.toaster]:bg-yellow-500/10 group-[.toaster]:text-yellow-600 dark:group-[.toaster]:text-yellow-400 group-[.toaster]:border-yellow-500/30",
          info:
            "group-[.toaster]:bg-blue-500/10 group-[.toaster]:text-blue-600 dark:group-[.toaster]:text-blue-400 group-[.toaster]:border-blue-500/30",
        },
      }}
      {...props}
    />
  );
}

export { Toaster };

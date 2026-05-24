import { Analytics } from "@vercel/analytics/next"
import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { Providers } from "@/components/providers";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const roboto = Roboto({
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Letterflow",
  description: "Email template management made simple",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "letterflow",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`h-full antialiased ${roboto.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Providers>
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster richColors closeButton />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}

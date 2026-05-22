import React, { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  showBranding?: boolean;
}

export function AuthLayout({ children, showBranding = true }: AuthLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-secondary">
      {/* Left Sidebar - Branding & Hero */}
      {showBranding && (
        <div className="hidden lg:flex w-1/3 relative flex-col justify-end p-12 bg-gradient-to-b from-[#33cc4a]/20 to-[#1a3a1a] dark:from-[#33cc4a]/30 dark:to-[#222222] border-r border-border">
          {/* Background Image with Overlay */}
          <Image
            src="/auth/global-accessibility-day.png"
            alt="Global Accessibility Awareness Day"
            fill
            className="object-cover"
            priority
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/90" />

          {/* Content */}
          

          {/* Marketing Banner */}
          <div className="bottom-0 left-0 right-0 p-8 relative z-20">
            <div className="text-white">
              <h2 className="text-2xl font-bold mb-3">Global Accessibility Awareness Day 2026</h2>
              <p className="text-sm mb-2">Do your emails reach every subscriber? For millions of people, interacting with an email isn&apos;t easy.</p>
              <p className="text-sm">
                <Link 
                  target="_blank" 
                  href="https://tanishdev.me"
                  className="underline hover:text-opacity-80 transition-opacity"
                >
                  Explore
                </Link>
                {" "}how to design emails that work for everyone.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Right Side - Form Area */}
      <div className="flex-1 flex flex-col justify-center items-center relative p-6">
        {/* Logo */}
        <div className="absolute top-6 left-6 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-10 bg-primary rounded flex items-center justify-center text-white font-bold text-lg">
              L
            </div>
            <span className="font-bold text-lg text-foreground">Letterflow</span>
          </div>
        </div>

        {/* Form Container */}
        {children}
      </div>
    </div>
  );
}

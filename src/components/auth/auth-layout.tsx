import React, { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  showBranding?: boolean;
}

export function AuthLayout({ children, showBranding = true }: AuthLayoutProps) {
  return (
    <div className="h-screen flex overflow-hidden bg-background dark:bg-background">
      {/* Left Sidebar - Branding & Hero */}
      {showBranding && (
        <div className="hidden lg:flex w-1/3 relative flex-col justify-end p-12 bg-gradient-to-b from-[#33cc4a]/20 to-[#1a3a1a] dark:from-[#33cc4a]/30 dark:to-[#222222] border-r border-border">
          {/* Decorative Background Elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at center, currentColor 1px, transparent 1px)",
                backgroundSize: "20px 20px",
              }}
            />

            {/* Floating brand cards */}
            <div className="absolute top-1/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-white/10 dark:bg-white/10 text-foreground p-4 rounded-lg backdrop-blur-sm w-40 border border-white/20">
                <h3 className="font-bold text-base mb-1">Email Accessibility</h3>
                <p className="text-xs text-muted">WCAG 2.1 AAA compliant</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <h1 className="text-4xl font-bold mb-4 text-foreground">
              Email Templates Made Simple
            </h1>
            <p className="text-sm text-muted mb-4 max-w-md">
              Design, manage, and send beautiful emails with Letterflow. Built for teams who care about email quality.
            </p>
            <p className="text-sm text-muted">
              Join thousands of companies using Letterflow to streamline their email workflow.
            </p>
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

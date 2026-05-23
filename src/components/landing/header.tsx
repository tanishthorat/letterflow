"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/ui/logo";
import { createClient } from "@/lib/supabase/client";

interface LandingHeaderProps {
  initialIsLoggedIn: boolean;
}

export default function LandingHeader({ initialIsLoggedIn }: LandingHeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    // Check active session to synchronize client state
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session?.user);
    });

    // Listen for auth state changes (sign-in, sign-out, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    if (isPending) return;
    setIsPending(true);
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <header className="w-full bg-white border-b border-[#EAEAEA] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Logo className="w-36 h-9 text-gray-900" />
        </Link>

        {/* Action Controls */}
        <div className="flex items-center gap-4">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="text-sm font-semibold text-[#1F1F1F] hover:text-[#33cc4a] transition-colors px-3 py-2"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard/templates"
                className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-[#EAEAEA] text-sm font-semibold rounded-lg hover:bg-[#F8F9FA] transition-all duration-200 text-[#1F1F1F] shadow-2xs"
              >
                <span>Open Editor</span>
                <span className="text-xs text-gray-400 font-bold ml-1">➔</span>
              </Link>
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="px-5 py-2.5 bg-[#111111] text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-all duration-200 disabled:opacity-50"
              >
                {isPending ? "Logging out..." : "Logout"}
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

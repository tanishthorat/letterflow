import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

// Safe redirect — only allow relative paths, never external URLs
function getSafeRedirectUrl(next: string | null, origin: string): string {
  // We use /dashboard as fallback (adjust if your primary protected route is different)
  if (!next) return origin + '/dashboard';
  try {
    const url = new URL(next, origin);
    if (url.origin !== origin) return origin + '/dashboard';
    return url.toString();
  } catch {
    return origin + '/dashboard';
  }
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next");

  // Handle errors
  if (error) {
    return NextResponse.redirect(
      new URL(`/login?error=${encodeURIComponent(errorDescription || error)}`, request.url)
    );
  }

  // Handle successful callback
  if (code) {
    try {
      const supabase = await createClient();
      const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

      if (exchangeError) {
        return NextResponse.redirect(
          new URL(`/login?error=${encodeURIComponent(exchangeError.message)}`, request.url)
        );
      }

      // Redirect to next param or dashboard on success
      return NextResponse.redirect(getSafeRedirectUrl(next, origin));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Authentication failed";
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(message)}`, request.url)
      );
    }
  }

  // No code or error
  return NextResponse.redirect(new URL("/login", request.url));
}

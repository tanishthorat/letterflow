import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");

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

      // Redirect to dashboard on success
      return NextResponse.redirect(new URL("/dashboard", request.url));
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

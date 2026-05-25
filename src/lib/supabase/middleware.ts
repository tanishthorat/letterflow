import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            request.cookies.set(name, value);
          });
          
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  const url = request.nextUrl.clone();
  
  // Define routes that do not require authentication
  const isPublicRoute = 
    url.pathname === '/' || 
    url.pathname.startsWith('/auth/') || 
    url.pathname.startsWith('/api/') || 
    url.pathname === '/login' || 
    url.pathname === '/signup' ||
    url.pathname === '/forgot-password' ||
    url.pathname.startsWith('/images/') ||
    url.pathname === '/icon.svg' ||
    url.pathname === '/icon.png' ||
    url.pathname === '/apple-icon.png' ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/favicon.ico';

  const isAuthRoute = url.pathname === '/login' || url.pathname === '/signup' || url.pathname === '/forgot-password';

  // If unauthenticated and trying to access a protected route
  if (!user && !isPublicRoute) {
    url.pathname = '/login';
    url.searchParams.set('next', request.nextUrl.pathname + request.nextUrl.search);
    return NextResponse.redirect(url);
  }

  // If authenticated and trying to access login/signup
  if (user && isAuthRoute) {
    url.pathname = '/dashboard/templates';
    return NextResponse.redirect(url);
  }

  return response;
}

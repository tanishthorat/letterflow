import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (static assets)
     * - icon.png, icon.svg, apple-icon.png, favicon.ico (icons)
     * - manifest.json (app manifest)
     */
    "/((?!_next/static|_next/image|images|icon\\.png|icon\\.svg|apple-icon\\.png|favicon\\.ico|manifest\\.json).*)",
  ],
};

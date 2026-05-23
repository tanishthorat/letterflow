import { NextResponse } from "next/server";
import { generateEmailHtml } from "@/lib/email/generate";
import type { TemplateDesign } from "@/lib/editor/types";

export async function POST(request: Request) {
  try {
    const design: TemplateDesign = await request.json();
    
    if (!design) {
      return new NextResponse("Invalid design payload", { status: 400 });
    }

    const html = await generateEmailHtml(design);

    // Return the raw HTML as a text/html response
    return new NextResponse(html, {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        // Do not cache this preview
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error: unknown) {
    console.error("Error generating preview:", error);
    return new NextResponse("Error generating preview", { status: 500 });
  }
}

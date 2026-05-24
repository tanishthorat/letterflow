import { NextResponse } from "next/server";
import { generateEmailHtml } from "@/lib/email/generate";
import type { TemplateDesign } from "@/lib/editor/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    let design: TemplateDesign;
    let variables: Record<string, string> = {};

    if (body && body.design) {
      design = body.design;
      variables = body.variables || {};
    } else {
      design = body;
    }

    if (!design) {
      return new NextResponse("Invalid design payload", { status: 400 });
    }

    let html = await generateEmailHtml(design);

    if (variables && Object.keys(variables).length > 0) {
      const { replacePlaceholders } = await import("@/lib/editor/placeholders");
      html = replacePlaceholders(html, variables);
    }

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

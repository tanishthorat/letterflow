import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { render } from "@react-email/render";
import { TemplateRenderer } from "@/lib/email/renderers";
import * as React from "react";

export async function PATCH(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const supabase = await createClient();
    
    // Authenticate user via server client
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    if (body.body_design) {
      try {
        const design = {
          version: body.body_design.version || "2.0",
          stripes: body.body_design.stripes || [],
          globalStyles: body.global_styles || body.body_design.globalStyles || {}
        };

        const emailElement = React.createElement(TemplateRenderer, { design, previewText: body.preheader || "" });
        
        const html = await render(emailElement);
        const text = await render(emailElement, { plainText: true });

        body.body_html = html;
        body.body_text = text;

        const placeholderRegex = /{{\s*([^}]+)\s*}}/g;
        const placeholders = new Set<string>();
        let match;
        while ((match = placeholderRegex.exec(text)) !== null) {
          placeholders.add(match[1].trim());
        }
        body.placeholders = Array.from(placeholders);
      } catch (err) {
        console.error("Failed to render email on server:", err);
      }
    }

    // The RLS policies in the database automatically enforce that 
    // the user can only update a template where user_id matches their auth.uid()
    const { data, error } = await supabase
      .from("email_templates")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ template: data });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  props: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await props.params;
    const supabase = await createClient();
    
    // Authenticate user via server client
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // The RLS policies in the database automatically enforce that 
    // the user can only delete a template where user_id matches their auth.uid()
    const { error } = await supabase
      .from("email_templates")
      .delete()
      .eq("id", id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

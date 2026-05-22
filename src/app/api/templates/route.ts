import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Authenticate user via server client
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // RLS will automatically restrict results to the authenticated user
    const { data, error } = await supabase
      .from("email_templates")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ templates: data });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    
    // Authenticate user
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Prepare payload on the server for safety & standardization
    const newTemplate = {
      ...body,
      user_id: userData.user.id,
      name: body.name || "Untitled Template",
      slug: body.slug || `untitled-${Date.now()}`,
      subject: body.subject || "",
      body_html: body.body_html || "",
      body_text: body.body_text || "",
      body_design: body.body_design || {},
      category: body.category || "other",
      status: body.status || "draft",
      placeholders: body.placeholders || [],
      global_styles: body.global_styles || {},
    };

    const { data, error } = await supabase
      .from("email_templates")
      .insert([newTemplate])
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

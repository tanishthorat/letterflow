import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    
    // Authenticate user via server client
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "all";
    const sort = searchParams.get("sort") || "date_desc";

    const offset = (page - 1) * limit;

    let query = supabase
      .from("email_templates")
      .select("*", { count: "exact" });

    if (search) {
      query = query.or(`name.ilike.%${search}%,subject.ilike.%${search}%`);
    }

    if (category !== "all") {
      query = query.eq("category", category);
    }

    switch (sort) {
      case "name_asc":
        query = query.order("name", { ascending: true });
        break;
      case "name_desc":
        query = query.order("name", { ascending: false });
        break;
      case "modified_desc":
        query = query.order("updated_at", { ascending: false });
        break;
      case "date_asc":
        query = query.order("created_at", { ascending: true });
        break;
      case "date_desc":
      default:
        query = query.order("created_at", { ascending: false });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const hasMore = count !== null ? offset + limit < count : false;

    return NextResponse.json({ templates: data, hasMore, total: count });
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

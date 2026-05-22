import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

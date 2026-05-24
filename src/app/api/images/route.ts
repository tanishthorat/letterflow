import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "images";

export interface GalleryImage {
  name: string;
  path: string;
  publicUrl: string;
  createdAt: string;
  size: number;
}

export async function GET(_req: NextRequest) {
  try {
    // Read the authenticated user from the session cookie
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    // Each user's images live under their own subfolder
    const userFolder = `email-builder/uploads/${user.id}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .list(userFolder, {
        limit: 200,
        offset: 0,
        sortBy: { column: "created_at", order: "desc" },
      });

    if (error) {
      console.error("[images] list error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const images: GalleryImage[] = (data ?? [])
      .filter((f) => f.id !== null) // exclude Supabase placeholder entries
      .map((f) => {
        const path = `${userFolder}/${f.name}`;
        const { data: urlData } = supabase.storage
          .from(bucketName)
          .getPublicUrl(path);
        return {
          name: f.name,
          path,
          publicUrl: urlData.publicUrl,
          createdAt: f.created_at ?? "",
          size: f.metadata?.size ?? 0,
        };
      });

    return NextResponse.json({ images });
  } catch (err: any) {
    console.error("[images] unexpected error:", err?.message ?? err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized. Please sign in." }, { status: 401 });
    }

    const { path } = await req.json();

    if (!path || typeof path !== "string") {
      return NextResponse.json({ error: "Image path is required." }, { status: 400 });
    }

    // Ensure the user is only deleting from their own folder
    const userFolder = `email-builder/uploads/${user.id}/`;
    if (!path.startsWith(userFolder)) {
      return NextResponse.json({ error: "Unauthorized to delete this image." }, { status: 403 });
    }

    const { error } = await supabase.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      console.error("[images] delete error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("[images] unexpected delete error:", err?.message ?? err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

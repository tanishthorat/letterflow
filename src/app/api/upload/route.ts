import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const bucketName = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "images";

const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/avif",
]);
const MAX_BYTES = 2 * 1024 * 1024; // 2 MB

export async function POST(req: NextRequest) {
  try {
    // Accept multipart/form-data so the file never leaves the server boundary
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided." }, { status: 400 });
    }

    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" is not allowed. Use JPEG, PNG, GIF, WEBP, or AVIF.` },
        { status: 400 }
      );
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: "File size must be 2 MB or less." },
        { status: 400 }
      );
    }

    // Build a randomised, safe storage path
    const rawExt = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const safeExt = /^[a-z0-9]+$/.test(rawExt) ? rawExt : "bin";
    const uuid = crypto.randomUUID();
    const filePath = `email-builder/uploads/${uuid}.${safeExt}`;

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const arrayBuffer = await file.arrayBuffer();
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, arrayBuffer, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error("[upload] Supabase storage error:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    return NextResponse.json({
      publicUrl: publicUrlData.publicUrl,
      path: data.path,
      fileName: file.name,
    });
  } catch (err: any) {
    console.error("[upload] Unexpected error:", err?.message ?? err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

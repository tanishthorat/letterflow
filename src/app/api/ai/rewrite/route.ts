import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// AI Rewrite Route - Groq API powered
export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Authenticate user
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, content, blockType, context } = body;

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing or invalid prompt" }, { status: 400 });
    }

    if (!content || typeof content !== "string") {
      return NextResponse.json({ error: "Missing or invalid content to rewrite" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service is not configured. Missing GROQ_API_KEY." },
        { status: 503 }
      );
    }

    const systemPrompt = `You are an expert email copywriter assisting a user inside an email template builder.
Your task is to REWRITE the provided content based on the user's specific request.

CONTEXT:
- Block Type: ${blockType}
- Template Subject/Intent: ${context?.subject || 'Unknown'}

RULES:
- Return ONLY the rewritten text.
- Do NOT include markdown formatting, quotes, or conversational filler like "Here is the rewritten text:".
- Keep it concise if the block is a "button".
- Maintain any {{placeholder}} variables if they exist in the original text, unless explicitly asked to remove them.`;

    const userPrompt = `ORIGINAL CONTENT:
${content}

USER INSTRUCTION:
${prompt}`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    const result = data.choices?.[0]?.message?.content?.trim();

    if (!result) {
      throw new Error("Groq returned an empty response");
    }

    return NextResponse.json({ result });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "Internal server error";
    console.error("[AI Rewrite] Unhandled error:", error);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateEmailHtml } from "@/lib/email/generate";
import type { TemplateDesign } from "@/lib/editor/types";
import { parseDesign } from "@/lib/editor/utils";

const SYSTEM_PROMPT = `You are an expert email marketer and layout designer. Your task is to generate a fully structured JSON email template based on the user's prompt. 
You MUST return ONLY valid JSON. No markdown, no prose.

The JSON must exactly match this interface:
{
  "name": "string", // Short template name
  "subject": "string", // Compelling subject line
  "preheader": "string", // One sentence summary
  "category": "transactional" | "marketing" | "support" | "billing" | "system" | "other",
  "placeholders": [
    { "key": "first_name", "label": "First Name", "sampleValue": "John", "required": true }
  ],
  "body_design": {
    "version": "2.0",
    "globalStyles": {
      "contentBackgroundColor": "#ffffff",
      "contentWidth": 600,
      "responsiveDesign": true
    },
    "stripes": [ // STRIPES ARE MANDATORY. You must have at least one stripe!
      {
        "id": "stripe-<unique_id>",
        "type": "stripe",
        "props": { "backgroundColor": "#f3f4f6", "fullWidth": false, "paddingTop": 20, "paddingBottom": 20 },
        "structures": [ // STRUCTURES ARE MANDATORY inside stripes!
          {
            "id": "structure-<unique_id>",
            "type": "structure",
            "props": { "backgroundColor": "#ffffff", "paddingTop": 20, "paddingBottom": 20, "paddingLeft": 20, "paddingRight": 20 },
            "columns": [ // COLUMNS ARE MANDATORY inside structures!
              {
                "id": "col-<unique_id>",
                "widthRatio": 1,
                "props": { "paddingTop": 0, "paddingBottom": 0, "paddingLeft": 0, "paddingRight": 0 },
                "blocks": [ // BLOCKS ARE MANDATORY inside columns!
                   {
                     "id": "block-<unique_id>",
                     "type": "text",
                     "props": { "content": "Top Picks For You", "fontSizeDesktop": 24, "color": "#333333", "alignDesktop": "center", "fontWeight": "bold" }
                   },
                   {
                     "id": "block-<unique_id>",
                     "type": "text",
                     "props": { "content": "Here is your robust email text in plain text format.", "fontSizeDesktop": 16, "color": "#666666", "alignDesktop": "left" }
                   },
                   {
                     "id": "block-<unique_id>",
                     "type": "button",
                     "props": { "text": "Shipping & Delivery", "href": "https://example.com", "buttonColor": "transparent", "textColor": "#000000", "fontSizeDesktop": 14, "alignDesktop": "left" }
                   }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
}

CRITICAL RULES:
1. HIERARCHY: You MUST ALWAYS use the exact hierarchy: stripes -> structures -> columns -> blocks. NEVER skip a layer.
2. CONTENT: Generate robust, professional marketing copy. You MUST use PLAIN TEXT ONLY for text blocks. DO NOT use any HTML tags (no <h1>, <p>, <strong>, <br>, etc.). Use the block properties like fontSizeDesktop and fontWeight to style text.
3. LINKS: To create a clickable text link (like in a footer), you MUST use a "button" block with "buttonColor": "transparent" and "textColor" set to the link color.
4. STRIPES: ALWAYS set "fullWidth": false on stripes unless explicitly requested otherwise.
5. COLUMNS: You can use up to 4 columns in a structure (widthRatio: 1 for each).
6. IDs: Generate valid, unique string IDs for every element (e.g., "stripe-123", "block-456").
7. MUST return ONLY a JSON object (starts with {).`;

type GeneratedTemplate = {
  name: string;
  subject: string;
  preheader?: string;
  category: string;
  placeholders: Array<{
    key: string;
    label: string;
    sampleValue: string;
    required: boolean;
  }>;
  body_design: TemplateDesign;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    // Authenticate user
    const { data: userData, error: authError } = await supabase.auth.getUser();
    if (authError || !userData?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a meaningful prompt (at least 5 characters)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service is not configured. Missing GROQ_API_KEY." },
        { status: 503 }
      );
    }

    // Call Groq API natively
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Use current recommended 70b model
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `Create an email template for: ${prompt}` },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Groq API error: ${response.status}`);
    }

    const data = await response.json();
    let resultText = data.choices?.[0]?.message?.content?.trim();

    if (!resultText) {
      throw new Error("Groq returned an empty response");
    }

    // Sometimes LLMs wrap in markdown despite response_format
    if (resultText.startsWith("```json")) {
      resultText = resultText.replace(/^```json\n?/, "").replace(/\n?```$/, "");
    }

    let generated: GeneratedTemplate;
    try {
      generated = JSON.parse(resultText) as GeneratedTemplate;
    } catch (e) {
      console.error("[AI Template] Failed to parse JSON:", resultText);
      return NextResponse.json(
        { error: "AI generated invalid JSON. Please try again." },
        { status: 502 }
      );
    }

    // Basic validation
    if (!generated.name || !generated.subject || !generated.body_design) {
      return NextResponse.json(
        { error: "AI generated incomplete template data. Please refine your prompt." },
        { status: 502 }
      );
    }

    // Parse design to ensure it has proper structure and IDs
    const parsedDesign = parseDesign(generated.body_design);

    // Generate HTML from the parsed design
    const body_html = await generateEmailHtml(parsedDesign);

    // Build slug
    const slug =
      generated.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 60) + `-${Date.now()}`;

    const validCategories = ["transactional", "marketing", "support", "billing", "system", "other"];
    const category = validCategories.includes(generated.category) ? generated.category : "other";

    // Extract text from HTML safely
    const body_text = body_html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();

    // Insert new template into Supabase
    const { data: template, error: insertError } = await supabase
      .from("email_templates")
      .insert([
        {
          user_id: userData.user.id,
          name: generated.name,
          slug,
          subject: generated.subject,
          preheader: generated.preheader ?? null,
          body_html,
          body_text,
          body_design: parsedDesign as any,
          category,
          status: "draft",
          placeholders: generated.placeholders ?? [],
          global_styles: parsedDesign.globalStyles as any,
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("[AI Template] Supabase insert error:", insertError);
      return NextResponse.json(
        { error: "Failed to save the generated template." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      templateId: template.id,
      templateName: template.name,
    });
  } catch (error: unknown) {
    const err = error instanceof Error ? error.message : "Internal server error";
    console.error("[AI Template] Unhandled error:", error);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

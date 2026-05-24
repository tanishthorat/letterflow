import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { createClient } from "@/lib/supabase/server";

// Model priority: try each in order until one works.
// gemini-1.5-flash has a real free tier (15 RPM, 1500 req/day).
// gemini-2.0-flash-lite is also free-tier.
const MODEL_PRIORITY = [
  "gemini-1.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-8b",
];

const SYSTEM_PROMPT = `You are an expert email copywriter helping a non-technical SaaS team member create email templates.
Given a plain-English description of an email, generate:
1. A compelling, concise subject line
2. A preheader text (1 sentence, max 120 chars)
3. A clean HTML email body (inline styles, suitable for email clients, use {{placeholder}} syntax for dynamic values)

Return ONLY valid JSON in this exact format (no markdown fences, no extra text):
{
  "name": "<short template name>",
  "subject": "<email subject line>",
  "preheader": "<preheader text>",
  "body_html": "<full HTML body with inline styles>",
  "category": "<one of: transactional|marketing|support|billing|system|other>",
  "placeholders": [
    {"key": "placeholder_key", "label": "Human Label", "sampleValue": "example value", "required": true}
  ]
}

Rules for body_html:
- Use a clean, professional layout with a max-width of 600px
- Use inline CSS styles only (no <style> tags, no classes)
- Use a white background (#ffffff) with #222222 text
- Include a header area with the brand name, a main content area, and a footer
- Use {{placeholder_key}} for dynamic values like {{first_name}}, {{company_name}}, etc.
- Make it look like a real transactional/marketing email
- Do NOT include <!DOCTYPE>, <html>, <head>, or <body> tags — just the email content fragment`;

type GeneratedTemplate = {
  name: string;
  subject: string;
  preheader?: string;
  body_html: string;
  category: string;
  placeholders: Array<{
    key: string;
    label: string;
    sampleValue: string;
    required: boolean;
  }>;
};

async function generateWithModel(
  genAI: GoogleGenerativeAI,
  modelName: string,
  userPrompt: string
): Promise<GeneratedTemplate> {
  const model = genAI.getGenerativeModel({
    model: modelName,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 4096,
      responseMimeType: "application/json",
    },
  });

  const result = await model.generateContent(
    `${SYSTEM_PROMPT}\n\nCreate an email template for: ${userPrompt}`
  );

  const text = result.response.text();
  return JSON.parse(text) as GeneratedTemplate;
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
    const { prompt } = body;

    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Please provide a meaningful prompt (at least 5 characters)." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "AI service is not configured. Please add GEMINI_API_KEY to your environment variables.",
        },
        { status: 503 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Try each model in priority order — fall through on quota/rate-limit errors
    let generated: GeneratedTemplate | null = null;
    let lastError: Error | null = null;

    for (const modelName of MODEL_PRIORITY) {
      try {
        console.log(`[AI Draft] Trying model: ${modelName}`);
        generated = await generateWithModel(genAI, modelName, prompt.trim());
        console.log(`[AI Draft] Success with model: ${modelName}`);
        break;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        lastError = err instanceof Error ? err : new Error(msg);

        // Only fall through for quota/rate-limit errors (429)
        if (
          msg.includes("429") ||
          msg.includes("RESOURCE_EXHAUSTED") ||
          msg.includes("quota") ||
          msg.includes("rate")
        ) {
          console.warn(`[AI Draft] Model ${modelName} quota exceeded, trying next…`);
          continue;
        }

        // For any other error (auth, invalid request, parse fail), stop immediately
        throw err;
      }
    }

    if (!generated) {
      console.error("[AI Draft] All models exhausted:", lastError);
      return NextResponse.json(
        {
          error:
            "All AI models are currently quota-limited. Please check your GEMINI_API_KEY at https://aistudio.google.com/app/apikey — make sure billing or a valid free-tier project is linked.",
        },
        { status: 429 }
      );
    }

    // Validate required fields
    if (!generated.name || !generated.subject || !generated.body_html) {
      return NextResponse.json(
        {
          error:
            "AI generated incomplete template data. Please refine your prompt.",
        },
        { status: 502 }
      );
    }

    // Build slug
    const slug =
      generated.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .substring(0, 60) + `-${Date.now()}`;

    const validCategories = [
      "transactional",
      "marketing",
      "support",
      "billing",
      "system",
      "other",
    ];
    const category = validCategories.includes(generated.category)
      ? generated.category
      : "other";

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
          body_html: generated.body_html,
          body_text: generated.body_html
            .replace(/<[^>]+>/g, " ")
            .replace(/\s+/g, " ")
            .trim(),
          body_design: { ai_generated: true, prompt },
          category,
          status: "draft",
          placeholders: generated.placeholders ?? [],
          global_styles: {},
        },
      ])
      .select()
      .single();

    if (insertError) {
      console.error("[AI Draft] Supabase insert error:", insertError);
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
    console.error("[AI Draft] Unhandled error:", error);
    return NextResponse.json({ error: err }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { Resend } from "resend";
import { generateEmailHtml } from "@/lib/email/generate";
import { replacePlaceholders } from "@/lib/editor/placeholders";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { to, subject, design, variables, apiKey, from: customFrom } = body;

    // Validation
    if (!to) {
      return NextResponse.json({ error: "Recipient email is required" }, { status: 400 });
    }
    if (!subject) {
      return NextResponse.json({ error: "Subject line is required" }, { status: 400 });
    }
    if (!design) {
      return NextResponse.json({ error: "Template design payload is required" }, { status: 400 });
    }

    // Determine Resend API Key (Custom override or Server env key)
    const resendKey = apiKey || process.env.RESEND_API_KEY;
    if (!resendKey) {
      return NextResponse.json(
        { 
          error: "Missing Resend API Key. Please provide one in the preview panel or configure RESEND_API_KEY in the environment." 
        }, 
        { status: 400 }
      );
    }

    // Generate and substitute placeholders in the HTML
    let html = await generateEmailHtml(design);
    if (variables && Object.keys(variables).length > 0) {
      html = replacePlaceholders(html, variables);
    }

    // Initialize Resend
    const resend = new Resend(resendKey);

    // Determine Sender: Resend custom sender or env sender or fallback
    const fromAddress = customFrom || process.env.RESEND_FROM_EMAIL || "Letterflow <contact@tanishdev.me>";

    const { data, error } = await resend.emails.send({
      from: fromAddress,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("Resend API error:", error);
      return NextResponse.json(
        { 
          error: error.message || "Failed to send email through Resend API." 
        }, 
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error: any) {
    console.error("Error in send-test endpoint:", error);
    return NextResponse.json(
      { 
        error: error.message || "Internal server error occurred while sending the test email." 
      }, 
      { status: 500 }
    );
  }
}

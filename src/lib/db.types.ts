// Email Template Schema Types
export interface EmailTemplate {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  description: string | null;
  subject: string;
  preheader: string | null;
  body_design: Record<string, any>;
  body_html: string;
  body_text: string;
  category: "transactional" | "marketing" | "support" | "billing" | "system" | "other";
  status: "draft" | "published" | "archived";
  placeholders: Array<{
    key: string;
    label: string;
    sampleValue: string;
    required: boolean;
  }>;
  global_styles: Record<string, any>;
  is_responsive: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestEmailLog {
  id: string;
  template_id: string;
  user_id: string;
  recipient_email: string;
  provider: string;
  provider_message_id: string | null;
  status: "queued" | "sent" | "failed";
  error_message: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

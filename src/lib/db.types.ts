// Email Template Schema Types
export interface EmailTemplate {
  id: string;
  user_id: string;
  name: string;
  subject: string;
  body: string;
  category: "welcome" | "transactional" | "marketing" | "notification" | "other";
  status: "draft" | "published" | "archived";
  variables: Record<string, string>; // JSON field for template variables
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

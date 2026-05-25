import { TemplateDesign } from "@/lib/editor/types";
import { awsVerifyTemplate } from "./aws-verify";

export interface PreBuiltTemplate {
  id: string;
  name: string;
  description: string;
  category: "transactional" | "marketing" | "support" | "billing" | "system" | "other";
  thumbnail?: string; // Optional URL or base64
  design: TemplateDesign;
}

export const PRE_BUILT_TEMPLATES: PreBuiltTemplate[] = [
  {
    id: "aws-verify",
    name: "AWS Verification Email",
    description: "A standard verification email template mimicking the Amazon Web Services design.",
    category: "transactional",
    thumbnail: "/static/aws-thumbnail.png", // We can leave this as a placeholder or remove
    design: awsVerifyTemplate,
  },
];

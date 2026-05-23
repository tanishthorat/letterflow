import { render } from "@react-email/render";
import { TemplateRenderer } from "./renderers";
import type { TemplateDesign } from "@/lib/editor/types";
import React from "react";

export async function generateEmailHtml(design: TemplateDesign): Promise<string> {
  // Use @react-email/render to convert the React elements to a full HTML string
  const element = React.createElement(TemplateRenderer, { design });
  const html = await render(element);
  return html;
}

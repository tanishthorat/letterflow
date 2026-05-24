import type { TemplateDesign } from "./types";

/**
 * Extracts unique placeholder keys (e.g. "first_name" from "{{first_name}}")
 * from the template design content.
 */
export function extractPlaceholders(design: TemplateDesign): string[] {
  const placeholders = new Set<string>();
  const regex = /\{\{\s*([a-zA-Z0-9_-]+)\s*\}\}/g;

  const scanText = (text: string) => {
    if (!text) return;
    // Reset regex index to prevent state issues
    regex.lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      placeholders.add(match[1]);
    }
  };

  const scanObj = (obj: any) => {
    if (!obj) return;
    if (typeof obj === "string") {
      scanText(obj);
    } else if (Array.isArray(obj)) {
      obj.forEach(scanObj);
    } else if (typeof obj === "object") {
      Object.values(obj).forEach(scanObj);
    }
  };

  if (design && Array.isArray(design.stripes)) {
    design.stripes.forEach((stripe) => {
      if (stripe.structures) {
        stripe.structures.forEach((structure) => {
          if (structure.columns) {
            structure.columns.forEach((column) => {
              if (column.blocks) {
                column.blocks.forEach((block) => {
                  if (block.props) {
                    scanObj(block.props);
                  }
                });
              }
            });
          }
        });
      }
    });
  }

  return Array.from(placeholders);
}

/**
 * Replaces placeholders in the HTML string with their corresponding variable values.
 * If a placeholder has no mock value, it keeps it as-is.
 */
export function replacePlaceholders(html: string, variables: Record<string, string>): string {
  let result = html;
  Object.entries(variables).forEach(([key, value]) => {
    const escapedKey = key.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
    const regex = new RegExp(`\\{\\{\\s*${escapedKey}\\s*\\}\\}`, "g");
    result = result.replace(regex, value);
  });
  return result;
}

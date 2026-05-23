import * as React from "react";
import { Html, Head, Body, Container, Text, Img, Button, Link, Font, Preview, Section } from "@react-email/components";
import type { EditorBlock, GlobalStyles, TemplateDesign } from "@/lib/editor/types";
import { BLOCK_REGISTRY } from "@/lib/editor/registry";

interface RenderEmailProps {
  design: TemplateDesign;
  previewText?: string;
  // In the future we will pass placeholders mapped to actual data here
}

export function TemplateRenderer({ design, previewText }: RenderEmailProps) {
  const { globalStyles, blocks } = design;

  // Process blocks
  const emailBlocks = blocks.map((block, index) => {
    const config = BLOCK_REGISTRY[block.type];
    if (!config || !config.renderEmail) return null;
    return (
      <React.Fragment key={block.id || index}>
        {config.renderEmail({ block })}
      </React.Fragment>
    );
  });

  return (
    <Html lang="en">
      <Head>
        <Font
          fontFamily={globalStyles.defaultFontFamily.split(",")[0].replace(/['"]/g, "")}
          fallbackFontFamily="sans-serif"
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      {previewText && <Preview>{previewText}</Preview>}
      <Body style={{ backgroundColor: globalStyles.bodyBackgroundColor, margin: 0, padding: 0 }}>
        <Container 
          style={{ 
            backgroundColor: globalStyles.contentBackgroundColor, 
            width: "100%", 
            maxWidth: `${globalStyles.contentWidth}px`, 
            margin: "0 auto" 
          }}
        >
          {emailBlocks}
        </Container>
      </Body>
    </Html>
  );
}

import * as React from "react";
import { Html, Head, Body, Container, Font, Preview, Section, Row as EmailRow, Column as EmailColumn } from "@react-email/components";
import type { GlobalStyles, TemplateDesign } from "@/lib/editor/types";
import { BLOCK_REGISTRY } from "@/lib/editor/registry";
import { migrateDesign } from "@/lib/editor/store";

interface RenderEmailProps {
  design: any;
  previewText?: string;
}

export function TemplateRenderer({ design, previewText }: RenderEmailProps) {
  // Always migrate to ensure we have version 2.0 structure
  const migratedDesign = migrateDesign(design);
  const { globalStyles, stripes } = migratedDesign;

  const emailStripes = stripes.map((stripe) => {
    return (
      <Section 
        key={stripe.id} 
        style={{ 
          backgroundColor: stripe.props.backgroundColor || "transparent", 
          padding: `${stripe.props.paddingTop || 0}px 0 ${stripe.props.paddingBottom || 0}px 0`,
          width: stripe.props.fullWidth ? "100%" : "inherit"
        }}
      >
        {stripe.structures.map((structure) => (
          <Section 
            key={structure.id}
            style={{
              backgroundColor: structure.props.backgroundColor || "transparent",
              padding: `${structure.props.paddingTop || 0}px ${structure.props.paddingRight || 0}px ${structure.props.paddingBottom || 0}px ${structure.props.paddingLeft || 0}px`
            }}
          >
            <EmailRow>
              {structure.columns.map((col: any) => (
                <EmailColumn 
                  key={col.id} 
                  style={{ 
                    width: `${col.widthRatio * 100}%`,
                    backgroundColor: col.props.backgroundColor || "transparent",
                    padding: `${col.props.paddingTop || 0}px ${col.props.paddingRight || 0}px ${col.props.paddingBottom || 0}px ${col.props.paddingLeft || 0}px`,
                    verticalAlign: col.props.verticalAlign || "top"
                  }}
                >
                  {col.blocks.map((block: any) => {
                    const config = BLOCK_REGISTRY[block.type as keyof typeof BLOCK_REGISTRY];
                    if (!config || !config.renderEmail) return null;
                    return (
                      <React.Fragment key={block.id}>
                        {config.renderEmail({ block })}
                      </React.Fragment>
                    );
                  })}
                </EmailColumn>
              ))}
            </EmailRow>
          </Section>
        ))}
      </Section>
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
          {emailStripes}
        </Container>
      </Body>
    </Html>
  );
}

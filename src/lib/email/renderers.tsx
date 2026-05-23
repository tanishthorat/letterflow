import * as React from "react";
import { Html, Head, Body, Container, Font, Preview, Section, Row as EmailRow, Column as EmailColumn } from "@react-email/components";
import type { GlobalStyles, TemplateDesign, Stripe, Structure, Column, ContentBlock } from "@/lib/editor/types";
import { BLOCK_REGISTRY } from "@/lib/editor/registry";
import { parseDesign } from "@/lib/editor/utils";

interface RenderEmailProps {
  design: unknown;
  previewText?: string;
}

export function TemplateRenderer({ design, previewText }: RenderEmailProps) {
  // Always migrate to ensure we have version 2.0 structure
  const migratedDesign = parseDesign(design);
  const { globalStyles, stripes } = migratedDesign;

  const emailStripes = stripes.map((stripe: Stripe) => {
    return (
      <Section
        key={stripe.id}
        style={{
          backgroundColor: stripe.props.backgroundColor || "transparent",
          backgroundImage: stripe.props.backgroundImageUrl ? `url(${stripe.props.backgroundImageUrl})` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: `${stripe.props.paddingTop || 0}px 0 ${stripe.props.paddingBottom || 0}px 0`,
          width: "100%"
        }}
      >
        <Container
          style={{
            width: "100%",
            maxWidth: stripe.props.fullWidth ? "100%" : `${globalStyles.contentWidth}px`,
            margin: "0 auto",
          }}
        >
          {stripe.structures.map((structure: Structure) => {
            const totalRatio = structure.columns.reduce((sum, col) => sum + col.widthRatio, 0);
            return (
              <Section
                key={`${structure.id}-wrapper`}
                style={{
                  padding: `${structure.props.marginTop || 0}px ${structure.props.marginRight || 0}px ${structure.props.marginBottom || 0}px ${structure.props.marginLeft || 0}px`,
                  backgroundColor: "transparent",
                }}
              >
                <Section
                  key={structure.id}
                  style={{
                    backgroundColor: structure.props.backgroundColor && structure.props.backgroundColor !== "transparent"
                      ? structure.props.backgroundColor
                      : globalStyles.contentBackgroundColor,
                    padding: `${structure.props.paddingTop || 0}px ${structure.props.paddingRight || 0}px ${structure.props.paddingBottom || 0}px ${structure.props.paddingLeft || 0}px`,
                  }}
                >
                  <EmailRow>
                    {structure.columns.map((col: Column) => (
                      <EmailColumn
                        key={col.id}
                        className="responsive-column"
                        style={{
                          width: totalRatio > 0 ? `${(col.widthRatio / totalRatio) * 100}%` : "100%",
                          backgroundColor: col.props.backgroundColor || "transparent",
                          padding: `${col.props.paddingTop || 0}px ${col.props.paddingRight || 0}px ${col.props.paddingBottom || 0}px ${col.props.paddingLeft || 0}px`,
                          verticalAlign: col.props.verticalAlign || "top"
                        }}
                      >
                        {col.blocks.map((block: ContentBlock) => {
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
              </Section>
            );
          })}
        </Container>
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
        {globalStyles.responsiveDesign !== false && (
          <style>
            {`
              @media only screen and (max-width: 600px) {
                .responsive-column {
                  width: 100% !important;
                  display: block !important;
                  box-sizing: border-box !important;
                }
              }
            `}
          </style>
        )}
      </Head>
      {previewText && <Preview>{previewText}</Preview>}
      <Body style={{ margin: 0, padding: 0 }}>
        <Section
          style={{
            backgroundColor: globalStyles.contentBackgroundColor,
            width: "100%",
          }}
        >
          {emailStripes}
        </Section>
      </Body>
    </Html>
  );
}

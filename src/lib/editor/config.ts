import { StripeProps, StructureProps, ColumnProps } from "./types";

export const DEFAULT_STRIPE_PROPS: StripeProps = {
  backgroundColor: "transparent",
  paddingTop: 10,
  paddingBottom: 10,
  fullWidth: false,
};

export const DEFAULT_STRUCTURE_PROPS: StructureProps = {
  backgroundColor: "transparent",
  paddingTop: 20,
  paddingBottom: 20,
  paddingLeft: 20,
  paddingRight: 20,
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 0,
  marginRight: 0,
  columnGap: 35,
};

export const DEFAULT_COLUMN_PROPS: ColumnProps = {
  backgroundColor: "transparent",
  paddingTop: 0,
  paddingBottom: 0,
  paddingLeft: 0,
  paddingRight: 0,
  verticalAlign: "top",
};

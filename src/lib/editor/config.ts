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

export const NODE_COLORS = {
  stripe: {
    color: "#5c6e99",
    ring: "ring-[#5c6e99]",
    hoverRing: "hover:ring-[#5c6e99]/50",
    bg: "bg-[#5c6e99]",
    lightBg: "bg-[#5c6e99]/10"
  },
  structure: {
    color: "#a75d5d",
    ring: "ring-[#a75d5d]",
    hoverRing: "hover:ring-[#a75d5d]/50",
    bg: "bg-[#a75d5d]",
    lightBg: "bg-[#a75d5d]/10"
  },
  column: {
    color: "#7faeef",
    ring: "ring-[#7faeef]",
    hoverRing: "hover:ring-[#7faeef]/50",
    bg: "bg-[#7faeef]",
    lightBg: "bg-[#7faeef]/10"
  },
  block: {
    color: "#3b82f6", // equivalent to blue-500
    ring: "ring-blue-500",
    hoverRing: "hover:ring-blue-300",
    bg: "bg-blue-500",
    lightBg: "bg-blue-500/10"
  }
};

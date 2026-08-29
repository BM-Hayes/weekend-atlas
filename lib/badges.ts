import type { Badge } from "./types";

export const BADGE_COPY: Record<
  Badge,
  { label: string; blurb: string }
> = {
  operator: {
    label: "Operator",
    blurb: "Submitted or confirmed by the people who run the place.",
  },
  verified: {
    label: "Verified",
    blurb: "Hours and location checked against a public source this season.",
  },
  community: {
    label: "Community",
    blurb: "Local report. Useful, not yet independently checked.",
  },
  unverified: {
    label: "Unverified",
    blurb: "Seeded from public lists. Treat hours as a hint.",
  },
};

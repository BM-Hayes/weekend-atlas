import { BADGE_COPY } from "@/lib/badges";
import type { Badge as BadgeKind, Place } from "@/lib/types";

export type ListingCat = "haunts" | "antiques" | "parks" | "farms";

const CAT_LABEL: Record<ListingCat, string> = {
  haunts: "Haunt",
  antiques: "Antiques",
  parks: "Park",
  farms: "Farm",
};

export function placeCategory(place: Place): ListingCat {
  const tag = place.tags[0];
  if (tag === "haunts" || tag === "antiques" || tag === "parks" || tag === "farms") {
    return tag;
  }
  return "parks";
}

export function Badge({ kind }: { kind: BadgeKind }) {
  return (
    <span className="badge" data-badge={kind} title={BADGE_COPY[kind].blurb}>
      {BADGE_COPY[kind].label}
    </span>
  );
}

export function CategoryChip({ place }: { place: Place }) {
  const cat = placeCategory(place);
  return (
    <span className="cat-chip" data-category={cat}>
      {CAT_LABEL[cat]}
    </span>
  );
}

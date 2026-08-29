import { BADGE_COPY } from "@/lib/badges";
import type { Badge as BadgeKind } from "@/lib/types";

export function Badge({ kind }: { kind: BadgeKind }) {
  return (
    <span className="badge" data-badge={kind} title={BADGE_COPY[kind].blurb}>
      {BADGE_COPY[kind].label}
    </span>
  );
}

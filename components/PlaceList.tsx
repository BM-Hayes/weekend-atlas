import { Badge, CategoryChip } from "./Badge";
import { driveLabel } from "@/lib/weekend";
import type { HubId, Place } from "@/lib/types";

export function PlaceList({
  places,
  hub,
  selectedId,
  onSelect,
}: {
  places: Place[];
  hub: HubId;
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  if (!places.length) {
    return (
      <p className="p-4 text-sm text-[#6b6356]">
        Nothing in this cut. Widen the drive time or switch category.
      </p>
    );
  }

  return (
    <ul className="m-0 flex list-none flex-col gap-2 p-3">
      {places.map((p) => {
        const active = p.id === selectedId;
        return (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onSelect(p.id)}
              className={`place-card ${active ? "is-active" : ""}`}
            >
              <span className="flex items-start gap-3">
                <span className="mt-0.5 font-mono text-[11px] tabular-nums text-[#3d5c45]">
                  {String(p.driveMinutes[hub]).padStart(2, "0")}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="display block truncate text-[16px] leading-snug">
                    {p.name}
                  </span>
                  <span className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs text-[#6b6356]">
                    <CategoryChip place={p} />
                    <Badge kind={p.badge} />
                    <span>
                      {p.city} · {driveLabel(p.driveMinutes[hub])}
                    </span>
                  </span>
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

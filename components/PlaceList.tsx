import { Badge } from "./Badge";
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
        Nothing in this cut. Widen the drive time or switch to Fall season.
      </p>
    );
  }

  return (
    <ul className="m-0 list-none divide-y divide-[#e0d3b6] p-0">
      {places.map((p) => {
        const active = p.id === selectedId;
        return (
          <li key={p.id}>
            <button
              type="button"
              onClick={() => onSelect(p.id)}
              className={`flex w-full items-start gap-3 px-4 py-3 text-left ${
                active ? "bg-[#efe4c8]" : "hover:bg-[#f3ead8]"
              }`}
            >
              <span className="mt-1 font-mono text-xs text-[#3d5a46]">
                {String(p.driveMinutes[hub]).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate font-medium">{p.name}</span>
                <span className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-[#6b6356]">
                  <Badge kind={p.badge} />
                  {p.city} · {driveLabel(p.driveMinutes[hub])}
                </span>
              </span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

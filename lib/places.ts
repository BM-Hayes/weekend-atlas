import type { HubId, Place } from "./types";
import placesData from "@/data/places.json";
import { FALL_2026, isOpenThisWeekend } from "./weekend";

export const PLACES = placesData as Place[];

export type ViewMode = "weekend" | "fall";

function inFallCatalog(place: Place): boolean {
  if (place.fallWeight < 4) return false;
  if (!place.season) return true;
  return place.season.start <= FALL_2026.end && place.season.end >= FALL_2026.start;
}

export function filterPlaces(
  places: Place[],
  opts: { mode: ViewMode; hub: HubId; kinds?: Place["kind"][]; maxMinutes?: number },
): Place[] {
  return places
    .filter((p) => {
      if (opts.mode === "weekend") return isOpenThisWeekend(p);
      return inFallCatalog(p);
    })
    .filter((p) => (opts.kinds?.length ? opts.kinds.includes(p.kind) : true))
    .filter((p) =>
      opts.maxMinutes ? p.driveMinutes[opts.hub] <= opts.maxMinutes : true,
    )
    .sort((a, b) => {
      const da = a.driveMinutes[opts.hub] - b.driveMinutes[opts.hub];
      if (da !== 0) return da;
      return b.fallWeight - a.fallWeight;
    });
}

export function getPlace(id: string): Place | undefined {
  return PLACES.find((p) => p.id === id);
}

import type { HubId, Place } from "./types";
import placesData from "@/data/places.json";
import { isOpenThisWeekend, inSeason } from "./weekend";

export const PLACES = placesData as Place[];

export type ViewMode = "weekend" | "fall";

export function filterPlaces(
  places: Place[],
  opts: { mode: ViewMode; hub: HubId; kinds?: Place["kind"][]; maxMinutes?: number },
): Place[] {
  return places
    .filter((p) => {
      if (opts.mode === "weekend") return isOpenThisWeekend(p);
      return inSeason(p) && p.fallWeight >= 4;
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

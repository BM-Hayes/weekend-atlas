import type { HubId, Place } from "./types";
import {
  filterListings,
  getAllListings,
  listingToPlace,
} from "./atlasData";
import type { DriveTimeCap, ListingCategory } from "@/types/atlas";

export const PLACES: Place[] = getAllListings().map(listingToPlace);

export type ViewMode = "weekend" | "fall";

export function filterPlaces(
  _places: Place[],
  opts: {
    mode?: ViewMode;
    hub: HubId;
    maxMinutes?: number;
    category?: ListingCategory;
  },
): Place[] {
  const cap = (opts.maxMinutes ?? 90) as DriveTimeCap;
  const category = opts.category ?? "all";
  return filterListings({
    hub: opts.hub,
    maxDriveTime: cap === 20 || cap === 35 || cap === 50 || cap === 90 ? cap : 90,
    category,
  }).map(listingToPlace);
}

import listingsData from "@/data/listings.json";
import type { AtlasFilters, HubId, Listing } from "@/types/atlas";
import type { Place, PlaceKind } from "@/lib/types";

export const HUBS: Record<HubId, { name: string; coordinates: [number, number] }> =
  {
    hartsville: { name: "Hartsville", coordinates: [-80.0731, 34.3743] },
    florence: { name: "Florence", coordinates: [-79.7626, 34.1954] },
    cheraw: { name: "Cheraw", coordinates: [-79.8834, 34.6977] },
  };

const KIND: Record<Listing["category"], PlaceKind> = {
  haunts: "event",
  antiques: "market",
  parks: "trail",
  farms: "farm",
};

export function getAllListings(): Listing[] {
  return listingsData as Listing[];
}

export function filterListings(filters: AtlasFilters): Listing[] {
  return getAllListings()
    .filter((item) => {
      const time = item.driveTimes[filters.hub] ?? 999;
      const matchesDrive = time <= filters.maxDriveTime;
      const matchesCategory =
        filters.category === "all" || item.category === filters.category;
      return matchesDrive && matchesCategory;
    })
    .sort(
      (a, b) =>
        (a.driveTimes[filters.hub] ?? 999) - (b.driveTimes[filters.hub] ?? 999),
    );
}

export function listingToPlace(item: Listing): Place {
  return {
    id: item.id,
    name: item.title,
    kind: KIND[item.category],
    badge: item.link ? "verified" : "community",
    lat: item.coordinates[1],
    lng: item.coordinates[0],
    city: item.city,
    county: "",
    oneLiner: item.tagline,
    whyThisWeekend:
      item.season === "fall"
        ? "Fall season. Confirm the night or weekend hours on the official page before you drive."
        : "Year-round. Weekend hours on the operator page.",
    hours:
      item.season === "fall"
        ? [{ days: ["fri", "sat"], open: "19:00", close: "23:00" }]
        : [
            {
              days: ["sat", "sun"],
              open: "10:00",
              close: "17:00",
            },
          ],
    website: item.link || undefined,
    source: "data/listings.json",
    tags: [item.category, item.season],
    driveMinutes: item.driveTimes,
    fallWeight: item.season === "fall" ? 8 : 6,
  };
}

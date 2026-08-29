import type { Place } from "./types";
import { PLACES } from "./places";
import { getSupabase } from "./supabase";

export type ListingRow = {
  slug: string;
  name: string;
  kind: Place["kind"];
  badge: Place["badge"];
  lat: number;
  lng: number;
  city: string;
  county: string;
  region: string;
  one_liner: string;
  why_this_weekend: string;
  hours: Place["hours"];
  season_start: string | null;
  season_end: string | null;
  season_label: string | null;
  website: string | null;
  source: string | null;
  tags: string[];
  drive_minutes_hartsville: number;
  drive_minutes_florence: number;
  drive_minutes_cheraw: number;
  fall_weight: number;
  published: boolean;
};

export function listingToPlace(row: ListingRow): Place {
  return {
    id: row.slug,
    name: row.name,
    kind: row.kind,
    badge: row.badge,
    lat: row.lat,
    lng: row.lng,
    city: row.city,
    county: row.county,
    oneLiner: row.one_liner,
    whyThisWeekend: row.why_this_weekend,
    hours: row.hours ?? [],
    season:
      row.season_start && row.season_end
        ? {
            start: row.season_start,
            end: row.season_end,
            label: row.season_label || `${row.season_start}–${row.season_end}`,
          }
        : undefined,
    website: row.website || undefined,
    source: row.source || "listings",
    tags: row.tags ?? [],
    driveMinutes: {
      hartsville: row.drive_minutes_hartsville,
      florence: row.drive_minutes_florence,
      cheraw: row.drive_minutes_cheraw,
    },
    fallWeight: row.fall_weight,
  };
}

export async function getPublishedListings(): Promise<Place[]> {
  const supabase = getSupabase();
  if (!supabase) return PLACES;

  const { data, error } = await supabase
    .from("listings")
    .select(
      "slug,name,kind,badge,lat,lng,city,county,region,one_liner,why_this_weekend,hours,season_start,season_end,season_label,website,source,tags,drive_minutes_hartsville,drive_minutes_florence,drive_minutes_cheraw,fall_weight,published",
    )
    .eq("published", true)
    .eq("region", "pee-dee");

  if (error || !data?.length) return PLACES;
  return (data as ListingRow[]).map(listingToPlace);
}

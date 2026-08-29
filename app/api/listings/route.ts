import { NextResponse } from "next/server";
import { getPublishedListings } from "@/lib/listings";
import { filterPlaces, type ViewMode } from "@/lib/places";
import type { HubId } from "@/lib/types";

export const revalidate = 300;

export async function GET(req: Request) {
  const url = new URL(req.url);
  const hub = (url.searchParams.get("hub") as HubId) || "hartsville";
  const mode = (url.searchParams.get("mode") as ViewMode) || "weekend";
  const max = Number(url.searchParams.get("max") || "90");
  const listings = await getPublishedListings();
  const places = filterPlaces(listings, { hub, mode, maxMinutes: max });
  return NextResponse.json({
    region: "pee-dee",
    holding: true,
    year: 2026,
    generatedAt: new Date().toISOString(),
    count: places.length,
    places,
  });
}

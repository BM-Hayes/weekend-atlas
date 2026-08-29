import { NextResponse } from "next/server";
import { PLACES } from "@/lib/places";
import { filterPlaces, type ViewMode } from "@/lib/places";
import type { HubId } from "@/lib/types";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const hub = (url.searchParams.get("hub") as HubId) || "hartsville";
  const mode = (url.searchParams.get("mode") as ViewMode) || "weekend";
  const max = Number(url.searchParams.get("max") || "90");
  const places = filterPlaces(PLACES, { hub, mode, maxMinutes: max });
  return NextResponse.json({
    generatedAt: new Date().toISOString(),
    count: places.length,
    places,
  });
}

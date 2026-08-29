import type { HubId } from "./types";
import { HUBS } from "./hubs";

/** Approximate road minutes. Replace with Mapbox Directions after the map ships. */
export function estimateDriveMinutes(
  lat: number,
  lng: number,
  hub: HubId,
): number {
  const origin = HUBS[hub];
  const dLat = lat - origin.lat;
  const dLng = lng - origin.lng;
  const miles = Math.sqrt((dLat * 69) ** 2 + (dLng * 56.5) ** 2);
  const raw = miles * 1.35 * 1.2;
  return Math.max(2, Math.round(raw));
}

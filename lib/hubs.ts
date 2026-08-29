import type { HubId } from "./types";

export const HUBS: Record<
  HubId,
  { id: HubId; label: string; short: string; lat: number; lng: number }
> = {
  hartsville: {
    id: "hartsville",
    label: "Hartsville",
    short: "HTV",
    lat: 34.3743,
    lng: -80.0731,
  },
  florence: {
    id: "florence",
    label: "Florence",
    short: "FLO",
    lat: 34.1954,
    lng: -79.7626,
  },
  cheraw: {
    id: "cheraw",
    label: "Cheraw",
    short: "CHW",
    lat: 34.6977,
    lng: -79.8834,
  },
};

export const HUB_ORDER: HubId[] = ["hartsville", "florence", "cheraw"];

export const PEE_DEE_BOUNDS = {
  west: -80.42,
  south: 33.88,
  east: -79.28,
  north: 34.92,
};

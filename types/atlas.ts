export type HubId = "hartsville" | "florence" | "cheraw";
export type DriveTimeCap = 20 | 35 | 50 | 90;
export type ListingCategory = "all" | "haunts" | "antiques" | "parks" | "farms";

export interface Listing {
  id: string;
  title: string;
  category: "haunts" | "antiques" | "parks" | "farms";
  season: "fall" | "year-round" | "spring" | "summer";
  tagline: string;
  coordinates: [number, number];
  city: string;
  driveTimes: Record<HubId, number>;
  link?: string;
}

export interface AtlasFilters {
  hub: HubId;
  maxDriveTime: DriveTimeCap;
  category: ListingCategory;
}

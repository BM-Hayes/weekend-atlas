export type HubId = "hartsville" | "florence" | "cheraw";

export type Badge = "operator" | "verified" | "community" | "unverified";

export type PlaceKind =
  | "trail"
  | "water"
  | "garden"
  | "farm"
  | "market"
  | "museum"
  | "downtown"
  | "event"
  | "refuge";

export type DayKey = "thu" | "fri" | "sat" | "sun" | "mon" | "tue" | "wed";

export type HoursBlock = {
  days: DayKey[];
  open: string;
  close: string;
  note?: string;
};

export type SeasonWindow = {
  start: string;
  end: string;
  label: string;
};

export type Place = {
  id: string;
  name: string;
  kind: PlaceKind;
  badge: Badge;
  lat: number;
  lng: number;
  city: string;
  county: string;
  oneLiner: string;
  whyThisWeekend: string;
  hours: HoursBlock[];
  season?: SeasonWindow;
  alwaysOpenDays?: boolean;
  website?: string;
  source: string;
  tags: string[];
  driveMinutes: Record<HubId, number>;
  fallWeight: number;
};

export type SuggestPayload = {
  name: string;
  city: string;
  kind: PlaceKind | "";
  website: string;
  note: string;
  fromHub: HubId;
};

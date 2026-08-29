import type { DayKey, Place } from "./types";

const DAY_MAP: DayKey[] = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

export function dayKey(date: Date): DayKey {
  return DAY_MAP[date.getDay()];
}

export function upcomingWeekend(now = new Date()): {
  fri: Date;
  sat: Date;
  sun: Date;
} {
  const d = new Date(now);
  const day = d.getDay();
  const toSat = day === 6 ? 0 : (6 - day + 7) % 7;
  const sat = new Date(d);
  sat.setDate(d.getDate() + toSat);
  sat.setHours(12, 0, 0, 0);
  const fri = new Date(sat);
  fri.setDate(sat.getDate() - 1);
  const sun = new Date(sat);
  sun.setDate(sat.getDate() + 1);
  return { fri, sat, sun };
}

export function formatWeekendLabel(now = new Date()): string {
  const { sat, sun } = upcomingWeekend(now);
  const fmt = (dt: Date) =>
    dt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(sat)}–${fmt(sun)}`;
}

export function inSeason(place: Place, date = new Date()): boolean {
  if (!place.season) return true;
  const iso = toIsoDate(date);
  return iso >= place.season.start && iso <= place.season.end;
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isOpenOn(place: Place, date: Date): boolean {
  if (!inSeason(place, date)) return false;
  const key = dayKey(date);
  return place.hours.some((block) => block.days.includes(key));
}

export function isOpenThisWeekend(place: Place, now = new Date()): boolean {
  const { fri, sat, sun } = upcomingWeekend(now);
  return isOpenOn(place, fri) || isOpenOn(place, sat) || isOpenOn(place, sun);
}

export function hoursForWeekend(place: Place, now = new Date()): string {
  const { fri, sat, sun } = upcomingWeekend(now);
  const parts: string[] = [];
  for (const [label, dt] of [
    ["Fri", fri],
    ["Sat", sat],
    ["Sun", sun],
  ] as const) {
    const key = dayKey(dt);
    const block = place.hours.find((h) => h.days.includes(key));
    if (block) {
      parts.push(`${label} ${formatClock(block.open)}–${formatClock(block.close)}`);
    }
  }
  if (!parts.length && place.season) {
    return place.season.label;
  }
  return parts.join(" · ") || "Hours vary";
}

export function formatClock(hhmm: string): string {
  const [hStr, mStr] = hhmm.split(":");
  let h = Number(hStr);
  const m = Number(mStr);
  const ampm = h >= 12 ? "p" : "a";
  h = h % 12 || 12;
  return m === 0 ? `${h}${ampm}` : `${h}:${String(m).padStart(2, "0")}${ampm}`;
}

export function driveLabel(minutes: number): string {
  if (minutes < 8) return `${minutes} min`;
  if (minutes < 60) return `${minutes} min drive`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h drive`;
}

export const FALL_2026 = { start: "2026-09-01", end: "2026-11-30" };

export function isFallSeason(date = new Date()): boolean {
  const iso = toIsoDate(date);
  return iso >= FALL_2026.start && iso <= FALL_2026.end;
}

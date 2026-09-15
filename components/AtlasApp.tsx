"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AtlasMap } from "./AtlasMap";
import { PlaceList } from "./PlaceList";
import { PlacePanel } from "./PlacePanel";
import { HUB_ORDER, HUBS } from "@/lib/hubs";
import { filterListings, listingToPlace } from "@/lib/atlasData";
import type { DriveTimeCap, ListingCategory } from "@/types/atlas";
import type { HubId, Place } from "@/lib/types";

const DRIVE_CAPS: DriveTimeCap[] = [20, 35, 50, 90];
const CATEGORIES: { id: ListingCategory; label: string }[] = [
  { id: "all", label: "All" },
  { id: "haunts", label: "Haunts" },
  { id: "antiques", label: "Antiques" },
  { id: "parks", label: "Parks" },
  { id: "farms", label: "Farms" },
];

export function AtlasApp({
  mapboxToken = "",
}: {
  listings?: Place[];
  mapboxToken?: string;
}) {
  const [hub, setHub] = useState<HubId>("hartsville");
  const [cap, setCap] = useState<DriveTimeCap>(50);
  const [category, setCategory] = useState<ListingCategory>("all");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const places = useMemo(
    () =>
      filterListings({ hub, maxDriveTime: cap, category }).map(listingToPlace),
    [hub, cap, category],
  );

  const selected = places.find((p) => p.id === selectedId);

  return (
    <div className="atlas-shell">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#cbbd9e] bg-[#f3ead8] px-4 py-3">
        <div>
          <p className="m-0 text-[11px] uppercase tracking-[0.22em] text-[#6b6356]">
            myweekendatlas.com
          </p>
          <h1 className="m-0 font-[family-name:var(--font-display-loaded)] text-[28px] leading-none">
            Weekend Atlas
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-[#6b6356]">From</span>
          {HUB_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => setHub(id)}
              className={`border px-3 py-1 ${
                hub === id
                  ? "border-[#1c1914] bg-[#1c1914] text-[#f3ead8]"
                  : "border-[#cbbd9e] bg-transparent"
              }`}
            >
              {HUBS[id].label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#cbbd9e] bg-[#efe4c8] px-4 py-2 text-sm">
        <p className="m-0 text-[#3f3a32]">
          Holding year 2026. Pins live in the repo. No database.
        </p>
        <p className="m-0 text-xs uppercase tracking-[0.12em] text-[#6b6356]">
          Tool, not a directory · no tickets · no phone · no chat ·{" "}
          <Link href="/about" className="normal-case tracking-normal underline">
            about
          </Link>
        </p>
      </div>

      <div className="grid min-h-0 grid-cols-1 md:grid-cols-[1fr_320px]">
        <div className="relative min-h-0">
          <div className="absolute left-3 top-3 z-30 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCategory(c.id)}
                className={`border px-3 py-1 text-sm shadow-sm ${
                  category === c.id
                    ? "border-[#1c1914] bg-[#1c1914] text-[#f3ead8]"
                    : "border-[#cbbd9e] bg-[#f7f0e0]"
                }`}
              >
                {c.label}
              </button>
            ))}
            <label className="border border-[#cbbd9e] bg-[#f7f0e0] px-2 py-1 text-sm shadow-sm">
              Within{" "}
              <select
                className="bg-transparent"
                value={cap}
                onChange={(e) =>
                  setCap(Number(e.target.value) as DriveTimeCap)
                }
              >
                {DRIVE_CAPS.map((n) => (
                  <option key={n} value={n}>
                    {n} min
                  </option>
                ))}
              </select>
            </label>
          </div>
          <AtlasMap
            places={places}
            hub={hub}
            selectedId={selectedId}
            onSelect={setSelectedId}
            mapboxToken={mapboxToken}
          />
        </div>
        <div className="flex max-h-[46vh] min-h-0 flex-col overflow-hidden border-t border-[#cbbd9e] bg-[#f7f0e0] md:max-h-none md:border-t-0">
          <div className="flex items-center justify-between border-b border-[#e0d3b6] px-4 py-2 text-xs uppercase tracking-[0.12em] text-[#6b6356]">
            <span>
              {places.length} place{places.length === 1 ? "" : "s"} · sorted by
              drive
            </span>
            <Link href="/suggest" className="normal-case tracking-normal underline">
              Suggest
            </Link>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            {selected ? (
              <PlacePanel
                place={selected}
                hub={hub}
                onClose={() => setSelectedId(null)}
              />
            ) : (
              <PlaceList
                places={places}
                hub={hub}
                selectedId={selectedId}
                onSelect={setSelectedId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

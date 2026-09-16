"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AtlasMap } from "./AtlasMap";
import { PlaceList } from "./PlaceList";
import { PlacePanel } from "./PlacePanel";
import { HUB_ORDER, HUBS } from "@/lib/hubs";
import {
  filterListings,
  getAllListings,
  listingToPlace,
} from "@/lib/atlasData";
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

const HUB_IDS: HubId[] = ["hartsville", "florence", "cheraw"];
const CAT_IDS: ListingCategory[] = [
  "all",
  "haunts",
  "antiques",
  "parks",
  "farms",
];

function parseHub(value: string | null): HubId {
  return HUB_IDS.includes(value as HubId) ? (value as HubId) : "hartsville";
}

function parseDrive(value: string | null): DriveTimeCap {
  const n = Number(value);
  return DRIVE_CAPS.includes(n as DriveTimeCap) ? (n as DriveTimeCap) : 50;
}

function parseCategory(value: string | null): ListingCategory {
  return CAT_IDS.includes(value as ListingCategory)
    ? (value as ListingCategory)
    : "all";
}

export function AtlasApp({
  mapboxToken = "",
}: {
  listings?: Place[];
  mapboxToken?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mobileView, setMobileView] = useState<"map" | "list">("map");

  const listingIds = useMemo(
    () => new Set(getAllListings().map((item) => item.id)),
    [],
  );
  const allPlaces = useMemo(
    () => getAllListings().map(listingToPlace),
    [],
  );

  const hub = parseHub(searchParams.get("hub"));
  const cap = parseDrive(searchParams.get("drive"));
  const category = parseCategory(searchParams.get("category"));
  const placeParam = searchParams.get("place");
  const selectedId =
    placeParam && listingIds.has(placeParam) ? placeParam : null;

  const writeQuery = useCallback(
    (patch: {
      hub?: HubId;
      drive?: DriveTimeCap;
      category?: ListingCategory;
      place?: string | null;
    }) => {
      const next = new URLSearchParams(searchParams.toString());
      const nextHub = patch.hub ?? parseHub(next.get("hub"));
      const nextDrive = patch.drive ?? parseDrive(next.get("drive"));
      const nextCategory = patch.category ?? parseCategory(next.get("category"));
      const nextPlace =
        patch.place !== undefined ? patch.place : next.get("place");

      if (nextHub === "hartsville") next.delete("hub");
      else next.set("hub", nextHub);

      if (nextDrive === 50) next.delete("drive");
      else next.set("drive", String(nextDrive));

      if (nextCategory === "all") next.delete("category");
      else next.set("category", nextCategory);

      if (!nextPlace || !listingIds.has(nextPlace)) next.delete("place");
      else next.set("place", nextPlace);

      const qs = next.toString();
      if (qs === searchParams.toString()) return;
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [listingIds, pathname, router, searchParams],
  );

  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());
    let dirty = false;
    const rawHub = next.get("hub");
    if (rawHub !== null && !HUB_IDS.includes(rawHub as HubId)) {
      next.delete("hub");
      dirty = true;
    }
    const rawDrive = next.get("drive");
    if (
      rawDrive !== null &&
      !DRIVE_CAPS.includes(Number(rawDrive) as DriveTimeCap)
    ) {
      next.delete("drive");
      dirty = true;
    }
    const rawCat = next.get("category");
    if (rawCat !== null && !CAT_IDS.includes(rawCat as ListingCategory)) {
      next.delete("category");
      dirty = true;
    }
    const rawPlace = next.get("place");
    if (rawPlace !== null && !listingIds.has(rawPlace)) {
      next.delete("place");
      dirty = true;
    }
    if (!dirty) return;
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }, [listingIds, pathname, router, searchParams]);

  const places = useMemo(
    () =>
      filterListings({ hub, maxDriveTime: cap, category }).map(listingToPlace),
    [hub, cap, category],
  );

  const selected = selectedId
    ? allPlaces.find((p) => p.id === selectedId)
    : undefined;

  return (
    <div className="atlas-shell">
      <header className="flex flex-wrap items-center justify-between gap-3 bg-[#141b18] px-4 py-3 text-[#fcfbf7]">
        <div>
          <p className="m-0 text-[10px] uppercase tracking-[0.28em] text-[#c4a35a]">
            Field guide · Pee Dee
          </p>
          <h1 className="display m-0 text-[26px] leading-none tracking-tight">
            Weekend Atlas
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          <span className="text-[11px] uppercase tracking-[0.14em] text-[#b7b0a4]">
            From
          </span>
          {HUB_ORDER.map((id) => (
            <button
              key={id}
              type="button"
              onClick={() => writeQuery({ hub: id })}
              className={`border px-3 py-1 ${
                hub === id
                  ? "border-[#c4a35a] bg-[#c4a35a] text-[#141b18]"
                  : "border-[#3a4540] bg-transparent text-[#ece7dc]"
              }`}
            >
              {HUBS[id].label}
            </button>
          ))}
        </div>
      </header>

      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e4ddd0] bg-[#f3efe6] px-4 py-2 text-sm">
        <p className="m-0 text-[#3f3a32]">
          Holding year 2026. Pins live in the repo. No database.
        </p>
        <p className="m-0 text-[11px] uppercase tracking-[0.12em] text-[#6b6356]">
          Tool, not a directory · no tickets · no phone · no chat ·{" "}
          <Link href="/about" className="normal-case tracking-normal underline decoration-[#c4a35a]">
            about
          </Link>
        </p>
      </div>

      <div className="grid min-h-0 grid-cols-1 md:grid-cols-[1fr_340px]">
        <div
          className={`relative min-h-0 ${
            mobileView === "map" ? "block" : "hidden"
          } md:block`}
        >
          <div className="absolute left-3 top-3 z-30 flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => writeQuery({ category: c.id })}
                className={`border px-3 py-1 text-sm shadow-sm ${
                  category === c.id
                    ? "border-[#141b18] bg-[#141b18] text-[#fcfbf7]"
                    : "border-[#e4ddd0] bg-[#fcfbf7]/95 text-[#1c1917]"
                }`}
              >
                {c.label}
              </button>
            ))}
            <label className="border border-[#e4ddd0] bg-[#fcfbf7]/95 px-2 py-1 text-sm shadow-sm">
              Within{" "}
              <select
                className="bg-transparent"
                value={cap}
                onChange={(e) =>
                  writeQuery({
                    drive: Number(e.target.value) as DriveTimeCap,
                  })
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
            selectedPlace={selected ?? null}
            onSelect={(id) => writeQuery({ place: id })}
            mapboxToken={mapboxToken}
            active={mobileView === "map"}
          />
          {selected ? (
            <div className="absolute inset-x-3 bottom-20 z-40 overflow-auto rounded-md shadow-lg md:hidden">
              <PlacePanel
                place={selected}
                hub={hub}
                onClose={() => writeQuery({ place: null })}
              />
            </div>
          ) : null}
        </div>
        <div
          className={`${
            mobileView === "list" ? "flex" : "hidden"
          } min-h-0 flex-col overflow-hidden border-[#e4ddd0] bg-[#f8f5ee] md:flex md:border-l`}
        >
          <div className="flex items-center justify-between border-b border-[#e4ddd0] px-4 py-2 text-[11px] uppercase tracking-[0.12em] text-[#6b6356]">
            <span>
              {places.length} place{places.length === 1 ? "" : "s"} · sorted by
              drive
            </span>
            <Link href="/suggest" className="normal-case tracking-normal underline decoration-[#c4a35a]">
              Suggest
            </Link>
          </div>
          <div className="min-h-0 flex-1 overflow-auto pb-20 md:pb-0">
            {selected ? (
              <PlacePanel
                place={selected}
                hub={hub}
                onClose={() => writeQuery({ place: null })}
              />
            ) : (
              <PlaceList
                places={places}
                hub={hub}
                selectedId={selectedId}
                onSelect={(id) => writeQuery({ place: id })}
              />
            )}
          </div>
        </div>
      </div>

      <div className="mobile-toggle" role="tablist" aria-label="View">
        <button
          type="button"
          role="tab"
          aria-selected={mobileView === "map"}
          className={mobileView === "map" ? "is-on" : ""}
          onClick={() => setMobileView("map")}
        >
          Map view
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={mobileView === "list"}
          className={mobileView === "list" ? "is-on" : ""}
          onClick={() => setMobileView("list")}
        >
          List view
        </button>
      </div>
    </div>
  );
}

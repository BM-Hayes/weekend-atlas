"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { placeCategory } from "./Badge";
import { HUBS, PEE_DEE_BOUNDS } from "@/lib/hubs";
import type { HubId, Place } from "@/lib/types";

function project(lat: number, lng: number, w: number, h: number) {
  const { west, south, east, north } = PEE_DEE_BOUNDS;
  const padX = 28;
  const padY = 36;
  const x = padX + ((lng - west) / (east - west)) * (w - padX * 2);
  const y = padY + ((north - lat) / (north - south)) * (h - padY * 2);
  return { x, y };
}

function milesToPx(miles: number, w: number) {
  const { west, east } = PEE_DEE_BOUNDS;
  const lonMiles = (east - west) * 56.5;
  return (miles / lonMiles) * (w - 56);
}

const CAT_LETTER: Record<string, string> = {
  haunts: "H",
  antiques: "A",
  parks: "P",
  farms: "F",
};

function pillHtml(place: Place) {
  const cat = placeCategory(place);
  return `<span class="pill-dot"></span><span>${CAT_LETTER[cat] ?? "·"}</span>`;
}

function hubHtml() {
  return `<span class="hub-pulse"></span><span class="hub-core"></span><span class="hub-needle"></span>`;
}

export function AtlasMap({
  places,
  hub,
  selectedId,
  selectedPlace = null,
  onSelect,
  mapboxToken = "",
  active = true,
}: {
  places: Place[];
  hub: HubId;
  selectedId: string | null;
  selectedPlace?: Place | null;
  onSelect: (id: string) => void;
  mapboxToken?: string;
  active?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 700 });

  const mappedPlaces = useMemo(() => {
    if (selectedPlace && !places.some((p) => p.id === selectedPlace.id)) {
      return [...places, selectedPlace];
    }
    return places;
  }, [places, selectedPlace]);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, [active]);

  const origin = HUBS[hub];
  const originPt = project(origin.lat, origin.lng, size.w, size.h);
  const rings = [
    { min: 15, miles: 12 },
    { min: 30, miles: 24 },
    { min: 45, miles: 36 },
  ];

  return (
    <div
      ref={wrap}
      className="relative h-full min-h-[320px] overflow-hidden bg-[#e7dfcf]"
    >
      {!mapboxToken && (
        <>
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${size.w} ${size.h}`}
            aria-hidden
          >
            <defs>
              <pattern
                id="hatch"
                width="12"
                height="12"
                patternUnits="userSpaceOnUse"
              >
                <path d="M0 12 L12 0" stroke="#d4cbb6" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={size.w} height={size.h} fill="#e7dfcf" />
            <rect width={size.w} height={size.h} fill="url(#hatch)" opacity="0.45" />
            {rings.map((r) => {
              const rad = milesToPx(r.miles, size.w);
              return (
                <circle
                  key={r.min}
                  cx={originPt.x}
                  cy={originPt.y}
                  r={rad}
                  fill="none"
                  stroke="#3d5c45"
                  strokeOpacity="0.28"
                  strokeDasharray="5 6"
                />
              );
            })}
          </svg>
          <div
            className="hub-mark absolute z-20"
            style={{ left: originPt.x, top: originPt.y }}
            aria-label={`${origin.label} hub`}
          >
            <span className="hub-pulse" />
            <span className="hub-core" />
            <span className="hub-needle" />
          </div>
          {mappedPlaces.map((p) => {
            const pt = project(p.lat, p.lng, size.w, size.h);
            const cat = placeCategory(p);
            return (
              <button
                key={p.id}
                type="button"
                className={`map-pill pin absolute z-10 ${selectedId === p.id ? "is-active" : ""}`}
                data-category={cat}
                style={{ left: pt.x, top: pt.y }}
                onClick={() => onSelect(p.id)}
                aria-label={p.name}
              >
                <span className="pill-dot" />
                <span>{CAT_LETTER[cat]}</span>
              </button>
            );
          })}
        </>
      )}

      <MapboxOverlay
        places={mappedPlaces}
        hub={hub}
        selectedId={selectedId}
        selectedPlace={selectedPlace}
        onSelect={onSelect}
        token={mapboxToken}
        active={active}
      />
    </div>
  );
}

function MapboxOverlay({
  places,
  hub,
  selectedId,
  selectedPlace,
  onSelect,
  token,
  active,
}: {
  places: Place[];
  hub: HubId;
  selectedId: string | null;
  selectedPlace: Place | null;
  onSelect: (id: string) => void;
  token: string;
  active: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!token || !ref.current) return;
    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      if (cancelled || !ref.current) return;
      mapboxgl.accessToken = token;
      const origin = HUBS[hub];
      const start = selectedPlace
        ? { center: [selectedPlace.lng, selectedPlace.lat] as [number, number], zoom: 11 }
        : { center: [origin.lng, origin.lat] as [number, number], zoom: 8.4 };
      const map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: start.center,
        zoom: start.zoom,
        attributionControl: false,
      });
      map.addControl(new mapboxgl.AttributionControl({ compact: true }));
      mapRef.current = map;
      const ready = () => map.resize();
      map.on("load", ready);
      requestAnimationFrame(ready);
    })();

    return () => {
      cancelled = true;
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
    // Map instance is created once per token; later moves use flyTo.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;
    (async () => {
      let map = mapRef.current;
      for (let i = 0; i < 50 && !map; i++) {
        await new Promise((r) => setTimeout(r, 100));
        map = mapRef.current;
      }
      if (cancelled || !map) return;
      if (selectedPlace) {
        map.flyTo({
          center: [selectedPlace.lng, selectedPlace.lat],
          zoom: 11,
          essential: true,
        });
        return;
      }
      const origin = HUBS[hub];
      map.flyTo({
        center: [origin.lng, origin.lat],
        zoom: 8.4,
        essential: true,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [token, hub, selectedPlace]);

  useEffect(() => {
    if (!token) return;
    mapRef.current?.resize();
  }, [token, active]);

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      let map = mapRef.current;
      for (let i = 0; i < 50 && !map; i++) {
        await new Promise((r) => setTimeout(r, 100));
        map = mapRef.current;
      }
      if (cancelled || !map) return;

      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const origin = HUBS[hub];
      const hubEl = document.createElement("div");
      hubEl.className = "hub-mark";
      hubEl.innerHTML = hubHtml();
      hubEl.setAttribute("aria-label", `${origin.label} hub`);
      const hubMarker = new mapboxgl.Marker({ element: hubEl, anchor: "center" })
        .setLngLat([origin.lng, origin.lat])
        .addTo(map);
      markersRef.current.push(hubMarker);

      places.forEach((p) => {
        const el = document.createElement("button");
        el.type = "button";
        const cat = placeCategory(p);
        el.className = `map-pill${selectedId === p.id ? " is-active" : ""}`;
        el.dataset.category = cat;
        el.setAttribute("aria-label", p.name);
        el.innerHTML = pillHtml(p);
        el.onclick = () => onSelectRef.current(p.id);
        const marker = new mapboxgl.Marker({ element: el, anchor: "center" })
          .setLngLat([p.lng, p.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [token, places, selectedId, hub]);

  if (!token) return null;
  return (
    <div
      ref={ref}
      className="absolute inset-0 z-20 h-full w-full min-h-[320px]"
    />
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
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

export function AtlasMap({
  places,
  hub,
  selectedId,
  onSelect,
  mapboxToken = "",
}: {
  places: Place[];
  hub: HubId;
  selectedId: string | null;
  onSelect: (id: string) => void;
  mapboxToken?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 800, h: 700 });

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setSize({ w: el.clientWidth, h: el.clientHeight });
    });
    ro.observe(el);
    setSize({ w: el.clientWidth, h: el.clientHeight });
    return () => ro.disconnect();
  }, []);

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
      className="relative h-full min-h-[320px] overflow-hidden bg-[#d9c9a6]"
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
                <path d="M0 12 L12 0" stroke="#c9b78e" strokeWidth="1" />
              </pattern>
            </defs>
            <rect width={size.w} height={size.h} fill="#d9c9a6" />
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
                  stroke="#2c4033"
                  strokeOpacity="0.28"
                  strokeDasharray="5 6"
                />
              );
            })}
          </svg>
          {places.map((p) => {
            const pt = project(p.lat, p.lng, size.w, size.h);
            return (
              <button
                key={p.id}
                type="button"
                className={`pin absolute z-10 ${selectedId === p.id ? "is-active" : ""}`}
                data-kind={p.kind}
                style={{ left: pt.x, top: pt.y }}
                onClick={() => onSelect(p.id)}
                aria-label={p.name}
              >
                <span className="pin-dot block" />
              </button>
            );
          })}
        </>
      )}

      <MapboxOverlay
        places={places}
        hub={hub}
        selectedId={selectedId}
        onSelect={onSelect}
        token={mapboxToken}
      />
    </div>
  );
}

function MapboxOverlay({
  places,
  hub,
  selectedId,
  onSelect,
  token,
}: {
  places: Place[];
  hub: HubId;
  selectedId: string | null;
  onSelect: (id: string) => void;
  token: string;
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
      const map = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [origin.lng, origin.lat],
        zoom: 8.4,
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
  }, [token]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;
    const origin = HUBS[hub];
    map.flyTo({ center: [origin.lng, origin.lat], zoom: 8.4 });
  }, [hub]);

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

      places.forEach((p) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = `map-pin${selectedId === p.id ? " is-active" : ""}`;
        el.dataset.kind = p.kind;
        el.setAttribute("aria-label", p.name);
        el.innerHTML = `<span class="pin-dot"></span>`;
        el.onclick = () => onSelectRef.current(p.id);
        const marker = new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([p.lng, p.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [token, places, selectedId]);

  if (!token) return null;
  return (
    <div
      ref={ref}
      className="absolute inset-0 z-20 h-full w-full min-h-[320px]"
    />
  );
}

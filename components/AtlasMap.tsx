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
      <svg
        className={`absolute inset-0 h-full w-full ${mapboxToken ? "hidden" : ""}`}
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
        <text
          x={20}
          y={size.h - 18}
          fill="#6b6356"
          fontSize="11"
          letterSpacing="0.16em"
        >
          PEE DEE · SEED MAP · SWAP IN MAPBOX WHEN TOKEN IS SET
        </text>
        {rings.map((r) => {
          const rad = milesToPx(r.miles, size.w);
          return (
            <g key={r.min}>
              <circle
                cx={originPt.x}
                cy={originPt.y}
                r={rad}
                fill="none"
                stroke="#2c4033"
                strokeOpacity="0.28"
                strokeDasharray="5 6"
              />
              <text
                x={originPt.x + rad * 0.72}
                y={originPt.y - rad * 0.62}
                fill="#2c4033"
                fontSize="10"
                opacity="0.7"
              >
                {r.min} min
              </text>
            </g>
          );
        })}
        <circle cx={originPt.x} cy={originPt.y} r="5" fill="#1c1914" />
        <text
          x={originPt.x + 10}
          y={originPt.y - 8}
          fill="#1c1914"
          fontSize="11"
          fontWeight="600"
        >
          {origin.label}
        </text>
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

  useEffect(() => {
    if (!token || !ref.current) return;
    let cancelled = false;
    let map: { remove: () => void } | undefined;

    (async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      await import("mapbox-gl/dist/mapbox-gl.css");
      if (cancelled || !ref.current) return;
      mapboxgl.accessToken = token;
      const origin = HUBS[hub];
      const instance = new mapboxgl.Map({
        container: ref.current,
        style: "mapbox://styles/mapbox/light-v11",
        center: [origin.lng, origin.lat],
        zoom: 8.4,
        attributionControl: false,
      });
      map = instance;
      instance.addControl(new mapboxgl.AttributionControl({ compact: true }));
      const markers: { remove: () => void }[] = [];
      const paint = () => {
        markers.splice(0).forEach((m) => m.remove());
        places.forEach((p) => {
          const el = document.createElement("button");
          el.className = `pin${selectedId === p.id ? " is-active" : ""}`;
          el.dataset.kind = p.kind;
          el.innerHTML = `<span class="pin-dot"></span>`;
          el.onclick = () => onSelect(p.id);
          markers.push(
            new mapboxgl.Marker({ element: el, anchor: "bottom" })
              .setLngLat([p.lng, p.lat])
              .addTo(instance),
          );
        });
      };
            instance.on("load", () => {
        instance.resize();
        paint();
      });
    })();

    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [token, hub, places, selectedId, onSelect]);

  if (!token) return null;
  return <div ref={ref} className="absolute inset-0 z-20" />;
}

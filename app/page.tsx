import { Suspense } from "react";
import { AtlasApp } from "@/components/AtlasApp";

function AtlasFallback() {
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
      </header>
      <div className="flex items-center border-b border-[#e4ddd0] bg-[#f3efe6] px-4 py-2 text-sm text-[#6b6356]">
        Loading the map…
      </div>
      <div className="min-h-0 bg-[#e7dfcf]" />
    </div>
  );
}

export default function HomePage() {
  const mapboxToken =
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN || process.env.MAPBOX_TOKEN || "";
  return (
    <Suspense fallback={<AtlasFallback />}>
      <AtlasApp mapboxToken={mapboxToken} />
    </Suspense>
  );
}

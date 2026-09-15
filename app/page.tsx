import { AtlasApp } from "@/components/AtlasApp";

export default function HomePage() {
  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
  return <AtlasApp mapboxToken={mapboxToken} />;
}

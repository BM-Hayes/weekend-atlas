import { AtlasApp } from "@/components/AtlasApp";
import { getPublishedListings } from "@/lib/listings";

export const revalidate = 300;

export default async function HomePage() {
  const listings = await getPublishedListings();
  const mapboxToken =
    process.env.MAPBOX_TOKEN ||
    process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
    "";
  return <AtlasApp listings={listings} mapboxToken={mapboxToken} />;
}

import { AtlasApp } from "@/components/AtlasApp";
import { getPublishedListings } from "@/lib/listings";

export const revalidate = 300;

export default async function HomePage() {
  const listings = await getPublishedListings();
  return <AtlasApp listings={listings} />;
}

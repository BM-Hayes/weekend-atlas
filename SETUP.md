# Setup

GitHub repo `weekend-atlas`. Vercel connected. Mapbox token in KeePass.

No database. Listings live in `data/listings.json`.

## Vercel env

| Name | Source |
| --- | --- |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox public token |
| `NEXT_PUBLIC_SITE_URL` | `https://myweekendatlas.com` |

You can delete the old Supabase env vars in the Vercel dashboard. They are unused.

## Add a place

Edit `data/listings.json`. Push `main`. Vercel rebuilds.

Drive times are minutes from Hartsville, Florence, and Cheraw. The map filters those numbers in the browser.

# Setup · accounts already exist

GitHub repo `weekend-atlas`. Vercel connected. Supabase us-east-1. Mapbox token in KeePass.

## 1. Supabase

SQL editor, in order:

1. `supabase/schema.sql` — creates `listings` + `review_queue`
2. `supabase/seed.sql` — 18 Pee Dee Fall rows, `published = true`

Confirm:

```sql
select slug, badge, city, published from public.listings order by city, slug;
```

You should see 18 rows. Anon can `select` only where `published = true`. Anon can `insert` into `review_queue`. Anon cannot update listings.

## 2. Vercel env

Copy values out of KeePass. Do not commit them.

| Name | Source |
| --- | --- |
| `NEXT_PUBLIC_MAPBOX_TOKEN` | Mapbox default public token |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, us-east-1 |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Project Settings → API → anon |
| `SUPABASE_SERVICE_ROLE` | Project Settings → API → service_role |
| `NEXT_PUBLIC_SITE_URL` | `https://myweekendatlas.com` |

Production + Preview. Redeploy after save.

## 3. Domain

Vercel → Domains → `myweekendatlas.com`.

## 4. What the holding page does

`/` is the product. It is also the 2026 holding page:

- Map is the page
- Open-this-weekend from Hartsville / Florence / Cheraw
- Listings from `public.listings` when env is set, else `data/places.json`
- No tickets, no phone, no live chat

`/suggest` writes the queue. Leave promotion manual.

## 5. Not this week

- Queue automation
- Mapbox Directions isochrones
- A second region

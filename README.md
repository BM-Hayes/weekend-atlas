# Weekend Atlas

**Domain:** [myweekendatlas.com](https://myweekendatlas.com)

Map-first weekend tool for the Pee Dee. Not a directory.

Stack: Next.js · Mapbox GL · Supabase · Vercel.

## What this is

Pick Hartsville, Florence, or Cheraw. See what is actually open this weekend, sorted by drive time. Fall 2026 is the first season. Canonical rows live in Supabase `public.listings`. `data/places.json` is the offline fallback.

No tickets. No phone. No live chat.

Badges:

- **operator** — the people who run it confirmed it
- **verified** — hours checked against a public source this season
- **community** — local report, not independently checked
- **unverified** — seeded, treat hours as a hint

## 2026 scope

Seed data + holding page. The map reads published listings. `/suggest` inserts into `review_queue`. Do not automate promotion from queue → listings until the map path is stable.

## Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

`.env.local` can stay empty. Without a Mapbox token the app uses the built-in Pee Dee seed map. Without Supabase the queue writes to disk.

```
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Ship (accounts are ready)

1. Push this repo to GitHub `weekend-atlas`. Vercel is already connected.
2. In Vercel project env, paste from KeePass:
   - `NEXT_PUBLIC_MAPBOX_TOKEN`
   - `NEXT_PUBLIC_SUPABASE_URL` (us-east-1 project URL)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE` (server only, never `NEXT_PUBLIC_`)
   - `NEXT_PUBLIC_SITE_URL=https://myweekendatlas.com`
3. In the Supabase SQL editor, run `supabase/schema.sql`, then `supabase/seed.sql`.
4. Attach domain `myweekendatlas.com`. Redeploy.

See `SETUP.md`.

## After the map is boring

- Cron against official park / market calendars
- Promote `review_queue` rows with a source URL and matching hours
- Isochrones from Mapbox Directions instead of precomputed minutes
- Second region only if Pee Dee Fall is actually used


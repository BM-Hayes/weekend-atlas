# Weekend Atlas

**Domain:** [myweekendatlas.com](https://myweekendatlas.com)

Map-first weekend tool for the Pee Dee. Not a directory.

Stack: Next.js · Mapbox GL · static JSON · Vercel.

## What this is

Pick Hartsville, Florence, or Cheraw. See what is in range, sorted by drive time. Fall 2026 is the first season. Canonical rows live in `data/listings.json`.

No tickets. No phone. No live chat. No database.

## Local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Mapbox token is optional. Without it the seed hatch map still works.

```
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_SITE_URL=https://myweekendatlas.com
```

Add or fix a place by editing `data/listings.json` and pushing to `main`.

## Review the suggestion queue

Public `/suggest` appends to `data/queue.json`. Review locally:

```bash
npm run queue:review
```

`A` approve · `E` edit · `D` reject · `S` skip. Approve writes estimated drive times from Hartsville, Florence, and Cheraw into `data/listings.json` and drops the row from the queue. Then commit and push `main`.


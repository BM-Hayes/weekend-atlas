-- Forgotten Valley · Hartsville 2026
-- Community listing from operator dates. No official site yet.

insert into public.listings (
  slug, name, kind, badge, lat, lng, city, county, region,
  one_liner, why_this_weekend, hours, season_start, season_end, season_label,
  website, source, tags,
  drive_minutes_hartsville, drive_minutes_florence, drive_minutes_cheraw,
  fall_weight, published
) values (
  'forgotten-valley',
  'Forgotten Valley',
  'event',
  'community',
  34.3524,
  -80.0518,
  'Hartsville',
  'Darlington',
  'pee-dee',
  'New Hartsville haunt. Pond Hollow Road. First season.',
  'Fri–Sat nights Sep 25–Oct 31, 7:30p–midnight. New operator — confirm the night on their Facebook before you roll.',
  '[{"days":["fri","sat"],"open":"19:30","close":"00:00"}]'::jsonb,
  '2026-09-25'::date,
  '2026-10-31'::date,
  'Sep 25–Oct 31 · Fri–Sat 7:30p–12a',
  null,
  'Operator dates via community submit, Sep 1 2026. Facebook page live; no standalone site.',
  ARRAY['halloween','haunt','night']::text[],
  10, 28, 32,
  9, true
)
on conflict (slug) do update set
  name = excluded.name,
  kind = excluded.kind,
  badge = excluded.badge,
  lat = excluded.lat,
  lng = excluded.lng,
  city = excluded.city,
  county = excluded.county,
  one_liner = excluded.one_liner,
  why_this_weekend = excluded.why_this_weekend,
  hours = excluded.hours,
  season_start = excluded.season_start,
  season_end = excluded.season_end,
  season_label = excluded.season_label,
  website = excluded.website,
  source = excluded.source,
  tags = excluded.tags,
  drive_minutes_hartsville = excluded.drive_minutes_hartsville,
  drive_minutes_florence = excluded.drive_minutes_florence,
  drive_minutes_cheraw = excluded.drive_minutes_cheraw,
  fall_weight = excluded.fall_weight,
  published = excluded.published;

-- Weekend Atlas · Halloween 2026 seed
-- Run in Supabase SQL editor. Safe to re-run (upsert on slug).

insert into public.listings (
  slug, name, kind, badge, lat, lng, city, county, region,
  one_liner, why_this_weekend, hours, season_start, season_end, season_label,
  website, source, tags,
  drive_minutes_hartsville, drive_minutes_florence, drive_minutes_cheraw,
  fall_weight, published
) values
  (
    'scream-acres', 'Scream Acres', 'event', 'verified',
    34.2148, -80.2689, 'Bishopville', 'Lee', 'pee-dee',
    'House from the 1880s, two-mile hayride, then a swamp walk. One ticket, three pieces.',
    '2026 season: Sep 11–12, 18–19, 25–26, then every Fri–Sat in October, plus Oct 25 and Oct 30–31.',
    '[{"days":["fri","sat"],"open":"19:00","close":"01:00"},{"days":["sun"],"open":"19:00","close":"22:00"}]'::jsonb,
    '2026-09-11'::date, '2026-10-31'::date, 'Sep 11–Oct 31 · Fri–Sat nights',
    'https://screamacreshauntedhouse.com/',
    'screamacreshauntedhouse.com + SC Haunted Houses 2026',
    ARRAY['halloween','haunt','hayride','swamp','night']::text[],
    26, 36, 50, 10, true
  ),
  (
    'kreepy-hollow', 'Kreepy Hollow', 'event', 'community',
    34.1639, -80.3214, 'Bishopville', 'Lee', 'pee-dee',
    'Bus ride, two-story house, then a hayride through Lucknow Bottom.',
    'Usually Fri–Sat nights mid-September through early November. Confirm the night on their page.',
    '[{"days":["fri","sat"],"open":"19:30","close":"00:30"},{"days":["sun"],"open":"19:30","close":"22:30"}]'::jsonb,
    '2026-09-12'::date, '2026-11-01'::date, 'Mid-Sep–early Nov, nights',
    'https://www.kreepyhollowhauntedattraction.com/information',
    'Kreepy Hollow directions page',
    ARRAY['halloween','haunt','hayride','trail','night']::text[],
    32, 42, 55, 9, true
  ),
  (
    'hollow-acres', 'Hollow Acres', 'event', 'community',
    34.4964, -79.1142, 'Fairmont', 'Robeson', 'pee-dee',
    'Bus drop to a trail, then scenes in the field. Just over the NC line from Dillon.',
    '2026 opening night Sep 25. Fri–Sat 7:30p–11:30p.',
    '[{"days":["fri","sat"],"open":"19:30","close":"23:30"}]'::jsonb,
    '2026-09-25'::date, '2026-11-01'::date, 'Opens Sep 25 · Fri–Sat nights',
    'https://www.northcarolinahauntedhouses.com/halloween/hollow-acres-the-field-of-misfits-nc.html',
    'NC Haunted Houses 2026 hours',
    ARRAY['halloween','haunt','trail','night']::text[],
    58, 38, 62, 8, true
  ),
  (
    'southern-palmetto-farms', 'Southern Palmetto Farms', 'farm', 'community',
    33.9842, -79.2218, 'Aynor', 'Horry', 'pee-dee',
    'Daytime maze and patch. Fright nights are a separate evening trail on the same farm.',
    'Fall weekends typically late Sep through Halloween. Confirm 2026 night dates on the farm page.',
    '[{"days":["sat","sun"],"open":"10:00","close":"18:00"}]'::jsonb,
    '2026-09-26'::date, '2026-10-31'::date, 'Late Sep–Halloween, weekends',
    'https://www.southernpalmettofarms.com',
    'southernpalmettofarms.com',
    ARRAY['halloween','farm','maze','kids']::text[],
    72, 42, 88, 7, true
  ),
  (
    'dark-castle', 'Dark Castle', 'event', 'verified',
    34.1706, -80.7938, 'Elgin', 'Kershaw', 'pee-dee',
    'Indoor haunt, outdoor trail, and a zombie yard. One ticket, three pieces, west toward Columbia.',
    'Event nights from 7p. Check their calendar for which Fridays and Saturdays are live in 2026.',
    '[{"days":["fri","sat"],"open":"19:00","close":"23:00"}]'::jsonb,
    '2026-09-19'::date, '2026-11-01'::date, 'Sep–Oct event nights from 7p',
    'https://darkcastlesc.com/',
    'darkcastlesc.com FAQ + address page',
    ARRAY['halloween','haunt','trail','night']::text[],
    62, 74, 78, 8, true
  ),
  (
    'aberdeen-fear-factory', 'Aberdeen Fear Factory', 'event', 'community',
    35.0993, -79.3763, 'Aberdeen', 'Moore', 'pee-dee',
    'Indoor haunt on NC-211. House, 3D rooms, zombie paintball on Fri–Sat.',
    'Typical nights Thu–Sat in season. 2026 calendar still lives on their page — confirm before the drive north.',
    '[{"days":["thu","fri","sat"],"open":"19:00","close":"00:00"}]'::jsonb,
    '2026-09-18'::date, '2026-11-01'::date, 'Thu–Sat nights in season',
    'https://aberdeenfearfactory.com/',
    'aberdeenfearfactory.com + Visit Pinehurst listing',
    ARRAY['halloween','haunt','indoor','night']::text[],
    55, 68, 38, 8, true
  ),
  (
    'standing-pines-halloween', 'Standing Pines spooky weekends', 'event', 'community',
    34.4218, -80.0186, 'Hartsville', 'Darlington', 'pee-dee',
    'Campground pumpkin trail and non-scary trick-or-treat. Close to town. Kids first.',
    'October weekends. Not a scream haunt — costumes and a trail on the property.',
    '[{"days":["fri","sat","sun"],"open":"17:00","close":"21:00"}]'::jsonb,
    '2026-10-02'::date, '2026-11-01'::date, 'October weekends',
    'https://campstandingpines.com/',
    'Camp Standing Pines / Kidding Around Halloween campgrounds 2026',
    ARRAY['halloween','kids','trail','family']::text[],
    12, 32, 28, 6, true
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

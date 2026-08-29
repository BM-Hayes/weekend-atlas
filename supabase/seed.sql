-- Weekend Atlas · Pee Dee Fall 2026 seed
-- Run AFTER schema.sql. Safe to re-run (upsert on slug).

insert into public.listings (
  slug, name, kind, badge, lat, lng, city, county, region,
  one_liner, why_this_weekend, hours, season_start, season_end, season_label,
  website, source, tags,
  drive_minutes_hartsville, drive_minutes_florence, drive_minutes_cheraw,
  fall_weight, published
) values
  (
    'cheraw-state-park', 'Cheraw State Park', 'trail', 'verified', 34.6442, -79.9261, 'Cheraw', 'Chesterfield', 'pee-dee',
    'Oldest SC state park. Longleaf, Lake Juniper, turkey oak going gold.', 'Park gates are open daily. Golf course stays closed through Oct 1 renovation — come for trails and the lake, not 18 holes.', '[{"days":["mon","tue","wed","thu","fri","sat","sun"],"open":"07:00","close":"20:00","note":"Oct hours 7a\u20138p; Nov\u2013Feb 7a\u20136p"}]'::jsonb,
    null::date, null::date, null,
    'https://southcarolinaparks.com/cheraw', 'SC State Parks hours, Aug 2026', ARRAY['free','hike','lake','fall-color','picnic']::text[],
    28, 48, 8,
    9, true
  ),
  (
    'kalmia-gardens', 'Kalmia Gardens', 'garden', 'verified', 34.3689, -80.0936, 'Hartsville', 'Darlington', 'pee-dee',
    '35 acres on Black Creek. Camellias loading. Quiet loop if you only have an hour.', 'The gardens stay open. Fall planting season is the point — not a festival weekend.', '[{"days":["mon","tue","wed","thu","fri","sat","sun"],"open":"08:00","close":"17:00"}]'::jsonb,
    null::date, null::date, null,
    'https://www.kalmiagardens.org', 'Kalmia Gardens / Coker University', ARRAY['free','walk','plants','black-creek']::text[],
    6, 28, 32,
    8, true
  ),
  (
    'lynches-river-park', 'Lynches River County Park', 'trail', 'verified', 33.9736, -79.8214, 'Coward', 'Florence', 'pee-dee',
    'Canopy walk over cypress. 676 acres between Florence and Lake City.', 'Park 9a–sunset. Canopy walk and Discovery Center: Sat 9–5, Sun 1–5.', '[{"days":["tue","wed","thu","fri","sat"],"open":"09:00","close":"17:00","note":"Park grounds 9a\u2013sunset"},{"days":["sun"],"open":"13:00","close":"17:00","note":"Canopy walk / EDC Sunday hours"}]'::jsonb,
    null::date, null::date, null,
    'https://www.lynchesriverpark.com', 'lynchesriverpark.com hours', ARRAY['canopy-walk','kayak','kids','river']::text[],
    42, 22, 62,
    8, true
  ),
  (
    'mcleod-farms', 'McLeod Farms', 'farm', 'operator', 34.4347, -80.2414, 'McBee', 'Chesterfield', 'pee-dee',
    'Working peach farm. Fall means corn maze, wagon, u-pick pumpkins.', 'Fall field days typically open early October. Market may be open; maze/patch is seasonal — confirm before you roll.', '[{"days":["sat"],"open":"09:00","close":"17:00"},{"days":["sun"],"open":"13:00","close":"17:00"},{"days":["tue","wed","thu","fri"],"open":"13:00","close":"17:00"}]'::jsonb,
    '2026-10-03'::date, '2026-11-08'::date, 'Fall field days usually early Oct–early Nov',
    'https://www.macspride.com/fall', 'McLeod Farms fall page (2025 dates used as pattern)', ARRAY['pumpkin','corn-maze','wagon','kids','seasonal']::text[],
    16, 38, 38,
    10, true
  ),
  (
    'pee-dee-farmers-market', 'Pee Dee State Farmers Market', 'market', 'verified', 34.2278, -79.8095, 'Florence', 'Florence', 'pee-dee',
    'Produce sheds, plants, food. The region’s Saturday errand that still feels like going out.', 'Market runs through the weekend. Plant, Flower & Food Festival is Oct 2–4.', '[{"days":["mon","tue","wed","thu","fri","sat"],"open":"08:00","close":"18:00"},{"days":["sun"],"open":"10:00","close":"17:00"}]'::jsonb,
    null::date, null::date, null,
    'https://agriculture.sc.gov/find-local/farmers-markets/pee-dee-state-farmers-market/', 'SCDA market listing', ARRAY['produce','plants','free-entry','saturday']::text[],
    24, 8, 44,
    7, true
  ),
  (
    'plant-flower-fest', 'Pee Dee Plant, Flower & Food Festival', 'event', 'verified', 34.2278, -79.8095, 'Florence', 'Florence', 'pee-dee',
    'SCDA’s fall plant festival on the market grounds. Mums, food, no mystery.', 'Set for Oct 2–4, 2026. Not this weekend unless you are looking at that first October weekend.', '[{"days":["fri","sat"],"open":"08:00","close":"18:00"},{"days":["sun"],"open":"10:00","close":"17:00"}]'::jsonb,
    '2026-10-02'::date, '2026-10-04'::date, 'Oct 2–4, 2026',
    'https://agriculture.sc.gov/find-local/farmers-markets/plant-and-flower-festivals/', 'SC Department of Agriculture 2026 festival calendar', ARRAY['festival','plants','food','october']::text[],
    24, 8, 44,
    9, true
  ),
  (
    'little-pee-dee-sp', 'Little Pee Dee State Park', 'water', 'verified', 34.3278, -79.2717, 'Dillon', 'Dillon', 'pee-dee',
    '54-acre lake plus the Little Pee Dee. Paddle if the wind is down.', 'Day-use park is open. Pack the kayak — rentals are not the promise here.', '[{"days":["mon","tue","wed","thu","fri","sat","sun"],"open":"08:00","close":"18:00"}]'::jsonb,
    null::date, null::date, null,
    'https://southcarolinaparks.com/little-pee-dee', 'SC State Parks', ARRAY['paddle','camp','lake','east']::text[],
    58, 36, 62,
    6, true
  ),
  (
    'woods-bay', 'Woods Bay State Park', 'trail', 'verified', 33.9464, -80.0256, 'Olanta', 'Sumter', 'pee-dee',
    'Carolina bay boardwalk. Alligators possible. Short, strange, worth the spur.', 'Boardwalk and picnic area are a half-day. Pair with Lynches River if you are already south.', '[{"days":["mon","tue","wed","thu","fri","sat","sun"],"open":"09:00","close":"18:00"}]'::jsonb,
    null::date, null::date, null,
    'https://southcarolinaparks.com/woods-bay', 'SC State Parks', ARRAY['boardwalk','wildlife','short-stop']::text[],
    36, 28, 58,
    6, true
  ),
  (
    'carolina-sandhills-nwr', 'Carolina Sandhills NWR', 'refuge', 'verified', 34.5192, -80.2267, 'McBee', 'Chesterfield', 'pee-dee',
    'Longleaf and red-cockaded woodpeckers. Auto tour + short walks.', 'Refuge roads are open daylight hours. Best cool-weather birding of the year starts now.', '[{"days":["mon","tue","wed","thu","fri","sat","sun"],"open":"07:00","close":"19:00"}]'::jsonb,
    null::date, null::date, null,
    'https://www.fws.gov/refuge/carolina-sandhills', 'USFWS Carolina Sandhills', ARRAY['birds','auto-tour','longleaf','free']::text[],
    22, 44, 28,
    9, true
  ),
  (
    'lee-state-park', 'Lee State Park', 'trail', 'verified', 34.2017, -80.1831, 'Bishopville', 'Lee', 'pee-dee',
    'Floodplain forest on the Lynches. Horses and hikers share the flats.', 'Open daily. A west-side option if Hartsville is home base.', '[{"days":["mon","tue","wed","thu","fri","sat","sun"],"open":"09:00","close":"18:00"}]'::jsonb,
    null::date, null::date, null,
    'https://southcarolinaparks.com/lee', 'SC State Parks', ARRAY['hike','horses','river']::text[],
    22, 32, 48,
    5, true
  ),
  (
    'florence-county-museum', 'Florence County Museum', 'museum', 'verified', 34.1972, -79.7667, 'Florence', 'Florence', 'pee-dee',
    'William H. Johnson and the Pee Dee under one roof. Downtown, free.', 'Closed Sunday. Saturday is the weekend window.', '[{"days":["tue","wed","thu","fri","sat"],"open":"10:00","close":"17:00"}]'::jsonb,
    null::date, null::date, null,
    'https://www.flocomuseum.org', 'Florence County Museum published hours', ARRAY['free','art','history','downtown']::text[],
    26, 5, 46,
    4, true
  ),
  (
    'downtown-cheraw', 'Downtown Cheraw', 'downtown', 'community', 34.6974, -79.8831, 'Cheraw', 'Chesterfield', 'pee-dee',
    'Town Green, brick storefronts, river just south. Walk first, drive second.', 'Always there. Pair with the state park if you only want one outing.', '[{"days":["thu","fri","sat"],"open":"10:00","close":"17:00"},{"days":["sun"],"open":"12:00","close":"16:00"}]'::jsonb,
    null::date, null::date, null,
    'https://www.cheraw.com', 'Town of Cheraw visitor notes', ARRAY['walk','shops','river-town']::text[],
    30, 46, 3,
    5, true
  ),
  (
    'downtown-hartsville', 'Downtown Hartsville', 'downtown', 'community', 34.3741, -80.0734, 'Hartsville', 'Darlington', 'pee-dee',
    'Fifth Street grid. Coffee, a walk, then Kalmia. No itinerary required.', 'Saturday morning is the useful window. Sunday is thinner.', '[{"days":["thu","fri","sat"],"open":"08:00","close":"17:00"}]'::jsonb,
    null::date, null::date, null,
    'https://www.hartsvillesc.gov', 'City of Hartsville', ARRAY['walk','coffee','local']::text[],
    2, 26, 30,
    4, true
  ),
  (
    'pride-pee-dee', 'Pride in the Pee Dee', 'event', 'community', 34.1959, -79.7648, 'Florence', 'Florence', 'pee-dee',
    'City Center Market. Vendors, music, afternoon into evening.', 'On the calendar for Saturday, October 10, 2026. Not a recurring weekly.', '[{"days":["sat"],"open":"16:00","close":"21:00"}]'::jsonb,
    '2026-10-10'::date, '2026-10-10'::date, 'Oct 10, 2026 · 4–9p',
    'https://www.peedeeequality.org/pride-in-the-pee-dee', 'Pee Dee Equality 2026 page', ARRAY['festival','downtown','october']::text[],
    26, 4, 46,
    7, true
  ),
  (
    'southern-500-weekend', 'Darlington Raceway weekend', 'event', 'verified', 34.2954, -79.8756, 'Darlington', 'Darlington', 'pee-dee',
    'Lady in Black. Playoff opener. The Pee Dee fills up.', 'Cook Out Southern 500 weekend is Sept 5–6, 2026. Traffic is the feature.', '[{"days":["sat"],"open":"12:00","close":"23:00"},{"days":["sun"],"open":"10:00","close":"19:00"}]'::jsonb,
    '2026-09-04'::date, '2026-09-06'::date, 'Sept 5–6, 2026',
    'https://www.darlingtonraceway.com', 'Darlington Raceway / WMBF Aug 2026', ARRAY['nascar','september','crowds']::text[],
    18, 14, 38,
    8, true
  ),
  (
    'black-creek-heritage', 'Black Creek Heritage Preserve', 'trail', 'unverified', 34.4015, -80.0122, 'Hartsville', 'Darlington', 'pee-dee',
    'Sandhills creek corridor. Little signage. Bring your own map sense.', 'Land is there. Hours and parking are not tightly published — treat as daylight only.', '[{"days":["sat","sun"],"open":"07:00","close":"18:00"}]'::jsonb,
    null::date, null::date, null,
    null, 'SCDNR heritage preserve list — hours not operator-confirmed', ARRAY['hike','undeveloped','daylight']::text[],
    12, 32, 28,
    5, true
  ),
  (
    'florence-after-five', 'Florence After Five', 'event', 'community', 34.1968, -79.7655, 'Florence', 'Florence', 'pee-dee',
    'Downtown block party series. 16th season in 2026.', 'Recurring downtown series — check the current date on the city calendar before you go.', '[{"days":["fri"],"open":"17:00","close":"21:00"}]'::jsonb,
    '2026-04-01'::date, '2026-10-31'::date, 'Seasonal Friday series',
    'https://www.cityofflorence.com', 'Pee Dee Tourism / City of Florence series listing', ARRAY['music','downtown','friday']::text[],
    26, 4, 46,
    6, true
  ),
  (
    'seaboard-park-cheraw', 'Cheraw River access / Seaboard', 'water', 'community', 34.689, -79.876, 'Cheraw', 'Chesterfield', 'pee-dee',
    'Great Pee Dee at town’s edge. Sunset if the river is up and the bugs are down.', 'Public land, daylight. Not a programmed event.', '[{"days":["mon","tue","wed","thu","fri","sat","sun"],"open":"07:00","close":"19:00"}]'::jsonb,
    null::date, null::date, null,
    null, 'Town riverfront / community reports', ARRAY['river','sunset','free']::text[],
    32, 48, 5,
    6, true
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

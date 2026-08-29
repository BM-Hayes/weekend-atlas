-- Weekend Atlas · us-east-1
-- Paste into the Supabase SQL editor, then run seed.sql.
-- listings is the public table. review_queue stays manual in 2026.

create extension if not exists pgcrypto;

do $$ begin
  create type public.badge as enum ('operator', 'verified', 'community', 'unverified');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.listing_kind as enum (
    'trail', 'water', 'garden', 'farm', 'market', 'museum', 'downtown', 'event', 'refuge'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.review_status as enum ('queued', 'needs_source', 'approved', 'rejected');
exception when duplicate_object then null;
end $$;

create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  kind public.listing_kind not null,
  badge public.badge not null default 'unverified',
  lat double precision not null,
  lng double precision not null,
  city text not null,
  county text not null,
  region text not null default 'pee-dee',
  one_liner text not null,
  why_this_weekend text not null,
  hours jsonb not null default '[]'::jsonb,
  season_start date,
  season_end date,
  season_label text,
  website text,
  source text,
  tags text[] not null default '{}',
  drive_minutes_hartsville smallint not null,
  drive_minutes_florence smallint not null,
  drive_minutes_cheraw smallint not null,
  fall_weight smallint not null default 5,
  published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint listings_lat check (lat between 33.5 and 35.5),
  constraint listings_lng check (lng between -81.0 and -78.8),
  constraint listings_region check (region = 'pee-dee')
);

create table if not exists public.review_queue (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  city text,
  kind text,
  website text,
  note text,
  from_hub text,
  status public.review_status not null default 'queued',
  raw jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists listings_touch on public.listings;
create trigger listings_touch
before update on public.listings
for each row execute function public.touch_updated_at();

create index if not exists listings_published_geo
  on public.listings (published, lat, lng);
create index if not exists listings_weekend_drive
  on public.listings (
    published,
    drive_minutes_hartsville,
    drive_minutes_florence,
    drive_minutes_cheraw
  );
create index if not exists listings_kind on public.listings (kind);
create index if not exists review_queue_status
  on public.review_queue (status, created_at desc);

alter table public.listings enable row level security;
alter table public.review_queue enable row level security;

drop policy if exists listings_public_read on public.listings;
create policy listings_public_read
  on public.listings
  for select
  using (published = true);

drop policy if exists review_queue_public_insert on public.review_queue;
create policy review_queue_public_insert
  on public.review_queue
  for insert
  with check (true);

-- Anon key can read published listings and insert queue rows.
-- Service role writes listings. Do not auto-promote queue → listings yet.

comment on table public.listings is
  'Pee Dee weekend listings. 2026 seed is published=true. Map reads this table.';
comment on table public.review_queue is
  'Human review only in 2026. Automate after the map path is stable.';

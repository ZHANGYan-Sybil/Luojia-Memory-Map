
-- Luojia Memory Map
-- Stage 4: Database Setup

-- Create the memories table

create table public.memories (
    id uuid primary key default gen_random_uuid(),

    content text not null
        check (
            char_length(btrim(content)) between 1 and 500
        ),

    latitude double precision not null
        check (latitude between -90 and 90),

    longitude double precision not null
        check (longitude between -180 and 180),

    created_at timestamptz not null default now()
);

-- Enable Row Level Security

alter table public.memories
enable row level security;

-- Restrict public permissions

revoke all on table public.memories
from anon, authenticated;

grant select, insert on table public.memories
to anon;

-- Allow anonymous visitors to read memories

create policy "Public can read memories"
on public.memories
for select
to anon
using (true);

-- Allow anonymous visitors to add memories

create policy "Public can add memories"
on public.memories
for insert
to anon
with check (true);
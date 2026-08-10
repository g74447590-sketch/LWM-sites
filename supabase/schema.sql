-- LWM Sites: execute this file in the Supabase SQL Editor before enabling authentication.
-- The application uses the Supabase service role ONLY on the server. Do not expose it in browser code.

create extension if not exists pgcrypto;

-- Media uploaded through the authenticated server route. Files are publicly readable
-- only after the application stores their safe HTTPS URL in a published site.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('site-media', 'site-media', true, 5242880, array['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
on conflict (id) do update set public = true, file_size_limit = 5242880, allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 80),
  email text not null unique check (email = lower(email)),
  password_hash text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  name text not null check (char_length(name) between 1 and 100),
  description text not null check (char_length(description) between 12 and 2000),
  status text not null default 'draft' check (status in ('draft', 'generating', 'ready', 'error')),
  generated_site jsonb,
  slug text unique,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_user_updated_idx on public.projects (user_id, updated_at desc);

-- Safe upgrades for a database that received an earlier version of this schema.
alter table public.projects add column if not exists slug text;
alter table public.projects add column if not exists published_at timestamptz;
create unique index if not exists projects_slug_unique_idx on public.projects (slug) where slug is not null;

-- Publication tokens are deliberately separate from payment providers. During
-- the free beta, LWM_TOKEN_BILLING_ENABLED remains false and these balances
-- are not charged. When billing is enabled, every account receives two launch
-- tokens and only the first publication of a project spends one token.
create table if not exists public.user_credits (
  user_id uuid primary key references public.users(id) on delete cascade,
  publish_tokens integer not null default 2 check (publish_tokens >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  project_id uuid references public.projects(id) on delete set null,
  delta integer not null,
  reason text not null check (reason in ('publish', 'manual_grant', 'payment')),
  created_at timestamptz not null default now()
);
create index if not exists credit_transactions_user_created_idx on public.credit_transactions (user_id, created_at desc);

-- This transaction keeps a token charge and the first publication atomic.
-- A future verified payment webhook can add positive `payment` transactions;
-- do not trust token quantities sent by a browser.
create or replace function public.publish_project_with_token(p_user_id uuid, p_project_id uuid, p_slug text)
returns setof public.projects
language plpgsql
security definer
set search_path = public
as $$
declare
  already_published timestamptz;
  remaining_tokens integer;
begin
  select published_at into already_published
  from public.projects
  where id = p_project_id and user_id = p_user_id
  for update;

  if not found then return; end if;

  if already_published is null then
    insert into public.user_credits (user_id)
    values (p_user_id)
    on conflict (user_id) do nothing;

    update public.user_credits
    set publish_tokens = publish_tokens - 1, updated_at = now()
    where user_id = p_user_id and publish_tokens >= 1
    returning publish_tokens into remaining_tokens;

    if not found then
      raise exception 'PUBLISH_TOKEN_REQUIRED';
    end if;

    insert into public.credit_transactions (user_id, project_id, delta, reason)
    values (p_user_id, p_project_id, -1, 'publish');
  end if;

  return query
  update public.projects
  set slug = coalesce(slug, p_slug), published_at = now()
  where id = p_project_id and user_id = p_user_id
  returning *;
end;
$$;
revoke all on function public.publish_project_with_token(uuid, uuid, text) from public;
grant execute on function public.publish_project_with_token(uuid, uuid, text) to service_role;

create table if not exists public.project_messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null check (char_length(content) between 1 and 2000),
  created_at timestamptz not null default now()
);
create index if not exists project_messages_project_created_idx on public.project_messages (project_id, created_at asc);

create table if not exists public.password_reset_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists password_reset_tokens_active_idx on public.password_reset_tokens (user_id, expires_at) where used_at is null;

create table if not exists public.rate_limit_events (
  id bigint generated always as identity primary key,
  rate_key text not null,
  created_at timestamptz not null default now()
);
create index if not exists rate_limit_events_key_created_idx on public.rate_limit_events (rate_key, created_at);

create or replace function public.consume_rate_limit(p_key text, p_limit integer, p_window_seconds integer)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  attempts integer;
begin
  perform pg_advisory_xact_lock(hashtext(p_key));
  delete from public.rate_limit_events
  where rate_key = p_key and created_at <= now() - make_interval(secs => p_window_seconds);
  select count(*) into attempts from public.rate_limit_events where rate_key = p_key;
  if attempts >= p_limit then return false; end if;
  insert into public.rate_limit_events (rate_key) values (p_key);
  return true;
end;
$$;
revoke all on function public.consume_rate_limit(text, integer, integer) from public;
grant execute on function public.consume_rate_limit(text, integer, integer) to service_role;

create or replace function public.set_updated_at()
returns trigger language plpgsql security invoker as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists users_set_updated_at on public.users;
create trigger users_set_updated_at before update on public.users for each row execute function public.set_updated_at();
drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
drop trigger if exists user_credits_set_updated_at on public.user_credits;
create trigger user_credits_set_updated_at before update on public.user_credits for each row execute function public.set_updated_at();

-- Browser clients receive no Supabase credentials. Explicitly deny direct table access;
-- the server-side repository enforces every query with the NextAuth user id.
alter table public.users enable row level security;
alter table public.projects enable row level security;
alter table public.project_messages enable row level security;
alter table public.password_reset_tokens enable row level security;
alter table public.rate_limit_events enable row level security;
alter table public.user_credits enable row level security;
alter table public.credit_transactions enable row level security;
drop policy if exists "deny direct users access" on public.users;
create policy "deny direct users access" on public.users for all using (false) with check (false);
drop policy if exists "deny direct projects access" on public.projects;
create policy "deny direct projects access" on public.projects for all using (false) with check (false);
drop policy if exists "deny direct project messages access" on public.project_messages;
create policy "deny direct project messages access" on public.project_messages for all using (false) with check (false);
drop policy if exists "deny direct password reset tokens access" on public.password_reset_tokens;
create policy "deny direct password reset tokens access" on public.password_reset_tokens for all using (false) with check (false);
drop policy if exists "deny direct rate limit access" on public.rate_limit_events;
create policy "deny direct rate limit access" on public.rate_limit_events for all using (false) with check (false);
drop policy if exists "deny direct user credits access" on public.user_credits;
create policy "deny direct user credits access" on public.user_credits for all using (false) with check (false);
drop policy if exists "deny direct credit transactions access" on public.credit_transactions;
create policy "deny direct credit transactions access" on public.credit_transactions for all using (false) with check (false);

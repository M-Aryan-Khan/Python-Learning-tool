-- =====================================================================
--  Python Path: database schema, security rules and helper functions
--  Run this ONCE in Supabase: SQL Editor -> New query -> paste -> Run.
--  It is safe to run again later (it only creates what is missing).
-- =====================================================================

create extension if not exists pgcrypto with schema extensions;

-- ---------- types ----------
do $$ begin
  create type public.app_role as enum ('student', 'campus_admin', 'coordinator', 'super_admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type public.school_status as enum ('none', 'claimed', 'confirmed');
exception when duplicate_object then null; end $$;

-- a 'section_admin' is a teacher who sees and manages only the sections assigned to them
alter type public.app_role add value if not exists 'section_admin';

-- ---------- campuses and sections (managed by the super admin) ----------
create table if not exists public.campuses (
  code text primary key,
  name text not null
);
insert into public.campuses (code, name) values ('maymar', 'Maymar'), ('kda', 'KDA')
on conflict (code) do nothing;

create table if not exists public.sections (
  id uuid primary key default gen_random_uuid(),
  campus text not null references public.campuses (code),
  name text not null check (length(trim(name)) between 1 and 20),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (campus, name)
);
-- Starting sections. The super admin can add, rename and hide sections later in the admin portal (Sections).
insert into public.sections (campus, name) values
  ('kda', '10-B'), ('kda', '10-C'), ('kda', '9-B'), ('kda', '9-C'),
  ('maymar', '10-A'), ('maymar', '10-B'), ('maymar', '9-A'), ('maymar', '9-C')
on conflict (campus, name) do nothing;

-- ---------- one profile per signed-up person ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  full_name text not null,
  role public.app_role not null default 'student',
  admin_campus text references public.campuses (code),      -- only for campus_admin
  school_status public.school_status not null default 'none', -- none = not a school student
  campus text references public.campuses (code),
  section_id uuid references public.sections (id),
  gr_number text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  last_seen timestamptz
);
create index if not exists profiles_campus_idx on public.profiles (campus, section_id);
create index if not exists profiles_gr_idx on public.profiles (campus, gr_number);

-- ---------- progress (one row per student per activity) ----------
create table if not exists public.progress (
  user_id uuid not null references public.profiles (id) on delete cascade,
  item_id text not null,
  lesson_id text,
  kind text,
  attempts integer not null default 0,
  passes integer not null default 0,
  completed_at timestamptz,
  first_attempt_at timestamptz not null default now(),
  last_attempt_at timestamptz not null default now(),
  code text,
  primary key (user_id, item_id)
);
create index if not exists progress_lesson_idx on public.progress (lesson_id);
create index if not exists progress_recent_idx on public.progress (last_attempt_at desc);

-- which sections an admin manages (section admins see only these; any admin may also be given sections to manage)
create table if not exists public.admin_sections (
  user_id uuid not null references public.profiles (id) on delete cascade,
  section_id uuid not null references public.sections (id) on delete cascade,
  primary key (user_id, section_id)
);

create table if not exists public.lesson_stats (
  user_id uuid not null references public.profiles (id) on delete cascade,
  lesson_id text not null,
  views integer not null default 0,
  runs integer not null default 0,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  primary key (user_id, lesson_id)
);

-- ---------- helper functions used by the security rules ----------
create or replace function public.is_super()
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.active and p.role = 'super_admin');
$$;

create or replace function public.can_view_campus(c text)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles p
    where p.id = auth.uid() and p.active
      and (p.role in ('super_admin', 'coordinator') or (p.role = 'campus_admin' and p.admin_campus is not null and p.admin_campus = c))
  );
$$;

-- who may look at this person's profile and progress?
--   super admin: everyone.  coordinator: every school student.  campus admin: school students of their campus.
--   people who are NOT school students are visible to the super admin only.
-- can this admin manage learners of this section? (super admin: every section; others: sections assigned to them)
create or replace function public.can_manage_section(sec uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_super() or (
    sec is not null and exists (
      select 1 from public.admin_sections a join public.profiles p on p.id = a.user_id
      where a.user_id = auth.uid() and a.section_id = sec and p.active and p.role::text <> 'student'
    )
  );
$$;

-- who may look at this person's profile and progress?
--   super admin: everyone.  coordinator: every school student.  campus admin: school students of their campus.
--   any admin: school students in a section assigned to them.
--   people who are NOT school students are visible to the super admin only.
create or replace function public.can_view_user(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_super()
      or exists (
        select 1 from public.profiles t
        where t.id = uid and t.school_status <> 'none' and t.campus is not null
          and (public.can_view_campus(t.campus) or public.can_manage_section(t.section_id))
      );
$$;

-- can this admin change this learner (details, password)?
create or replace function public.can_manage_user(uid uuid)
returns boolean language sql stable security definer set search_path = public as $$
  select public.is_super() or exists (
    select 1 from public.profiles t
    where t.id = uid and t.role::text = 'student' and t.school_status <> 'none' and public.can_manage_section(t.section_id)
  );
$$;

-- ---------- when someone signs up, create their profile ----------
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  claim boolean := false;
  camp text := null;
  sec uuid := null;
  gr text := null;
begin
  begin claim := coalesce((m ->> 'school')::boolean, false); exception when others then claim := false; end;
  if claim then
    camp := m ->> 'campus';
    begin sec := (m ->> 'section_id')::uuid; exception when others then sec := null; end;
    gr := left(trim(coalesce(m ->> 'gr_number', '')), 30);
    if gr = '' or not exists (select 1 from public.sections s where s.id = sec and s.campus = camp and s.active) then
      claim := false; camp := null; sec := null; gr := null;
    end if;
  end if;
  insert into public.profiles (id, email, full_name, school_status, campus, section_id, gr_number)
  values (
    new.id, new.email,
    left(coalesce(nullif(trim(m ->> 'full_name'), ''), nullif(split_part(coalesce(new.email, ''), '@', 1), ''), 'Learner'), 80),
    case when claim then 'claimed'::public.school_status else 'none'::public.school_status end,
    camp, sec, gr
  );
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------- row level security ----------
alter table public.campuses enable row level security;
alter table public.sections enable row level security;
alter table public.profiles enable row level security;
alter table public.progress enable row level security;
alter table public.lesson_stats enable row level security;
alter table public.admin_sections enable row level security;

-- campuses / sections: everyone may read (the sign-up form needs them); only the super admin may change sections
drop policy if exists campuses_read on public.campuses;
create policy campuses_read on public.campuses for select using (true);

drop policy if exists sections_read on public.sections;
create policy sections_read on public.sections for select using (true);

drop policy if exists sections_write on public.sections;
create policy sections_write on public.sections for all to authenticated using (public.is_super()) with check (public.is_super());

-- profiles: you can read your own; admins can read people in their scope. Nobody edits profiles directly (see functions below).
drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated
  using (id = (select auth.uid()) or public.can_view_user(id));

-- assignments: you can see your own; the super admin sees all
drop policy if exists admin_sections_read on public.admin_sections;
create policy admin_sections_read on public.admin_sections for select to authenticated
  using (user_id = (select auth.uid()) or public.is_super());

-- progress and stats: read-only from the browser (writes go through the functions below)
drop policy if exists progress_read on public.progress;
create policy progress_read on public.progress for select to authenticated
  using (user_id = (select auth.uid()) or public.can_view_user(user_id));

drop policy if exists stats_read on public.lesson_stats;
create policy stats_read on public.lesson_stats for select to authenticated
  using (user_id = (select auth.uid()) or public.can_view_user(user_id));

-- ---------- functions students use ----------
create or replace function public.save_progress(p_item text, p_lesson text, p_kind text, p_code text, p_passed boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if p_item is null or length(p_item) not between 1 and 120 then raise exception 'bad item'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid() and active) then raise exception 'account disabled'; end if;
  -- admins only look around: their activity is never recorded
  if exists (select 1 from public.profiles where id = auth.uid() and role <> 'student') then return; end if;
  if (select count(*) from public.progress where user_id = auth.uid()) >= 3000
     and not exists (select 1 from public.progress where user_id = auth.uid() and item_id = p_item) then
    raise exception 'too many items';
  end if;
  insert into public.progress (user_id, item_id, lesson_id, kind, attempts, passes, completed_at, code)
  values (auth.uid(), p_item, left(p_lesson, 80), left(p_kind, 30), 1, case when p_passed then 1 else 0 end,
          case when p_passed then now() end, left(p_code, 8000))
  on conflict (user_id, item_id) do update set
    attempts = public.progress.attempts + 1,
    passes = public.progress.passes + case when p_passed then 1 else 0 end,
    completed_at = coalesce(public.progress.completed_at, case when p_passed then now() end),
    last_attempt_at = now(),
    code = coalesce(left(p_code, 8000), public.progress.code),
    lesson_id = coalesce(left(p_lesson, 80), public.progress.lesson_id),
    kind = coalesce(left(p_kind, 30), public.progress.kind);
end $$;

create or replace function public.bump_lesson(p_lesson text, p_views integer, p_runs integer)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if not exists (select 1 from public.profiles where id = auth.uid() and active) then raise exception 'account disabled'; end if;
  if exists (select 1 from public.profiles where id = auth.uid() and role <> 'student') then return; end if;
  if (select count(*) from public.lesson_stats where user_id = auth.uid()) >= 500
     and not exists (select 1 from public.lesson_stats where user_id = auth.uid() and lesson_id = left(p_lesson, 80)) then
    return;
  end if;
  insert into public.lesson_stats (user_id, lesson_id, views, runs)
  values (auth.uid(), left(p_lesson, 80), greatest(0, least(coalesce(p_views, 0), 50)), greatest(0, least(coalesce(p_runs, 0), 500)))
  on conflict (user_id, lesson_id) do update set
    views = public.lesson_stats.views + greatest(0, least(coalesce(p_views, 0), 50)),
    runs = public.lesson_stats.runs + greatest(0, least(coalesce(p_runs, 0), 500)),
    last_seen = now();
  update public.profiles set last_seen = now() where id = auth.uid();
end $$;

create or replace function public.update_my_name(p_name text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if length(trim(coalesce(p_name, ''))) < 2 then raise exception 'name too short'; end if;
  update public.profiles set full_name = left(trim(p_name), 80) where id = auth.uid() and active;
end $$;

-- ---------- functions only the SUPER ADMIN can use ----------
create or replace function public.admin_update_profile(
  p_user uuid, p_name text, p_gr text, p_status public.school_status,
  p_campus text, p_section uuid, p_active boolean)
returns void language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if not exists (select 1 from public.profiles where id = p_user) then raise exception 'no such user'; end if;
  if not public.is_super() then
    if not public.can_manage_user(p_user) then raise exception 'you can only change learners in your own sections'; end if;
    if p_status = 'none' then raise exception 'only the super admin can remove someone from the school'; end if;
    if not public.can_manage_section(p_section) then raise exception 'that section is not one of yours'; end if;
  end if;
  if length(trim(coalesce(p_name, ''))) < 2 then raise exception 'name too short'; end if;
  if p_user = auth.uid() and p_active is false then raise exception 'you cannot disable your own account'; end if;
  if p_status = 'none' then
    update public.profiles set full_name = left(trim(p_name), 80), gr_number = null, school_status = 'none',
      campus = null, section_id = null, active = coalesce(p_active, active) where id = p_user;
  else
    if not exists (select 1 from public.sections s where s.id = p_section and s.campus = p_campus) then
      raise exception 'that section does not belong to that campus';
    end if;
    update public.profiles set full_name = left(trim(p_name), 80), gr_number = left(trim(p_gr), 30),
      school_status = p_status, campus = p_campus, section_id = p_section, active = coalesce(p_active, active)
    where id = p_user;
  end if;
end $$;

create or replace function public.admin_set_role(p_user uuid, p_role public.app_role, p_campus text)
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_super() then raise exception 'only the super admin can do this'; end if;
  if p_user = auth.uid() then raise exception 'you cannot change your own role'; end if;
  if not exists (select 1 from public.profiles where id = p_user) then raise exception 'no such user'; end if;
  if p_role = 'campus_admin' and (p_campus is null or not exists (select 1 from public.campuses where code = p_campus)) then
    raise exception 'a campus admin needs a campus';
  end if;
  update public.profiles set role = p_role, admin_campus = case when p_role = 'campus_admin' then p_campus end where id = p_user;
  if p_role = 'student' then delete from public.admin_sections where user_id = p_user; end if;
end $$;

-- which sections an admin manages (super admin only)
create or replace function public.admin_set_sections(p_user uuid, p_sections uuid[])
returns void language plpgsql security definer set search_path = public as $$
begin
  if not public.is_super() then raise exception 'only the super admin can do this'; end if;
  if not exists (select 1 from public.profiles where id = p_user and role::text <> 'student') then raise exception 'that person is not an admin'; end if;
  delete from public.admin_sections where user_id = p_user;
  insert into public.admin_sections (user_id, section_id)
    select p_user, s.id from public.sections s where s.id = any(coalesce(p_sections, '{}'::uuid[]));
end $$;

-- Set a new password for a learner WITHOUT any e-mail (free plan friendly). Super admin, or the admin of that learner's section.
create or replace function public.admin_set_password(p_user uuid, p_password text)
returns void language plpgsql security definer set search_path = public, extensions, auth as $$
begin
  if not public.can_manage_user(p_user) then raise exception 'you can only set passwords for learners in your own sections'; end if;
  if length(coalesce(p_password, '')) < 8 then raise exception 'password too short (at least 8 characters)'; end if;
  if length(p_password) > 72 then raise exception 'password too long (at most 72 characters)'; end if;
  if not exists (select 1 from auth.users where id = p_user) then raise exception 'no such user'; end if;
  update auth.users set encrypted_password = extensions.crypt(p_password, extensions.gen_salt('bf', 10)), updated_at = now()
  where id = p_user;
  -- sign the learner out everywhere so the old password stops working
  begin delete from auth.sessions where user_id = p_user; exception when others then null; end;
  begin delete from auth.refresh_tokens where user_id::text = p_user::text; exception when others then null; end;
end $$;

-- Create a learner's account straight away (confirmed, ready to sign in with e-mail + password).
-- Super admin: any section. Section admin: only sections assigned to them.
create or replace function public.admin_create_student(p_email text, p_password text, p_name text, p_gr text, p_section uuid)
returns uuid language plpgsql security definer set search_path = public, extensions, auth as $$
declare
  v_id uuid := gen_random_uuid();
  v_email text := lower(trim(coalesce(p_email, '')));
  v_campus text;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if not public.can_manage_section(p_section) then raise exception 'you cannot add learners to that section'; end if;
  select s.campus into v_campus from public.sections s where s.id = p_section and s.active;
  if v_campus is null then raise exception 'unknown or hidden section'; end if;
  if length(v_email) > 200 or v_email !~ '^[^@[:space:]]+@[^@[:space:]]+[.][^@[:space:]]+$' then raise exception 'that email address is not valid'; end if;
  if length(trim(coalesce(p_name, ''))) < 2 then raise exception 'name too short'; end if;
  if length(trim(coalesce(p_gr, ''))) < 1 then raise exception 'GR number is required'; end if;
  if length(coalesce(p_password, '')) < 8 then raise exception 'password too short (at least 8 characters)'; end if;
  if length(p_password) > 72 then raise exception 'password too long (at most 72 characters)'; end if;
  if exists (select 1 from auth.users u where lower(u.email) = v_email) then raise exception 'an account with that email already exists'; end if;

  insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
                          raw_app_meta_data, raw_user_meta_data, created_at, updated_at,
                          confirmation_token, recovery_token, email_change_token_new, email_change)
  values ('00000000-0000-0000-0000-000000000000', v_id, 'authenticated', 'authenticated', v_email,
          extensions.crypt(p_password, extensions.gen_salt('bf', 10)), now(),
          '{"provider":"email","providers":["email"]}'::jsonb,
          jsonb_build_object('full_name', left(trim(p_name), 80), 'school', true, 'campus', v_campus,
                             'section_id', p_section::text, 'gr_number', left(trim(p_gr), 30)),
          now(), now(), '', '', '', '');

  insert into auth.identities (id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at)
  values (gen_random_uuid(), v_id, jsonb_build_object('sub', v_id::text, 'email', v_email, 'email_verified', true),
          'email', v_id::text, now(), now(), now());

  -- the sign-up trigger made the profile as "claimed"; an admin adding the learner means it is confirmed
  update public.profiles set school_status = 'confirmed' where id = v_id;
  return v_id;
end $$;

-- ---------- one-row-per-student summary for the admin lists (respects the same security rules) ----------
create or replace view public.student_summary with (security_invoker = true) as
select p.id as user_id,
       count(pr.item_id) filter (where pr.completed_at is not null) as done_items,
       count(pr.item_id) as touched_items,
       coalesce(sum(pr.attempts), 0)::int as attempts,
       greatest(max(pr.last_attempt_at), p.last_seen) as last_activity
from public.profiles p
left join public.progress pr on pr.user_id = p.id
group by p.id;

-- ---------- permissions ----------
-- anything created in this schema LATER is private by default
alter default privileges for role postgres in schema public revoke all on tables from anon, authenticated;
alter default privileges for role postgres in schema public revoke execute on functions from public, anon, authenticated;
alter default privileges for role postgres in schema public revoke all on sequences from anon, authenticated;

revoke all on all tables in schema public from anon, authenticated;
grant select on public.campuses, public.sections to anon, authenticated;
grant select on public.profiles, public.progress, public.lesson_stats, public.student_summary, public.admin_sections to authenticated;
grant insert, update, delete on public.sections to authenticated;   -- still limited to the super admin by the policy above

revoke all on function public.is_super() from public, anon;
revoke all on function public.can_view_campus(text) from public, anon;
revoke all on function public.can_view_user(uuid) from public, anon;
revoke all on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.is_super() to authenticated;
grant execute on function public.can_view_campus(text) to authenticated;
grant execute on function public.can_view_user(uuid) to authenticated;
revoke all on function public.save_progress(text, text, text, text, boolean) from public, anon;
revoke all on function public.bump_lesson(text, integer, integer) from public, anon;
revoke all on function public.update_my_name(text) from public, anon;
revoke all on function public.admin_update_profile(uuid, text, text, public.school_status, text, uuid, boolean) from public, anon;
revoke all on function public.admin_set_role(uuid, public.app_role, text) from public, anon;
revoke all on function public.admin_set_password(uuid, text) from public, anon;
grant execute on function public.save_progress(text, text, text, text, boolean) to authenticated;
grant execute on function public.bump_lesson(text, integer, integer) to authenticated;
grant execute on function public.update_my_name(text) to authenticated;
grant execute on function public.admin_update_profile(uuid, text, text, public.school_status, text, uuid, boolean) to authenticated;
grant execute on function public.admin_set_role(uuid, public.app_role, text) to authenticated;
revoke all on function public.can_manage_section(uuid) from public, anon;
revoke all on function public.can_manage_user(uuid) from public, anon;
revoke all on function public.admin_set_sections(uuid, uuid[]) from public, anon;
revoke all on function public.admin_create_student(text, text, text, text, uuid) from public, anon;
grant execute on function public.can_manage_section(uuid) to authenticated;
grant execute on function public.can_manage_user(uuid) to authenticated;
grant execute on function public.admin_set_sections(uuid, uuid[]) to authenticated;
grant execute on function public.admin_create_student(text, text, text, text, uuid) to authenticated;
grant execute on function public.admin_set_password(uuid, text) to authenticated;

-- =====================================================================
--  AFTER you sign up on your own website, make yourself the super admin:
--  (replace the e-mail with the one you signed up with, then run just this line)
--
--    update public.profiles set role = 'super_admin' where email = 'you@example.com';
-- =====================================================================

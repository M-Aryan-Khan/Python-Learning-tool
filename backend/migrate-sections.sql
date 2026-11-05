-- =====================================================================
--  RUN THIS ONCE if you already ran the first version of schema.sql
--  (which created the KDA sections "XB" and "XC").
--  Supabase: SQL Editor -> New query -> paste -> Run.
--  It keeps every student that is already in XB / XC and just renames the section.
--  Safe to run again.
-- =====================================================================

-- rename the old KDA sections (students stay attached)
update public.sections set name = '10-B' where campus = 'kda' and name = 'XB'
  and not exists (select 1 from public.sections where campus = 'kda' and name = '10-B');
update public.sections set name = '10-C' where campus = 'kda' and name = 'XC'
  and not exists (select 1 from public.sections where campus = 'kda' and name = '10-C');

-- make sure every section you named exists
insert into public.sections (campus, name) values
  ('kda', '10-B'), ('kda', '10-C'), ('kda', '9-B'), ('kda', '9-C'),
  ('maymar', '10-A'), ('maymar', '10-B'), ('maymar', '9-A'), ('maymar', '9-C')
on conflict (campus, name) do nothing;

-- check the result
select campus, name, active from public.sections order by campus, name;

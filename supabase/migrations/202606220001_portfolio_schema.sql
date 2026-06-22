-- Estudio Javier Calamante: portfolio, contact inbox and private administration.
-- Apply this migration to a new, isolated Supabase project.

create table if not exists public.admin_users (
  email text primary key check (email = lower(email)),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

insert into public.admin_users (email)
values ('javiercalamantetandil@gmail.com')
on conflict (email) do update set active = true;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.admin_users
    where email = lower(coalesce((select auth.jwt()) ->> 'email', ''))
      and active = true
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table if not exists public.projects (
  id bigint generated always as identity primary key,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (char_length(title) between 2 and 120),
  excerpt text not null default '' check (char_length(excerpt) <= 280),
  description text not null default '' check (char_length(description) <= 12000),
  location text not null default 'Tandil, Buenos Aires' check (char_length(location) <= 160),
  category text not null default 'Residencial'
    check (category in ('Residencial', 'Comercial', 'Interiores', 'Reforma', 'Institucional')),
  completion_year smallint check (completion_year between 1950 and 2100),
  status text not null default 'draft' check (status in ('draft', 'published')),
  featured boolean not null default false,
  sort_order integer not null default 0,
  cover_image_path text,
  created_by uuid default (select auth.uid()) references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_status_sort_idx
  on public.projects (status, featured desc, sort_order, created_at desc);
create index if not exists projects_created_by_idx on public.projects (created_by);

create table if not exists public.project_images (
  id bigint generated always as identity primary key,
  project_id bigint not null references public.projects(id) on delete cascade,
  storage_path text not null unique,
  alt_text text not null default '' check (char_length(alt_text) <= 240),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists project_images_project_id_idx
  on public.project_images (project_id, sort_order, id);

create table if not exists public.inquiries (
  id bigint generated always as identity primary key,
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  phone text not null check (char_length(phone) between 6 and 40),
  project_type text not null default 'Consulta general'
    check (project_type in ('Vivienda nueva', 'Reforma', 'Comercial', 'Interiores', 'Dirección de obra', 'Consulta general')),
  message text not null check (char_length(message) between 10 and 4000),
  consent boolean not null check (consent = true),
  status text not null default 'new' check (status in ('new', 'contacted', 'archived')),
  admin_notes text not null default '' check (char_length(admin_notes) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists inquiries_status_created_idx
  on public.inquiries (status, created_at desc);
create index if not exists inquiries_email_created_idx
  on public.inquiries (lower(email), created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists inquiries_set_updated_at on public.inquiries;
create trigger inquiries_set_updated_at
before update on public.inquiries
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.project_images enable row level security;
alter table public.inquiries enable row level security;

drop policy if exists "Public can read published projects" on public.projects;
create policy "Public can read published projects"
on public.projects for select
to anon, authenticated
using (status = 'published');

drop policy if exists "Admins can read all projects" on public.projects;
create policy "Admins can read all projects"
on public.projects for select
to authenticated
using ((select public.is_admin()));

drop policy if exists "Admins can insert projects" on public.projects;
create policy "Admins can insert projects"
on public.projects for insert
to authenticated
with check ((select public.is_admin()));

drop policy if exists "Admins can update projects" on public.projects;
create policy "Admins can update projects"
on public.projects for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins can delete projects" on public.projects;
create policy "Admins can delete projects"
on public.projects for delete
to authenticated
using ((select public.is_admin()));

drop policy if exists "Public can read published project images" on public.project_images;
create policy "Public can read published project images"
on public.project_images for select
to anon, authenticated
using (
  exists (
    select 1 from public.projects
    where projects.id = project_images.project_id
      and projects.status = 'published'
  )
);

drop policy if exists "Admins can manage project images" on public.project_images;
create policy "Admins can manage project images"
on public.project_images for all
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins can read inquiries" on public.inquiries;
create policy "Admins can read inquiries"
on public.inquiries for select
to authenticated
using ((select public.is_admin()));

drop policy if exists "Admins can update inquiries" on public.inquiries;
create policy "Admins can update inquiries"
on public.inquiries for update
to authenticated
using ((select public.is_admin()))
with check ((select public.is_admin()));

drop policy if exists "Admins can delete inquiries" on public.inquiries;
create policy "Admins can delete inquiries"
on public.inquiries for delete
to authenticated
using ((select public.is_admin()));

create or replace function public.submit_inquiry(
  p_name text,
  p_email text,
  p_phone text,
  p_project_type text,
  p_message text,
  p_consent boolean
)
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_id bigint;
  clean_email text := lower(trim(p_email));
begin
  if char_length(trim(p_name)) not between 2 and 120 then
    raise exception 'Nombre inválido';
  end if;
  if clean_email !~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$' then
    raise exception 'Email inválido';
  end if;
  if char_length(trim(p_phone)) not between 6 and 40 then
    raise exception 'Teléfono inválido';
  end if;
  if char_length(trim(p_message)) not between 10 and 4000 then
    raise exception 'Mensaje inválido';
  end if;
  if p_consent is not true then
    raise exception 'Se requiere consentimiento';
  end if;
  if p_project_type not in ('Vivienda nueva', 'Reforma', 'Comercial', 'Interiores', 'Dirección de obra', 'Consulta general') then
    raise exception 'Tipo de proyecto inválido';
  end if;
  if (
    select count(*) from public.inquiries
    where lower(email) = clean_email
      and created_at > now() - interval '1 hour'
  ) >= 3 then
    raise exception 'Demasiadas consultas. Intente nuevamente más tarde.';
  end if;

  insert into public.inquiries (name, email, phone, project_type, message, consent)
  values (trim(p_name), clean_email, trim(p_phone), p_project_type, trim(p_message), true)
  returning id into new_id;

  return new_id;
end;
$$;

revoke all on function public.submit_inquiry(text, text, text, text, text, boolean) from public;
grant execute on function public.submit_inquiry(text, text, text, text, text, boolean) to anon, authenticated;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images',
  'project-images',
  true,
  8388608,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can read project image files" on storage.objects;
create policy "Public can read project image files"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'project-images');

drop policy if exists "Admins can upload project image files" on storage.objects;
create policy "Admins can upload project image files"
on storage.objects for insert
to authenticated
with check (bucket_id = 'project-images' and (select public.is_admin()));

drop policy if exists "Admins can update project image files" on storage.objects;
create policy "Admins can update project image files"
on storage.objects for update
to authenticated
using (bucket_id = 'project-images' and (select public.is_admin()))
with check (bucket_id = 'project-images' and (select public.is_admin()));

drop policy if exists "Admins can delete project image files" on storage.objects;
create policy "Admins can delete project image files"
on storage.objects for delete
to authenticated
using (bucket_id = 'project-images' and (select public.is_admin()));

revoke all on public.admin_users from anon, authenticated;
grant select on public.projects, public.project_images to anon, authenticated;
grant insert, update, delete on public.projects, public.project_images to authenticated;
grant select, update, delete on public.inquiries to authenticated;
grant usage, select on all sequences in schema public to authenticated;

-- Migration: Add surface and materials columns to public.projects table
-- Enables persistent square meters and constructive material specifications.

alter table public.projects
  add column if not exists surface text default '' check (char_length(surface) <= 120),
  add column if not exists materials text default '' check (char_length(materials) <= 280);

-- Update existing sample projects if they exist
update public.projects
set
  surface = coalesce(nullif(surface, ''), '320 m²'),
  materials = coalesce(nullif(materials, ''), 'Piedra de Tandil labrada, hormigón visto, madera natural')
where slug = 'casa-sabino';

-- Migration: Relax project_type constraint on inquiries table and update submit_inquiry function
-- Ensures both canonical categories and descriptive client entries are safely persisted.

alter table public.inquiries drop constraint if exists inquiries_project_type_check;

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
  clean_type text := trim(p_project_type);
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
  if char_length(clean_type) not between 2 and 120 then
    clean_type := 'Consulta general';
  end if;
  if (
    select count(*) from public.inquiries
    where lower(email) = clean_email
      and created_at > now() - interval '1 hour'
  ) >= 5 then
    raise exception 'Demasiadas consultas. Intente nuevamente más tarde.';
  end if;

  insert into public.inquiries (name, email, phone, project_type, message, consent)
  values (trim(p_name), clean_email, trim(p_phone), clean_type, trim(p_message), true)
  returning id into new_id;

  return new_id;
end;
$$;

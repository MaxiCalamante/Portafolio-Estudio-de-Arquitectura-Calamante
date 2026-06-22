# Estudio Javier Calamante

Landing y portfolio administrable para un estudio de arquitectura en Tandil. Incluye portfolio público, contacto, SEO local y panel privado para gestionar proyectos y consultas.

## Funciones

- Landing editorial responsive.
- Portfolio alimentado desde Supabase, con estado borrador/publicado, orden, portada y galería.
- Vista ampliada de cada proyecto.
- Formulario de consultas con validación, consentimiento y límite básico por email.
- `/login` privado, sin enlaces visibles desde la web.
- `/admin` protegido para crear, editar y eliminar proyectos e imágenes.
- Bandeja de consultas con estados, notas privadas, teléfono y email directos.
- RLS, lista de administradores y políticas privadas de Storage.
- SEO local para “arquitecto en Tandil”, Schema.org, Open Graph, robots, sitemap y manifest.
- Reglas de Vercel para SPA, cache y cabeceras de seguridad.

## Desarrollo

```bash
npm install
cp .env.example .env.local
npm run dev
```

Variables necesarias:

```env
VITE_SUPABASE_URL=https://PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_SITE_URL=https://dominio-final.example
```

## Supabase

1. Crear un proyecto Supabase nuevo y aislado.
2. Aplicar `supabase/migrations/202606220001_portfolio_schema.sql`.
3. Copiar la URL y la publishable key a `.env.local` y a Vercel.
4. En Authentication → Users, crear o invitar a `javiercalamantetandil@gmail.com`.
5. Mantener deshabilitado el registro público si sólo Javier administrará el sitio.

La migración autoriza ese email en `admin_users`. Los visitantes sólo pueden leer proyectos publicados y ejecutar `submit_inquiry`; no pueden leer consultas ni modificar datos.

### Estado de la conexión

La organización Supabase `Turnero` alcanzó el límite gratuito de dos proyectos activos. No se modificó ni pausó ninguno. El esquema y la integración están completos, pero hace falta liberar un cupo o ampliar el plan para crear y conectar el proyecto nuevo.

## Vercel

- Producción: https://javier-calamante-arquitecto.vercel.app
- Framework: Vite
- Build command: `npm run build`
- Output: `dist`
- Agregar las dos variables públicas de Supabase.
- Actualizar `canonical`, `robots.txt`, `sitemap.xml` y JSON-LD si el dominio definitivo no es `javiercalamante.com.ar`.

## Verificación

```bash
npm run lint
npm run build
```

## Contenido inicial

Mientras Supabase no tenga proyectos publicados, la landing muestra tres imágenes conceptuales identificadas como tales. El primer proyecto publicado desde `/admin` reemplaza automáticamente esa selección.

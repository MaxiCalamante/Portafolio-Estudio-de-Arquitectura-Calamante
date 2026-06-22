# Fidelity ledger

## Comparación final

| Punto | Evidencia del concepto | Evidencia del render | Resultado |
| --- | --- | --- | --- |
| Primera pantalla | Blanco real, columna editorial 44/56, imagen sin overlay | `render-desktop.png` | Coincide; se ajustaron escala y altura del hero. |
| Copy visible | Marca, cuatro enlaces, título, bajada, dos CTA y ubicación | Snapshot de Browser/IAB | Sin agregados ni faltantes sobre el pliegue. |
| Tipografía | Serif de alto contraste + sans neutral | Instrument Serif + DM Sans | Coincide en personalidad, jerarquía y peso. |
| Paleta | Blanco, carbón y óxido | Tokens `--white`, `--ink`, `--accent` | Coincide; no hay tintes, gradientes ni fondos crema. |
| Galería | Una pieza horizontal y dos piezas verticales, sin tarjetas | `render-projects.png` | Proporciones corregidas para igualar densidad y ritmo. |
| Servicios | Filas numeradas abiertas, hairlines y flechas | `render-services.png` | Coincide y suma expansión funcional por fila. |
| Contacto | Banda carbón, dos CTA, datos y footer integrado | `render-contact.png` | Coincide; se agregó el horario público de sábado. |
| Responsive | Continuación limpia y controles legibles | `render-mobile.png`, 390×844 | Sin overflow; menú móvil y filtros verificados. |

## Desviaciones intencionales

- Las imágenes son dirección visual conceptual y están identificadas como tales. No se presentan como obras construidas.
- No se usó el retrato genérico del concepto: no apareció una fotografía pública de Javier con resolución suficiente para un bloque editorial.
- No hay enlace a un archivo completo de proyectos porque todavía no existe contenido público verificable para esa vista.

## Verificación

- Browser/IAB en 1536×1024 y 390×844.
- Filtros de proyectos, acordeones de servicios y navegación móvil probados.
- `npm run build` y `npm run lint` sin errores.
- Sin errores o advertencias en la consola del navegador.

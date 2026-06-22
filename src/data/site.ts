export const contact = {
  phoneDisplay: '+54 249 454 3936',
  phoneHref: 'tel:+542494543936',
  whatsappHref:
    'https://wa.me/542494543936?text=Hola%20Javier%2C%20quisiera%20conversar%20sobre%20un%20proyecto.',
  email: 'javiercalamantetandil@gmail.com',
  address: 'Maipú 710 · Tandil, Buenos Aires',
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=Maip%C3%BA%20710%2C%20Tandil%2C%20Buenos%20Aires',
  schedule: 'Lun–Vie 9–18 h · Sáb 10–14 h',
}

export const social = {
  instagram: 'https://www.instagram.com/javier_calamante/',
  facebook: 'https://www.facebook.com/people/Estudio-Calamante/100057443739996/',
  linkedin: 'https://ar.linkedin.com/in/javier-calamante-39a7b15a',
}

export const fallbackProjects = [
  {
    title: 'Vivienda y paisaje',
    category: 'Residencial' as const,
    location: 'Tandil',
    image: '/images/architecture-landscape.webp',
    alt: 'Vivienda contemporánea integrada a un paisaje serrano',
    size: 'wide',
  },
  {
    title: 'Patios y materialidad',
    category: 'Interiores' as const,
    location: 'Buenos Aires',
    image: '/images/courtyard-house.webp',
    alt: 'Patio de ladrillo y hormigón con un árbol central',
    size: 'portrait',
  },
  {
    title: 'Espacios de trabajo',
    category: 'Comercial' as const,
    location: 'Tandil',
    image: '/images/studio-workspace.webp',
    alt: 'Estudio de trabajo con hormigón, madera y luz natural',
    size: 'portrait',
  },
] as const

export const services = [
  {
    number: '01',
    title: 'Proyecto y diseño',
    description: 'Ideas claras, espacios funcionales y una respuesta precisa al sitio.',
  },
  {
    number: '02',
    title: 'Dirección de obra',
    description: 'Seguimiento cercano para cuidar decisiones, tiempos y calidad de ejecución.',
  },
  {
    number: '03',
    title: 'Reformas e interiores',
    description: 'Nuevas formas de habitar estructuras existentes, con criterio y detalle.',
  },
  {
    number: '04',
    title: 'Documentación y gestión',
    description: 'Documentación técnica y acompañamiento de permisos para avanzar con claridad.',
  },
] as const

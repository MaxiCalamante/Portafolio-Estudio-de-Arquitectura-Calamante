// Vercel Serverless Function: api/share.js
// Generates dynamic Open Graph meta tags for shared architecture projects (WhatsApp, Facebook, Twitter, iMessage)

const projectsData = {
  'casa-sabino': {
    title: 'Casa Sabino',
    category: 'Residencial · Sierras de Tandil',
    excerpt: 'Residencia serrana en piedra natural de Tandil, madera maciza y grandes aberturas integradas al paisaje serrano.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/casa-sabino/cover.webp',
  },
  'casa-bertini': {
    title: 'Casa Bertini',
    category: 'Residencial · Tandil',
    excerpt: 'Vivienda contemporánea con articulación de patios internos, amplios aventanamientos y diseño de iluminación natural.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/casa-bertini/cover.webp',
  },
  'edificio-roca': {
    title: 'Edificio Roca',
    category: 'Comercial & Residencial · Centro de Tandil',
    excerpt: 'Edificio de propiedad horizontal y locales comerciales en planta baja. Fachada en hormigón visto y carpinterías de alta prestación.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/edificio-roca/cover.webp',
  },
  'casa-haristeguy': {
    title: 'Casa Haristeguy',
    category: 'Residencial · Zona de Quintas',
    excerpt: 'Casa de fin de semana con quincho vidriado, piscina integrada y parque con vegetación autóctona tandilense.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/casa-haristeguy/cover.webp',
  },
  'casa-lopez-echaniz': {
    title: 'Casa López Echaniz',
    category: 'Residencial · Tandil',
    excerpt: 'Vivienda familiar de lenguaje racionalista, distribución funcional en dos plantas y excelente captación térmica.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/casa-lopez-echaniz/cover.webp',
  },
  'casa-jaureguibehere': {
    title: 'Casa Jaureguibehere',
    category: 'Residencial · Tandil',
    excerpt: 'Intervención y ampliación residencial con integración de cocina-comedor y galerías al jardín.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/casa-jaureguibehere/cover.webp',
  },
  'casa-violini': {
    title: 'Casa Violini',
    category: 'Residencial · Barrio Cerrado',
    excerpt: 'Arquitectura unifamiliar con cubierta inclinada, revestimientos en madera tratada y vistas panorámicas a las sierras.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/casa-violini/cover.webp',
  },
  'casa-barbieri': {
    title: 'Casa Barbieri',
    category: 'Residencial · Tandil',
    excerpt: 'Vivienda compacta y eficiente energéticamente con diseño bioclimático pasivo para inviernos rigurosos.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/casa-barbieri/cover.webp',
  },
  'casa-gatti': {
    title: 'Casa Gatti',
    category: 'Residencial · Altos del Golf',
    excerpt: 'Residencia unifamiliar en esquina con desarrollo lineal, pérgolas exteriores y amplias terrazas.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/casa-gatti/cover.webp',
  },
  'casa-efron': {
    title: 'Casa Efron',
    category: 'Residencial · Valle Escondido',
    excerpt: 'Vivienda contemporánea implantada respetando la topografía natural del lote y las rocas autóctonas.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/casa-efron/cover.webp',
  },
  'centro-rincon-colonial': {
    title: 'Centro Rincón Colonial',
    category: 'Comercial · Tandil',
    excerpt: 'Paseo comercial y gastronómico con galería cubierta, locales modulares y patio de encuentro urbano.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/centro-rincon-colonial/cover.webp',
  },
  'edificio-christensen': {
    title: 'Edificio Christensen',
    category: 'Institucional & Oficinas · Tandil',
    excerpt: 'Edificio institucional de plantas libres para sedes corporativas y estudios profesionales.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/edificio-christensen/cover.webp',
  },
  'sede-unitech': {
    title: 'Sede Unitech',
    category: 'Corporativo · Tandil',
    excerpt: 'Arquitectura para tecnología: oficinas abiertas, áreas colaborativas y diseño bioclimático sustentable.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/sede-unitech/cover.webp',
  },
  'showroom-gogna': {
    title: 'Showroom Gogna',
    category: 'Comercial & Interiores · Tandil',
    excerpt: 'Diseño integral de local de exposición comercial con iluminación puntual y mobiliario a medida.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/showroom-gogna/cover.webp',
  },
}

export default function handler(req, res) {
  const slug = (req.query.slug || '').toString().toLowerCase().trim()
  const project = projectsData[slug] || {
    title: 'Estudio Javier Calamante',
    category: 'Arquitecto en Tandil (Matr. 15327)',
    excerpt: 'Más de 28 años de trayectoria proyectando residencias singulares, reformas y dirección de obra en Tandil.',
    image: 'https://javier-calamante-arquitecto.vercel.app/images/projects/casa-sabino/cover.webp',
  }

  const userAgent = req.headers['user-agent'] || ''
  const isBot = /bot|crawl|spider|facebook|whatsapp|twitter|slack|linkedin|telegram|applebot/i.test(userAgent)

  const redirectUrl = `https://javier-calamante-arquitecto.vercel.app/?obra=${slug}`

  // Si no es un bot crawler, redirigir directo a la app con la obra abierta
  if (!isBot && req.query.bot !== '1') {
    res.writeHead(302, { Location: redirectUrl })
    return res.end()
  }

  const html = `<!doctype html>
<html lang="es-AR">
<head>
  <meta charset="UTF-8" />
  <title>${project.title} · Arq. Javier Calamante | Tandil</title>
  <meta name="description" content="${project.excerpt}" />
  <meta name="robots" content="index, follow" />
  <meta property="og:type" content="article" />
  <meta property="og:site_name" content="Estudio Javier Calamante · Arquitecto en Tandil" />
  <meta property="og:title" content="${project.title} (${project.category}) · Arq. Javier Calamante" />
  <meta property="og:description" content="${project.excerpt}" />
  <meta property="og:image" content="${project.image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="800" />
  <meta property="og:url" content="${redirectUrl}" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${project.title} · Javier Calamante Arquitecto" />
  <meta name="twitter:description" content="${project.excerpt}" />
  <meta name="twitter:image" content="${project.image}" />
  <meta http-equiv="refresh" content="0;url=${redirectUrl}" />
</head>
<body style="font-family: sans-serif; background: #141413; color: #f5f4ef; display: grid; place-items: center; min-height: 100vh;">
  <p>Redirigiendo a <a style="color: #c9a875;" href="${redirectUrl}">${project.title}</a>...</p>
</body>
</html>`

  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=43200')
  return res.status(200).send(html)
}

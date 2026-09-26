import { useState, useMemo } from 'react'
import { WhatsAppIcon } from './WhatsAppIcon'
import { ArrowIcon } from './ArrowIcon'
import { contact } from '../data/site'

interface Option {
  id: string
  label: string
  desc: string
}

const situationOptions: Option[] = [
  { id: 'tengo-lote', label: 'Tengo lote propio', desc: 'Listo para proyectar y construir' },
  { id: 'evaluando-lote', label: 'Evaluando lote a comprar', desc: 'Buscando analizar su potencial técnico' },
  { id: 'reforma', label: 'Inmueble existente', desc: 'Reforma, ampliación o reciclaje' },
]

const locationOptions: Option[] = [
  { id: 'sierras', label: 'Sierras / Don Bosco / Las Ánimas', desc: 'Topografía quebrada y mantos de piedra' },
  { id: 'urbana', label: 'Zona Urbana / Centro / Estación', desc: 'Lote estándar entre medianeras' },
  { id: 'golf', label: 'Valle del Tandil / Barrio Golf', desc: 'Vistas panorámicas y reglamento de barrio' },
  { id: 'comercial', label: 'Ruta / Parque Industrial / Comercial', desc: 'Gran escala y accesos vehiculares' },
]

const typologyOptions: Option[] = [
  { id: 'permanente', label: 'Vivienda permanente', desc: 'Confort térmico y vida cotidiana familiar' },
  { id: 'descanso', label: 'Casa de descanso / fin de semana', desc: 'Bajo mantenimiento y máxima integración al paisaje' },
  { id: 'edificio', label: 'Edificio de departamentos', desc: 'Rendimiento de m², cocheras y normativa COT' },
  { id: 'comercial', label: 'Local o espacio corporativo', desc: 'Imagen de marca, visibilidad y funcionalidad' },
]

export function ProjectDiagnostic() {
  const [situation, setSituation] = useState(situationOptions[0].id)
  const [location, setLocation] = useState(locationOptions[0].id)
  const [typology, setTypology] = useState(typologyOptions[0].id)

  const selectedSituation = situationOptions.find((s) => s.id === situation) || situationOptions[0]
  const selectedLocation = locationOptions.find((l) => l.id === location) || locationOptions[0]
  const selectedTypology = typologyOptions.find((t) => t.id === typology) || typologyOptions[0]

  const technicalAssessment = useMemo(() => {
    let soil: string
    let bioclimatic: string
    let regulatory: string

    // Evaluación de suelo y topografía
    if (location === 'sierras') {
      soil = 'Topografía serrana con pendientes: requiere relevamiento altimétrico de cotas y verificación de afloramientos de piedra o tosca para diseñar fundaciones ancladas sin sobrecostos de movimiento de suelo.'
      bioclimatic = 'Orientación solar norte prioritaria para captación pasiva durante inviernos rigurosos tandilenses y diseño de aleros protectores frente a vientos del cuadrante sur/sudoeste.'
      regulatory = 'Verificación de pendientes máximas, escorrentías naturales de agua de lluvia y retiros visuales hacia el cordón serrano.'
    } else if (location === 'golf') {
      soil = 'Manto fértil sobre tosca compacta: óptima capacidad portante para fundaciones continuas o zapatas aisladas.'
      bioclimatic = 'Planteo de visuales abiertas al entorno paisajístico con carpinterías herméticas de doble vidriado (DVH) para evitar puentes térmicos.'
      regulatory = 'Alineación con el reglamento interno de edificación del barrio (retiros laterales, alturas máximas y porcentaje de ocupación FOS/FOT).'
    } else if (location === 'urbana') {
      soil = 'Suelo urbano consolidado: inspección de muros medianeros linderos y cotas de vereda municipal.'
      bioclimatic = 'Estrategia de patios de luz y ventilación cruzada cenital para garantizar luminosidad natural en parcelas profundas.'
      regulatory = 'Código de Ordenamiento Territorial (COT) de Tandil: análisis estricto de FOS, FOT, línea municipal y retiros de fondo.'
    } else {
      soil = 'Suelo para cargas pesadas: cálculo de losas de hormigón armado para tránsito vehicular o almacenamiento.'
      bioclimatic = 'Grandes luces estructurales en acero o vigas pretensadas con aislamiento térmico continuo en cubiertas.'
      regulatory = 'Factibilidad de habilitación municipal, áreas de carga/descarga y reglamentación de impacto ambiental/urbano.'
    }

    if (situation === 'reforma') {
      soil = 'Relevamiento in situ de patologías existentes, muros portantes y capacidad de sobrecarga en fundaciones existentes.'
    }

    return { soil, bioclimatic, regulatory }
  }, [situation, location])

  const whatsappMessage = useMemo(() => {
    const text = `Hola Arq. Javier Calamante, utilicé el módulo de diagnóstico técnico de su web para mi proyecto:
- Situación: ${selectedSituation.label}
- Ubicación en Tandil: ${selectedLocation.label}
- Tipología: ${selectedTypology.label}

Me gustaría coordinar una reunión de asesoramiento técnico en su estudio para evaluar la viabilidad de la obra.`
    const phoneClean = contact.phoneHref.replace('tel:', '').replace('+', '')
    return `https://wa.me/${phoneClean}?text=${encodeURIComponent(text.trim())}`
  }, [selectedSituation, selectedLocation, selectedTypology])

  return (
    <div className="diagnostic-tool reveal" id="diagnostico-tecnico">
      <div className="diagnostic-tool__header">
        <div>
          <span className="section-eyebrow section-eyebrow--light">Diagnóstico Técnico de Viabilidad</span>
          <h3>Evaluá el potencial constructivo de tu terreno en Tandil</h3>
        </div>
        <p className="diagnostic-tool__sub">
          Seleccioná tu situación actual para ver las pautas preliminares de suelo, bioclima y normativa antes de dar el primer paso.
        </p>
      </div>

      <div className="diagnostic-tool__selectors">
        {/* Paso 1: Situación */}
        <div className="diagnostic-selector">
          <span className="diagnostic-selector__label">1. Situación del Terreno o Propiedad</span>
          <div className="diagnostic-selector__options">
            {situationOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`diagnostic-opt-btn ${situation === opt.id ? 'is-active' : ''}`}
                onClick={() => setSituation(opt.id)}
              >
                <strong>{opt.label}</strong>
                <span>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Paso 2: Ubicación */}
        <div className="diagnostic-selector">
          <span className="diagnostic-selector__label">2. Zona de Implantación en Tandil</span>
          <div className="diagnostic-selector__options">
            {locationOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`diagnostic-opt-btn ${location === opt.id ? 'is-active' : ''}`}
                onClick={() => setLocation(opt.id)}
              >
                <strong>{opt.label}</strong>
                <span>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Paso 3: Tipología */}
        <div className="diagnostic-selector">
          <span className="diagnostic-selector__label">3. Tipología de Proyecto Deseada</span>
          <div className="diagnostic-selector__options">
            {typologyOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={`diagnostic-opt-btn ${typology === opt.id ? 'is-active' : ''}`}
                onClick={() => setTypology(opt.id)}
              >
                <strong>{opt.label}</strong>
                <span>{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Resultado del Dictamen Técnico */}
      <div className="diagnostic-result">
        <div className="diagnostic-result__top">
          <div>
            <span className="diagnostic-result__badge">Dictamen Preliminar del Estudio</span>
            <h4>Pautas técnicas para {selectedTypology.label.toLowerCase()} en {selectedLocation.label}</h4>
          </div>
        </div>

        <div className="diagnostic-result__grid">
          <div className="diagnostic-card">
            <span className="diagnostic-card__tag">Suelo & Fundaciones</span>
            <p>{technicalAssessment.soil}</p>
          </div>
          <div className="diagnostic-card">
            <span className="diagnostic-card__tag">Clima Serrano & Asoleamiento</span>
            <p>{technicalAssessment.bioclimatic}</p>
          </div>
          <div className="diagnostic-card">
            <span className="diagnostic-card__tag">Normativa & Factibilidad</span>
            <p>{technicalAssessment.regulatory}</p>
          </div>
        </div>

        <div className="diagnostic-result__actions">
          <a
            className="button button--whatsapp-hero"
            href={whatsappMessage}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={16} />
            <span>Consultar este caso con Javier por WhatsApp</span>
          </a>
          <a className="button button--secondary-outline" href="#contacto">
            <span>Completar consulta formal en el formulario</span>
            <ArrowIcon />
          </a>
        </div>
      </div>
    </div>
  )
}

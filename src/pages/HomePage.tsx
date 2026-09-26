import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowIcon } from '../components/ArrowIcon'
import { WhatsAppIcon } from '../components/WhatsAppIcon'
import { ContactForm } from '../components/ContactForm'
import { Header } from '../components/Header'
import { Projects } from '../components/Projects'
import { ProjectDiagnostic } from '../components/ProjectDiagnostic'
import {
  contact,
  faqs,
  methodology,
  services,
  social,
  stats,
  testimonials,
} from '../data/site'

function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="hero__copy reveal">
        <div className="hero__badge-kicker">
          <span className="badge-capba">C.A.P.B.A. Matr. 15327</span>
          <span className="hero__badge-separator">·</span>
          <span>Distrito VIII · Tandil, Bs. As.</span>
        </div>
        <h1>
          Arquitectura de autor,<br />
          rigor constructivo<br />
          y permanencia.
        </h1>
        <p>
          Estudio de arquitectura en Tandil fundado en 1996 por el Arq. Javier Calamante. Más de 28 años proyectando residencias singulares, edificios comerciales y reformas de alto nivel que dialogan con el paisaje y el clima serrano.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="#proyectos">
            Explorar Obras Realizadas
          </a>
          <a
            className="button button--whatsapp-hero"
            href={contact.whatsappHref}
            target="_blank"
            rel="noreferrer"
            aria-label="Iniciar consulta directa por WhatsApp con el arquitecto"
          >
            <WhatsAppIcon size={16} />
            <span>Consultar por WhatsApp</span>
          </a>
        </div>
        <p className="hero__location">
          <span>{contact.fullAddress}</span> · <span>Atención personalizada por el Arq. Javier Calamante</span>
        </p>
      </div>

      <div className="hero__media-wrapper">
        <img
          src="/images/projects/casa-sabino/cover.jpg"
          alt="Casa Sabino en Tandil · Arquitectura serrana en piedra y madera por el Arq. Javier Calamante"
          className="hero__img"
          fetchPriority="high"
          decoding="async"
          width="1920"
          height="1080"
        />
        <div className="hero__image-tag">
          <div className="hero__image-tag-coords">37° 19′ S, 59° 08′ W · Tandil, Argentina</div>
          <span className="hero__image-tag-badge">Obra Emblemática</span>
          <strong className="hero__image-tag-title">Casa Sabino</strong>
          <span className="hero__image-tag-sub">Sierras de Tandil · Piedra natural labrada & Madera</span>
        </div>
      </div>
    </section>
  )
}

function StatsBar() {
  return (
    <section className="stats-strip section-shell reveal" aria-label="Cifras y trayectoria del estudio">
      <div className="stats-strip__grid">
        {stats.map((stat, i) => (
          <div className="stat-card" key={i}>
            <span className="stat-card__value">{stat.value}</span>
            <strong className="stat-card__label">{stat.label}</strong>
            <span className="stat-card__detail">{stat.detail}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function Studio() {
  return (
    <section className="studio section-shell" id="estudio">
      <div className="studio__image reveal">
        <img
          src="/images/projects/casa-bertini/cover.jpg"
          alt="Interiorismo y cocina de diseño en Tandil por el arquitecto Javier Calamante"
          loading="lazy"
        />
        <div className="studio__image-caption">
          <strong>Casa Bertini</strong> · Proyecto arquitectónico, dirección e interiorismo
        </div>
      </div>
      <div className="studio__copy reveal">
        <span className="section-eyebrow">Manifiesto & Oficio</span>
        <h2>
          Treinta años<br />
          proyectando con rigor.
        </h2>
        <p>
          Desde 1996, el arquitecto Javier Calamante (Matrícula C.A.P.B.A. Nº 15327) dirige su estudio en Tandil con una filosofía innegociable: acompañar cada obra de manera directa, sin delegar las decisiones críticas en intermediarios. Quien dibuja y calcula los planos es quien camina el terreno, coordina los gremios y verifica cada detalle en la obra.
        </p>
        <p>
          Construir en el paisaje serrano de Tandil exige una lectura precisa del suelo (mantos de tosca o afloramientos de piedra), un cálculo bioclimático minucioso para inviernos rigurosos y una nobleza material perdurable: piedra labrada en canteras regionales, hormigón visto, acero estructural y carpinterías herméticas con doble vidriado (DVH).
        </p>

        <div className="studio__features">
          <div className="feature-item">
            <span className="feature-item__icon">01</span>
            <div>
              <strong>Supervisión directa in situ</strong>
              <p>Presencia constante de Javier Calamante en las etapas críticas: fundaciones, coladas de hormigón, albañilería y terminaciones.</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-item__icon">02</span>
            <div>
              <strong>Previsión económica y cómputos rigurosos</strong>
              <p>Desglose rubro por rubro antes de comprar el primer ladrillo para garantizar certidumbre financiera total.</p>
            </div>
          </div>
          <div className="feature-item">
            <span className="feature-item__icon">03</span>
            <div>
              <strong>Arquitectura bioclimática serrana</strong>
              <p>Aprovechamiento de la radiación solar invernal, ventilación cruzada estival y muros con gran inercia térmica.</p>
            </div>
          </div>
        </div>

        <a className="text-link" href="#metodo">
          Conocer nuestra metodología de trabajo <ArrowIcon />
        </a>
      </div>
    </section>
  )
}

function Methodology() {
  return (
    <section className="methodology section-shell" id="metodo">
      <div className="methodology__header reveal">
        <span className="section-eyebrow">Metodología de Trabajo</span>
        <h2>Del primer croquis a la llave en mano.</h2>
        <p>
          Un proceso ordenado en 4 etapas concebido para que disfrutes de proyectar y construir tu casa con absoluta previsión de plazos, costos y calidad constructiva.
        </p>
      </div>

      <div className="methodology__grid">
        {methodology.map((item) => (
          <article className="methodology-card reveal" key={item.step}>
            <div className="methodology-card__header">
              <span className="methodology-card__step">{item.step}</span>
              <span className="methodology-card__line" />
            </div>
            <h3 className="methodology-card__title">{item.title}</h3>
            <strong className="methodology-card__subtitle">{item.subtitle}</strong>
            <p className="methodology-card__desc">{item.description}</p>
          </article>
        ))}
      </div>

      <ProjectDiagnostic />

      <div className="methodology__banner reveal">
        <div>
          <span className="section-eyebrow section-eyebrow--light">Asesoramiento Inicial</span>
          <h3>¿Tenés un terreno en Tandil y querés evaluar su potencial?</h3>
          <p>
            Coordinamos una primera reunión en nuestro estudio de calle Maipú o visitamos tu lote para analizar cotas, vistas panorámicas, asoleamiento y factibilidad municipal sin compromiso.
          </p>
        </div>
        <a className="button button--primary" href="#contacto">
          Solicitar Diagnóstico Técnico
        </a>
      </div>
    </section>
  )
}

function Services() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx))
  }

  return (
    <section className="services section-shell" id="servicios">
      <div className="services__heading reveal">
        <span className="section-eyebrow">Áreas de Práctica</span>
        <h2>Servicios profesionales en Tandil.</h2>
        <p>Acompañamiento integral, transparente y con estricto respaldo colegial en el Distrito VIII (CAPBA).</p>
      </div>
      <div className="service-list">
        {services.map((service, index) => {
          const isOpen = openIndex === index
          return (
            <div className={`service reveal ${isOpen ? 'is-open' : ''}`} key={service.number}>
              <button
                type="button"
                className="service__summary"
                onClick={() => toggle(index)}
                aria-expanded={isOpen}
                aria-controls={`service-desc-${service.number}`}
              >
                <span className="service__number">{service.number}</span>
                <span className="service__title">{service.title}</span>
                <span className="service__arrow">
                  <ArrowIcon />
                </span>
              </button>
              <div
                id={`service-desc-${service.number}`}
                className="service__drawer"
                role="region"
              >
                <div className="service__drawer-inner">
                  <div className="service__content">
                    <p>{service.description}</p>
                    {'deliverables' in service && Array.isArray((service as { deliverables?: readonly string[] }).deliverables) && (
                      <div className="service__deliverables">
                        <span className="service__deliverables-label">Entregables Técnicos:</span>
                        <ul>
                          {((service as { deliverables: readonly string[] }).deliverables).map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="testimonials section-shell reveal" id="testimonios">
      <div className="testimonials__header">
        <span className="section-eyebrow">Referencias & Trayectoria</span>
        <h2>La experiencia de construir con nosotros.</h2>
        <p>Familias, inversores y empresas que confiaron en el oficio y la supervisión del Arq. Javier Calamante.</p>
      </div>

      <div className="testimonials__grid">
        {testimonials.map((t, index) => (
          <blockquote className="testimonial-card" key={index}>
            <div className="testimonial-card__stars" aria-hidden="true">
              ★★★★★
            </div>
            <p className="testimonial-card__quote">“{t.quote}”</p>
            <footer className="testimonial-card__author">
              <strong>{t.author}</strong>
              <span>{t.project} · {t.year}</span>
            </footer>
          </blockquote>
        ))}
      </div>
    </section>
  )
}

function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx))
  }

  return (
    <section className="faq section-shell" id="preguntas">
      <div className="faq__header reveal">
        <span className="section-eyebrow">Consultas Frecuentes</span>
        <h2>Respuestas sobre construir en Tandil.</h2>
        <p>Pautas clave sobre costos, suelo serrano, permisos de obra y metodología antes de dar el primer paso.</p>
      </div>

      <div className="faq__list">
        {faqs.map((faq, i) => {
          const isOpen = openIndex === i
          return (
            <div className={`faq-item reveal ${isOpen ? 'is-open' : ''}`} key={i}>
              <button
                type="button"
                className="faq-item__question"
                onClick={() => toggle(i)}
                aria-expanded={isOpen}
                aria-controls={`faq-answer-${i}`}
              >
                <span>{faq.question}</span>
                <span className="faq-item__icon" aria-hidden="true">+</span>
              </button>
              <div
                id={`faq-answer-${i}`}
                className="faq-item__drawer"
                role="region"
              >
                <div className="faq-item__drawer-inner">
                  <div className="faq-item__answer">
                    <p>{faq.answer}</p>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

function FloatingWhatsApp() {
  return (
    <a
      href={contact.whatsappHref}
      target="_blank"
      rel="noreferrer"
      className="floating-whatsapp"
      aria-label="Contactar al Arq. Javier Calamante por WhatsApp"
      title="Consultar por WhatsApp con Javier Calamante (+54 9 2494 54-3936)"
    >
      <div className="floating-whatsapp__icon-wrap">
        <WhatsAppIcon size={24} />
        <span className="floating-whatsapp__pulse" />
      </div>
      <div className="floating-whatsapp__text">
        <span className="floating-whatsapp__kicker">Atención directa</span>
        <strong className="floating-whatsapp__label">WhatsApp con Javier</strong>
      </div>
    </a>
  )
}

function Contact() {
  return (
    <section className="contact" id="contacto">
      <div className="contact__main section-shell">
        <div className="contact__intro reveal">
          <span className="section-eyebrow section-eyebrow--light">Contacto Directo</span>
          <h2>
            Conversemos sobre<br />
            tu próxima obra.
          </h2>
          <p>
            Dejanos tus datos y una breve descripción de tu proyecto o terreno. Javier Calamante
            analizará tu consulta personalmente para coordinar una reunión de diagnóstico.
          </p>
          <div className="contact__quick-actions">
            <a href={contact.whatsappHref} target="_blank" rel="noreferrer" className="contact-quick-link">
              <WhatsAppIcon size={16} />
              <span>WhatsApp Directo</span>
              <ArrowIcon />
            </a>
            <a href={`mailto:${contact.email}`}>Email <ArrowIcon /></a>
          </div>
          <address>
            <a href={contact.mapsHref} target="_blank" rel="noreferrer">
              {contact.fullAddress}
            </a>
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <span>Atención: {contact.schedule}</span>
            <span>Matrícula C.A.P.B.A. Nº 15327 (Distrito VIII)</span>
          </address>
        </div>
        <div className="reveal">
          <ContactForm />
        </div>
      </div>

      <footer className="footer section-shell">
        <div className="footer__brand">
          <strong>Javier Calamante</strong>
          <span>Estudio de Arquitectura · Tandil, Buenos Aires (Matr. 15327)</span>
        </div>
        <nav aria-label="Redes y enlaces del estudio">
          <a href={social.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={contact.whatsappHref} target="_blank" rel="noreferrer">WhatsApp</a>
          <a href={social.facebook} target="_blank" rel="noreferrer">Facebook</a>
          <a href={social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={contact.mapsHref} target="_blank" rel="noreferrer">Ubicación Estudio (Maipú 710)</a>
          <Link to="/privacidad">Privacidad</Link>
        </nav>
        <p>© {new Date().getFullYear()} Estudio Javier Calamante · Matrícula C.A.P.B.A. Nº 15327 (Distrito VIII)</p>
      </footer>
    </section>
  )
}

export function HomePage() {
  useEffect(() => {
    document.title = 'Estudio Javier Calamante · Arquitecto en Tandil | Matr. CAPBA 15327'
    document
      .querySelector('meta[name="robots"]')
      ?.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        }),
      { threshold: 0.1 },
    )

    const observeReveals = () => {
      document.querySelectorAll('.reveal:not(.is-visible)').forEach((element) => observer.observe(element))
    }
    observeReveals()

    const mutationObserver = new MutationObserver(() => {
      observeReveals()
    })
    mutationObserver.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [])

  return (
    <>
      <a className="skip-link" href="#proyectos">
        Saltar al contenido
      </a>
      <Header />
      <main>
        <Hero />
        <StatsBar />
        <Projects />
        <Studio />
        <Methodology />
        <Services />
        <Testimonials />
        <FAQ />
        <Contact />
      </main>
      <FloatingWhatsApp />
    </>
  )
}

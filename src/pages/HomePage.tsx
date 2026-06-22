import { useEffect } from 'react'
import { ArrowIcon } from '../components/ArrowIcon'
import { ContactForm } from '../components/ContactForm'
import { Header } from '../components/Header'
import { Projects } from '../components/Projects'
import { contact, services, social } from '../data/site'

function Hero() {
  return (
    <section className="hero" id="inicio">
      <Header />
      <div className="hero__copy reveal">
        <h1>Arquitectura<br />que permanece.</h1>
        <p>Estudio de arquitectura en Tandil. Proyectos honestos, funcionales y atentos a la forma de vivir.</p>
        <div className="hero__actions">
          <a className="button button--primary" href="#proyectos">Ver proyectos</a>
          <a className="text-link" href="#contacto">Hablemos <ArrowIcon /></a>
        </div>
        <p className="hero__location">Tandil, Buenos Aires · Desde 1996</p>
      </div>
      <div className="hero__image" role="img" aria-label="Arquitectura contemporánea integrada al paisaje serrano de Tandil" />
    </section>
  )
}

function Studio() {
  return (
    <section className="studio section-shell" id="estudio">
      <div className="studio__image reveal">
        <img src="/images/studio-workspace.webp" alt="Mesa de trabajo con planos y materiales de arquitectura" loading="lazy" />
      </div>
      <div className="studio__copy reveal">
        <h2>Treinta años<br />proyectando con oficio.</h2>
        <p>Desde 1996, el arquitecto Javier Calamante dirige su estudio en Tandil y acompaña cada obra de forma personal, desde la primera idea hasta el último detalle.</p>
        <p>Una práctica atenta a la función, la materialidad, el presupuesto y el vínculo de cada espacio con su entorno.</p>
        <a className="text-link" href="#servicios">Conocer el enfoque <ArrowIcon /></a>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section className="services section-shell" id="servicios">
      <div className="services__heading reveal">
        <h2>Del plano a la obra.</h2>
        <p>Servicios de arquitectura en Tandil con un acompañamiento integral, claro y cercano.</p>
      </div>
      <div className="service-list">
        {services.map((service) => (
          <details className="service reveal" key={service.number}>
            <summary>
              <span className="service__number">{service.number}</span>
              <span className="service__title">{service.title}</span>
              <span className="service__arrow"><ArrowIcon /></span>
            </summary>
            <p>{service.description}</p>
          </details>
        ))}
      </div>
    </section>
  )
}

function Contact() {
  return (
    <section className="contact" id="contacto">
      <div className="contact__main section-shell">
        <div className="contact__intro reveal">
          <h2>Conversemos sobre<br />tu próximo proyecto.</h2>
          <p>Dejanos tus datos y una breve descripción. Javier revisará personalmente la consulta para contactarte.</p>
          <div className="contact__quick-actions">
            <a href={contact.whatsappHref} target="_blank" rel="noreferrer">WhatsApp <ArrowIcon /></a>
            <a href={`mailto:${contact.email}`}>Email <ArrowIcon /></a>
          </div>
          <address>
            <a href={contact.mapsHref} target="_blank" rel="noreferrer">{contact.address}</a>
            <a href={contact.phoneHref}>{contact.phoneDisplay}</a>
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
            <span>Atención · {contact.schedule}</span>
          </address>
        </div>
        <div className="reveal"><ContactForm /></div>
      </div>

      <footer className="footer section-shell">
        <div className="footer__brand">Javier Calamante / Arquitecto</div>
        <nav aria-label="Redes y ubicación">
          <a href={social.instagram} target="_blank" rel="noreferrer">Instagram</a>
          <a href={social.facebook} target="_blank" rel="noreferrer">Facebook</a>
          <a href={social.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
          <a href={contact.mapsHref} target="_blank" rel="noreferrer">Cómo llegar</a>
          <a href="/privacidad">Privacidad</a>
        </nav>
        <p>© {new Date().getFullYear()} Estudio Javier Calamante</p>
      </footer>
    </section>
  )
}

export function HomePage() {
  useEffect(() => {
    document.title = 'Javier Calamante · Arquitecto en Tandil'
    document.querySelector('meta[name="robots"]')?.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('is-visible')),
      { threshold: 0.1 },
    )
    const elements = document.querySelectorAll('.reveal')
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <a className="skip-link" href="#proyectos">Saltar al contenido</a>
      <main>
        <Hero />
        <Projects />
        <Studio />
        <Services />
        <Contact />
      </main>
    </>
  )
}

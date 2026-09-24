import { useEffect, useState } from 'react'
import { contact } from '../data/site'
import { WhatsAppIcon } from './WhatsAppIcon'

const navItems = [
  ['Obras', '#proyectos'],
  ['Estudio', '#estudio'],
  ['Método', '#metodo'],
  ['Servicios', '#servicios'],
  ['Preguntas', '#preguntas'],
  ['Contacto', '#contacto'],
] as const

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
      <a className="brand" href="#inicio" aria-label="Estudio Javier Calamante, volver al inicio">
        <span className="brand__mark" aria-hidden="true">JC</span>
        <span className="brand__text">
          <strong>Javier Calamante</strong>
          <span>Arquitecto · Tandil (Matr. 15327)</span>
        </span>
      </a>

      <nav
        id="main-navigation"
        className={`site-nav ${menuOpen ? 'site-nav--open' : ''}`}
        aria-label="Navegación principal"
      >
        {navItems.map(([label, href]) => (
          <a key={href} href={href} onClick={() => setMenuOpen(false)}>
            {label}
          </a>
        ))}
      </nav>

      <div className="site-header__actions">
        <a
          href={contact.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="header-cta"
          aria-label="Contactar al arquitecto por WhatsApp"
        >
          <WhatsAppIcon size={15} />
          <span>Consultar Obra</span>
        </a>

        <button
          className="menu-toggle"
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span>{menuOpen ? 'Cerrar' : 'Menú'}</span>
          <span className="menu-toggle__lines" aria-hidden="true" />
        </button>
      </div>
    </header>
  )
}

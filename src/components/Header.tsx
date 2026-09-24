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

  // Sync body class for scroll lock and ensure cleanup
  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [menuOpen])

  // Track header scroll state
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on Escape key press
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && menuOpen) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [menuOpen])

  // Close menu if viewport resized to desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 700 && menuOpen) {
        setMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [menuOpen])

  const closeMenu = () => {
    setMenuOpen(false)
    document.body.classList.remove('menu-open')
  }

  const handleNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    closeMenu()
    if (href.startsWith('#')) {
      const target = document.querySelector(href)
      if (target) {
        event.preventDefault()
        setTimeout(() => {
          target.scrollIntoView({ behavior: 'smooth' })
          window.history.pushState(null, '', href)
        }, 60)
      }
    }
  }

  const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    if (menuOpen) {
      closeMenu()
    }
    const target = document.querySelector('#inicio')
    if (target) {
      event.preventDefault()
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' })
        window.history.pushState(null, '', '#inicio')
      }, 50)
    }
  }

  return (
    <header
      className={`site-header ${isScrolled ? 'site-header--scrolled' : ''} ${menuOpen ? 'site-header--menu-open' : ''}`}
    >
      <a
        className="brand"
        href="#inicio"
        onClick={handleBrandClick}
        aria-label="Estudio Javier Calamante, volver al inicio"
      >
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
        <div className="site-nav__links">
          {navItems.map(([label, href]) => (
            <a
              key={href}
              href={href}
              onClick={(e) => handleNavClick(e, href)}
            >
              <span>{label}</span>
              <span className="site-nav__arrow" aria-hidden="true">→</span>
            </a>
          ))}
        </div>

        <div className="site-nav__footer">
          <a
            href={contact.whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="site-nav__whatsapp"
            onClick={closeMenu}
          >
            <WhatsAppIcon size={18} />
            <span>Consultar por WhatsApp</span>
          </a>
          <div className="site-nav__location">
            <p>{contact.fullAddress}</p>
            <p>Atención personalizada por el Arq. Javier Calamante</p>
          </div>
        </div>
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
          className={`menu-toggle ${menuOpen ? 'menu-toggle--open' : ''}`}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="main-navigation"
          aria-label={menuOpen ? 'Cerrar navegación' : 'Abrir navegación'}
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="menu-toggle__label">{menuOpen ? 'Cerrar' : 'Menú'}</span>
          <span className="menu-toggle__icon" aria-hidden="true">
            <span className="menu-toggle__line menu-toggle__line--1" />
            <span className="menu-toggle__line menu-toggle__line--2" />
          </span>
        </button>
      </div>
    </header>
  )
}

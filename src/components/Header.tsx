import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
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
  const [isOpen, setIsOpen] = useState(false)
  const [isRendered, setIsRendered] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const closeTimerRef = useRef<number | null>(null)

  const closeMenuImmediately = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsOpen(false)
    setIsRendered(false)
    document.body.classList.remove('menu-open')
  }

  const closeMenuGracefully = () => {
    setIsOpen(false)
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }
    closeTimerRef.current = window.setTimeout(() => {
      setIsRendered(false)
      closeTimerRef.current = null
    }, 220)
  }

  const openMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setIsRendered(true)
    requestAnimationFrame(() => {
      setIsOpen(true)
    })
  }

  // Sincronizar bloqueo de scroll suave en body
  useEffect(() => {
    document.body.classList.toggle('menu-open', isOpen)
    return () => {
      document.body.classList.remove('menu-open')
    }
  }, [isOpen])

  // Seguimiento del estado scrolled del header
  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Cerrar menú con tecla Escape
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && isOpen) {
        closeMenuGracefully()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Cerrar menú si la pantalla se redimensiona a desktop
  useEffect(() => {
    function handleResize() {
      if (window.innerWidth > 700 && (isOpen || isRendered)) {
        closeMenuImmediately()
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, isRendered])

  // Limpieza al desmontar
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current)
      }
      document.body.classList.remove('menu-open')
    }
  }, [])

  const handleMobileNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault()
    closeMenuImmediately()

    if (href.startsWith('#')) {
      const target = document.querySelector(href)
      if (target) {
        requestAnimationFrame(() => {
          target.scrollIntoView({ behavior: 'smooth' })
          window.history.pushState(null, '', href)
        })
      }
    }
  }

  const handleDesktopNavClick = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith('#')) {
      const target = document.querySelector(href)
      if (target) {
        event.preventDefault()
        target.scrollIntoView({ behavior: 'smooth' })
        window.history.pushState(null, '', href)
      }
    }
  }

  const handleBrandClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault()
    if (isOpen || isRendered) {
      closeMenuImmediately()
    }
    const target = document.querySelector('#inicio')
    if (target) {
      requestAnimationFrame(() => {
        target.scrollIntoView({ behavior: 'smooth' })
        window.history.pushState(null, '', '#inicio')
      })
    }
  }

  return (
    <>
      <header className={`site-header ${isScrolled ? 'site-header--scrolled' : ''}`}>
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

        {/* Navegación horizontal en Desktop */}
        <nav
          id="main-navigation"
          className="site-nav"
          aria-label="Navegación principal"
        >
          <div className="site-nav__links">
            {navItems.map(([label, href]) => (
              <a
                key={href}
                href={href}
                onClick={(e) => handleDesktopNavClick(e, href)}
              >
                <span>{label}</span>
              </a>
            ))}
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
            className="menu-toggle"
            type="button"
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
            aria-label="Abrir navegación"
            onClick={openMenu}
          >
            <span className="menu-toggle__label">Menú</span>
            <span className="menu-toggle__icon" aria-hidden="true">
              <span className="menu-toggle__line menu-toggle__line--1" />
              <span className="menu-toggle__line menu-toggle__line--2" />
            </span>
          </button>
        </div>
      </header>

      {/* Menú móvil portaleado a document.body para evitar clipping por backdrop-filter y bugs de layout */}
      {isRendered && createPortal(
        <div
          id="mobile-navigation"
          className={`mobile-menu ${isOpen ? 'mobile-menu--open' : ''}`}
          role="dialog"
          aria-modal="true"
          aria-label="Navegación principal móvil"
        >
          <div className="mobile-menu__topbar">
            <a
              className="brand mobile-menu__brand"
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

            <button
              className="menu-toggle menu-toggle--open mobile-menu__close"
              type="button"
              aria-label="Cerrar navegación"
              onClick={closeMenuGracefully}
            >
              <span className="menu-toggle__label">Cerrar</span>
              <span className="menu-toggle__icon" aria-hidden="true">
                <span className="menu-toggle__line menu-toggle__line--1" />
                <span className="menu-toggle__line menu-toggle__line--2" />
              </span>
            </button>
          </div>

          <div className="mobile-menu__body">
            <nav className="mobile-menu__nav" aria-label="Enlaces del menú móvil">
              {navItems.map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="mobile-menu__link"
                  onClick={(e) => handleMobileNavClick(e, href)}
                >
                  <span>{label}</span>
                  <span className="mobile-menu__arrow" aria-hidden="true">→</span>
                </a>
              ))}
            </nav>

            <div className="mobile-menu__footer">
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mobile-menu__whatsapp"
                onClick={closeMenuImmediately}
              >
                <WhatsAppIcon size={18} />
                <span>Consultar por WhatsApp</span>
              </a>
              <div className="mobile-menu__location">
                <p>{contact.fullAddress}</p>
                <p>Atención personalizada por el Arq. Javier Calamante</p>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

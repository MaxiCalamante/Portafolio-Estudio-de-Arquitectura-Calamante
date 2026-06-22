import { useEffect, useState } from 'react'

const navItems = [
  ['Estudio', '#estudio'],
  ['Proyectos', '#proyectos'],
  ['Servicios', '#servicios'],
  ['Contacto', '#contacto'],
] as const

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.classList.toggle('menu-open', menuOpen)
    return () => document.body.classList.remove('menu-open')
  }, [menuOpen])

  return (
    <header className="site-header">
      <a className="brand" href="#inicio" aria-label="Javier Calamante, inicio">
        <span className="brand__mark" aria-hidden="true">JC</span>
        <span className="brand__text">
          <strong>Javier Calamante</strong>
          <span>Arquitecto</span>
        </span>
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
    </header>
  )
}

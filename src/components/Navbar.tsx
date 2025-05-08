
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

// Componente separado para el menú móvil
const MobileMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  scrolled: boolean;
  isProjectDetail?: boolean;
}> = ({ isOpen, onClose, scrolled, isProjectDetail = false }) => {
  return (
    <>
      {/* Overlay oscuro con animación de fade */}
      <div
        className={`fixed inset-0 bg-black z-40 transition-opacity duration-500 ${
          isOpen ? 'opacity-90' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Menú - Fondo completamente sólido con animación de slide */}
      <div
        className={`fixed inset-y-0 left-0 w-full z-50 transition-transform duration-500 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          backgroundColor: isProjectDetail ? '#000000' : scrolled ? '#ffffff' : '#000000',
          backgroundImage: 'none',
          boxShadow: '0 0 25px rgba(0, 0, 0, 0.5)'
        }}
      >
        <button
          className={`absolute top-6 right-6 ${isProjectDetail ? 'text-white' : scrolled ? 'text-primary' : 'text-white'}
            hover:scale-110 hover:rotate-90 transition-all duration-300 ease-in-out
            rounded-full p-2 backdrop-blur-sm ${isProjectDetail ? 'bg-black/30' : scrolled ? 'bg-gray-100/30' : 'bg-black/30'}`}
          onClick={onClose}
          aria-label="Close menu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-8 h-8"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto px-8">
          <div className={`text-center mb-12 ${isProjectDetail ? 'text-white' : scrolled ? 'text-primary' : 'text-white'} transform transition-all duration-700 ease-out`}>
            <h2 className="font-serif text-3xl md:text-4xl font-medium animate-fade-in">Estudio Javier Calamante</h2>
            <div className={`w-0 h-0.5 mx-auto mt-4 ${isProjectDetail ? 'bg-white' : scrolled ? 'bg-primary' : 'bg-white'} animate-width-expand`}></div>
          </div>
          <div className="flex flex-col space-y-10 text-xl w-full">
            {[
              { href: isProjectDetail ? "/" : "#home", label: "Inicio", delay: "100ms" },
              { href: isProjectDetail ? "/#about" : "#about", label: "Sobre Nosotros", delay: "200ms" },
              { href: isProjectDetail ? "/#services" : "#services", label: "Servicios", delay: "300ms" },
              { href: isProjectDetail ? "/#projects" : "#projects", label: "Proyectos", delay: "400ms" },
              { href: isProjectDetail ? "/#contact" : "#contact", label: "Contacto", delay: "500ms" }
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                onClick={onClose}
                className={`${isProjectDetail ? 'text-white border-gray-700' : scrolled ? 'text-primary border-gray-200' : 'text-white border-gray-700'}
                  hover:pl-4 hover:border-primary hover:text-primary transition-all duration-300
                  py-4 px-2 border-b text-center opacity-0 animate-fade-in`}
                style={{
                  animationDelay: item.delay,
                  animationFillMode: 'forwards'
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  // Verificar si estamos en una página de detalle de proyecto
  const isProjectDetail = location.pathname.includes('/proyectos/') || location.pathname.includes('/projects/');

  const toggleMenu = () => {
    const newMenuState = !isMenuOpen;
    setIsMenuOpen(newMenuState);

    // Bloquear/desbloquear el desplazamiento del body cuando el menú está abierto/cerrado
    if (newMenuState) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = '';
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    // Cerrar el menú cuando se cambia el tamaño de la ventana a desktop
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMenuOpen) {
        closeMenu();
      }
    };

    // Cerrar el menú cuando se hace clic en un enlace de anclaje
    const handleHashChange = () => {
      if (isMenuOpen) {
        closeMenu();
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [isMenuOpen]);

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 w-full py-4 z-50 transition-all duration-300",
          isProjectDetail
            ? "bg-black/90 backdrop-blur-sm" // Siempre fondo oscuro en páginas de detalle
            : scrolled
              ? "bg-white/95 backdrop-blur-sm shadow-md"
              : "bg-black/40 backdrop-blur-sm"
        )}
      >
        <div className="container-custom flex items-center justify-between">
          <Link
            to="/"
            className={cn(
              "font-serif text-xl md:text-2xl font-medium tracking-wide",
              isProjectDetail
                ? "text-white" // Siempre texto blanco en páginas de detalle
                : scrolled ? "text-primary" : "text-white"
            )}
            onClick={closeMenu}
          >
            Estudio Javier Calamante
          </Link>

          {/* Mobile Menu Button con animación */}
          <button
            className={cn(
              "lg:hidden relative p-2 rounded-md overflow-hidden transition-all duration-300",
              isProjectDetail
                ? "text-white hover:bg-white/10" // Siempre texto blanco en páginas de detalle
                : scrolled ? "text-primary hover:bg-gray-100/20" : "text-white hover:bg-white/10",
              isMenuOpen ? "rotate-90" : "rotate-0"
            )}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <div className="relative w-6 h-6">
              <span
                className={`absolute left-0 top-1 block w-6 h-0.5 transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? 'rotate-45 translate-y-1.5' : ''
                } ${isProjectDetail ? 'bg-white' : scrolled ? 'bg-primary' : 'bg-white'}`}
              ></span>
              <span
                className={`absolute left-0 top-3 block w-6 h-0.5 transition-all duration-200 ${
                  isMenuOpen ? 'opacity-0' : 'opacity-100'
                } ${isProjectDetail ? 'bg-white' : scrolled ? 'bg-primary' : 'bg-white'}`}
              ></span>
              <span
                className={`absolute left-0 top-5 block w-6 h-0.5 transform transition-all duration-300 ease-in-out ${
                  isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''
                } ${isProjectDetail ? 'bg-white' : scrolled ? 'bg-primary' : 'bg-white'}`}
              ></span>
            </div>
          </button>

          {/* Desktop Navigation con efectos de hover mejorados */}
          <div className="hidden lg:flex items-center space-x-8">
            {[
              { href: isProjectDetail ? "/" : "#home", label: "Inicio" },
              { href: isProjectDetail ? "/#about" : "#about", label: "Sobre Nosotros" },
              { href: isProjectDetail ? "/#services" : "#services", label: "Servicios" },
              { href: isProjectDetail ? "/#projects" : "#projects", label: "Proyectos" },
              { href: isProjectDetail ? "/#contact" : "#contact", label: "Contacto" }
            ].map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={cn(
                  "hover-underline relative py-2 transition-all duration-300",
                  isProjectDetail
                    ? "text-white" // Siempre texto blanco en páginas de detalle
                    : scrolled ? "text-primary" : "text-white"
                )}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* Usar el componente MobileMenu separado */}
      <MobileMenu
        isOpen={isMenuOpen}
        onClose={closeMenu}
        scrolled={scrolled}
        isProjectDetail={isProjectDetail}
      />
    </>
  );
};

export default Navbar;

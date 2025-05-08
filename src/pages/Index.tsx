
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ServicesSection from '@/components/sections/ServicesSection';
import ProjectsSection from '@/components/sections/ProjectsSection';
import ContactSection from '@/components/sections/ContactSection';
import ScrollReveal from '@/components/ScrollReveal';

const Index: React.FC = () => {
  const location = useLocation();

  // Add a class to body to enable smooth transitions
  useEffect(() => {
    // Apply a background color to the body for better aesthetics
    document.body.style.backgroundColor = '#f9f9f9';

    // Small delay to ensure smooth initial animations
    setTimeout(() => {
      document.body.classList.add('page-loaded');
    }, 100);

    return () => {
      document.body.classList.remove('page-loaded');
      document.body.style.backgroundColor = '';
    };
  }, []);

  // Scroll to the appropriate section based on the route or URL parameters
  useEffect(() => {
    const scrollToSection = () => {
      // Verificar si hay un parámetro scrollTo en la URL
      const params = new URLSearchParams(location.search);
      const scrollToParam = params.get('scrollTo');

      if (scrollToParam) {
        // Si hay un parámetro scrollTo, desplazarse a esa sección
        const targetSection = document.getElementById(scrollToParam);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
          return; // Salir de la función si ya se ha desplazado
        }
      }

      // Si no hay parámetro o la sección no existe, verificar la ruta
      if (location.pathname === '/servicios') {
        const servicesSection = document.getElementById('services');
        if (servicesSection) {
          servicesSection.scrollIntoView({ behavior: 'smooth' });
        }
      } else if (location.pathname === '/contacto') {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    };

    // Small delay to ensure the page is fully loaded
    setTimeout(scrollToSection, 300);
  }, [location.pathname, location.search]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <ScrollReveal />
      <Navbar />
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <ContactSection />
      </div>
      <Footer />
    </div>
  );
};

export default Index;

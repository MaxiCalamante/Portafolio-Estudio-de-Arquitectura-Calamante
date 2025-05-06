
import React, { useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

// URLs de las imágenes de fondo para el carrusel
const backgrounds = [
  "https://images.unsplash.com/photo-1486718448742-163732cd1544?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1493397212122-2b85dda8106b?q=80&w=1600&auto=format&fit=crop"
];

const HeroSection: React.FC = () => {
  const [currentBgIndex, setCurrentBgIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(backgrounds.map(() => false));

  // Precarga de imágenes para mejorar el rendimiento
  useEffect(() => {
    backgrounds.forEach((src, index) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setImagesLoaded(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
      };
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBgIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000); // Cambiamos el fondo cada 5 segundos para crear un efecto dinámico

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex items-center overflow-hidden">
      {/* Fondo estático como respaldo en caso de que las imágenes no carguen */}
      <div className="absolute inset-0 bg-gray-900"></div>

      {/* Carrusel de fondos con transición suave entre imágenes */}
      <div className="absolute inset-0 transition-opacity duration-1000 ease-in-out">
        {backgrounds.map((bg, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${bg})`,
              opacity: currentBgIndex === index ? 1 : 0
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70"></div>
          </div>
        ))}
      </div>

      {/* Contenido principal con animaciones mejoradas para captar la atención */}
      <div className="container-custom relative z-10">
        <div className="max-w-2xl animate-fade-in">
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-serif leading-tight mb-6">
            Transformando tu idea en un espacio inspirador
          </h1>
          <p className="text-white/90 text-lg md:text-xl mb-10 max-w-lg">
            Estudio Javier Calamante, creo arquitectura que combina
            estética, funcionalidad e innovación para dar vida a tu proyecto.
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="/proyectos"
              className="inline-block bg-white text-primary px-8 py-3 rounded hover:bg-white/90 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Proyectos
            </a>
            <a
              href="#contact"
              className="inline-block bg-transparent text-white border border-white px-8 py-3 rounded hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1"
            >
              Contáctame
            </a>
          </div>
        </div>
      </div>

      {/* Indicador de desplazamiento mejorado para guiar al usuario a seguir explorando */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-white/90 animate-bounce">
        <div className="flex flex-col items-center">
          <span className="text-sm mb-2 tracking-wider font-light">Descubrí más</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

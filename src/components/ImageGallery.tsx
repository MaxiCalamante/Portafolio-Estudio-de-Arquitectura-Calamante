import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';

interface ImageGalleryProps {
  images: string[];
  title: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [expandedView, setExpandedView] = useState(false);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedImage && !expandedView) return;

      if (e.key === 'Escape') {
        if (selectedImage) {
          closeLightbox();
        } else if (expandedView) {
          closeExpandedView();
        }
      } else if (e.key === 'ArrowLeft') {
        if (selectedImage) {
          navigateLightbox('prev');
        } else if (expandedView) {
          navigateMainImage('prev');
        }
      } else if (e.key === 'ArrowRight') {
        if (selectedImage) {
          navigateLightbox('next');
        } else if (expandedView) {
          navigateMainImage('next');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedImage, lightboxIndex, expandedView]);

  const openLightbox = (index: number) => {
    setSelectedImage(images[index]);
    setLightboxIndex(index);
    // Prevent scrolling when lightbox is open
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    // Restore scrolling
    document.body.style.overflow = 'auto';
  };

  const toggleExpandedView = () => {
    setExpandedView(!expandedView);
    // Scroll to the expanded image if opening
    if (!expandedView) {
      setTimeout(() => {
        const expandedElement = document.getElementById('expanded-image');
        if (expandedElement) {
          expandedElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const closeExpandedView = () => {
    setExpandedView(false);
  };

  const navigateMainImage = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentImageIndex(prev => (prev > 0 ? prev - 1 : images.length - 1));
    } else {
      setCurrentImageIndex(prev => (prev < images.length - 1 ? prev + 1 : 0));
    }
  };

  const navigateLightbox = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setLightboxIndex(prev => {
        const newIndex = prev > 0 ? prev - 1 : images.length - 1;
        setSelectedImage(images[newIndex]);
        return newIndex;
      });
    } else {
      setLightboxIndex(prev => {
        const newIndex = prev < images.length - 1 ? prev + 1 : 0;
        setSelectedImage(images[newIndex]);
        return newIndex;
      });
    }
  };

  // If no images, return nothing
  if (!images.length) return null;

  return (
    <div className="w-full">
      {!expandedView ? (
        <>
          {/* Main image display - Moderate size */}
          <div className="mb-4 relative">
            <div
              className="relative overflow-hidden rounded-md shadow-md cursor-pointer"
            >
              <div className="w-full" style={{ height: '400px' }}>
                <img
                  src={images[currentImageIndex]}
                  alt={`${title} - Imagen principal`}
                  className="object-contain w-full h-full transition-transform duration-300"
                />
                <div
                  className="absolute inset-0 bg-black bg-opacity-20 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                  onClick={toggleExpandedView}
                >
                  <span className="text-white text-sm font-medium px-4 py-2 bg-black bg-opacity-70 rounded-md shadow-lg flex items-center gap-2 transform transition-transform duration-300 hover:scale-105">
                    <Maximize2 size={16} />
                    Ampliar imagen
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation arrows for main image */}
            <button
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                navigateMainImage('prev');
              }}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                navigateMainImage('next');
              }}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={20} />
            </button>

            {/* Image counter */}
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded-full text-xs">
              {currentImageIndex + 1} / {images.length}
            </div>
          </div>

          {/* Thumbnails - Grid layout */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            {images.slice(0, 8).map((image, index) => (
              <div
                key={index}
                className={`relative overflow-hidden rounded-md cursor-pointer transition-all duration-300 ${
                  index === currentImageIndex ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <div style={{ height: '70px' }}>
                  <img
                    src={image}
                    alt={`${title} - Miniatura ${index + 1}`}
                    className="object-contain w-full h-full"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Show more thumbnails button if needed */}
          {images.length > 8 && (
            <button
              className="text-sm text-primary hover:underline mb-4 mt-1"
              onClick={() => openLightbox(currentImageIndex)}
            >
              Ver todas las imágenes ({images.length})
            </button>
          )}
        </>
      ) : (
        /* Expanded View - Full width between navbar and footer */
        <div
          id="expanded-image"
          className="w-full bg-gray-100 py-8 px-4 md:py-12 md:px-8 rounded-lg shadow-lg animate-fadeIn"
        >
          <div className="max-w-6xl mx-auto">
            {/* Header with title and close button */}
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg md:text-xl font-medium">{title} - Imagen {currentImageIndex + 1} de {images.length}</h3>
              <button
                onClick={closeExpandedView}
                className="text-gray-600 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-200"
                aria-label="Cerrar vista ampliada"
              >
                <Minimize2 size={24} />
              </button>
            </div>

            {/* Main expanded image container */}
            <div className="relative mb-6">
              <div className="bg-white p-4 rounded-md shadow-md">
                <div className="relative" style={{ height: 'calc(100vh - 300px)', minHeight: '500px' }}>
                  <img
                    src={images[currentImageIndex]}
                    alt={`${title} - Imagen ampliada`}
                    className="object-contain w-full h-full"
                  />

                  {/* Navigation arrows - inside the image */}
                  <button
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300 shadow-lg"
                    onClick={() => navigateMainImage('prev')}
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft size={28} />
                  </button>
                  <button
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-3 rounded-full transition-all duration-300 shadow-lg"
                    onClick={() => navigateMainImage('next')}
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight size={28} />
                  </button>
                </div>
              </div>
            </div>

            {/* Thumbnails in expanded view */}
            <div className="overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex space-x-3 min-w-max">
                {images.map((image, index) => (
                  <div
                    key={index}
                    className={`relative overflow-hidden rounded-md shadow-md cursor-pointer transition-all duration-300 ${
                      index === currentImageIndex ? 'ring-2 ring-primary ring-offset-2' : 'opacity-70 hover:opacity-100'
                    }`}
                    onClick={() => setCurrentImageIndex(index)}
                    style={{ width: '100px', height: '70px' }}
                  >
                    <img
                      src={image}
                      alt={`${title} - Miniatura ${index + 1}`}
                      className="object-contain w-full h-full"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Lightbox with elegant design */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center animate-fadeIn"
          onClick={closeLightbox}
        >
          <div
            className="relative w-full h-full flex flex-col items-center justify-center p-4 md:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header with counter and close button */}
            <div className="absolute top-4 left-0 right-0 flex justify-between items-center px-4 md:px-8 z-20">
              <div className="text-white/80 text-sm md:text-base font-light">
                {lightboxIndex + 1} / {images.length}
              </div>
              <button
                onClick={closeLightbox}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Cerrar"
              >
                <X size={28} />
              </button>
            </div>

            {/* Main image container with shadow and border */}
            <div className="relative max-w-5xl w-full h-[80vh] flex items-center justify-center">
              <img
                src={selectedImage}
                alt={title}
                className="max-w-full max-h-full object-contain shadow-2xl rounded-sm animate-scaleIn"
              />
            </div>

            {/* Navigation arrows - larger and more elegant */}
            <button
              className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('prev');
              }}
              aria-label="Imagen anterior"
            >
              <ChevronLeft size={40} />
            </button>
            <button
              className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-all duration-300"
              onClick={(e) => {
                e.stopPropagation();
                navigateLightbox('next');
              }}
              aria-label="Imagen siguiente"
            >
              <ChevronRight size={40} />
            </button>

            {/* Caption - optional */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p className="text-white/80 text-sm md:text-base font-light px-4">
                {title} - Imagen {lightboxIndex + 1}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;

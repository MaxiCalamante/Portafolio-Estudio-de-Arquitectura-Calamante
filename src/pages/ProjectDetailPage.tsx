
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Project } from '@/components/ProjectCard';
import ScrollReveal from '@/components/ScrollReveal';
import { projectsAPI } from '@/services/api';
import ImageGallery from '@/components/ImageGallery';

const ProjectDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | undefined>(undefined);

  useEffect(() => {
    // Verificar si estamos en la ruta en inglés y redirigir a la ruta en español
    const path = window.location.pathname;
    if (path.startsWith('/projects/') && slug) {
      navigate(`/proyectos/${slug}`, { replace: true });
      return;
    }

    const fetchProject = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        const data = await projectsAPI.getBySlug(slug);
        setProject(data);
        setSelectedImage(data.images[0]);
        setError(null);
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('No se pudo cargar el proyecto');
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [slug, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom pt-32 pb-16 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-muted-foreground">Cargando proyecto...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container-custom pt-32 pb-16">
          <h1 className="text-3xl font-serif mb-6">Proyecto no encontrado</h1>
          <p className="mb-6">Lo sentimos, el proyecto que está buscando no existe.</p>
          <Link to="/proyectos" className="text-primary hover:text-primary/80">
            Volver a proyectos
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ScrollReveal />
      <Navbar />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-custom">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <Link to="/proyectos" className="text-primary hover:text-primary/80 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
              </svg>
              Volver a proyectos
            </Link>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">{project.title}</h1>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-muted-foreground">
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
              {project.location}
            </p>
            <p className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
              {project.completionDate}
            </p>
          </div>
        </div>
      </section>

      {/* Layout de dos columnas: imágenes a la izquierda, descripción a la derecha */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Columna izquierda - Galería de imágenes */}
            <div className="lg:col-span-7 reveal">
              {/* Usar el componente ImageGallery */}
              <ImageGallery images={project.images} title={project.title} />
            </div>

            {/* Columna derecha - Detalles del proyecto */}
            <div className="lg:col-span-5 reveal">
              <h2 className="text-2xl font-serif mb-4">Detalles del Proyecto</h2>
              <div className="w-16 h-1 bg-primary mb-6"></div>

              {/* Información básica del proyecto */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-1">Ubicación</h3>
                  <p className="font-medium">{project.location}</p>
                </div>
                <div>
                  <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-1">Fecha de finalización</h3>
                  <p className="font-medium">{project.completionDate}</p>
                </div>
              </div>

              <p className="text-muted-foreground mb-8 whitespace-pre-line">
                {project.description}
              </p>

              {/* Sección de contacto */}
              <div className="bg-secondary p-6 rounded-lg mt-8">
                <h3 className="font-serif text-lg mb-3">¿Te interesa este proyecto?</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Podemos diseñar un proyecto similar adaptado a tus necesidades.
                  Contáctanos para discutir tus ideas.
                </p>
                <Link
                  to="/#contact"
                  className="inline-block bg-primary text-primary-foreground px-5 py-3 rounded-sm hover:bg-primary/90 transition-colors duration-300 w-full text-center"
                >
                  Contactar ahora
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectDetailPage;

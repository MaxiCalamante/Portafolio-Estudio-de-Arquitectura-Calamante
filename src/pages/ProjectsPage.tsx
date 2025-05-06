
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProjectCard, { Project } from '@/components/ProjectCard';
import ScrollReveal from '@/components/ScrollReveal';
import { projectsAPI } from '@/services/api';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectsAPI.getAll();
        setProjects(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching projects:', err);
        setError('No se pudieron cargar los proyectos');
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen">
      <ScrollReveal />
      <Navbar />

      <section className="pt-32 pb-16 bg-secondary">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">Proyectos</h1>
          <div className="w-20 h-1 bg-primary mb-8"></div>
          <p className="text-muted-foreground max-w-2xl">
            Explora nuestra selección de proyectos destacados, que reflejan nuestra pasión por la arquitectura innovadora y funcional.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-muted-foreground">Cargando proyectos...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500">{error}</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No hay proyectos disponibles.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 reveal">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProjectsPage;

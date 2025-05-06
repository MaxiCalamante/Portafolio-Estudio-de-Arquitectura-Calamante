
import React, { useState, useEffect } from 'react';
import ProjectCard, { Project } from '../ProjectCard';
import { Link } from 'react-router-dom';
import { projectsAPI } from '@/services/api';

const ProjectsSection: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectsAPI.getAll();
        // Mostrar solo los primeros 6 proyectos en la página principal
        setProjects(data.slice(0, 6));
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
    <section id="projects" className="section bg-white">
      <div className="container-custom">
        <div className="max-w-xl mx-auto text-center mb-16 reveal">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-6">Proyectos</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-muted-foreground">
            Explora nuestra selección de proyectos destacados, que reflejan nuestra pasión por la arquitectura innovadora y funcional.
          </p>
        </div>

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

        <div className="text-center mt-12 reveal">
          <Link
            to="/projects"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-sm hover:bg-primary/90 transition-colors duration-300"
          >
            Ver todos los proyectos
          </Link>
        </div>
      </div>
    </section>
  );
};

export default ProjectsSection;

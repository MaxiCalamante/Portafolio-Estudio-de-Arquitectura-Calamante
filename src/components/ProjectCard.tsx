
import React from 'react';
import { Link } from 'react-router-dom';

export type Project = {
  id: number;
  title: string;
  location: string;
  completionDate: string;
  description: string;
  images: string[];
  slug: string;
};

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-all duration-300 bg-white">
      <div className="relative aspect-w-4 aspect-h-3 overflow-hidden">
        <img
          src={project.images[0]}
          alt={project.title}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
          <div className="p-4 w-full">
            <p className="text-white text-sm font-medium mb-1 opacity-90">{project.location}</p>
            <p className="text-white text-xs opacity-80">{project.completionDate}</p>
          </div>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg font-medium mb-2">{project.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
        <Link
          to={`/proyectos/${project.slug}`}
          className="inline-block text-sm font-medium border-b border-primary pb-0.5 hover:pb-1 transition-all"
        >
          Ver proyecto
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;

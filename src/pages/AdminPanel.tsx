
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminProjectsList from '@/components/admin/AdminProjectsList';
import AdminProjectForm from '@/components/admin/AdminProjectForm';
import AdminContactMessages from '@/components/admin/AdminContactMessages';
import { Project } from '@/components/ProjectCard';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { authAPI, projectsAPI } from '@/services/api';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    // Comprueba si el usuario está autenticado
    const isAuth = authAPI.isAuthenticated();

    if (!isAuth) {
      navigate('/admin/login');
      return;
    }
    setIsAuthenticated(true);

    // Cargar proyectos desde la API
    const fetchProjects = async () => {
      try {
        const projectsData = await projectsAPI.getAll();
        setProjects(projectsData);
      } catch (error) {
        console.error('Error fetching projects:', error);
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'No se pudieron cargar los proyectos'
        });
      }
    };

    fetchProjects();
  }, [navigate, toast]);

  const handleAddProject = async (project: Omit<Project, 'id' | 'slug'>, files: File[] = []) => {
    try {
      const newProject = await projectsAPI.create(project, files);
      setProjects([...projects, newProject]);
      toast({
        title: 'Proyecto creado',
        description: `El proyecto "${project.title}" ha sido creado exitosamente.`
      });
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo crear el proyecto'
      });
    }
  };

  const handleEditProject = async (project: any, files: File[] = []) => {
    try {
      // Verificar que el proyecto tenga un ID válido
      if (!project.id) {
        console.error('Error: Project ID is missing or invalid', project);
        toast({
          variant: 'destructive',
          title: 'Error al actualizar el proyecto',
          description: 'ID del proyecto no válido. Por favor, intenta de nuevo.'
        });
        return;
      }

      console.log('Updating project:', project.id, project.title);

      // Crear una copia del proyecto para evitar problemas de referencia
      const projectToUpdate = {
        id: project.id,
        title: project.title,
        location: project.location,
        completionDate: project.completionDate,
        description: project.description,
        images: project.images || []
      };

      const updatedProject = await projectsAPI.update(project.id, projectToUpdate, files);

      // Actualizar la lista de proyectos
      setProjects(projects.map(p => p.id === project.id ? updatedProject : p));
      setSelectedProject(null);

      toast({
        title: 'Proyecto actualizado',
        description: `El proyecto "${project.title}" ha sido actualizado exitosamente.`
      });
    } catch (error: any) {
      console.error('Error updating project:', error);

      // Mostrar un mensaje de error más detallado
      toast({
        variant: 'destructive',
        title: 'Error al actualizar el proyecto',
        description: error.message || 'No se pudo actualizar el proyecto. Intenta de nuevo.'
      });
    }
  };

  const handleDeleteProject = async (id: number) => {
    try {
      await projectsAPI.delete(id);
      setProjects(projects.filter(project => project.id !== id));
      toast({
        title: 'Proyecto eliminado',
        description: 'El proyecto ha sido eliminado exitosamente.'
      });
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el proyecto'
      });
    }
  };

  const handleSelectProject = (project: Project) => {
    setSelectedProject(project);
  };

  const handleCancelEdit = () => {
    setSelectedProject(null);
  };

  const handleDeleteImage = async (imageUrl: string, imageIndex: number) => {
    if (!selectedProject) return;

    try {
      // Extract the image ID from the database
      // First, we need to query the database to get the image ID based on the URL
      // For this example, we'll assume the image URL format is consistent

      // Extract the image ID from the URL or find it in the database
      // This is a simplified approach - in a real app, you might need to make an API call to get the image ID
      const imagePathParts = imageUrl.split('/');
      const imageFileName = imagePathParts[imagePathParts.length - 1];

      // Find the image in the database by querying the API
      // For now, we'll make a direct call to delete the image
      // In a real app, you might want to first get the image ID and then delete it

      // Find all project images
      const projectImages = await fetch(`${import.meta.env.VITE_API_URL}/api/projects/${selectedProject.id}`)
        .then(res => res.json())
        .then(data => data.images);

      // Find the image ID by matching the URL
      const imageId = projectImages.findIndex((img: string) => img === imageUrl) + 1; // +1 because DB IDs usually start at 1

      if (imageId) {
        // Delete the image from the server
        await projectsAPI.deleteImage(selectedProject.id, imageId);

        // Update the selected project in state
        if (selectedProject) {
          const updatedImages = [...selectedProject.images];
          updatedImages.splice(imageIndex, 1);

          setSelectedProject({
            ...selectedProject,
            images: updatedImages
          });

          // Also update the project in the projects list
          setProjects(projects.map(p =>
            p.id === selectedProject.id
              ? { ...p, images: updatedImages }
              : p
          ));

          toast({
            title: 'Imagen eliminada',
            description: 'La imagen ha sido eliminada exitosamente.'
          });
        }
      }
    } catch (error: any) {
      console.error('Error deleting image:', error);
      toast({
        variant: 'destructive',
        title: 'Error al eliminar la imagen',
        description: error.message || 'No se pudo eliminar la imagen. Intenta de nuevo.'
      });
    }
  };

  if (!isAuthenticated) {
    return <div>Verificando autenticación...</div>;
  }

  return (
    <div className="min-h-screen bg-secondary/10">
      <AdminNavbar />

      <div className="container-custom py-8">
        <h1 className="text-3xl font-serif mb-6">Panel de Administración</h1>

        <Tabs defaultValue="projects" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="projects">Proyectos</TabsTrigger>
            <TabsTrigger value="new">Nuevo Proyecto</TabsTrigger>
            <TabsTrigger value="messages">Mensajes de Contacto</TabsTrigger>
          </TabsList>

          <TabsContent value="projects" className="space-y-6">
            <AdminProjectsList
              projects={projects}
              onEdit={handleSelectProject}
              onDelete={handleDeleteProject}
            />

            {selectedProject && (
              <div className="mt-8">
                <h2 className="text-2xl font-serif mb-4">Editar Proyecto</h2>
                <AdminProjectForm
                  project={selectedProject}
                  onSubmit={handleEditProject}
                  onCancel={handleCancelEdit}
                  isEditing={true}
                  onDeleteImage={handleDeleteImage}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="new">
            <h2 className="text-2xl font-serif mb-4">Nuevo Proyecto</h2>
            <AdminProjectForm
              onSubmit={handleAddProject}
              onCancel={() => {}}
              isEditing={false}
            />
          </TabsContent>

          <TabsContent value="messages">
            <h2 className="text-2xl font-serif mb-4">Mensajes de Contacto</h2>
            <AdminContactMessages />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminPanel;

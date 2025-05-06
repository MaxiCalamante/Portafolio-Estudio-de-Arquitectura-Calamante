
import React from 'react';
import { Project } from '@/components/ProjectCard';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Edit, Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface AdminProjectsListProps {
  projects: Project[];
  onEdit: (project: Project) => void;
  onDelete: (id: number) => void;
}

const AdminProjectsList: React.FC<AdminProjectsListProps> = ({
  projects,
  onEdit,
  onDelete
}) => {
  if (projects.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <h3 className="text-xl text-muted-foreground">No hay proyectos registrados</h3>
        <p className="mt-2">Crea un nuevo proyecto para comenzar</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Ubicación</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell className="font-medium">{project.id}</TableCell>
              <TableCell>{project.title}</TableCell>
              <TableCell>{project.location}</TableCell>
              <TableCell>{project.completionDate}</TableCell>
              <TableCell className="text-right space-x-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onEdit(project)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Eliminar</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente el proyecto
                        <strong> {project.title}</strong>.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => onDelete(project.id)}
                        className="bg-destructive hover:bg-destructive/90"
                      >
                        Eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminProjectsList;

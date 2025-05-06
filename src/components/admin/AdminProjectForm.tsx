
import React, { useState, useRef } from 'react';
import { Project } from '@/components/ProjectCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface FormValues {
  title: string;
  location: string;
  completionDate: string;
  description: string;
  images: string[];
}

interface AdminProjectFormProps {
  project?: Project;
  onSubmit: (project: Omit<Project, "id" | "slug">, files: File[]) => void;
  onCancel: () => void;
  isEditing: boolean;
  onDeleteImage?: (imageUrl: string, imageIndex: number) => Promise<void>;
}

const AdminProjectForm: React.FC<AdminProjectFormProps> = ({ project, onSubmit, onCancel, isEditing, onDeleteImage }) => {
  const [title, setTitle] = useState(project?.title || '');
  const [location, setLocation] = useState(project?.location || '');
  const [completionDate, setCompletionDate] = useState(project?.completionDate || '');
  const [description, setDescription] = useState(project?.description || '');
  const [imageUrl, setImageUrl] = useState('');
  const [images, setImages] = useState<string[]>(project?.images || []);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addImage = () => {
    if (imageUrl.trim()) {
      setImages([...images, imageUrl]);
      setImageUrl('');
    }
  };

  const removeImage = async (index: number) => {
    const imageToRemove = images[index];

    if (isEditing && project && onDeleteImage) {
      try {
        // Call the onDeleteImage function provided by the parent component
        await onDeleteImage(imageToRemove, index);
        // If successful, remove from local state
        setImages(images.filter((_, i) => i !== index));
      } catch (error) {
        console.error('Error deleting image:', error);
        // Handle error (could show a toast notification here)
      }
    } else {
      // If not editing or no onDeleteImage function provided, just remove from local state
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Asegurar que todos los campos requeridos estén presentes
    const projectData: any = {
      title: title,
      location: location,
      completionDate: completionDate,
      description: description,
      images: images
    };

    // Si estamos editando, incluir el ID del proyecto
    if (isEditing && project) {
      projectData.id = project.id;
      console.log('Submitting project with ID:', project.id);
    }

    onSubmit(projectData, files);

    // Reiniciar el formulario después de enviar
    if (!isEditing) {
      setTitle('');
      setLocation('');
      setCompletionDate('');
      setDescription('');
      setImages([]);
      setFiles([]);
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Proyecto' : 'Añadir Nuevo Proyecto'}</CardTitle>
        <CardDescription>
          {isEditing
            ? 'Actualiza la información del proyecto existente'
            : 'Completa el formulario para añadir un nuevo proyecto a tu portafolio'}
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nombre del proyecto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Ubicación</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ubicación del proyecto"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="completionDate">Fecha de finalización</Label>
            <Input
              id="completionDate"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              placeholder="Ej: Enero 2023"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe el proyecto"
              className="min-h-32"
              required
            />
          </div>

          <div className="space-y-3">
            <Label>Imágenes</Label>

            {/* URL de imagen */}
            <div className="flex gap-2">
              <Input
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL de la imagen"
                className="flex-1"
              />
              <Button type="button" variant="secondary" onClick={addImage}>
                Añadir
              </Button>
            </div>

            {/* Subir archivos */}
            <div className="mt-4">
              <Label htmlFor="file-upload">Subir imágenes</Label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                  ref={fileInputRef}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Upload size={16} />
                  Seleccionar archivos
                </Button>
              </div>
            </div>

            {/* Mostrar archivos seleccionados */}
            {files.length > 0 && (
              <div className="mt-4">
                <Label>Archivos seleccionados</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {files.map((file, index) => (
                    <div key={`file-${index}`} className="relative group bg-muted p-2 rounded-md flex flex-col items-center">
                      <div className="w-full h-20 flex items-center justify-center">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Archivo ${index + 1}`}
                            className="h-full max-w-full object-contain"
                          />
                        ) : (
                          <ImageIcon className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      <p className="text-xs truncate w-full text-center mt-1">{file.name}</p>
                      <button
                        type="button"
                        onClick={() => removeFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Eliminar archivo"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Mostrar imágenes existentes */}
            {images.length > 0 && (
              <div className="mt-4">
                <Label>Imágenes existentes</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
                  {images.map((img, index) => (
                    <div key={`img-${index}`} className="relative group">
                      <img
                        src={img}
                        alt={`Proyecto ${index + 1}`}
                        className="h-24 w-full object-cover rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Eliminar imagen"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {isEditing ? 'Actualizar' : 'Crear'} Proyecto
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default AdminProjectForm;

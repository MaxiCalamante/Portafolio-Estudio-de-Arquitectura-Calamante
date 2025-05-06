import React, { useState, useEffect } from 'react';
import { contactAPI, ContactMessage } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
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
import { Eye, Trash2, Mail, Check } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';

const AdminContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await contactAPI.getAll();
      setMessages(data);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudieron cargar los mensajes de contacto'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewMessage = (message: ContactMessage) => {
    setSelectedMessage(message);
    setIsDialogOpen(true);

    // If message is unread, mark it as read
    if (!message.is_read) {
      handleMarkAsRead(message.id);
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await contactAPI.markAsRead(id);
      setMessages(messages.map(msg =>
        msg.id === id ? { ...msg, is_read: true } : msg
      ));

      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, is_read: true });
      }

      toast({
        title: 'Mensaje marcado como leído',
        description: 'El mensaje ha sido marcado como leído'
      });
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo marcar el mensaje como leído'
      });
    }
  };

  const handleDeleteMessage = async (id: number) => {
    try {
      await contactAPI.delete(id);
      setMessages(messages.filter(msg => msg.id !== id));
      toast({
        title: 'Mensaje eliminado',
        description: 'El mensaje ha sido eliminado exitosamente'
      });
    } catch (error) {
      console.error('Error deleting message:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'No se pudo eliminar el mensaje'
      });
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, 'dd MMM yyyy, HH:mm', { locale: es });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando mensajes...</div>;
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-lg shadow-sm">
        <h3 className="text-xl text-muted-foreground">No hay mensajes de contacto</h3>
        <p className="mt-2">Cuando los visitantes envíen mensajes, aparecerán aquí</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Fecha</TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Asunto</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages.map((message) => (
              <TableRow key={message.id} className={!message.read ? 'bg-muted/30' : ''}>
                <TableCell className="font-medium">
                  {formatDate(message.created_at)}
                </TableCell>
                <TableCell>{message.name}</TableCell>
                <TableCell>{message.subject}</TableCell>
                <TableCell>
                  {message.is_read ? (
                    <Badge variant="outline" className="bg-muted text-muted-foreground">
                      Leído
                    </Badge>
                  ) : (
                    <Badge variant="default" className="bg-primary">
                      Nuevo
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleViewMessage(message)}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Ver</span>
                  </Button>

                  {!message.is_read && (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleMarkAsRead(message.id)}
                      className="h-8 w-8 p-0 text-blue-500"
                    >
                      <Check className="h-4 w-4" />
                      <span className="sr-only">Marcar como leído</span>
                    </Button>
                  )}

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
                          Esta acción no se puede deshacer. Esto eliminará permanentemente el mensaje
                          de <strong>{message.name}</strong>.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteMessage(message.id)}
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

      {/* Message Detail Dialog */}
      {selectedMessage && (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>{selectedMessage.subject}</DialogTitle>
              <DialogDescription>
                Mensaje recibido el {formatDate(selectedMessage.created_at)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium mb-1">Nombre</h4>
                  <p className="text-sm">{selectedMessage.name}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-1">Correo electrónico</h4>
                  <p className="text-sm">{selectedMessage.email}</p>
                </div>
              </div>

              {selectedMessage.phone && (
                <div>
                  <h4 className="text-sm font-medium mb-1">Teléfono</h4>
                  <p className="text-sm">{selectedMessage.phone}</p>
                </div>
              )}

              <div>
                <h4 className="text-sm font-medium mb-1">Mensaje</h4>
                <div className="bg-muted/30 p-3 rounded-md text-sm whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between">
              <Button
                variant="outline"
                type="button"
                onClick={() => window.location.href = `mailto:${selectedMessage.email}`}
                className="flex items-center gap-2"
              >
                <Mail className="h-4 w-4" />
                Responder por correo
              </Button>
              <DialogClose asChild>
                <Button type="button">Cerrar</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AdminContactMessages;

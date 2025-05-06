
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, Home } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { authAPI } from '@/services/api';

const AdminNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = () => {
    authAPI.logout();
    toast({
      title: 'Sesión cerrada',
      description: 'Has cerrado sesión exitosamente'
    });
    navigate('/admin/login');
  };

  return (
    <nav className="bg-primary text-white py-4">
      <div className="container-custom flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-serif">Estudio Javier Calamante</h2>
          <span className="text-sm px-2 py-1 bg-primary-foreground/20 rounded">Admin</span>
        </div>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-primary-foreground/20"
          >
            <Home className="mr-2 h-4 w-4" />
            Ver sitio
          </Button>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-white hover:bg-primary-foreground/20"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;


import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-medium mb-4">Estudio Javier Calamante</h3>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Arquitectura de excelencia, innovación y funcionalidad. Transformamos ideas en espacios que inspiran.
            </p>

          </div>

          <div>
            <h3 className="text-xl font-medium mb-4">Contacto</h3>
            <div className="space-y-2">
              <p className="flex items-center text-sm text-primary-foreground/80">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                </svg>
                Maipu 710, Tandil, Buenos Aires, Argentina
              </p>
              <p className="flex items-center text-sm text-primary-foreground/80">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                </svg>
                +54 2494543936
              </p>
              <p className="flex items-center text-sm text-primary-foreground/80">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                </svg>
                javiercalamantetandil@gmail.com
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-medium mb-4">Horario</h3>
            <div className="space-y-2 text-sm text-primary-foreground/80">
              <p>Lunes - Viernes: 9:00 - 18:00</p>
              <p>Sábados: 10:00 - 14:00</p>
              <p>Domingos: Cerrado</p>
            </div>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-sm text-center text-primary-foreground/60">
          <p>&copy; {currentYear} Estudio Javier Calamante.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

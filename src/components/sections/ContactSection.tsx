
import React, { useState } from 'react';
import { useToast } from "@/components/ui/use-toast";
import { contactAPI } from '@/services/api';

// Componente de sección de contacto
const ContactSection: React.FC = () => {
  const { toast } = useToast();
  // Estado para almacenar los datos del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  // Estado para controlar si el formulario está siendo enviado
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Manejador de cambios en los campos del formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Manejador de envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Enviamos los datos del formulario a la API
      await contactAPI.submit(formData);

      // Mostramos un mensaje de éxito
      toast({
        title: "Mensaje enviado",
        description: "Gracias por contactarnos. Responderemos a la brevedad.",
      });

      // Limpiamos el formulario
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
    } catch (error) {
      console.error('Error al enviar el formulario de contacto:', error);
      // Mostramos un mensaje de error
      toast({
        variant: 'destructive',
        title: "Error al enviar",
        description: "Hubo un problema al enviar su mensaje. Por favor, intente nuevamente.",
      });
    } finally {
      // Finalizamos el estado de envío
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="section bg-secondary">
      <div className="container-custom">
        <div className="max-w-xl mx-auto text-center mb-16 reveal">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-6">Contáctenos</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-8"></div>
          <p className="text-muted-foreground">
            Estamos disponibles para discutir su proyecto. Complete el formulario
            a continuación y nos pondremos en contacto con usted a la brevedad.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white p-8 rounded-lg shadow-md reveal">
            <h3 className="text-xl font-serif mb-6">Envíenos un mensaje</h3>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-muted-foreground mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">
                    Correo electrónico *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-1">
                    Asunto *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="">Seleccione una opción</option>
                    <option value="Consulta general">Consulta general</option>
                    <option value="Proyecto residencial">Proyecto residencial</option>
                    <option value="Proyecto comercial">Proyecto comercial</option>
                    <option value="Renovación">Renovación</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-2 border border-border rounded-sm focus:outline-none focus:ring-1 focus:ring-primary"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-sm hover:bg-primary/90 transition-colors duration-300 disabled:opacity-70"
              >
                {isSubmitting ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </div>

          <div className="reveal">
            <div className="bg-white p-8 rounded-lg shadow-md mb-8">
              <h3 className="text-xl font-serif mb-6">Información de contacto</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Dirección</h4>
                    <p className="text-muted-foreground text-sm">Maipu 710, Tandil, Buenos Aires, Argentina</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Correo electrónico</h4>
                    <p className="text-muted-foreground text-sm">javiercalamantetandil@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Teléfono</h4>
                    <p className="text-muted-foreground text-sm">+54 2494543936</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-primary">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm mb-1">Horario de atención</h4>
                    <p className="text-muted-foreground text-sm">Lunes - Viernes: 9:00 - 18:00</p>
                    <p className="text-muted-foreground text-sm">Sábados: 10:00 - 14:00</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-1 rounded-lg shadow-md h-[300px] overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3173.0337134200394!2d-59.14073492422726!3d-37.32768397211767!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95911f9b2a2c8d95%3A0xf8a48f0a6bae4c7c!2sMaip%C3%BA%20710%2C%20Tandil%2C%20Provincia%20de%20Buenos%20Aires%2C%20Argentina!5e0!3m2!1ses!2sus!4v1718566731844!5m2!1ses!2sus"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                title="Ubicación de Estudio Javier Calamante - Maipu 710, Tandil"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

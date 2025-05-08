
import React from 'react';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="section bg-white">
      <div className="container-custom">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <div className="relative">
              <div className="bg-accent w-full h-[400px] md:h-[500px] rounded-lg overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
                  alt="Estudio de arquitectura"
                  className="w-full h-full object-cover object-center"
                />
              </div>
              <div className="hidden md:block absolute -bottom-8 -right-8 w-48 h-48 bg-primary">
                <div className="w-full h-full flex items-center justify-center text-primary-foreground">
                  <p className="text-center font-serif">
                    <span className="block text-3xl font-medium">29+</span>
                    <span className="text-sm">Años de experiencia</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="reveal">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif mb-6">Sobre Estudio Javier Calamante</h2>
            <div className="w-20 h-1 bg-primary mb-8"></div>
            <p className="text-muted-foreground mb-6">
              Desde 1996, el Estudio Javier Calamante se dedica a proyectar espacios funcionales y estéticamente cuidados, con una mirada moderna y atenta al detalle.
            </p>
            <p className="text-muted-foreground mb-6">
              Liderado por el arquitecto Javier Calamante, el estudio aborda cada proyecto de manera personalizada, priorizando la calidad, la claridad en el diseño y el vínculo con el entorno.
            </p>
            <p className="text-muted-foreground mb-8">
              La eficiencia, la sostenibilidad y el compromiso con el contexto son pilares clave en cada obra que realizamos.
            </p>
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="text-center">
                <span className="block font-serif text-3xl font-medium text-primary">120+</span>
                <span className="text-sm text-muted-foreground">Proyectos Completados</span>
              </div>
              <div className="text-center">
                <span className="block font-serif text-3xl font-medium text-primary">45+</span>
                <span className="text-sm text-muted-foreground">Clientes Satisfechos</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;

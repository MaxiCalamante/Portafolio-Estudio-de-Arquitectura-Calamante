Estudio Javier Calamante - Sitio Web
Este repositorio contiene el código fuente del sitio web del Estudio Javier Calamante, un estudio de arquitectura ubicado en Tandil, Buenos Aires, Argentina.

Descripción general
El proyecto está desarrollado con React para el frontend y Node.js con Express para el backend. Utiliza MySQL como base de datos para almacenar información sobre proyectos y mensajes enviados desde el formulario de contacto.
Cuenta además con un sistema de autenticación y un panel administrativo para gestionar el contenido.

Tecnologías utilizadas
Frontend: React, TypeScript, TailwindCSS, Shadcn UI
Backend: Node.js, Express
Base de datos: MySQL
Procesamiento de imágenes: Sharp (conversión automática a WebP)
Autenticación: JWT

Requisitos previos
Antes de iniciar el proyecto es necesario tener instalado lo siguiente:

Node.js (versión 16 o superior)

MySQL (versión 8 o superior)

Instalación
Clonar el repositorio:

git clone https://github.com/MaxiCalamante/Portafolio-Estudio-de-Arquitectura-Calamante.git
cd Portafolio-Estudio-de-Arquitectura-Calamante-main
Instalar dependencias:


npm install
Crear la base de datos:

Crear una base en MySQL llamada calamante_studio

Importar el esquema desde el archivo incluido:

mysql -u root -p calamante_studio < calamante_studio.sql
Configurar las variables de entorno:

Crear un archivo .env en la raíz del proyecto con los siguientes valores:

PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=calamante_studio

JWT_SECRET=una_clave_segura
Ejecución del proyecto
Modo desarrollo
Para iniciar tanto el servidor como el frontend, ejecutar el archivo Arrancar.bat.
Esto levanta ambos servicios automáticamente.

Frontend disponible en: http://localhost:5173

Backend disponible en: http://localhost:3000

Modo producción
Compilar el frontend:

npm run build
El backend se encargará de servir tanto la API como los archivos estáticos generados.

Panel de administración
El sistema incluye una interfaz para que el estudio pueda administrar proyectos y revisar mensajes de contacto.

Ruta: /admin

Usuario por defecto: admin

Contraseña por defecto: password

Importante: Por razones de seguridad, se recomienda cambiar las credenciales predeterminadas luego del primer acceso.

Estructura del proyecto
├── public/                Archivos estáticos y uploads
├── src/                   Código fuente del frontend
│   ├── components/        Componentes reutilizables
│   ├── pages/             Vistas/páginas del sitio
│   ├── services/          Comunicación con la API
│   └── styles/            Estilos
├── server.js              Backend con Express
├── calamante_studio.sql   Esquema inicial de la base de datos
└── README.md              Este archivo
Seguridad
Para un entorno de producción:

Utilizar una clave JWT segura y única

Cambiar las credenciales de acceso del administrador

Verificar los permisos de la carpeta uploads

Implementar HTTPS en el servidor

Contacto
Para consultas o soporte, escribir a:
maximocalamante14@gmail.com

Desarrollado por Máximo Calamante para Estudio Javier Calamante - Año 2025

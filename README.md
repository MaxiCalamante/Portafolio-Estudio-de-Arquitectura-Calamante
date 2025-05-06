# Estudio Javier Calamante - Sitio Web

Este repositorio contiene el código fuente del sitio web para Estudio Javier Calamante, un estudio de arquitectura ubicado en Tandil, Buenos Aires, Argentina.

## 📋 Descripción

El proyecto está desarrollado con React para el frontend y Node.js con Express para el backend. Utiliza MySQL como base de datos para almacenar información sobre proyectos arquitectónicos y mensajes de contacto.

## 🚀 Tecnologías utilizadas

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Node.js, Express
- **Base de datos**: MySQL
- **Procesamiento de imágenes**: Sharp (conversión automática a WebP)
- **Autenticación**: JWT

## ⚙️ Requisitos previos

Para ejecutar este proyecto necesitás tener instalado:

- Node.js (v16 o superior)
- MySQL (v8 o superior)
- Bun (opcional, para mejor rendimiento)

## 🔧 Instalación

### 1. Cloná el repositorio

```bash
git clone https://github.com/estudio-calamante.git
cd estudio-calamante
```

### 2. Instalá las dependencias

```bash
# Usando npm
npm install

# O usando Bun (recomendado por su velocidad)
bun install
```

### 3. Configurá la base de datos

1. Creá una base de datos MySQL llamada `calamante_studio`
2. Podés importar el esquema inicial desde el archivo `calamante_studio.sql` incluido en el proyecto:

```bash
mysql -u root -p calamante_studio < calamante_studio.sql
```

### 4. Configurá las variables de entorno

Creá un archivo `.env` en la raíz del proyecto con el siguiente contenido:

```
# Puerto para el servidor
PORT=3000

# Configuración de la base de datos
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=calamante_studio

# Clave secreta para JWT (cambiala por una clave segura)
JWT_SECRET=tu_clave_secreta_para_jwt
```

## 🚀 Ejecución del proyecto

### Modo desarrollo

Para ejecutar el proyecto en modo desarrollo, necesitás iniciar tanto el servidor backend como el frontend:

1. **Iniciá el servidor backend**:

```bash
# Usando el script incluido
./start-backend-dev.bat

# O manualmente
node server.js
```

2. **Iniciá el servidor de desarrollo frontend**:

```bash
# Usando npm
npm run dev

# O usando Bun
bun run dev
```

El frontend estará disponible en `http://localhost:5173` y el backend en `http://localhost:3000`.

### Modo producción

Para desplegar en producción:

1. **Construí el frontend**:

```bash
# Usando npm
npm run build

# O usando Bun
bun run build
```

2. **Iniciá el servidor**:

```bash
# Usando el script incluido
./start-backend.bat

# O manualmente
node server.js
```

El servidor servirá tanto la API como los archivos estáticos del frontend construido.

## 👨‍💻 Panel de administración

El sistema incluye un panel de administración para gestionar proyectos y mensajes de contacto:

- **URL**: `/admin`
- **Credenciales por defecto**:
  - Usuario: `javiercalamante69`
  - Contraseña: `140103JC`

⚠️ **Importante**: Cambiá estas credenciales después del primer inicio de sesión por motivos de seguridad.

## 📁 Estructura del proyecto

```
/
├── public/             # Archivos estáticos y uploads
├── src/                # Código fuente del frontend
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas de la aplicación
│   ├── services/       # Servicios para comunicación con la API
│   └── styles/         # Estilos CSS
├── server.js           # Servidor Express (backend)
├── calamante_studio.sql # Esquema inicial de la base de datos
└── README.md           # Este archivo
```

## 📤 Archivos a subir a GitHub

Al subir este proyecto a GitHub, te recomendamos:

### ✅ Incluir:
- Todo el código fuente (`/src`)
- Archivos de configuración (`.gitignore`, `tsconfig.json`, etc.)
- Scripts de inicio (`start-backend.bat`, `start-backend-dev.bat`)
- Esquema de la base de datos (`calamante_studio.sql`)
- Documentación (`README.md`, etc.)

### ❌ No incluir:
- Carpeta `node_modules` (asegurate de que esté en `.gitignore`)
- Archivos `.env` con credenciales sensibles
- Carpeta `public/uploads` con imágenes subidas por usuarios
- Archivos de construcción (`/dist`, `/build`)
- Archivos temporales o de caché

## 🔒 Seguridad

Para mejorar la seguridad del proyecto:

1. Cambiá la clave JWT en producción
2. Modificá las credenciales de administrador predeterminadas
3. Asegurate de que la carpeta `uploads` tenga los permisos adecuados
4. Implementá HTTPS en producción

## 📞 Soporte

Para consultas o soporte, contactá a:
- Email: maximocalamante14@gmail.com

---

Desarrollado por Maximo Calamante para Estudio Calamante © 2025

import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Creamos la aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de Middleware
app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use(express.static('public'));

// Creamos el directorio de uploads si no existe
const uploadsDir = path.join(__dirname, 'public/uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuramos multer para la carga de archivos
// Utilizamos almacenamiento en memoria para procesar con sharp
const storage = multer.memoryStorage();

// Creamos un filtro para permitir solo archivos de imagen
const fileFilter = (req, file, cb) => {
  // Aceptamos solo archivos de imagen
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('¡Solo se permiten archivos de imagen!'), false);
  }
};

// Creamos la instancia de multer con almacenamiento en memoria
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Tamaño máximo de archivo: 10MB
  }
});

// Middleware para procesar las imágenes subidas a formato WebP
const processImages = async (req, res, next) => {
  if (!req.files || req.files.length === 0) {
    return next();
  }

  try {
    // Procesamos cada archivo
    const processedFiles = [];

    for (const file of req.files) {
      // Creamos un nombre de archivo único
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const filename = `${file.fieldname}-${uniqueSuffix}.webp`;
      const outputPath = path.join('public/uploads', filename);

      // Convertimos a WebP y guardamos con máxima calidad
      await sharp(file.buffer)
        .resize({
          width: 1920,  // Redimensionamos a un ancho máximo de 1920px (Full HD)
          height: 1080, // Redimensionamos a un alto máximo de 1080px (Full HD)
          fit: 'inside', // Mantenemos la relación de aspecto
          withoutEnlargement: true // No agrandamos imágenes más pequeñas
        })
        .webp({ quality: 100, lossless: true }) // 100% de calidad para máxima fidelidad visual
        .toFile(path.join(__dirname, outputPath));

      // Agregamos la información del archivo procesado a la solicitud
      processedFiles.push({
        originalname: file.originalname,
        filename: filename,
        path: outputPath,
        destination: 'public/uploads',
        mimetype: 'image/webp'
      });
    }

    // Reemplazamos los archivos originales con los procesados
    req.files = processedFiles;
    next();
  } catch (error) {
    console.error('Error al procesar imágenes:', error);
    return res.status(500).json({ message: 'Error al procesar las imágenes subidas' });
  }
};

// Conexión a MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'calamante_studio'
});

// Conectamos a MySQL
db.connect(err => {
  if (err) {
    console.error('Error al conectar a MySQL:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');

  // Creamos las tablas si no existen
  createTables();
});

// Creamos las tablas de la base de datos
function createTables() {
  // Tabla de administradores
  db.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla de administradores:', err);
    } else {
      console.log('La tabla de administradores fue creada o ya existe');

      // Verificamos si existe el usuario administrador, si no, lo creamos (Remplazar admin por el nombre de usuario)
      db.query('SELECT * FROM admins WHERE username = ?', ['admin'], (err, results) => {
        if (err) {
          console.error('Error al verificar el usuario administrador:', err);
        } else if (results.length === 0) {
          // Creamos el usuario administrador personalizado (usuario: admin, contraseña: password)
          bcrypt.hash('password', 10, (err, hash) => {
            if (err) {
              console.error('Error al hashear la contraseña:', err);
            } else {
              db.query('INSERT INTO admins (username, password) VALUES (?, ?)', ['admin', hash], (err) => {
                if (err) {
                  console.error('Error al crear el administrador personalizado:', err);
                } else {
                  console.log('Usuario administrador "admin" creado');
                }
              });
            }
          });
        }
      });
    }
  });

  // Tabla de proyectos
  db.query(`
    CREATE TABLE IF NOT EXISTS projects (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      location VARCHAR(255) NOT NULL,
      completion_date VARCHAR(100) NOT NULL,
      description TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla de proyectos:', err);
    } else {
      console.log('La tabla de proyectos fue creada o ya existe');
    }
  });

  // Tabla de imágenes de proyectos
  db.query(`
    CREATE TABLE IF NOT EXISTS project_images (
      id INT AUTO_INCREMENT PRIMARY KEY,
      project_id INT NOT NULL,
      image_url VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla de imágenes de proyectos:', err);
    } else {
      console.log('La tabla de imágenes de proyectos fue creada o ya existe');
    }
  });

  // Tabla de mensajes de contacto
  db.query(`
    CREATE TABLE IF NOT EXISTS contact_messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      phone VARCHAR(20),
      subject VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      is_read TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `, (err) => {
    if (err) {
      console.error('Error al crear la tabla de mensajes de contacto:', err);
    } else {
      console.log('La tabla de mensajes de contacto fue creada o ya existe');
    }
  });
}

// Clave secreta para JWT
const JWT_SECRET = 'calamante-studio-secret-key';

// Middleware para verificar el token JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Se requiere autenticación' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido o expirado' });
    }
    req.user = user;
    next();
  });
}

// Rutas

// Inicio de sesión de administrador
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Se requieren nombre de usuario y contraseña' });
  }

  db.query('SELECT * FROM admins WHERE username = ?', [username], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const admin = results[0];

    bcrypt.compare(password, admin.password, (err, match) => {
      if (err) {
        console.error('Error al comparar contraseñas:', err);
        return res.status(500).json({ message: 'Error del servidor' });
      }

      if (!match) {
        return res.status(401).json({ message: 'Credenciales inválidas' });
      }

      // Generamos el token JWT
      const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '24h' });

      res.json({
        message: 'Inicio de sesión exitoso',
        token,
        admin: {
          id: admin.id,
          username: admin.username
        }
      });
    });
  });
});

// Obtener todos los proyectos
app.get('/api/projects', (req, res) => {
  db.query('SELECT * FROM projects ORDER BY created_at DESC', (err, projects) => {
    if (err) {
      console.error('Error al obtener proyectos:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    // Obtenemos las imágenes para cada proyecto
    const projectPromises = projects.map(project => {
      return new Promise((resolve, reject) => {
        db.query('SELECT * FROM project_images WHERE project_id = ?', [project.id], (err, images) => {
          if (err) {
            reject(err);
          } else {
            project.images = images.map(img => img.image_url);
            resolve(project);
          }
        });
      });
    });

    Promise.all(projectPromises)
      .then(projectsWithImages => {
        res.json(projectsWithImages);
      })
      .catch(err => {
        console.error('Error al obtener imágenes de proyectos:', err);
        res.status(500).json({ message: 'Error del servidor' });
      });
  });
});

// Obtener un proyecto específico por ID
app.get('/api/projects/:id', (req, res) => {
  const projectId = req.params.id;

  db.query('SELECT * FROM projects WHERE id = ?', [projectId], (err, results) => {
    if (err) {
      console.error('Error al obtener el proyecto:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const project = results[0];

    db.query('SELECT * FROM project_images WHERE project_id = ?', [projectId], (err, images) => {
      if (err) {
        console.error('Error al obtener imágenes del proyecto:', err);
        return res.status(500).json({ message: 'Error del servidor' });
      }

      project.images = images.map(img => img.image_url);
      res.json(project);
    });
  });
});

// Obtener un proyecto específico por slug
app.get('/api/projects/slug/:slug', (req, res) => {
  const slug = req.params.slug;

  db.query('SELECT * FROM projects WHERE slug = ?', [slug], (err, results) => {
    if (err) {
      console.error('Error al obtener proyecto por slug:', err);
      return res.status(500).json({ message: 'Error del servidor' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    const project = results[0];

    db.query('SELECT * FROM project_images WHERE project_id = ?', [project.id], (err, images) => {
      if (err) {
        console.error('Error al obtener imágenes del proyecto:', err);
        return res.status(500).json({ message: 'Error del servidor' });
      }

      project.images = images.map(img => img.image_url);
      res.json(project);
    });
  });
});

// Create a new project
app.post('/api/projects', authenticateToken, upload.array('images', 10), processImages, (req, res) => {
  const { title, location, completionDate, description } = req.body;

  if (!title || !location || !completionDate || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Create slug from title
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  // Insert project
  db.query(
    'INSERT INTO projects (title, slug, location, completion_date, description) VALUES (?, ?, ?, ?, ?)',
    [title, slug, location, completionDate, description],
    (err, result) => {
      if (err) {
        console.error('Error creating project:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      const projectId = result.insertId;

      // Handle image uploads
      const files = req.files || [];
      const imageUrls = files.map(file => `/uploads/${file.filename}`);

      // If no files were uploaded but image URLs were provided in the request body
      const bodyImageUrls = req.body.imageUrls ? JSON.parse(req.body.imageUrls) : [];
      const allImageUrls = [...imageUrls, ...bodyImageUrls];

      if (allImageUrls.length === 0) {
        return res.status(201).json({
          id: projectId,
          title,
          slug,
          location,
          completionDate,
          description,
          images: []
        });
      }

      // Insert image URLs
      const imageValues = allImageUrls.map(url => [projectId, url]);
      db.query(
        'INSERT INTO project_images (project_id, image_url) VALUES ?',
        [imageValues],
        (err) => {
          if (err) {
            console.error('Error saving project images:', err);
            return res.status(500).json({ message: 'Server error' });
          }

          res.status(201).json({
            id: projectId,
            title,
            slug,
            location,
            completionDate: completionDate,
            description,
            images: allImageUrls
          });
        }
      );
    }
  );
});

// Update a project
app.put('/api/projects/:id', authenticateToken, upload.array('images', 10), processImages, (req, res) => {
  const projectId = req.params.id;
  const { title, location, completionDate, description } = req.body;

  if (!title || !location || !completionDate || !description) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // Create slug from title
  const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

  // Update project basic info
  db.query(
    'UPDATE projects SET title = ?, slug = ?, location = ?, completion_date = ?, description = ? WHERE id = ?',
    [title, slug, location, completionDate, description, projectId],
    (err, result) => {
      if (err) {
        console.error('Error updating project:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Project not found' });
      }

      // Add new images if any
      const files = req.files || [];
      if (files.length > 0) {
        const imageUrls = files.map(file => `/uploads/${file.filename}`);
        const imageValues = imageUrls.map(url => [projectId, url]);

        // Insert only new images
        db.query(
          'INSERT INTO project_images (project_id, image_url) VALUES ?',
          [imageValues],
          (err) => {
            if (err) {
              console.error('Error saving new project images:', err);
              // Continue anyway
            }
          }
        );
      }

      // Get all images for the project
      db.query('SELECT * FROM project_images WHERE project_id = ?', [projectId], (err, images) => {
        if (err) {
          console.error('Error fetching updated project images:', err);
          return res.status(500).json({ message: 'Server error' });
        }

        // Return the updated project
        res.json({
          id: parseInt(projectId),
          title,
          slug,
          location,
          completionDate,
          description,
          images: images.map(img => img.image_url)
        });
      });
    }
  );
});

// Delete a single image from a project
app.delete('/api/projects/:projectId/images/:imageId', authenticateToken, (req, res) => {
  const { projectId, imageId } = req.params;

  // First, get the image details to delete the file
  db.query('SELECT * FROM project_images WHERE id = ? AND project_id = ?', [imageId, projectId], (err, images) => {
    if (err) {
      console.error('Error fetching image for deletion:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (images.length === 0) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const image = images[0];

    // Delete the image file from filesystem
    const imagePath = path.join(__dirname, 'public', image.image_url);
    if (fs.existsSync(imagePath)) {
      try {
        fs.unlinkSync(imagePath);
        console.log(`Deleted image file: ${imagePath}`);
      } catch (error) {
        console.error(`Error deleting image file: ${imagePath}`, error);
        // Continue with database deletion anyway
      }
    }

    // Delete the image record from database
    db.query('DELETE FROM project_images WHERE id = ?', [imageId], (err, result) => {
      if (err) {
        console.error('Error deleting image from database:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Image not found in database' });
      }

      res.json({
        message: 'Image deleted successfully',
        imageId: parseInt(imageId)
      });
    });
  });
});

// Delete a project
app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  const projectId = req.params.id;

  // Get project images before deleting
  db.query('SELECT * FROM project_images WHERE project_id = ?', [projectId], (err, images) => {
    if (err) {
      console.error('Error fetching project images for deletion:', err);
      // Continue with deletion anyway
    } else {
      // Delete image files from filesystem
      images.forEach(image => {
        const imagePath = path.join(__dirname, 'public', image.image_url);
        if (fs.existsSync(imagePath)) {
          try {
            fs.unlinkSync(imagePath);
            console.log(`Deleted image file: ${imagePath}`);
          } catch (error) {
            console.error(`Error deleting image file: ${imagePath}`, error);
            // Continue with deletion anyway
          }
        }
      });
    }

    // Delete project (will cascade delete images due to foreign key constraint)
    db.query('DELETE FROM projects WHERE id = ?', [projectId], (err, result) => {
      if (err) {
        console.error('Error deleting project:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Project not found' });
      }

      res.json({ message: 'Project deleted successfully' });
    });
  });
});

// Submit contact form
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ message: 'Name, email, subject, and message are required' });
  }

  db.query(
    'INSERT INTO contact_messages (name, email, phone, subject, message) VALUES (?, ?, ?, ?, ?)',
    [name, email, phone || '', subject, message],
    (err, result) => {
      if (err) {
        console.error('Error saving contact message:', err);
        return res.status(500).json({ message: 'Server error' });
      }

      res.status(201).json({
        id: result.insertId,
        name,
        email,
        phone,
        subject,
        message,
        created_at: new Date()
      });
    }
  );
});

// Get all contact messages
app.get('/api/contact', authenticateToken, (req, res) => {
  db.query('SELECT * FROM contact_messages ORDER BY created_at DESC', (err, messages) => {
    if (err) {
      console.error('Error fetching contact messages:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    res.json(messages);
  });
});

// Mark contact message as read
app.put('/api/contact/:id/read', authenticateToken, (req, res) => {
  const messageId = req.params.id;

  db.query('UPDATE contact_messages SET is_read = 1 WHERE id = ?', [messageId], (err, result) => {
    if (err) {
      console.error('Error marking message as read:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Message marked as read' });
  });
});

// Delete contact message
app.delete('/api/contact/:id', authenticateToken, (req, res) => {
  const messageId = req.params.id;

  db.query('DELETE FROM contact_messages WHERE id = ?', [messageId], (err, result) => {
    if (err) {
      console.error('Error deleting contact message:', err);
      return res.status(500).json({ message: 'Server error' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Message not found' });
    }

    res.json({ message: 'Contact message deleted successfully' });
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

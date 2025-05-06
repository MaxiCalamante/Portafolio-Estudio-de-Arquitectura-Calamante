import { Project } from '@/components/ProjectCard';

const API_URL = 'http://localhost:3000/api';
const SERVER_URL = 'http://localhost:3000';

// Get token from session storage
const getToken = () => sessionStorage.getItem('adminToken');

// Generic fetch function with error handling
async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const token = getToken();

  if (token) {
    options.headers = {
      ...options.headers,
      'Authorization': `Bearer ${token}`
    };
  }

  const response = await fetch(url, options);

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new Error(error.message || 'An error occurred');
  }

  return response.json();
}

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    // Save token to session storage
    sessionStorage.setItem('adminToken', data.token);
    sessionStorage.setItem('adminAuthenticated', 'true');

    return data;
  },

  logout: () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminAuthenticated');
  },

  isAuthenticated: () => {
    return sessionStorage.getItem('adminAuthenticated') === 'true';
  }
};

// Projects API
export const projectsAPI = {
  getAll: async (): Promise<Project[]> => {
    const data = await fetch(`${API_URL}/projects`).then(res => res.json());

    // Transform the data to match the Project type
    return data.map((project: any) => ({
      id: project.id,
      title: project.title,
      slug: project.slug,
      location: project.location,
      completionDate: project.completion_date,
      description: project.description,
      images: project.images ? project.images.map((img: string) =>
        img.startsWith('http') ? img : `${SERVER_URL}${img}`
      ) : []
    }));
  },

  getById: async (id: number): Promise<Project> => {
    const data = await fetch(`${API_URL}/projects/${id}`).then(res => res.json());

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      location: data.location,
      completionDate: data.completion_date,
      description: data.description,
      images: data.images ? data.images.map((img: string) =>
        img.startsWith('http') ? img : `${SERVER_URL}${img}`
      ) : []
    };
  },

  getBySlug: async (slug: string): Promise<Project> => {
    const data = await fetch(`${API_URL}/projects/slug/${slug}`).then(res => res.json());

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      location: data.location,
      completionDate: data.completion_date,
      description: data.description,
      images: data.images ? data.images.map((img: string) =>
        img.startsWith('http') ? img : `${SERVER_URL}${img}`
      ) : []
    };
  },

  create: async (project: Omit<Project, 'id' | 'slug'>, images: File[]): Promise<Project> => {
    const formData = new FormData();

    // Add project data
    formData.append('title', project.title);
    formData.append('location', project.location);
    formData.append('completionDate', project.completionDate);
    formData.append('description', project.description);

    // Add existing image URLs if any
    if (project.images && project.images.length > 0) {
      formData.append('imageUrls', JSON.stringify(project.images));
    }

    // Add new image files if any
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }

    const data = await fetchWithAuth(`${API_URL}/projects`, {
      method: 'POST',
      body: formData
    });

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      location: data.location,
      completionDate: data.completionDate,
      description: data.description,
      images: data.images ? data.images.map((img: string) =>
        img.startsWith('http') ? img : `${SERVER_URL}${img}`
      ) : []
    };
  },

  update: async (id: number, project: Omit<Project, 'slug'>, images: File[]): Promise<Project> => {
    const formData = new FormData();

    // Add project data
    formData.append('title', project.title);
    formData.append('location', project.location);
    formData.append('completionDate', project.completionDate);
    formData.append('description', project.description);

    // Add new image files if any
    if (images && images.length > 0) {
      images.forEach(image => {
        formData.append('images', image);
      });
    }

    const data = await fetchWithAuth(`${API_URL}/projects/${id}`, {
      method: 'PUT',
      body: formData
    });

    return {
      id: data.id,
      title: data.title,
      slug: data.slug,
      location: data.location,
      completionDate: data.completionDate,
      description: data.description,
      images: data.images ? data.images.map((img: string) =>
        img.startsWith('http') ? img : `${SERVER_URL}${img}`
      ) : []
    };
  },

  delete: async (id: number): Promise<void> => {
    await fetchWithAuth(`${API_URL}/projects/${id}`, {
      method: 'DELETE'
    });
  },

  deleteImage: async (projectId: number, imageId: number): Promise<{ imageId: number }> => {
    const data = await fetchWithAuth(`${API_URL}/projects/${projectId}/images/${imageId}`, {
      method: 'DELETE'
    });
    return data;
  }
};

// Contact API
export interface ContactMessage {
  id: number;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const contactAPI = {
  getAll: async (): Promise<ContactMessage[]> => {
    return fetchWithAuth(`${API_URL}/contact`);
  },

  submit: async (message: Omit<ContactMessage, 'id' | 'read' | 'created_at'>): Promise<ContactMessage> => {
    const response = await fetch(`${API_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(message)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to submit contact form');
    }

    return data;
  },

  markAsRead: async (id: number): Promise<void> => {
    await fetchWithAuth(`${API_URL}/contact/${id}/read`, {
      method: 'PUT'
    });
  },

  delete: async (id: number): Promise<void> => {
    await fetchWithAuth(`${API_URL}/contact/${id}`, {
      method: 'DELETE'
    });
  }
};

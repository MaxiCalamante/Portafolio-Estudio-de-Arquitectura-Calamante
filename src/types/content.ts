export type ProjectCategory = 'Residencial' | 'Comercial' | 'Interiores' | 'Reforma' | 'Institucional'
export type ProjectStatus = 'draft' | 'published'

export interface ProjectImageRecord {
  id: number
  project_id: number
  storage_path: string
  alt_text: string
  sort_order: number
  created_at: string
}

export interface ProjectRecord {
  id: number
  slug: string
  title: string
  excerpt: string
  description: string
  location: string
  category: ProjectCategory
  completion_year: number | null
  status: ProjectStatus
  featured: boolean
  sort_order: number
  cover_image_path: string | null
  created_by: string | null
  created_at: string
  updated_at: string
}

export interface ProjectWithImages extends ProjectRecord {
  project_images: ProjectImageRecord[]
}

export type InquiryStatus = 'new' | 'contacted' | 'archived'

export interface InquiryRecord {
  id: number
  name: string
  email: string
  phone: string
  project_type: string
  message: string
  consent: boolean
  status: InquiryStatus
  admin_notes: string
  created_at: string
  updated_at: string
}

import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { publicImageUrl, supabase } from '../../lib/supabase'
import { safeFileName, toSlug } from '../../lib/slug'
import type { ProjectCategory, ProjectStatus, ProjectWithImages } from '../../types/content'

const categories: ProjectCategory[] = ['Residencial', 'Comercial', 'Interiores', 'Reforma', 'Institucional']

interface ProjectFormState {
  title: string
  slug: string
  excerpt: string
  description: string
  location: string
  category: ProjectCategory
  completionYear: string
  status: ProjectStatus
  featured: boolean
  sortOrder: string
}

const emptyForm: ProjectFormState = {
  title: '',
  slug: '',
  excerpt: '',
  description: '',
  location: 'Tandil, Buenos Aires',
  category: 'Residencial',
  completionYear: '',
  status: 'draft',
  featured: false,
  sortOrder: '0',
}

export function ProjectManager() {
  const [projects, setProjects] = useState<ProjectWithImages[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<ProjectWithImages | 'new' | null>(null)
  const [error, setError] = useState('')

  const loadProjects = useCallback(async () => {
    if (!supabase) return
    const { data, error: queryError } = await supabase
      .from('projects')
      .select('*, project_images(*)')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (queryError) setError(queryError.message)
    setProjects((data as ProjectWithImages[] | null) ?? [])
    setLoading(false)
  }, [])

  // Data fetching is the external synchronization owned by this effect.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadProjects() }, [loadProjects])

  async function deleteProject(project: ProjectWithImages) {
    if (!supabase || !window.confirm(`¿Eliminar “${project.title}” y todas sus imágenes?`)) return
    setError('')
    const paths = project.project_images.map((image) => image.storage_path)
    if (project.cover_image_path && !paths.includes(project.cover_image_path)) paths.push(project.cover_image_path)
    if (paths.length) await supabase.storage.from('project-images').remove(paths)
    const { error: deleteError } = await supabase.from('projects').delete().eq('id', project.id)
    if (deleteError) setError(deleteError.message)
    else await loadProjects()
  }

  return (
    <section className="admin-section">
      <div className="admin-section__header">
        <div>
          <p className="admin-kicker">Portfolio</p>
          <h1>Proyectos</h1>
          <p>Creá borradores, ordená el portfolio y publicá cuando esté listo.</p>
        </div>
        <button className="admin-button admin-button--primary" type="button" onClick={() => setEditing('new')}>Nuevo proyecto</button>
      </div>

      {error && <div className="admin-alert" role="alert">{error}</div>}
      {loading && <p>Cargando proyectos…</p>}

      {!loading && projects.length === 0 && (
        <div className="admin-empty">
          <h2>Todavía no hay proyectos.</h2>
          <p>Empezá creando el primero como borrador.</p>
        </div>
      )}

      <div className="admin-project-list">
        {projects.map((project) => {
          const cover = publicImageUrl(project.cover_image_path) || publicImageUrl(project.project_images[0]?.storage_path)
          return (
            <article className="admin-project-row" key={project.id}>
              <div className="admin-project-row__image">
                {cover ? <img src={cover} alt="" /> : <span>Sin foto</span>}
              </div>
              <div className="admin-project-row__main">
                <span className={`status-dot status-dot--${project.status}`}>{project.status === 'published' ? 'Publicado' : 'Borrador'}</span>
                <h2>{project.title}</h2>
                <p>{project.category} · {project.location}{project.completion_year ? ` · ${project.completion_year}` : ''}</p>
              </div>
              <div className="admin-project-row__meta">
                <span>{project.project_images.length} foto{project.project_images.length === 1 ? '' : 's'}</span>
                <span>Orden {project.sort_order}</span>
              </div>
              <div className="admin-project-row__actions">
                <button type="button" onClick={() => setEditing(project)}>Editar</button>
                <button className="danger-link" type="button" onClick={() => void deleteProject(project)}>Eliminar</button>
              </div>
            </article>
          )
        })}
      </div>

      {editing && (
        <ProjectEditor
          key={editing === 'new' ? 'new' : editing.id}
          project={editing === 'new' ? null : editing}
          onClose={() => setEditing(null)}
          onSaved={async () => { setEditing(null); await loadProjects() }}
        />
      )}
    </section>
  )
}

function ProjectEditor({ project, onClose, onSaved }: { project: ProjectWithImages | null; onClose: () => void; onSaved: () => Promise<void> }) {
  const [form, setForm] = useState<ProjectFormState>(() => project ? projectToForm(project) : emptyForm)
  const [files, setFiles] = useState<File[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [images, setImages] = useState(project?.project_images ?? [])
  const [coverPath, setCoverPath] = useState(project?.cover_image_path ?? null)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!supabase) return
    setSaving(true)
    setError('')

    const payload = {
      title: form.title.trim(),
      slug: toSlug(form.slug || form.title),
      excerpt: form.excerpt.trim(),
      description: form.description.trim(),
      location: form.location.trim(),
      category: form.category,
      completion_year: form.completionYear ? Number(form.completionYear) : null,
      status: form.status,
      featured: form.featured,
      sort_order: Number(form.sortOrder) || 0,
    }

    const query = project
      ? supabase.from('projects').update(payload).eq('id', project.id).select().single()
      : supabase.from('projects').insert(payload).select().single()
    const { data: savedProject, error: saveError } = await query

    if (saveError || !savedProject) {
      setError(saveError?.message ?? 'No se pudo guardar el proyecto.')
      setSaving(false)
      return
    }

    let nextCoverPath = coverPath
    const newImageRows: Array<{ project_id: number; storage_path: string; alt_text: string; sort_order: number }> = []

    for (const [index, file] of files.entries()) {
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/avif'].includes(file.type) || file.size > 8 * 1024 * 1024) {
        setError(`${file.name}: formato inválido o supera 8 MB.`)
        setSaving(false)
        return
      }
      const path = `${savedProject.id}/${safeFileName(file.name)}`
      const { error: uploadError } = await supabase.storage.from('project-images').upload(path, file, { cacheControl: '31536000', upsert: false })
      if (uploadError) {
        setError(`No se pudo subir ${file.name}: ${uploadError.message}`)
        setSaving(false)
        return
      }
      if (!nextCoverPath) nextCoverPath = path
      newImageRows.push({ project_id: savedProject.id, storage_path: path, alt_text: form.title.trim(), sort_order: images.length + index })
    }

    if (newImageRows.length) {
      const { error: imageError } = await supabase.from('project_images').insert(newImageRows)
      if (imageError) {
        await supabase.storage.from('project-images').remove(newImageRows.map((row) => row.storage_path))
        setError(imageError.message)
        setSaving(false)
        return
      }
    }

    if (nextCoverPath !== savedProject.cover_image_path) {
      await supabase.from('projects').update({ cover_image_path: nextCoverPath }).eq('id', savedProject.id)
    }

    await onSaved()
  }

  async function removeImage(imageId: number, storagePath: string) {
    if (!supabase || !window.confirm('¿Eliminar esta imagen?')) return
    await supabase.storage.from('project-images').remove([storagePath])
    const { error: deleteError } = await supabase.from('project_images').delete().eq('id', imageId)
    if (deleteError) { setError(deleteError.message); return }
    const remaining = images.filter((image) => image.id !== imageId)
    setImages(remaining)
    if (project && coverPath === storagePath) {
      const nextPath = remaining[0]?.storage_path ?? null
      await supabase.from('projects').update({ cover_image_path: nextPath }).eq('id', project.id)
      setCoverPath(nextPath)
    }
  }

  async function setCover(storagePath: string) {
    if (!supabase || !project) return
    const { error: coverError } = await supabase.from('projects').update({ cover_image_path: storagePath }).eq('id', project.id)
    if (coverError) setError(coverError.message)
    else setCoverPath(storagePath)
  }

  return (
    <div className="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="editor-title">
      <div className="admin-drawer__backdrop" onClick={onClose} />
      <div className="admin-drawer__panel">
        <div className="admin-drawer__header">
          <div><p className="admin-kicker">{project ? 'Editar' : 'Nuevo'}</p><h2 id="editor-title">{project?.title || 'Proyecto'}</h2></div>
          <button type="button" onClick={onClose}>Cerrar</button>
        </div>
        <form className="admin-form project-editor" onSubmit={handleSubmit}>
          <label>Título<input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value, slug: project ? form.slug : toSlug(event.target.value) })} required minLength={2} maxLength={120} /></label>
          <label>URL amigable<input value={form.slug} onChange={(event) => setForm({ ...form, slug: toSlug(event.target.value) })} required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" /></label>
          <div className="admin-form__grid">
            <label>Categoría<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value as ProjectCategory })}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
            <label>Año<input type="number" min="1950" max="2100" value={form.completionYear} onChange={(event) => setForm({ ...form, completionYear: event.target.value })} /></label>
          </div>
          <label>Ubicación<input value={form.location} onChange={(event) => setForm({ ...form, location: event.target.value })} required maxLength={160} /></label>
          <label>Resumen<textarea value={form.excerpt} onChange={(event) => setForm({ ...form, excerpt: event.target.value })} maxLength={280} rows={3} /></label>
          <label>Descripción<textarea value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} maxLength={12000} rows={8} /></label>
          <div className="admin-form__grid">
            <label>Estado<select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as ProjectStatus })}><option value="draft">Borrador</option><option value="published">Publicado</option></select></label>
            <label>Orden<input type="number" value={form.sortOrder} onChange={(event) => setForm({ ...form, sortOrder: event.target.value })} /></label>
          </div>
          <label className="admin-checkbox"><input type="checkbox" checked={form.featured} onChange={(event) => setForm({ ...form, featured: event.target.checked })} /><span>Proyecto destacado</span></label>

          {images.length > 0 && (
            <div className="admin-image-grid">
              {images.map((image) => {
                const url = publicImageUrl(image.storage_path)
                return (
                  <div key={image.id} className="admin-image-item">
                    {url && <img src={url} alt={image.alt_text} />}
                    <div>
                      <button type="button" onClick={() => void setCover(image.storage_path)}>{coverPath === image.storage_path ? 'Portada actual' : 'Usar de portada'}</button>
                      <button className="danger-link" type="button" onClick={() => void removeImage(image.id, image.storage_path)}>Eliminar</button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <label className="admin-file-input">Agregar imágenes<input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={(event) => setFiles(Array.from(event.target.files ?? []))} /><span>JPG, PNG, WebP o AVIF · Máximo 8 MB cada una</span></label>
          {files.length > 0 && <p>{files.length} archivo{files.length === 1 ? '' : 's'} listo{files.length === 1 ? '' : 's'} para subir.</p>}
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="admin-form__actions"><button type="button" onClick={onClose}>Cancelar</button><button className="admin-button admin-button--primary" type="submit" disabled={saving}>{saving ? 'Guardando…' : 'Guardar proyecto'}</button></div>
        </form>
      </div>
    </div>
  )
}

function projectToForm(project: ProjectWithImages): ProjectFormState {
  return {
    title: project.title,
    slug: project.slug,
    excerpt: project.excerpt,
    description: project.description,
    location: project.location,
    category: project.category,
    completionYear: project.completion_year?.toString() ?? '',
    status: project.status,
    featured: project.featured,
    sortOrder: project.sort_order.toString(),
  }
}

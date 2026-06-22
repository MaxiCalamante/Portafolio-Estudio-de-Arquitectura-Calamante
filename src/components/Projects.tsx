import { useEffect, useMemo, useState } from 'react'
import { ArrowIcon } from './ArrowIcon'
import { fallbackProjects } from '../data/site'
import { publicImageUrl, supabase } from '../lib/supabase'
import type { ProjectWithImages } from '../types/content'

const baseCategories = ['Todos', 'Residencial', 'Comercial', 'Interiores', 'Reforma', 'Institucional']

export function Projects() {
  const [projects, setProjects] = useState<ProjectWithImages[]>([])
  const [loading, setLoading] = useState(Boolean(supabase))
  const [category, setCategory] = useState('Todos')
  const [selected, setSelected] = useState<ProjectWithImages | null>(null)

  useEffect(() => {
    let active = true
    async function loadProjects() {
      if (!supabase) return
      const { data } = await supabase
        .from('projects')
        .select('*, project_images(*)')
        .eq('status', 'published')
        .order('featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (active) {
        setProjects((data as ProjectWithImages[] | null) ?? [])
        setLoading(false)
      }
    }
    void loadProjects()
    return () => { active = false }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', Boolean(selected))
    return () => document.body.classList.remove('modal-open')
  }, [selected])

  const availableCategories = useMemo(() => {
    if (!projects.length) return baseCategories.slice(0, 4)
    return baseCategories.filter((item) => item === 'Todos' || projects.some((project) => project.category === item))
  }, [projects])

  const visibleProjects = useMemo(
    () => projects.filter((project) => category === 'Todos' || project.category === category),
    [category, projects],
  )

  const showFallback = !loading && projects.length === 0

  return (
    <section className="projects section-shell" id="proyectos">
      <div className="projects__intro reveal">
        <div>
          <h2>Obras pensadas<br />para su contexto.</h2>
          <p>Cada proyecto nace de una conversación, una necesidad concreta y una lectura sensible del lugar.</p>
        </div>
        <div className="project-filters" role="group" aria-label="Filtrar tipos de proyecto">
          {availableCategories.map((item) => (
            <button
              className={item === category ? 'is-active' : ''}
              type="button"
              key={item}
              aria-pressed={item === category}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="portfolio-loading">Cargando proyectos…</p>}

      {!showFallback && !loading && (
        <div className={`project-grid project-grid--${visibleProjects.length}`} aria-live="polite">
          {visibleProjects.map((project, index) => {
            const cover = publicImageUrl(project.cover_image_path) || publicImageUrl(project.project_images[0]?.storage_path)
            return (
              <button
                className={`project project--${index === 0 ? 'wide' : 'portrait'} reveal`}
                key={project.id}
                type="button"
                onClick={() => setSelected(project)}
              >
                <span className="project__media">
                  {cover ? <img src={cover} alt={project.project_images[0]?.alt_text || project.title} loading="lazy" /> : <span className="project__placeholder">Sin imagen</span>}
                </span>
                <span className="project__caption">
                  <span>
                    <strong>{project.title}</strong>
                    <small>{project.category} · {project.location}</small>
                  </span>
                  <ArrowIcon />
                </span>
              </button>
            )
          })}
        </div>
      )}

      {showFallback && (
        <>
          <div className="project-grid project-grid--3">
            {fallbackProjects.map((project) => (
              <article className={`project project--${project.size} reveal`} key={project.title}>
                <div className="project__media"><img src={project.image} alt={project.alt} loading="lazy" /></div>
                <div className="project__caption">
                  <div><strong>{project.title}</strong><small>{project.category} · {project.location}</small></div>
                </div>
              </article>
            ))}
          </div>
          <p className="editorial-note">Imágenes conceptuales de dirección visual. Las obras publicadas desde el panel reemplazan automáticamente esta selección.</p>
        </>
      )}

      {selected && <ProjectDialog project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

function ProjectDialog({ project, onClose }: { project: ProjectWithImages; onClose: () => void }) {
  const images = [...project.project_images].sort((a, b) => a.sort_order - b.sort_order)
  const displayImages = images.length ? images : project.cover_image_path ? [{ id: -1, storage_path: project.cover_image_path, alt_text: project.title }] : []

  return (
    <div className="project-dialog" role="dialog" aria-modal="true" aria-labelledby="project-dialog-title" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="project-dialog__panel">
        <button className="project-dialog__close" type="button" onClick={onClose} aria-label="Cerrar proyecto">Cerrar</button>
        <div className="project-dialog__header">
          <div>
            <p>{project.category} · {project.location}{project.completion_year ? ` · ${project.completion_year}` : ''}</p>
            <h2 id="project-dialog-title">{project.title}</h2>
          </div>
          {project.excerpt && <p className="project-dialog__excerpt">{project.excerpt}</p>}
        </div>
        {project.description && <p className="project-dialog__description">{project.description}</p>}
        <div className="project-dialog__gallery">
          {displayImages.map((image) => {
            const url = publicImageUrl(image.storage_path)
            return url ? <img key={image.id} src={url} alt={image.alt_text || project.title} /> : null
          })}
        </div>
      </div>
    </div>
  )
}

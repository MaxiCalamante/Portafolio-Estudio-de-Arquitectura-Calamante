import { useEffect, useMemo, useState, useCallback } from 'react'
import { ArrowIcon } from './ArrowIcon'
import { WhatsAppIcon } from './WhatsAppIcon'
import { realProjects, contact } from '../data/site'
import { publicImageUrl, supabase } from '../lib/supabase'
import type { ProjectWithImages } from '../types/content'

const baseCategories = ['Todos', 'Residencial', 'Comercial', 'Interiores', 'Reforma', 'Institucional']

export function Projects() {
  const [projects, setProjects] = useState<ProjectWithImages[]>(realProjects)
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('Todos')
  const [selected, setSelected] = useState<ProjectWithImages | null>(null)

  useEffect(() => {
    let active = true
    async function loadSupabaseProjects() {
      if (!supabase) return
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*, project_images(*)')
          .eq('status', 'published')
          .order('featured', { ascending: false })
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: false })

        if (active && !error && data && data.length > 0) {
          setProjects(data as ProjectWithImages[])
        }
      } catch {
        // Fallback to realProjects seamlessly
      } finally {
        if (active) setLoading(false)
      }
    }
    void loadSupabaseProjects()
    return () => { active = false }
  }, [])

  useEffect(() => {
    document.body.classList.toggle('modal-open', Boolean(selected))
    return () => document.body.classList.remove('modal-open')
  }, [selected])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { Todos: projects.length }
    projects.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1
    })
    return counts
  }, [projects])

  const availableCategories = useMemo(() => {
    return baseCategories.filter((item) => item === 'Todos' || (categoryCounts[item] && categoryCounts[item] > 0))
  }, [categoryCounts])

  const visibleProjects = useMemo(
    () => projects.filter((project) => category === 'Todos' || project.category === category),
    [category, projects],
  )

  return (
    <section className="projects section-shell" id="proyectos">
      <div className="projects__intro reveal">
        <div>
          <span className="section-eyebrow">Colección de Obras Realizadas</span>
          <h2>Arquitectura con identidad,<br />oficio y permanencia.</h2>
          <p>
            Viviendas unifamiliares en las sierras, edificios de propiedad horizontal, espacios de trabajo y reformas integrales en Tandil. Obras concebidas con respeto por el asoleamiento, pureza formal y materiales nobles que dialogan con el entorno.
          </p>
        </div>
        <div className="project-filters" role="group" aria-label="Filtrar por tipología arquitectónica">
          {availableCategories.map((item) => (
            <button
              className={`project-filter-btn ${item === category ? 'is-active' : ''}`}
              type="button"
              key={item}
              aria-pressed={item === category}
              onClick={() => setCategory(item)}
            >
              <span>{item === 'Todos' ? 'Todas las Obras' : item}</span>
              <span className="filter-count">({categoryCounts[item] ?? 0})</span>
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="portfolio-loading">Actualizando colección…</p>}

      <div className="project-mosaic" aria-live="polite">
        {visibleProjects.map((project, index) => {
          const cover = publicImageUrl(project.cover_image_path) || publicImageUrl(project.project_images[0]?.storage_path)
          const photoCount = project.project_images?.length || (project.cover_image_path ? 1 : 0)
          const isLarge = index === 0 || index % 5 === 0

          return (
            <article
              className={`project-card ${isLarge ? 'project-card--large' : 'project-card--standard'}`}
              key={`${category}-${project.id || project.slug}`}
            >
              <button
                className="project-card__clickable"
                type="button"
                onClick={() => setSelected(project)}
                aria-label={`Ver ficha técnica y fotografías de ${project.title}`}
              >
                <div className="project-card__media">
                  {cover ? (
                    <img
                      src={cover}
                      alt={project.project_images?.[0]?.alt_text || `${project.title} - Arquitecto Javier Calamante en Tandil`}
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <div className="project__placeholder">Sin imagen disponible</div>
                  )}

                  <div className="project-card__badge-row">
                    <span className="badge badge--category">{project.category}</span>
                    {project.completion_year && <span className="badge badge--year">{project.completion_year}</span>}
                    {project.surface && <span className="badge badge--surface">{project.surface}</span>}
                  </div>

                  <div className="project-card__photo-count">
                    <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                      <circle cx="8.5" cy="8.5" r="1.5"/>
                      <polyline points="21 15 16 10 5 21"/>
                    </svg>
                    <span>{photoCount} {photoCount === 1 ? 'fotografía' : 'fotografías'}</span>
                  </div>
                </div>

                <div className="project-card__content">
                  <div className="project-card__header">
                    <div>
                      <h3 className="project-card__title">{project.title}</h3>
                      <p className="project-card__location">{project.location}</p>
                    </div>
                    <span className="project-card__explore-btn" aria-hidden="true">
                      <span>Ver ficha</span>
                      <ArrowIcon />
                    </span>
                  </div>

                  {project.materials && (
                    <p className="project-card__materials">
                      <span>Materiales:</span> {project.materials}
                    </p>
                  )}

                  {project.excerpt && <p className="project-card__excerpt">{project.excerpt}</p>}
                </div>
              </button>
            </article>
          )
        })}
      </div>

      <div className="projects__bottom-note reveal">
        <div className="projects__bottom-note-text">
          <span className="section-eyebrow">Construcción & Asesoramiento</span>
          <h3>¿Tenés un terreno o un proyecto en mente en Tandil?</h3>
          <p>
            Coordinamos una primera reunión en el estudio o visitamos tu lote para evaluar asoleamiento, cotas de nivel y factibilidad reglamentaria sin compromiso.
          </p>
        </div>
        <div className="projects__bottom-note-actions">
          <a className="button button--primary" href="#contacto">
            Iniciar Consulta Técnica
          </a>
          <a
            className="button button--whatsapp-secondary"
            href={contact.whatsappHref}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={16} />
            <span>Conversar por WhatsApp</span>
          </a>
        </div>
      </div>

      {selected && <ProjectDialog project={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}

function ProjectDialog({ project, onClose }: { project: ProjectWithImages; onClose: () => void }) {
  const images = useMemo(() => {
    const sorted = [...(project.project_images || [])].sort((a, b) => a.sort_order - b.sort_order)
    if (sorted.length > 0) return sorted
    if (project.cover_image_path) {
      return [{ id: -1, project_id: project.id, storage_path: project.cover_image_path, alt_text: project.title, sort_order: 1, created_at: '' }]
    }
    return []
  }, [project])

  const [activeImageIdx, setActiveImageIdx] = useState(0)
  const [touchStartX, setTouchStartX] = useState<number | null>(null)
  const [touchDeltaX, setTouchDeltaX] = useState<number>(0)

  const handleNext = useCallback(() => {
    if (images.length <= 1) return
    setActiveImageIdx((prev) => (prev + 1) % images.length)
  }, [images.length])

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return
    setActiveImageIdx((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  useEffect(() => {
    setActiveImageIdx(0)
  }, [project])

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX)
    setTouchDeltaX(0)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX !== null) {
      setTouchDeltaX(e.targetTouches[0].clientX - touchStartX)
    }
  }

  const handleTouchEnd = () => {
    if (touchStartX === null) return
    const minSwipeDistance = 40
    if (touchDeltaX < -minSwipeDistance) {
      handleNext()
    } else if (touchDeltaX > minSwipeDistance) {
      handlePrev()
    }
    setTouchStartX(null)
    setTouchDeltaX(0)
  }

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      if (event.key === 'ArrowRight') handleNext()
      if (event.key === 'ArrowLeft') handlePrev()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose, handleNext, handlePrev])

  const currentImage = images[activeImageIdx]
  const currentImageUrl = currentImage ? publicImageUrl(currentImage.storage_path) : null

  const whatsappMessage = encodeURIComponent(
    `Hola Arq. Javier Calamante, estuve viendo la obra "${project.title}" (${project.category}, ${project.location}) en su sitio web y me gustaría consultarle por un proyecto de características similares.`,
  )
  const whatsappUrl = `https://wa.me/5492494543936?text=${whatsappMessage}`

  return (
    <div
      className="project-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="project-dialog-title"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className="project-dialog__panel">
        <header className="project-dialog__topbar">
          <div className="project-dialog__meta">
            <span className="badge badge--category">{project.category}</span>
            <span className="project-dialog__loc">{project.location}</span>
            {project.completion_year && <span className="project-dialog__year">· Año {project.completion_year}</span>}
          </div>
          <div className="project-dialog__top-actions">
            <span className="project-dialog__keyboard-hint">Teclas ← → para navegar · Esc para cerrar</span>
            <button
              className="project-dialog__close"
              type="button"
              onClick={onClose}
              aria-label="Cerrar visor de obra"
            >
              <span aria-hidden="true">&times;</span>
              <span>Cerrar</span>
            </button>
          </div>
        </header>

        <div className="project-dialog__body">
          <div className="project-dialog__main-col">
            {currentImageUrl ? (
              <div className="dialog-viewer">
                <div
                  className="dialog-viewer__stage"
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleTouchEnd}
                >
                  <img
                    key={currentImage.id}
                    src={currentImageUrl}
                    alt={currentImage.alt_text || project.title}
                    decoding="async"
                  />
                  {images.length > 1 && (
                    <>
                      <button
                        className="dialog-viewer__nav dialog-viewer__nav--prev"
                        type="button"
                        onClick={handlePrev}
                        aria-label="Fotografía anterior"
                      >
                        &#8249;
                      </button>
                      <button
                        className="dialog-viewer__nav dialog-viewer__nav--next"
                        type="button"
                        onClick={handleNext}
                        aria-label="Fotografía siguiente"
                      >
                        &#8250;
                      </button>
                    </>
                  )}
                </div>

                <div className="dialog-viewer__footer">
                  <p className="dialog-viewer__caption">
                    {currentImage.alt_text || project.title}
                  </p>
                  <span className="dialog-viewer__counter">
                    {activeImageIdx + 1} de {images.length}
                  </span>
                </div>

                {images.length > 1 && (
                  <div className="dialog-viewer__thumbs" role="tablist" aria-label="Fotografías de la obra">
                    {images.map((img, idx) => {
                      const thumbUrl = publicImageUrl(img.storage_path)
                      if (!thumbUrl) return null
                      return (
                        <button
                          key={img.id || idx}
                          type="button"
                          className={`thumb-btn ${idx === activeImageIdx ? 'is-active' : ''}`}
                          onClick={() => setActiveImageIdx(idx)}
                          aria-label={`Ver fotografía ${idx + 1}`}
                          aria-selected={idx === activeImageIdx}
                        >
                          <img src={thumbUrl} alt="" loading="lazy" />
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            ) : (
              <div className="dialog-viewer__stage">
                <p style={{ color: 'var(--muted)', margin: 0 }}>Fotografías en preparación para esta obra.</p>
              </div>
            )}
          </div>

          <aside className="project-dialog__sidebar">
            <div>
              <span className="section-eyebrow">Ficha de Obra</span>
              <h2 id="project-dialog-title" className="project-dialog__title">
                {project.title}
              </h2>
            </div>

            {project.excerpt && (
              <p className="project-dialog__lead">{project.excerpt}</p>
            )}

            <div className="project-dialog__specs">
              <h3>Ficha Técnica & Datos Constructivos</h3>
              <dl>
                <div>
                  <dt>Tipología</dt>
                  <dd>{project.category}</dd>
                </div>
                <div>
                  <dt>Ubicación</dt>
                  <dd>{project.location}</dd>
                </div>
                {project.completion_year && (
                  <div>
                    <dt>Año de Ejecución</dt>
                    <dd>{project.completion_year}</dd>
                  </div>
                )}
                {project.surface && (
                  <div>
                    <dt>Superficie</dt>
                    <dd>{project.surface}</dd>
                  </div>
                )}
                {project.materials && (
                  <div className="project-dialog__specs-full">
                    <dt>Materialidad Predominante</dt>
                    <dd>{project.materials}</dd>
                  </div>
                )}
                <div className="project-dialog__specs-full">
                  <dt>Proyecto & Dirección de Obra</dt>
                  <dd>Arq. Javier Calamante (C.A.P.B.A. Matr. Nº 15327 · Distrito VIII)</dd>
                </div>
              </dl>
            </div>

            {project.description && (
              <div className="project-dialog__text">
                <h3>Memoria Arquitectónica</h3>
                <p>{project.description}</p>
              </div>
            )}

            <div className="project-dialog__cta-box">
              <h4>¿Pensás proyectar o construir en Tandil?</h4>
              <p>Podemos conversar sobre tus requerimientos, tiempos y costos estimados para una obra con este nivel de rigor.</p>
              <div className="project-dialog__cta-actions">
                <a
                  className="button button--whatsapp"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <WhatsAppIcon size={16} />
                  <span>Consultar por esta obra</span>
                </a>
                <a className="button button--secondary" href="#contacto" onClick={onClose}>
                  Enviar consulta por la web
                </a>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}

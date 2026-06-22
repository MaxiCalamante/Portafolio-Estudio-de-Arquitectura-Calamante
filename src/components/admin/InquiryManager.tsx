import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { InquiryRecord, InquiryStatus } from '../../types/content'

const statusLabels: Record<InquiryStatus, string> = { new: 'Nueva', contacted: 'Contactada', archived: 'Archivada' }

export function InquiryManager() {
  const [inquiries, setInquiries] = useState<InquiryRecord[]>([])
  const [filter, setFilter] = useState<'all' | InquiryStatus>('all')
  const [selected, setSelected] = useState<InquiryRecord | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadInquiries = useCallback(async () => {
    if (!supabase) return
    const { data, error: queryError } = await supabase.from('inquiries').select('*').order('created_at', { ascending: false })
    if (queryError) setError(queryError.message)
    setInquiries((data as InquiryRecord[] | null) ?? [])
    setLoading(false)
  }, [])

  // Data fetching is the external synchronization owned by this effect.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { void loadInquiries() }, [loadInquiries])

  const visible = useMemo(() => inquiries.filter((inquiry) => filter === 'all' || inquiry.status === filter), [filter, inquiries])

  async function updateInquiry(inquiry: InquiryRecord, changes: Partial<Pick<InquiryRecord, 'status' | 'admin_notes'>>) {
    if (!supabase) return
    const { error: updateError } = await supabase.from('inquiries').update(changes).eq('id', inquiry.id)
    if (updateError) { setError(updateError.message); return }
    const updated = { ...inquiry, ...changes }
    setInquiries((items) => items.map((item) => item.id === inquiry.id ? updated : item))
    setSelected(updated)
  }

  async function deleteInquiry(inquiry: InquiryRecord) {
    if (!supabase || !window.confirm(`¿Eliminar definitivamente la consulta de ${inquiry.name}?`)) return
    const { error: deleteError } = await supabase.from('inquiries').delete().eq('id', inquiry.id)
    if (deleteError) setError(deleteError.message)
    else { setSelected(null); await loadInquiries() }
  }

  return (
    <section className="admin-section">
      <div className="admin-section__header">
        <div>
          <p className="admin-kicker">Potenciales clientes</p>
          <h1>Consultas</h1>
          <p>Datos enviados desde el formulario público, ordenados por fecha.</p>
        </div>
        <div className="admin-count">{inquiries.filter((item) => item.status === 'new').length}<span>nuevas</span></div>
      </div>

      <div className="admin-filters" role="group" aria-label="Filtrar consultas">
        {(['all', 'new', 'contacted', 'archived'] as const).map((item) => <button key={item} className={filter === item ? 'is-active' : ''} type="button" onClick={() => setFilter(item)}>{item === 'all' ? 'Todas' : statusLabels[item]}</button>)}
      </div>
      {error && <div className="admin-alert" role="alert">{error}</div>}
      {loading && <p>Cargando consultas…</p>}

      {!loading && visible.length === 0 && <div className="admin-empty"><h2>No hay consultas en esta vista.</h2></div>}
      <div className="inquiry-list">
        {visible.map((inquiry) => (
          <button className="inquiry-row" type="button" key={inquiry.id} onClick={() => setSelected(inquiry)}>
            <span className={`inquiry-row__status inquiry-row__status--${inquiry.status}`}>{statusLabels[inquiry.status]}</span>
            <span><strong>{inquiry.name}</strong><small>{inquiry.project_type}</small></span>
            <span><strong>{inquiry.phone}</strong><small>{inquiry.email}</small></span>
            <time>{new Intl.DateTimeFormat('es-AR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(inquiry.created_at))}</time>
          </button>
        ))}
      </div>

      {selected && (
        <div className="admin-drawer" role="dialog" aria-modal="true" aria-labelledby="inquiry-title">
          <div className="admin-drawer__backdrop" onClick={() => setSelected(null)} />
          <div className="admin-drawer__panel inquiry-detail">
            <div className="admin-drawer__header"><div><p className="admin-kicker">Consulta #{selected.id}</p><h2 id="inquiry-title">{selected.name}</h2></div><button type="button" onClick={() => setSelected(null)}>Cerrar</button></div>
            <div className="inquiry-detail__actions"><a className="admin-button admin-button--primary" href={`tel:${selected.phone}`}>Llamar</a><a className="admin-button" href={`mailto:${selected.email}`}>Enviar email</a></div>
            <dl>
              <div><dt>Teléfono</dt><dd>{selected.phone}</dd></div>
              <div><dt>Email</dt><dd>{selected.email}</dd></div>
              <div><dt>Proyecto</dt><dd>{selected.project_type}</dd></div>
              <div><dt>Fecha</dt><dd>{new Intl.DateTimeFormat('es-AR', { dateStyle: 'full', timeStyle: 'short' }).format(new Date(selected.created_at))}</dd></div>
            </dl>
            <div className="inquiry-detail__message"><h3>Mensaje</h3><p>{selected.message}</p></div>
            <label className="admin-form__label">Estado<select value={selected.status} onChange={(event) => void updateInquiry(selected, { status: event.target.value as InquiryStatus })}><option value="new">Nueva</option><option value="contacted">Contactada</option><option value="archived">Archivada</option></select></label>
            <label className="admin-form__label">Notas privadas<textarea value={selected.admin_notes} onChange={(event) => setSelected({ ...selected, admin_notes: event.target.value })} rows={5} maxLength={4000} /><button className="admin-button" type="button" onClick={() => void updateInquiry(selected, { admin_notes: selected.admin_notes })}>Guardar notas</button></label>
            <button className="danger-link inquiry-detail__delete" type="button" onClick={() => void deleteInquiry(selected)}>Eliminar consulta</button>
          </div>
        </div>
      )}
    </section>
  )
}

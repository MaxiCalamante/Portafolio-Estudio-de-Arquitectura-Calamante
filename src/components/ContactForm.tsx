import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  projectType: 'Consulta general',
  message: '',
  consent: false,
  company: '',
}

export function ContactForm() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (form.company) {
      setStatus('success')
      return
    }
    if (!supabase) {
      setError('El formulario estará disponible al finalizar la conexión de la base de datos.')
      setStatus('error')
      return
    }

    setStatus('sending')
    setError('')
    const { error: submitError } = await supabase.rpc('submit_inquiry', {
      p_name: form.name,
      p_email: form.email,
      p_phone: form.phone,
      p_project_type: form.projectType,
      p_message: form.message,
      p_consent: form.consent,
    })

    if (submitError) {
      setError(submitError.message.includes('Demasiadas') ? submitError.message : 'No pudimos enviar la consulta. Probá nuevamente o escribinos por WhatsApp.')
      setStatus('error')
      return
    }

    setForm(initialForm)
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="contact-form contact-form--success" role="status">
        <p className="contact-form__number">✓</p>
        <h3>Consulta recibida.</h3>
        <p>Gracias por escribirnos. Javier revisará tus datos y se pondrá en contacto.</p>
        <button type="button" onClick={() => setStatus('idle')}>Enviar otra consulta</button>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__heading">
        <p>Contanos lo esencial</p>
        <span>Todos los campos son obligatorios</span>
      </div>
      <div className="contact-form__grid">
        <label>
          Nombre y apellido
          <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} minLength={2} maxLength={120} required autoComplete="name" />
        </label>
        <label>
          Teléfono
          <input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} minLength={6} maxLength={40} required autoComplete="tel" inputMode="tel" />
        </label>
        <label>
          Email
          <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} maxLength={254} required autoComplete="email" />
        </label>
        <label>
          Tipo de proyecto
          <select value={form.projectType} onChange={(event) => setForm({ ...form, projectType: event.target.value })}>
            <option>Vivienda nueva</option>
            <option>Reforma</option>
            <option>Comercial</option>
            <option>Interiores</option>
            <option>Dirección de obra</option>
            <option>Consulta general</option>
          </select>
        </label>
      </div>
      <label>
        Mensaje
        <textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} minLength={10} maxLength={4000} rows={4} required placeholder="Ubicación, necesidades, tiempos aproximados…" />
      </label>
      <label className="contact-form__honeypot" aria-hidden="true">
        Empresa
        <input value={form.company} onChange={(event) => setForm({ ...form, company: event.target.value })} tabIndex={-1} autoComplete="off" />
      </label>
      <label className="contact-form__consent">
        <input type="checkbox" checked={form.consent} onChange={(event) => setForm({ ...form, consent: event.target.checked })} required />
        <span>Acepto que el estudio utilice estos datos exclusivamente para responder mi consulta.</span>
      </label>
      {status === 'error' && <p className="form-error" role="alert">{error}</p>}
      <button className="contact-form__submit" type="submit" disabled={status === 'sending'}>
        {status === 'sending' ? 'Enviando…' : 'Enviar solicitud'}
      </button>
    </form>
  )
}

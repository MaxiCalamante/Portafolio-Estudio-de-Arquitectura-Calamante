import { useState, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { contact } from '../data/site'
import { WhatsAppIcon } from './WhatsAppIcon'

const initialForm = {
  name: '',
  email: '',
  phone: '',
  location: 'Tandil (Zona Urbana / Centro)',
  projectType: 'Vivienda nueva unifamiliar',
  budgetRange: 'Tengo lote y quiero diseñar el proyecto',
  message: '',
  consent: true,
  company: '',
}

export function ContactForm() {
  const [form, setForm] = useState(initialForm)
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle')
  const [error, setError] = useState('')
  const [submittedWaUrl, setSubmittedWaUrl] = useState('')

  function getFormattedWhatsAppUrl(data = form) {
    const text = `Hola Arq. Javier Calamante, mi nombre es ${data.name || 'un interesado'}.
Quisiera consultarle por un proyecto de: *${data.projectType}*.
Ubicación / Zona: ${data.location}.
Estado actual: ${data.budgetRange}.
Teléfono de contacto: ${data.phone || 'No especificado'}.
Email: ${data.email || 'No especificado'}.

Detalle del proyecto:
${data.message || 'Quisiera coordinar una reunión de asesoramiento para conversar ideas y presupuesto.'}`

    return `https://wa.me/5492494543936?text=${encodeURIComponent(text.trim())}`
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (form.company) {
      setStatus('success')
      return
    }

    const waUrl = getFormattedWhatsAppUrl(form)
    setSubmittedWaUrl(waUrl)
    setStatus('sending')
    setError('')

    if (supabase) {
      try {
        const { error: submitError } = await supabase.rpc('submit_inquiry', {
          p_name: form.name,
          p_email: form.email,
          p_phone: form.phone,
          p_project_type: `${form.projectType} (${form.location}) - ${form.budgetRange}`,
          p_message: form.message,
          p_consent: form.consent,
        })

        if (submitError) {
          throw submitError
        }

        setForm(initialForm)
        setStatus('success')
        return
      } catch (err: unknown) {
        console.warn('Supabase submission fallback to WhatsApp', err)
      }
    }

    // Direct fallback: Open WhatsApp with the pre-formatted lead
    window.open(waUrl, '_blank', 'noopener,noreferrer')
    setForm(initialForm)
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="contact-form contact-form--success" role="status">
        <p className="contact-form__number">✓</p>
        <h3>¡Consulta lista!</h3>
        <p>
          Muchas gracias por contactarte. Javier Calamante revisará tu mensaje personalmente a la brevedad para coordinar una reunión de asesoramiento técnico.
        </p>
        <div className="contact-form__success-actions">
          <a
            className="button button--whatsapp"
            href={submittedWaUrl || getFormattedWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={16} />
            <span>Abrir chat de WhatsApp</span>
          </a>
          <button type="button" onClick={() => setStatus('idle')} className="text-button">
            Enviar otra consulta
          </button>
        </div>
      </div>
    )
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
      <div className="contact-form__heading">
        <div>
          <p>Iniciá tu proyecto</p>
          <span className="contact-form__sub">Completá los datos clave para una respuesta personalizada de Javier</span>
        </div>
        <a
          href={contact.whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="badge-direct-wa"
          title="Respuesta directa por WhatsApp"
        >
          <WhatsAppIcon size={14} />
          <span>Atención Directa</span>
        </a>
      </div>

      <div className="contact-form__grid">
        <label>
          Nombre y apellido *
          <input
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            minLength={2}
            maxLength={120}
            required
            autoComplete="name"
            placeholder="Ej. Martín Gómez"
          />
        </label>

        <label>
          Teléfono / WhatsApp *
          <input
            value={form.phone}
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            minLength={6}
            maxLength={40}
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="Ej. 249 454-3936"
          />
        </label>

        <label>
          Correo electrónico *
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            maxLength={254}
            required
            autoComplete="email"
            placeholder="nombre@correo.com"
          />
        </label>

        <label>
          Tipo de proyecto *
          <select
            value={form.projectType}
            onChange={(event) => setForm({ ...form, projectType: event.target.value })}
          >
            <option>Vivienda nueva unifamiliar</option>
            <option>Reforma integral o ampliación</option>
            <option>Edificio residencial / PH</option>
            <option>Local comercial u oficina</option>
            <option>Quincho, pileta o galería</option>
            <option>Diseño y reforma de cocina o baño</option>
            <option>Dirección y supervisión de obra</option>
            <option>Planos municipales y habilitaciones</option>
            <option>Consulta general</option>
          </select>
        </label>

        <label>
          Zona en Tandil / Región
          <select
            value={form.location}
            onChange={(event) => setForm({ ...form, location: event.target.value })}
          >
            <option>Tandil (Zona Urbana / Centro)</option>
            <option>Zona de Quintas / Golf</option>
            <option>Zona Serrana / Don Bosco / El Paraíso</option>
            <option>Cerro Leones / La Elena</option>
            <option>Barrio Cerrado / Club de Campo</option>
            <option>Otra localidad (Prov. Bs. As.)</option>
            <option>Aún no dispongo de lote</option>
          </select>
        </label>

        <label>
          Estado actual de la idea
          <select
            value={form.budgetRange}
            onChange={(event) => setForm({ ...form, budgetRange: event.target.value })}
          >
            <option>Tengo lote y quiero diseñar el proyecto</option>
            <option>Tengo proyecto y busco Dirección de Obra</option>
            <option>Quiero reformar o ampliar mi casa actual</option>
            <option>Estoy evaluando comprar un terreno</option>
            <option>Desarrollo inmobiliario / Inversión</option>
          </select>
        </label>
      </div>

      <label>
        Detalle de lo que imaginás para tu espacio *
        <textarea
          value={form.message}
          onChange={(event) => setForm({ ...form, message: event.target.value })}
          minLength={10}
          maxLength={4000}
          rows={4}
          required
          placeholder="Contanos cuántos ambientes pensás, metros cuadrados aproximados, tiempos deseados o cualquier duda que tengas…"
        />
      </label>

      {/* Honeypot anti-spam */}
      <label className="contact-form__honeypot" aria-hidden="true">
        Empresa
        <input
          value={form.company}
          onChange={(event) => setForm({ ...form, company: event.target.value })}
          tabIndex={-1}
          autoComplete="off"
        />
      </label>

      <label className="contact-form__consent">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => setForm({ ...form, consent: event.target.checked })}
          required
        />
        <span>
          Acepto ser contactado por el Estudio de Arquitectura Javier Calamante para coordinar una reunión de asesoramiento.
        </span>
      </label>

      {status === 'error' && <p className="form-error" role="alert">{error}</p>}

      <div className="contact-form__submit-row">
        <button
          className="contact-form__submit"
          type="submit"
          disabled={status === 'sending'}
        >
          {status === 'sending' ? 'Enviando consulta…' : 'Enviar consulta al estudio'}
        </button>

        <a
          className="button-wa-secondary"
          href={getFormattedWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
        >
          <WhatsAppIcon size={16} />
          <span>Escribir directo por WhatsApp</span>
        </a>
      </div>
    </form>
  )
}

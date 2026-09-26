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
  autoWhatsApp: true,
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

    const phoneClean = contact.phoneHref.replace('tel:', '').replace('+', '')
    return `https://wa.me/${phoneClean}?text=${encodeURIComponent(text.trim())}`
  }

function mapToCanonicalProjectType(projectType: string): string {
  if (projectType.includes('Vivienda')) return 'Vivienda nueva'
  if (projectType.includes('Reforma') || projectType.includes('Quincho')) return 'Reforma'
  if (projectType.includes('Edificio') || projectType.includes('comercial') || projectType.includes('oficina')) return 'Comercial'
  if (projectType.includes('Interiores') || projectType.includes('cocina') || projectType.includes('baño')) return 'Interiores'
  if (projectType.includes('Dirección') || projectType.includes('Planos')) return 'Dirección de obra'
  return 'Consulta general'
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

    const shouldOpenWa = form.autoWhatsApp
    const canonicalProjectType = mapToCanonicalProjectType(form.projectType)
    const enrichedMessage = `[Zona / Ubicación: ${form.location}]
[Situación del proyecto: ${form.budgetRange}]
[Tipología elegida: ${form.projectType}]

Mensaje:
${form.message.trim()}`

    if (supabase) {
      try {
        const { data: inquiryId, error: submitError } = await supabase.rpc('submit_inquiry', {
          p_name: form.name.trim(),
          p_email: form.email.trim(),
          p_phone: form.phone.trim(),
          p_project_type: canonicalProjectType,
          p_message: enrichedMessage,
          p_consent: form.consent,
        })

        if (submitError) {
          throw submitError
        }

        // Notificación en tiempo real al arquitecto (Supabase Edge Function)
        void supabase.functions
          .invoke('notify-inquiry', {
            body: {
              id: inquiryId,
              name: form.name.trim(),
              email: form.email.trim(),
              phone: form.phone.trim(),
              projectType: form.projectType,
              canonicalType: canonicalProjectType,
              location: form.location,
              budgetRange: form.budgetRange,
              message: form.message.trim(),
            },
          })
          .catch(() => {
            // Falla no bloqueante si no está configurada la función
          })

        if (shouldOpenWa) {
          window.open(waUrl, '_blank', 'noopener,noreferrer')
        }
        setForm(initialForm)
        setStatus('success')
        return
      } catch (err: unknown) {
        console.warn('Supabase submission fallback to WhatsApp', err)
        if (shouldOpenWa) {
          window.open(waUrl, '_blank', 'noopener,noreferrer')
          setForm(initialForm)
          setStatus('success')
          return
        }
        setError('Ocurrió un inconveniente al registrar la consulta. Podés comunicarte directamente con Javier por WhatsApp.')
        setStatus('error')
        return
      }
    }

    // Direct fallback: Open WhatsApp with the pre-formatted lead
    if (shouldOpenWa) {
      window.open(waUrl, '_blank', 'noopener,noreferrer')
    }
    setForm(initialForm)
    setStatus('success')
  }

  if (status === 'success') {
    return (
      <div className="contact-form contact-form--success" role="status">
        <p className="contact-form__number">✓</p>
        <h3>¡Consulta registrada con éxito!</h3>
        <p>
          Muchas gracias por contactarte. Javier Calamante revisará tu mensaje personalmente para coordinar una reunión de asesoramiento técnico.
        </p>
        <div className="contact-form__success-actions">
          <a
            className="button button--whatsapp"
            href={submittedWaUrl || getFormattedWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
          >
            <WhatsAppIcon size={16} />
            <span>Continuar por WhatsApp ahora</span>
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
          checked={form.autoWhatsApp}
          onChange={(event) => setForm({ ...form, autoWhatsApp: event.target.checked })}
        />
        <span>
          Abrir chat de WhatsApp al enviar para recibir respuesta directa de Javier.
        </span>
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

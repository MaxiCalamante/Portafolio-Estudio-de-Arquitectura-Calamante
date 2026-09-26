import { useState, useEffect, useRef, type FormEvent } from 'react'
import { supabase } from '../lib/supabase'
import { contact } from '../data/site'
import { WhatsAppIcon } from './WhatsAppIcon'
import { trackLeadSubmitted, trackWhatsAppClick } from '../lib/analytics'

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
  const [diagnosticBadge, setDiagnosticBadge] = useState<string | null>(null)
  const nameInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    function handleApplyDiagnostic(e: Event) {
      const customEvent = e as CustomEvent<{
        situation: string
        location: string
        typology: string
        situationLabel: string
        locationLabel: string
        typologyLabel: string
      }>
      if (!customEvent.detail) return

      const { situation, location, typology, situationLabel, locationLabel, typologyLabel } = customEvent.detail

      let mappedType = 'Vivienda nueva unifamiliar'
      if (typology === 'reforma') mappedType = 'Reforma integral o ampliación'
      else if (typology === 'comercial') mappedType = 'Edificio residencial / PH'

      let mappedLocation = 'Zona Serrana / Don Bosco / El Paraíso'
      if (location === 'golf') mappedLocation = 'Zona de Quintas / Golf'
      else if (location === 'urbana') mappedLocation = 'Tandil (Zona Urbana / Centro)'
      else if (location === 'comercial') mappedLocation = 'Tandil (Zona Urbana / Centro)'

      let mappedBudget = 'Tengo lote y quiero diseñar el proyecto'
      if (situation === 'buscando-lote') mappedBudget = 'Estoy evaluando comprar un terreno'
      else if (situation === 'reforma') mappedBudget = 'Quiero reformar o ampliar mi casa actual'

      const prefilledMsg = `Hola Javier, completé el diagnóstico técnico preliminar en la web para un proyecto de ${typologyLabel} en ${locationLabel} (${situationLabel}). Quisiera coordinar una reunión de asesoramiento para analizar el terreno y evaluar el proyecto.`

      setForm((prev) => ({
        ...prev,
        projectType: mappedType,
        location: mappedLocation,
        budgetRange: mappedBudget,
        message: prefilledMsg,
      }))

      setDiagnosticBadge(`Diagnóstico cargado: ${typologyLabel} · ${locationLabel}`)

      setTimeout(() => {
        nameInputRef.current?.focus()
      }, 450)
    }

    window.addEventListener('apply-diagnostic', handleApplyDiagnostic)
    return () => window.removeEventListener('apply-diagnostic', handleApplyDiagnostic)
  }, [])

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

        trackLeadSubmitted({
          projectType: form.projectType,
          canonicalType: canonicalProjectType,
          location: form.location,
          budgetRange: form.budgetRange,
          autoWhatsApp: shouldOpenWa,
        })

        if (shouldOpenWa) {
          trackWhatsAppClick('contact_success_screen', { auto: true })
          window.open(waUrl, '_blank', 'noopener,noreferrer')
        }
        setForm(initialForm)
        setStatus('success')
        return
      } catch (err: unknown) {
        console.warn('Supabase submission fallback to WhatsApp', err)
        trackLeadSubmitted({
          projectType: form.projectType,
          canonicalType: canonicalProjectType,
          location: form.location,
          budgetRange: form.budgetRange,
          fallback: true,
        })
        if (shouldOpenWa) {
          trackWhatsAppClick('contact_success_screen', { auto: true, fallback: true })
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

    trackLeadSubmitted({
      projectType: form.projectType,
      canonicalType: canonicalProjectType,
      location: form.location,
      budgetRange: form.budgetRange,
      direct: true,
    })

    // Direct fallback: Open WhatsApp with the pre-formatted lead
    if (shouldOpenWa) {
      trackWhatsAppClick('contact_success_screen', { auto: true, direct: true })
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
            onClick={() => trackWhatsAppClick('contact_success_screen')}
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
          onClick={() => trackWhatsAppClick('contact_direct_badge')}
        >
          <WhatsAppIcon size={14} />
          <span>Atención Directa</span>
        </a>
      </div>

      {diagnosticBadge && (
        <div className="contact-form__diagnostic-notice" role="status">
          <span className="contact-form__diagnostic-notice-text">
            <strong>✓ Parámetros cargados:</strong> {diagnosticBadge}
          </span>
          <button
            type="button"
            className="contact-form__diagnostic-notice-close"
            onClick={() => setDiagnosticBadge(null)}
            aria-label="Cerrar aviso"
          >
            ×
          </button>
        </div>
      )}

      <div className="contact-form__grid">
        <label>
          Nombre y apellido *
          <input
            ref={nameInputRef}
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

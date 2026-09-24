import { useEffect } from 'react'
import { Link } from 'react-router-dom'

export function PrivacyPage() {
  useEffect(() => {
    document.title = 'Privacidad · Estudio Javier Calamante'
    document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, follow')
  }, [])

  return (
    <main className="legal-page">
      <Link className="legal-page__brand" to="/">Javier Calamante / Arquitecto</Link>
      <article>
        <p className="admin-kicker">Información de privacidad</p>
        <h1>Cómo usamos tus datos.</h1>
        <p>Los datos enviados mediante el formulario se utilizan únicamente para evaluar y responder consultas vinculadas con servicios de arquitectura.</p>
        <h2>Datos recopilados</h2>
        <p>Nombre, email, teléfono, tipo de proyecto, mensaje y fecha de envío.</p>
        <h2>Acceso y conservación</h2>
        <p>La información queda disponible sólo para el responsable autorizado del Estudio Javier Calamante y se conserva mientras sea necesaria para gestionar la consulta o la relación profesional.</p>
        <h2>Tus derechos</h2>
        <p>Podés solicitar acceso, corrección o eliminación de tus datos escribiendo a <a href="mailto:javiercalamantetandil@gmail.com">javiercalamantetandil@gmail.com</a>.</p>
        <h2>Responsable</h2>
        <p>Estudio Javier Calamante · Maipú 710, Oficina 2, Tandil, Buenos Aires, Argentina.</p>
        <Link className="text-link" to="/">Volver al sitio</Link>
      </article>
    </main>
  )
}

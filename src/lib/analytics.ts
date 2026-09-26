// Telemetría unificada de eventos comerciales y atribución de conversión
// Soporta Google Tag Manager (dataLayer), GA4 (gtag), Meta Pixel (fbq) y persistencia local para métricas directas.

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>
    gtag?: (command: string, action: string, params?: Record<string, unknown>) => void
    fbq?: (action: string, eventName: string, params?: Record<string, unknown>) => void
  }
}

export type WhatsAppSource =
  | 'floating_button'
  | 'header_cta'
  | 'project_dialog'
  | 'project_card'
  | 'diagnostic_result'
  | 'contact_direct_badge'
  | 'contact_quick_action'
  | 'contact_success_screen'
  | 'footer_link'

interface AnalyticsStore {
  whatsappClicks: Record<string, number>
  projectsViewed: Record<string, number>
  diagnosticsCompleted: number
  leadsSubmitted: number
  lastUpdated: string
}

const STORAGE_KEY = 'jc_analytics_store'

function getStore(): AnalyticsStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as AnalyticsStore
  } catch {
    // Fallback si localStorage falla
  }
  return {
    whatsappClicks: {},
    projectsViewed: {},
    diagnosticsCompleted: 0,
    leadsSubmitted: 0,
    lastUpdated: new Date().toISOString(),
  }
}

function saveStore(store: AnalyticsStore) {
  try {
    store.lastUpdated = new Date().toISOString()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // Ignorar si storage está deshabilitado
  }
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  const timestamp = new Date().toISOString()
  const payload = { ...params, timestamp }

  // 1. Google Tag Manager
  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: eventName, ...payload })
  }

  // 2. Google Analytics 4
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, payload)
  }

  // 3. Meta Pixel
  if (typeof window !== 'undefined' && typeof window.fbq === 'function') {
    window.fbq('trackCustom', eventName, payload)
  }

  // 4. Registro interno para trazabilidad sin dependencias
  try {
    const store = getStore()
    if (eventName === 'whatsapp_click') {
      const src = String(params.source || 'other')
      store.whatsappClicks[src] = (store.whatsappClicks[src] || 0) + 1
    } else if (eventName === 'project_viewed') {
      const slug = String(params.slug || 'unknown')
      store.projectsViewed[slug] = (store.projectsViewed[slug] || 0) + 1
    } else if (eventName === 'diagnostic_completed') {
      store.diagnosticsCompleted += 1
    } else if (eventName === 'lead_form_submitted') {
      store.leadsSubmitted += 1
    }
    saveStore(store)
  } catch {
    // Silencioso
  }
}

export function trackWhatsAppClick(source: WhatsAppSource, extra: Record<string, unknown> = {}) {
  trackEvent('whatsapp_click', { source, ...extra })
}

export function trackLeadSubmitted(data: Record<string, unknown>) {
  trackEvent('lead_form_submitted', data)
}

export function trackDiagnosticCompleted(data: Record<string, unknown>) {
  trackEvent('diagnostic_completed', data)
}

export function trackProjectViewed(slug: string, title: string, category: string) {
  trackEvent('project_viewed', { slug, title, category })
}

export function getLocalAnalyticsSummary(): AnalyticsStore {
  return getStore()
}

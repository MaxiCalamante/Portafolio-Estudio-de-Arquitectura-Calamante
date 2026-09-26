import { Component, type ErrorInfo, type ReactNode } from 'react'
import { contact } from '../data/site'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Error no capturado en la aplicación:', error, errorInfo)
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null })
    window.location.href = '/'
  }

  private handleReload = () => {
    window.location.reload()
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <main
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--color-bg, #161513)',
            color: 'var(--color-text-main, #f5f2eb)',
            padding: '2rem 1.5rem',
            fontFamily: 'inherit',
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '8px',
              padding: '2.5rem 2rem',
              textAlign: 'center',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                letterSpacing: '0.14em',
                color: '#c5a059',
                marginBottom: '1rem',
                fontWeight: 600,
              }}
            >
              Estudio de Arquitectura Javier Calamante
            </span>

            <h1
              style={{
                fontFamily: 'var(--font-serif, "Playfair Display", Georgia, serif)',
                fontSize: '1.75rem',
                fontWeight: 400,
                lineHeight: 1.25,
                margin: '0 0 1rem 0',
                color: '#fff',
              }}
            >
              Se produjo una interrupción en la visualización
            </h1>

            <p
              style={{
                fontSize: '0.95rem',
                lineHeight: 1.6,
                color: '#a39f95',
                margin: '0 0 2rem 0',
              }}
            >
              Disculpá las molestias. Los datos y el catálogo siguen a resguardo. Podés recargar la página o comunicarte directamente con el estudio vía WhatsApp.
            </p>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                justifyContent: 'center',
              }}
            >
              <button
                type="button"
                onClick={this.handleReload}
                className="button button--primary"
                style={{ cursor: 'pointer' }}
              >
                Recargar página
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="button button--ghost"
                style={{ cursor: 'pointer' }}
              >
                Ir a la portada
              </button>
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="button button--whatsapp-secondary"
                style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
              >
                <span>WhatsApp Estudio</span>
              </a>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <details
                style={{
                  marginTop: '2rem',
                  textAlign: 'left',
                  fontSize: '0.8rem',
                  color: '#e06c75',
                  background: 'rgba(0, 0, 0, 0.4)',
                  padding: '1rem',
                  borderRadius: '4px',
                  overflowX: 'auto',
                }}
              >
                <summary style={{ cursor: 'pointer', color: '#c5a059', marginBottom: '0.5rem' }}>
                  Detalle técnico del error (solo desarrollo)
                </summary>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {this.state.error.toString()}
                  {'\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </main>
      )
    }

    return this.props.children
  }
}

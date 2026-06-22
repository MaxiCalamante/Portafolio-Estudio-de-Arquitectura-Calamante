import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'
import { supabase, supabaseConfigured } from '../lib/supabase'

export function LoginPage() {
  const { session, authorized } = useAuth()
  const [email, setEmail] = useState('javiercalamantetandil@gmail.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  useEffect(() => {
    document.title = 'Acceso privado · Javier Calamante'
    document.querySelector('meta[name="robots"]')?.setAttribute('content', 'noindex, nofollow')
  }, [])

  if (session && authorized) return <Navigate to="/admin" replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!supabase) return
    setSending(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) setError('Email o contraseña incorrectos.')
    setSending(false)
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="login-title">
        <Link className="auth-brand" to="/">JC / Estudio</Link>
        <p className="admin-kicker">Acceso privado</p>
        <h1 id="login-title">Administrar portfolio.</h1>
        <p>Ingresá para publicar obras y responder consultas.</p>

        {!supabaseConfigured && (
          <div className="admin-alert">Supabase todavía no está conectado. Revisá <code>.env.example</code>.</div>
        )}

        <form className="admin-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="username" />
          </label>
          <label>
            Contraseña
            <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} required autoComplete="current-password" />
          </label>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="admin-button admin-button--primary" disabled={sending || !supabaseConfigured} type="submit">
            {sending ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        <Link className="admin-back-link" to="/">Volver al sitio</Link>
      </section>
    </main>
  )
}

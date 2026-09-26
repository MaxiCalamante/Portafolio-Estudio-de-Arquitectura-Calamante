import { useEffect, useState, type FormEvent } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/AuthProvider'
import { supabase, supabaseConfigured } from '../lib/supabase'

export function LoginPage() {
  const { session, authorized } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)
  const [attempts, setAttempts] = useState(0)
  const [lockoutTimer, setLockoutTimer] = useState(0)

  useEffect(() => {
    document.title = 'Acceso privado · Javier Calamante'
    const metaRobots = document.querySelector('meta[name="robots"]')
    metaRobots?.setAttribute('content', 'noindex, nofollow')
    return () => {
      metaRobots?.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    }
  }, [])

  useEffect(() => {
    if (lockoutTimer <= 0) return
    const interval = setInterval(() => {
      setLockoutTimer((t) => Math.max(0, t - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [lockoutTimer])

  if (session && authorized) return <Navigate to="/admin" replace />

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!supabase || lockoutTimer > 0) return
    setSending(true)
    setError('')
    const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    if (authError) {
      const next = attempts + 1
      setAttempts(next)
      if (next >= 5) {
        setLockoutTimer(60)
        setError('Demasiados intentos incorrectos. Por seguridad, aguardá 60 segundos.')
      } else {
        setError('Email o contraseña incorrectos.')
      }
    }
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
          <button className="admin-button admin-button--primary" disabled={sending || !supabaseConfigured || lockoutTimer > 0} type="submit">
            {lockoutTimer > 0 ? `Reintentar en ${lockoutTimer}s` : sending ? 'Ingresando…' : 'Ingresar'}
          </button>
        </form>
        <Link className="admin-back-link" to="/">Volver al sitio</Link>
      </section>
    </main>
  )
}

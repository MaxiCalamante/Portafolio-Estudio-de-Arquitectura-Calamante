import { Navigate } from 'react-router-dom'
import { supabaseConfigured } from '../lib/supabase'
import { useAuth } from '../hooks/AuthProvider'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { loading, session, authorized, signOut } = useAuth()

  if (!supabaseConfigured) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <p className="admin-kicker">Configuración pendiente</p>
          <h1>Falta conectar Supabase.</h1>
          <p>Agregá las variables indicadas en <code>.env.example</code> para habilitar el panel.</p>
        </div>
      </main>
    )
  }

  if (loading) return <main className="auth-page"><p>Cargando sesión…</p></main>
  if (!session) return <Navigate to="/login" replace />
  if (!authorized) {
    return (
      <main className="auth-page">
        <div className="auth-card">
          <h1>Acceso no autorizado.</h1>
          <p>Esta cuenta no tiene permisos para administrar el sitio.</p>
          <button className="admin-button" type="button" onClick={() => void signOut()}>Cerrar sesión</button>
        </div>
      </main>
    )
  }

  return children
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { InquiryManager } from '../components/admin/InquiryManager'
import { ProjectManager } from '../components/admin/ProjectManager'
import { useAuth } from '../hooks/AuthProvider'

export function AdminPage() {
  const [view, setView] = useState<'projects' | 'inquiries'>('projects')
  const { session, signOut } = useAuth()

  useEffect(() => {
    document.title = 'Administración · Javier Calamante'
    const metaRobots = document.querySelector('meta[name="robots"]')
    metaRobots?.setAttribute('content', 'noindex, nofollow')
    return () => {
      metaRobots?.setAttribute('content', 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1')
    }
  }, [])

  return (
    <main className="admin-shell">
      <header className="admin-header">
        <Link className="admin-logo" to="/">JC <span>Estudio</span></Link>
        <nav aria-label="Administración">
          <button className={view === 'projects' ? 'is-active' : ''} type="button" onClick={() => setView('projects')}>Proyectos</button>
          <button className={view === 'inquiries' ? 'is-active' : ''} type="button" onClick={() => setView('inquiries')}>Consultas</button>
        </nav>
        <div className="admin-user"><span>{session?.user.email}</span><button type="button" onClick={() => void signOut()}>Salir</button></div>
      </header>
      <div className="admin-content">{view === 'projects' ? <ProjectManager /> : <InquiryManager />}</div>
    </main>
  )
}

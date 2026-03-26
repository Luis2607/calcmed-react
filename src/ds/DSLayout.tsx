import { useState, Suspense } from 'react'
import { Outlet } from 'react-router-dom'
import DSSidebar from './DSSidebar'
import './ds.css'

export default function DSLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="ds-layout">
      <button
        className="ds-mobile-toggle"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menu"
      >
        <i className="ph ph-list" />
      </button>

      <DSSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="ds-content">
        <Suspense fallback={<div className="p-10 text-fg-3">Carregando...</div>}>
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}

import { useState, useEffect, Suspense } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import DSSidebar from './DSSidebar'
import './ds.css'

/* ── Path metadata for breadcrumbs & prev/next ── */
const pathLabels: Record<string, { group: string; label: string }> = {
  brand: { group: 'Átomos', label: 'Marca e Identidade' },
  cores: { group: 'Átomos', label: 'Cores' },
  tipografia: { group: 'Átomos', label: 'Tipografia' },
  espacamento: { group: 'Átomos', label: 'Espaçamento' },
  grid: { group: 'Átomos', label: 'Grid' },
  elevacao: { group: 'Átomos', label: 'Elevação' },
  motion: { group: 'Átomos', label: 'Animações' },
  icones: { group: 'Átomos', label: 'Ícones' },
  writing: { group: 'Átomos', label: 'Tom de Voz e Escrita' },
  botoes: { group: 'Moléculas', label: 'Botões' },
  inputs: { group: 'Moléculas', label: 'Campos de Entrada' },
  selecao: { group: 'Moléculas', label: 'Controles de Seleção' },
  tags: { group: 'Moléculas', label: 'Tags e Chips' },
  alertas: { group: 'Moléculas', label: 'Alertas' },
  cards: { group: 'Organismos', label: 'Cards' },
  categorias: { group: 'Organismos', label: 'Categorias' },
  chat: { group: 'Organismos', label: 'Chat e IA' },
  calendario: { group: 'Organismos', label: 'Calendário' },
  'menu-perfil': { group: 'Organismos', label: 'Menu e Perfil' },
  premium: { group: 'Organismos', label: 'Premium e Checkout' },
  clinico: { group: 'Organismos', label: 'Componentes Clínicos' },
  navegacao: { group: 'Templates', label: 'Navegação' },
  patterns: { group: 'Templates', label: 'Listas e Utilitários' },
  overlays: { group: 'Templates', label: 'Overlays e Diálogos' },
  estados: { group: 'Templates', label: 'Estados de Conteúdo' },
  headers: { group: 'Templates', label: 'Headers' },
  acessibilidade: { group: 'Templates', label: 'Acessibilidade' },
  changelog: { group: 'Meta', label: 'Changelog' },
}

const sectionOrder = [
  'brand', 'cores', 'tipografia', 'espacamento', 'grid', 'elevacao', 'motion', 'icones', 'writing',
  'botoes', 'inputs', 'selecao', 'tags', 'alertas',
  'cards', 'categorias', 'chat', 'calendario', 'menu-perfil', 'premium', 'clinico',
  'navegacao', 'patterns', 'overlays', 'estados', 'headers', 'acessibilidade',
  'changelog',
]

/* ── Breadcrumb component ── */
function DSBreadcrumb({ slug }: { slug: string | undefined }) {
  const meta = slug ? pathLabels[slug] : undefined
  if (!meta) return null

  return (
    <nav className="ds-breadcrumb" aria-label="Breadcrumb">
      <Link to="/design-system">Design System</Link>
      <span className="separator" aria-hidden="true">
        <i className="ph ph-caret-right" />
      </span>
      <span>{meta.group}</span>
      <span className="separator" aria-hidden="true">
        <i className="ph ph-caret-right" />
      </span>
      <span className="current">{meta.label}</span>
    </nav>
  )
}

/* ── Prev / Next navigation component ── */
function DSPrevNext({ slug }: { slug: string | undefined }) {
  if (!slug) return null

  const idx = sectionOrder.indexOf(slug)
  if (idx === -1) return null

  const prev = idx > 0 ? sectionOrder[idx - 1] : undefined
  const next = idx < sectionOrder.length - 1 ? sectionOrder[idx + 1] : undefined
  const prevMeta = prev ? pathLabels[prev] : undefined
  const nextMeta = next ? pathLabels[next] : undefined

  if (!prevMeta && !nextMeta) return null

  return (
    <div className="ds-prev-next">
      {prevMeta ? (
        <Link to={`/design-system/${prev}`}>
          <i className="ph ph-arrow-left" />
          <div>
            <span className="label">Anterior</span>
            {prevMeta.label}
          </div>
        </Link>
      ) : (
        <span />
      )}
      {nextMeta ? (
        <Link to={`/design-system/${next}`}>
          <div style={{ textAlign: 'right' }}>
            <span className="label">Próximo</span>
            {nextMeta.label}
          </div>
          <i className="ph ph-arrow-right" />
        </Link>
      ) : (
        <span />
      )}
    </div>
  )
}

export default function DSLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [darkMode, setDarkMode] = useState(false)
  const location = useLocation()

  // Extract the current section slug from the path
  const slug = location.pathname.replace('/design-system/', '').replace('/design-system', '') || undefined
  const isOverview = !slug || slug === '' || slug === '/'

  // Clear search when navigating
  useEffect(() => {
    setSearch('')
  }, [location.pathname])

  return (
    <div className={`ds-layout ${darkMode ? 'dark' : 'light'}`}>
      <button
        className="ds-mobile-toggle"
        onClick={() => setSidebarOpen(true)}
        aria-label="Abrir menu"
      >
        <i className="ph ph-list" />
      </button>

      <DSSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        search={search}
        onSearch={setSearch}
        onNavigate={() => setSearch('')}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
      />

      <main className="ds-content">
        {!isOverview && <DSBreadcrumb slug={slug} />}
        <Suspense fallback={<div className="p-8 text-fg-3">Carregando...</div>}>
          <Outlet />
        </Suspense>
        {!isOverview && <DSPrevNext slug={slug} />}
      </main>
    </div>
  )
}

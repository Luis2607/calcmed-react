import { useState, useMemo } from 'react'
import { NavLink } from 'react-router-dom'

type NavStatus = 'beta' | 'new'

const statusConfig: Record<NavStatus, { color: string; label: string }> = {
  beta: { color: 'var(--warning)', label: 'Beta' },
  new: { color: 'var(--btn-primary)', label: 'Novo' },
}

interface NavItem {
  label: string
  path: string
  status?: NavStatus
}

interface NavGroup {
  title: string
  items: NavItem[]
}

const groups: NavGroup[] = [
  {
    title: 'Átomos',
    items: [
      { label: 'Marca e Identidade', path: 'brand' },
      { label: 'Cores', path: 'cores' },
      { label: 'Tipografia', path: 'tipografia' },
      { label: 'Espaçamento', path: 'espacamento' },
      { label: 'Grid', path: 'grid' },
      { label: 'Elevação', path: 'elevacao' },
      { label: 'Animações', path: 'motion' },
      { label: 'Ícones', path: 'icones' },
      { label: 'Tom de Voz e Escrita', path: 'writing' },
    ],
  },
  {
    title: 'Moléculas',
    items: [
      { label: 'Botões', path: 'botoes' },
      { label: 'Campos de Entrada', path: 'inputs' },
      { label: 'Controles de Seleção', path: 'selecao' },
      { label: 'Tags e Chips', path: 'tags' },
      { label: 'Alertas', path: 'alertas' },
    ],
  },
  {
    title: 'Organismos',
    items: [
      { label: 'Cards', path: 'cards' },
      { label: 'Categorias', path: 'categorias' },
      { label: 'Chat e IA', path: 'chat' },
      { label: 'Calendário', path: 'calendario' },
      { label: 'Menu e Perfil', path: 'menu-perfil' },
      { label: 'Premium e Checkout', path: 'premium' },
      { label: 'Componentes Clínicos', path: 'clinico', status: 'new' },
    ],
  },
  {
    title: 'Templates',
    items: [
      { label: 'Navegação', path: 'navegacao' },
      { label: 'Listas e Utilitários', path: 'patterns' },
      { label: 'Overlays e Diálogos', path: 'overlays' },
      { label: 'Estados de Conteúdo', path: 'estados' },
      { label: 'Headers', path: 'headers' },
      { label: 'Acessibilidade', path: 'acessibilidade' },
    ],
  },
]

/** Normalize string for accent-insensitive comparison */
function normalize(str: string): string {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

interface Props {
  isOpen: boolean
  onClose: () => void
  search?: string
  onSearch?: (value: string) => void
  onNavigate?: () => void
  darkMode?: boolean
  onToggleDark?: () => void
}

export default function DSSidebar({ isOpen, onClose, search = '', onSearch, onNavigate, darkMode = false, onToggleDark }: Props) {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    'Átomos': true,
    'Moléculas': true,
    'Organismos': true,
    'Templates': true,
  })

  const isSearching = search.trim().length > 0
  const normalizedSearch = normalize(search)

  const filteredGroups = useMemo(() => {
    if (!isSearching) return groups
    return groups
      .map(group => ({
        ...group,
        items: group.items.filter(item =>
          normalize(item.label).includes(normalizedSearch) ||
          normalize(item.path).includes(normalizedSearch)
        ),
      }))
      .filter(group => group.items.length > 0)
  }, [isSearching, normalizedSearch])

  const toggle = (title: string) => {
    setExpanded(prev => ({ ...prev, [title]: !prev[title] }))
  }

  const handleNavClick = () => {
    onClose()
    onNavigate?.()
  }

  return (
    <>
      <div className={isOpen ? 'ds-overlay open' : 'ds-overlay'} onClick={onClose} />
      <aside className={`ds-sidebar${isOpen ? ' open' : ''}`}>
        <div className="ds-header">
          <NavLink to="/design-system" className="ds-header-logo" onClick={handleNavClick}>
            Calc<span className="dot">.</span>Med
          </NavLink>
          <span className="ds-header-label">Design System</span>
          <button
            className="ds-theme-toggle"
            onClick={onToggleDark}
            title={darkMode ? 'Modo claro' : 'Modo escuro'}
            aria-label={darkMode ? 'Modo claro' : 'Modo escuro'}
          >
            <i className={`ph ${darkMode ? 'ph-sun' : 'ph-moon'}`} />
          </button>
        </div>

        <NavLink to="/home" className="ds-back-link" onClick={handleNavClick}>
          <i className="ph ph-arrow-left" />
          Voltar ao App
        </NavLink>

        {onSearch && (
          <div className="ds-search-area">
            <input
              type="text"
              className="ds-search"
              placeholder="Buscar componente..."
              value={search}
              onChange={e => onSearch(e.target.value)}
              aria-label="Buscar seções do Design System"
            />
          </div>
        )}

        <nav>
          {filteredGroups.map(group => {
            const isExpanded = isSearching || expanded[group.title]
            return (
              <div className="ds-nav-group" key={group.title}>
                <div
                  className="ds-nav-group-title"
                  onClick={() => !isSearching && toggle(group.title)}
                >
                  <span>{group.title}</span>
                  {!isSearching && (
                    <i className={`ph ph-caret-right ds-chevron${expanded[group.title] ? ' open' : ''}`} />
                  )}
                </div>
                <div
                  className="ds-nav-items"
                  style={{
                    maxHeight: isExpanded ? `${group.items.length * 40}px` : '0px',
                  }}
                >
                  {group.items.map(item => (
                    <NavLink
                      key={item.path}
                      to={`/design-system/${item.path}`}
                      className={({ isActive }) => `ds-nav-item${isActive ? ' active' : ''}`}
                      onClick={handleNavClick}
                    >
                      <span>{item.label}</span>
                      {item.status && (
                        <span
                          className="ds-nav-status"
                          style={{
                            display: 'inline-block',
                            fontSize: 9,
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: 0.5,
                            padding: '1px 6px',
                            borderRadius: 4,
                            marginLeft: 8,
                            color: statusConfig[item.status].color,
                            border: `1px solid ${statusConfig[item.status].color}`,
                          }}
                        >
                          {statusConfig[item.status].label}
                        </span>
                      )}
                    </NavLink>
                  ))}
                </div>
              </div>
            )
          })}
          {isSearching && filteredGroups.length === 0 && (
            <div style={{ padding: '16px', color: 'var(--fg-3)', fontSize: 13 }}>
              Nenhum resultado encontrado.
            </div>
          )}
        </nav>

        <div className="ds-sidebar-footer">
          <NavLink
            to="/design-system/changelog"
            className={({ isActive }) => `ds-nav-item ds-changelog-link${isActive ? ' active' : ''}`}
            onClick={handleNavClick}
          >
            <i className="ph ph-clock-counter-clockwise" />
            <span>Changelog</span>
          </NavLink>
        </div>
      </aside>
    </>
  )
}

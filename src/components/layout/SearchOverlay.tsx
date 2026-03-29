import { useState, useMemo, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ClockCounterClockwise,
  CaretRight,
  MagnifyingGlass,
  Siren,
  Eyedropper,
  Calculator,
  ClipboardText,
  ChartBar,
  ArrowsLeftRight,
} from '@phosphor-icons/react'
import Chip from '../ui/Chip'
import ListItem from '../ui/ListItem'
import { searchDb } from '../../data/homeData'

function normalize(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

const recentTerms = ['Noradrenalina', 'Clearance', 'Intubacao']

const quickChips: { label: string; domain: string }[] = [
  { label: 'IOT', domain: 'urg' },
  { label: 'DVA', domain: 'dil' },
  { label: 'CrCl', domain: 'calc' },
  { label: 'VM', domain: 'urg' },
  { label: 'Glasgow', domain: 'esc' },
  { label: 'ACLS', domain: 'prot' },
  { label: 'Na+', domain: 'calc' },
]

const domainIcons: Record<string, React.ElementType> = {
  urg: Siren,
  dil: Eyedropper,
  calc: Calculator,
  prot: ClipboardText,
  esc: ChartBar,
  conv: ArrowsLeftRight,
}

interface Props {
  onClose: () => void
}

export default function SearchOverlay({ onClose }: Props) {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  // Filter results
  const results = useMemo(() => {
    if (!query.trim()) return []
    const t = normalize(query.trim())
    return searchDb.filter(item => {
      const nome = normalize(item.nome)
      const sub = normalize(item.sub)
      return nome.includes(t) || sub.includes(t)
    })
  }, [query])

  // Group results by domain group
  const grouped = useMemo(() => {
    const groups: Record<string, { dominio: string; items: typeof results }> = {}
    results.forEach(item => {
      if (!groups[item.grupo]) groups[item.grupo] = { dominio: item.dominio, items: [] }
      groups[item.grupo].items.push(item)
    })
    return groups
  }, [results])

  const hasQuery = query.trim().length > 0

  // Navigate to full search page — kept for future "Ver todos" button
  void useCallback(() => {
    onClose()
    navigate('/busca')
  }, [onClose, navigate])

  return (
    <>
      {/* Backdrop */}
      <div className="search-overlay-backdrop" onClick={onClose} />

      {/* Dropdown */}
      <div className="search-overlay" role="dialog" aria-label="Busca rapida">
        {/* Search input */}
        <div className="search-overlay-input-wrap">
          <MagnifyingGlass size={18} className="search-overlay-icon" />
          <input
            className="search-overlay-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar calculadora, protocolo, escore..."
            autoFocus
          />
        </div>

        {/* Body */}
        <div className="search-overlay-body">
          {!hasQuery ? (
            <>
              {/* Recentes */}
              <div className="search-overlay-section">
                <span className="t-texto-badge text-fg-3">Recentes</span>
                {recentTerms.map(term => (
                  <button
                    key={term}
                    className="search-overlay-item"
                    onClick={() => setQuery(term)}
                  >
                    <ClockCounterClockwise size={16} />
                    <span>{term}</span>
                  </button>
                ))}
              </div>

              {/* Acesso rapido */}
              <div className="search-overlay-section">
                <span className="t-texto-badge text-fg-3">Acesso rapido</span>
                <div className="flex gap-2 flex-wrap" style={{ marginTop: 'var(--sp-2, 8px)' }}>
                  {quickChips.map(c => (
                    <Chip
                      key={c.label}
                      label={c.label}
                      domain={c.domain as 'urg' | 'dil' | 'calc' | 'prot' | 'esc' | 'conv'}
                      onClick={() => setQuery(c.label)}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Grouped results */}
              {results.length > 0 ? (
                <>
                  {Object.entries(grouped).map(([grupo, data]) => (
                    <div key={grupo}>
                      <div className="search-group-header">
                        <div className={`group-accent ${data.dominio}`} />
                        <span className="group-name">{grupo}</span>
                      </div>
                      <div className="flex flex-col gap-1 mb-2">
                        {data.items.map((item, i) => {
                          const ItemIcon = domainIcons[item.dominio]
                          return (
                            <ListItem
                              key={`${item.nome}-${item.dominio}-${i}`}
                              icon={ItemIcon ? <ItemIcon size={20} /> : undefined}
                              iconClass={`icon-${item.dominio}`}
                              title={item.nome}
                              subtitle={item.sub}
                              trailing={<CaretRight size={16} />}
                              onClick={onClose}
                            />
                          )
                        })}
                      </div>
                    </div>
                  ))}

                </>
              ) : (
                <div className="empty-state" role="status" style={{ padding: 'var(--sp-6, 24px) 0' }}>
                  <MagnifyingGlass size={36} className="empty-icon empty-icon-sm" weight="light" aria-hidden="true" />
                  <p className="empty-title">Nenhum resultado para &lsquo;{query.trim()}&rsquo;</p>
                  <p className="empty-desc">Tente buscar por nome ou sigla</p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}

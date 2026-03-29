import { useState, useMemo, useEffect, useRef, useCallback } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import BottomNav from '../components/layout/BottomNav'
import SearchInput from '../components/forms/SearchInput'
import SectionHeader from '../components/ui/SectionHeader'
import ListItem from '../components/ui/ListItem'
import Chip from '../components/ui/Chip'
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
import HomeHeader from '../components/layout/HomeHeader'
import { useLayout } from '../contexts/LayoutContext'
import { searchDb } from '../data/homeData'

function normalize(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

/** Levenshtein distance between two strings */
function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0) as number[])
  for (let i = 0; i <= m; i++) dp[i][0] = i
  for (let j = 0; j <= n; j++) dp[0][j] = j
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost)
    }
  }
  return dp[m][n]
}

/** Custom hook: debounce a string value */
function useDebounce(value: string, delay: number): string {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

const recentTerms = ['Noradrenalina', 'Clearance', 'Intubação']

const quickChips: { label: string; domain: string }[] = [
  { label: 'IOT', domain: 'urg' },
  { label: 'DVA', domain: 'dil' },
  { label: 'CrCl', domain: 'calc' },
  { label: 'VM', domain: 'urg' },
  { label: 'Potássio', domain: 'urg' },
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

/** All unique searchable terms (nome + sub) for typo suggestion */
const allKnownTerms = Array.from(
  new Set(searchDb.flatMap(item => [item.nome, item.sub]))
)

export default function BuscaPage() {
  const { layoutMode } = useLayout()
  const isWeb = layoutMode === 'web'
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Filter results using the debounced query
  const results = useMemo(() => {
    if (!debouncedQuery.trim()) return []
    const t = normalize(debouncedQuery.trim())
    return searchDb.filter(item => {
      const nome = normalize(item.nome)
      const sub = normalize(item.sub)
      return nome.includes(t) || sub.includes(t)
    })
  }, [debouncedQuery])

  const grouped = useMemo(() => {
    const groups: Record<string, { dominio: string; items: typeof results }> = {}
    results.forEach(item => {
      if (!groups[item.grupo]) groups[item.grupo] = { dominio: item.dominio, items: [] }
      groups[item.grupo].items.push(item)
    })
    return groups
  }, [results])

  // "Voce quis dizer" — find closest known term within Levenshtein distance <= 2
  const suggestion = useMemo(() => {
    const trimmed = debouncedQuery.trim()
    if (!trimmed || trimmed.length < 3 || results.length > 0) return null
    const normQ = normalize(trimmed)
    let bestTerm: string | null = null
    let bestDist = 3 // threshold: must be <= 2
    for (const term of allKnownTerms) {
      const normT = normalize(term)
      // Only compare if lengths are somewhat close
      if (Math.abs(normT.length - normQ.length) > 2) continue
      const dist = levenshtein(normQ, normT)
      if (dist < bestDist) {
        bestDist = dist
        bestTerm = term
      }
    }
    return bestTerm
  }, [debouncedQuery, results.length])

  const hasQuery = debouncedQuery.trim().length > 0
  const isTyping = query.trim().length > 0 && query !== debouncedQuery

  // Handle recent search tap: fill input and trigger filter
  const handleRecentTap = useCallback((term: string) => {
    setQuery(term)
  }, [])

  // Handle chip tap
  const handleChipTap = useCallback((label: string) => {
    setQuery(label)
  }, [])

  // Handle suggestion tap
  const handleSuggestionTap = useCallback((term: string) => {
    setQuery(term)
  }, [])

  // Stagger animation: assign CSS custom property for each result item
  let globalItemIndex = 0

  return (
    <MobileFrame>
      <HomeHeader />

      <div className={`screen-content flex-1 overflow-y-auto p-5 ${isWeb ? 'busca-web-content' : ''}`}>
        {/* Search bar — only on mobile (web uses header search) */}
        {!isWeb && (
          <div className="mb-6">
            <SearchInput
              value={query}
              onChange={setQuery}
              onClear={() => setQuery('')}
              placeholder="Buscar calculadora, protocolo, escore..."
              autoFocus
            />
          </div>
        )}
        {/* Web: inline search at top with max-width */}
        {isWeb && (
          <div className="mb-6 busca-web-search">
            <SearchInput
              value={query}
              onChange={setQuery}
              onClear={() => setQuery('')}
              placeholder="Buscar calculadora, protocolo, escore..."
              autoFocus
            />
          </div>
        )}

        {/* ESTADO INICIAL */}
        {!hasQuery && !isTyping && (
          <div>
            <SectionHeader title="Recentes" action={{ label: 'Limpar' }} />
            <nav aria-label="Buscas recentes">
              <div className="flex flex-col gap-1 mb-6">
                {recentTerms.map(term => (
                  <ListItem
                    key={term}
                    icon={<ClockCounterClockwise size={20} />}
                    title={term}
                    trailing={<CaretRight size={16} />}
                    onClick={() => handleRecentTap(term)}
                    ariaLabel={`Buscar ${term}`}
                  />
                ))}
              </div>
            </nav>

            <SectionHeader title="Acesso rápido" />
            <div className="flex gap-2 flex-wrap" role="group" aria-label="Atalhos de busca">
              {quickChips.map(c => (
                <Chip
                  key={c.label}
                  label={c.label}
                  domain={c.domain as 'urg' | 'dil' | 'calc' | 'prot' | 'esc' | 'conv'}
                  onClick={() => handleChipTap(c.label)}
                />
              ))}
            </div>
          </div>
        )}

        {/* ARIA LIVE REGION */}
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {hasQuery && results.length > 0 && `${results.length} resultado${results.length > 1 ? 's' : ''} encontrado${results.length > 1 ? 's' : ''}`}
          {hasQuery && results.length === 0 && !suggestion && 'Nenhum resultado encontrado'}
          {suggestion && `Você quis dizer: ${suggestion}?`}
        </div>

        {/* "VOCE QUIS DIZER" SUGGESTION */}
        {hasQuery && results.length === 0 && suggestion && (
          <button
            type="button"
            className="busca-suggestion"
            onClick={() => handleSuggestionTap(suggestion)}
            aria-label={`Buscar por ${suggestion}`}
          >
            Você quis dizer: <strong>{suggestion}</strong>?
          </button>
        )}

        {/* ESTADO RESULTADOS — with staggered fade-in */}
        {hasQuery && results.length > 0 && (
          <div ref={resultsRef} role="region" aria-label={`${results.length} resultados de busca`}>
            {Object.entries(grouped).map(([grupo, data]) => {
              return (
                <div key={grupo}>
                  <div className="search-group-header busca-result-enter" style={{ '--stagger-i': globalItemIndex++ } as React.CSSProperties}>
                    <div className={`group-accent ${data.dominio}`} />
                    <span className="group-name">{grupo}</span>
                  </div>
                  <div className="flex flex-col gap-1 mb-2">
                    {data.items.map((item, i) => {
                      const ItemIcon = domainIcons[item.dominio]
                      const staggerIndex = globalItemIndex++
                      return (
                        <div
                          key={`${item.nome}-${item.dominio}-${i}`}
                          className="busca-result-enter"
                          style={{ '--stagger-i': staggerIndex } as React.CSSProperties}
                        >
                          <ListItem
                            icon={ItemIcon ? <ItemIcon size={20} /> : undefined}
                            iconClass={`icon-${item.dominio}`}
                            title={item.nome}
                            subtitle={item.sub}
                            trailing={<CaretRight size={16} />}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        {/* SEM RESULTADO — DS empty-state pattern (only when no typo suggestion) */}
        {hasQuery && results.length === 0 && !suggestion && (
          <div className="empty-state" role="status">
            <MagnifyingGlass size={48} className="empty-icon empty-icon-sm" weight="light" aria-hidden="true" />
            <p className="empty-title">Nenhum resultado para &lsquo;{debouncedQuery.trim()}&rsquo;</p>
            <p className="empty-desc">Tente buscar por nome ou sigla</p>
          </div>
        )}
      </div>

      <BottomNav />
    </MobileFrame>
  )
}

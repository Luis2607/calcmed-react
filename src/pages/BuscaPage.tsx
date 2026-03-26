import { useState, useMemo } from 'react'
import MobileFrame from '../components/layout/MobileFrame'
import BottomNav from '../components/layout/BottomNav'
import SearchInput from '../components/forms/SearchInput'
import SectionHeader from '../components/ui/SectionHeader'
import ListItem from '../components/ui/ListItem'
import { ClockCounterClockwise, CaretRight, MagnifyingGlass } from '@phosphor-icons/react'
import { searchDb, domColors } from '../data/homeData'

function normalize(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
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

export default function BuscaPage() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const t = normalize(query.trim())
    return searchDb.filter(item => {
      const nome = normalize(item.nome)
      const sub = normalize(item.sub)
      return nome.includes(t) || sub.includes(t)
    })
  }, [query])

  const grouped = useMemo(() => {
    const groups: Record<string, { dominio: string; items: typeof results }> = {}
    results.forEach(item => {
      if (!groups[item.grupo]) groups[item.grupo] = { dominio: item.dominio, items: [] }
      groups[item.grupo].items.push(item)
    })
    return groups
  }, [results])

  const hasQuery = query.trim().length > 0

  return (
    <MobileFrame>
      <div className="screen-content flex-1 overflow-y-auto p-5 pt-10">
        <div className="mb-6">
          <SearchInput
            value={query}
            onChange={setQuery}
            onClear={() => setQuery('')}
            placeholder="Buscar calculadora, protocolo, escore..."
          />
        </div>

        {/* ESTADO INICIAL */}
        {!hasQuery && (
          <div>
            <SectionHeader title="Recentes" action={{ label: 'Limpar' }} />
            <div className="flex flex-col gap-1 mb-6">
              {recentTerms.map(term => (
                <ListItem
                  key={term}
                  icon={<ClockCounterClockwise size={20} />}
                  title={term}
                  trailing={<CaretRight size={16} />}
                  onClick={() => setQuery(term)}
                />
              ))}
            </div>

            <SectionHeader title="Acesso rápido" />
            <div className="flex gap-2 flex-wrap">
              {quickChips.map(c => (
                <span key={c.label} className={`chip ${c.domain}`} onClick={() => setQuery(c.label)}>
                  {c.label}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ESTADO RESULTADOS */}
        {hasQuery && results.length > 0 && (
          <div>
            {Object.entries(grouped).map(([grupo, data]) => (
              <div key={grupo}>
                <div className="search-group-header">
                  <div className="group-accent" style={{ background: domColors[data.dominio] }} />
                  <span className="group-name">{grupo}</span>
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  {data.items.map((item, i) => (
                    <ListItem
                      key={`${item.nome}-${item.dominio}-${i}`}
                      icon={<i className={`ph ph-${item.icon}`} />}
                      iconClass={`icon-${item.dominio}`}
                      title={item.nome}
                      subtitle={item.sub}
                      trailing={<CaretRight size={16} />}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SEM RESULTADO */}
        {hasQuery && results.length === 0 && (
          <div className="text-center mt-8">
            <MagnifyingGlass size={48} className="text-fg-3" />
            <p className="t-corpo-2 text-fg-3 mt-3">Nenhum resultado encontrado</p>
          </div>
        )}
      </div>

      <BottomNav />
    </MobileFrame>
  )
}

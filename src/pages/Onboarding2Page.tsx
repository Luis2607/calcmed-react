import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CaretLeft, BookmarkSimple } from '@phosphor-icons/react'
import MobileFrame from '../components/layout/MobileFrame'
import AuthWebLayout from '../components/layout/AuthWebLayout'
import Button from '../components/ui/Button'
import { useLayout } from '../contexts/LayoutContext'

const features = [
  { abbr: 'IOT', name: 'Intubação', domain: 'urg' },
  { abbr: 'VM', name: 'Ventilação Mecânica', domain: 'urg' },
  { abbr: 'CrCl', name: 'Clearance de Creatinina', domain: 'calc' },
  { abbr: 'DVA', name: 'Drogas Vasoativas', domain: 'dil' },
  { abbr: 'DHE', name: 'Dist. Hidroeletrolíticos', domain: 'urg', premium: true },
  { abbr: 'Gaso', name: 'Gasometria', domain: 'esc' },
  { abbr: 'Anaf', name: 'Anafilaxia', domain: 'prot' },
  { abbr: 'CAD', name: 'Cetoacidose Diabética', domain: 'urg' },
]

export default function Onboarding2Page() {
  const { layoutMode } = useLayout()
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const toggle = (abbr: string) => {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(abbr) ? next.delete(abbr) : next.add(abbr)
      return next
    })
  }

  if (layoutMode === 'web') {
    return (
      <AuthWebLayout>
        {/* Header */}
        <div className="mb-4">
          <Link to="/onboarding/1" className="auth-web-back mb-3">
            <CaretLeft size={16} /> Voltar
          </Link>
          <h1 className="t-titulo-pagina">Mais usadas no plantão</h1>
          <p className="t-corpo-2 text-fg-2 mt-2">Selecione para acesso rápido na Home</p>
        </div>

        {/* Grid 2col — card-feature do DS */}
        <div className="grid-2col onboarding-grid" role="listbox" aria-label="Funcionalidades favoritas" aria-multiselectable="true">
          {features.map(f => (
            <div
              key={f.abbr}
              className={`card-feature ${selected.has(f.abbr) ? 'selected' : ''}`}
              role="option"
              tabIndex={0}
              aria-selected={selected.has(f.abbr)}
              onClick={() => toggle(f.abbr)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(f.abbr); } }}
            >
              <button
                className={`feat-bookmark ${selected.has(f.abbr) ? 'saved' : ''}`}
                aria-label={selected.has(f.abbr) ? `Remover ${f.name} dos favoritos` : `Adicionar ${f.name} aos favoritos`}
                tabIndex={-1}
              >
                <BookmarkSimple size={16} weight={selected.has(f.abbr) ? 'fill' : 'regular'} />
              </button>
              <span className={`tag-abbr ${f.domain}`}>{f.abbr}</span>
              <span className="feat-name">{f.name}</span>
              {f.premium && <span className="tag-status teste">TESTE</span>}
            </div>
          ))}
        </div>

        {/* Progress + CTA */}
        <div className="mt-4">
          <p className="progress text-center mb-3">Passo 2 de 2</p>
          <Button variant="primary" size="md" href="/home" fullWidth>Continuar</Button>
          <div className="text-center mt-3">
            <Button variant="discrete" href="/home">Agora não, quero explorar</Button>
          </div>
        </div>
      </AuthWebLayout>
    )
  }

  return (
    <MobileFrame>
      <div className="screen-content flex-1 flex flex-col overflow-y-auto p-4 pt-10">
        <Link to="/onboarding/1" className="back mb-4" aria-label="Voltar"><CaretLeft size={20} /></Link>
        <h1 className="t-titulo-pagina mb-2">Mais usadas no plantão</h1>
        <p className="t-corpo-2 text-fg-2">Plantonistas de adulto acessam essas com frequência</p>
        <p className="t-legenda text-fg-3 mt-1 mb-4">Toque nas que você quer no acesso rápido</p>

        <div className="grid-2col onboarding-grid" role="listbox" aria-label="Funcionalidades favoritas" aria-multiselectable="true">
          {features.map(f => (
            <div
              key={f.abbr}
              className={`card-feature ${selected.has(f.abbr) ? 'selected' : ''}`}
              role="option"
              tabIndex={0}
              aria-selected={selected.has(f.abbr)}
              onClick={() => toggle(f.abbr)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(f.abbr); } }}
            >
              <button
                className={`feat-bookmark ${selected.has(f.abbr) ? 'saved' : ''}`}
                aria-label={selected.has(f.abbr) ? `Remover ${f.name} dos favoritos` : `Adicionar ${f.name} aos favoritos`}
                tabIndex={-1}
              >
                <BookmarkSimple size={16} weight={selected.has(f.abbr) ? 'fill' : 'regular'} />
              </button>
              <span className={`tag-abbr ${f.domain}`}>{f.abbr}</span>
              <span className="feat-name">{f.name}</span>
              {f.premium && <span className="tag-status teste">TESTE</span>}
            </div>
          ))}
        </div>

        <div className="flex-1 min-h-6" />

        <div className="progress mb-3">Passo 2 de 2</div>
        <Button variant="primary" size="lg" href="/home" fullWidth>Continuar</Button>
        <div className="text-center mt-3">
          <Button variant="discrete" href="/home">Agora não, quero explorar</Button>
        </div>
      </div>
    </MobileFrame>
  )
}

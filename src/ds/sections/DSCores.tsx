import { useEffect, useState, useRef } from 'react'

interface Swatch { name: string; value: string }

const primitiveScales: { title: string; prefix: string; steps: string[] }[] = [
  { title: 'Teal (Primary Interactive)', prefix: 'teal', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Navy (Dark Surfaces)', prefix: 'navy', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Slate (Neutrals)', prefix: 'slate', steps: ['0','25','50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Emerald (Success)', prefix: 'emerald', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Red (Critical)', prefix: 'red', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Amber (Warning)', prefix: 'amber', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Blue (Diluições)', prefix: 'blue', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Purple (Protocolos)', prefix: 'purple', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Indigo (Conversores)', prefix: 'indigo', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Rose (Urgências)', prefix: 'rose', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Orange (Calculadoras)', prefix: 'orange', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Cyan (Escores)', prefix: 'cyan', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
]

const brandTokens = [
  'brand-navy', 'brand-navy-dark', 'brand-navy-deep',
  'brand-red', 'brand-red-light', 'brand-red-bright',
]

const semanticSurfaces = ['bg', 'bg-surface', 'bg-card', 'bg-elevated', 'bg-hover']
const semanticText = ['fg', 'fg-2', 'fg-3', 'fg-disabled', 'fg-on', 'fg-link']
const semanticBorders = ['border', 'border-subtle', 'border-focus', 'border-error']
const semanticInteractive = ['btn-primary', 'btn-primary-hover', 'btn-primary-active', 'btn-accent', 'btn-danger']
const semanticFeedback = ['success', 'success-bg', 'success-border', 'danger', 'danger-bg', 'danger-border', 'warning', 'warning-bg', 'warning-border']

const domains = [
  { name: 'Urgências', prefix: 'dom-urg', keys: ['dom-urg', 'dom-urg-bg', 'dom-urg-text'] },
  { name: 'Diluições', prefix: 'dom-dil', keys: ['dom-dil', 'dom-dil-bg', 'dom-dil-text'] },
  { name: 'Calculadoras', prefix: 'dom-calc', keys: ['dom-calc', 'dom-calc-bg', 'dom-calc-text'] },
  { name: 'Protocolos', prefix: 'dom-prot', keys: ['dom-prot', 'dom-prot-bg', 'dom-prot-text'] },
  { name: 'Escores', prefix: 'dom-esc', keys: ['dom-esc', 'dom-esc-bg', 'dom-esc-text'] },
  { name: 'Conversores', prefix: 'dom-conv', keys: ['dom-conv', 'dom-conv-bg', 'dom-conv-text'] },
]

function getVar(name: string, el?: Element): string {
  const target = el ?? document.documentElement
  return getComputedStyle(target).getPropertyValue(`--${name}`).trim()
}

function SwatchGrid({ swatches }: { swatches: Swatch[] }) {
  return (
    <div className="ds-color-grid">
      {swatches.map(s => (
        <div className="ds-swatch" key={s.name}>
          <div className="color" style={{ background: s.value }} />
          <div className="name">{s.name}</div>
          <div className="hex">{s.value}</div>
        </div>
      ))}
    </div>
  )
}

function SemanticRow({ tokens, label, rootEl }: { tokens: string[]; label: string; rootEl?: Element }) {
  const swatches = tokens.map(t => ({ name: `--${t}`, value: getVar(t, rootEl) }))
  return (
    <div className="mb-4">
      <div className="t-texto-badge text-fg-3 mb-2">{label}</div>
      <SwatchGrid swatches={swatches} />
    </div>
  )
}

export default function DSCores() {
  const [colors, setColors] = useState<Record<string, Swatch[]>>({})
  const [brandSwatches, setBrand] = useState<Swatch[]>([])
  const lightRef = useRef<HTMLDivElement>(null)
  const darkRef = useRef<HTMLDivElement>(null)
  const [, setReady] = useState(false)

  useEffect(() => {
    const result: Record<string, Swatch[]> = {}
    primitiveScales.forEach(scale => {
      result[scale.prefix] = scale.steps.map(step => ({
        name: `${step}`,
        value: getVar(`${scale.prefix}-${step}`),
      }))
    })
    setColors(result)
    setBrand(brandTokens.map(t => ({ name: t, value: getVar(t) })))
    // Force re-render after refs are attached
    setTimeout(() => setReady(true), 50)
  }, [])

  return (
    <div>
      <h2 className="ds-section-title">Cores</h2>
      <p className="ds-section-desc">
        Sistema de cores com 152 primitivos organizados em 12 escalas cromáticas, mais 50 tokens
        semânticos por modo (Light/Dark). Cada escala vai de 50 (mais claro) a 950 (mais escuro).
      </p>
      <p className="ds-section-desc">
        No contexto médico, a precisão cromática é essencial: vermelho para alertas críticos,
        âmbar para avisos e verde para confirmações de dose segura.
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Precisar identificar visualmente um domínio clínico (Urgências, Diluições, etc.) com cor de domínio</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Comunicar feedback de sistema (sucesso, erro, aviso) com tokens semânticos de feedback</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Trocar automaticamente entre Light e Dark usando tokens semânticos em vez de cor literal</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">A cor for apenas decorativa ou de branding. Nesse caso, use tokens de brand</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Misturar cores de domínio com cores de feedback. Isso gera ambiguidade clínica</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar primitivos (teal-500) diretamente em componentes. Prefira sempre o token semântico correspondente</span></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Brand */}
      <div className="ds-subsection">
        <h3>Brand</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          As 6 cores institucionais do CalcMed. Navy transmite confiança clínica,
          e vermelho identifica a marca e situações de urgência.
        </p>
        <SwatchGrid swatches={brandSwatches} />
      </div>

      {/* Primitive Scales */}
      {primitiveScales.map(scale => (
        <div className="ds-subsection" key={scale.prefix}>
          <h3>{scale.title}</h3>
          <SwatchGrid swatches={colors[scale.prefix] ?? []} />
        </div>
      ))}

      {/* Semantic Tokens */}
      <div className="ds-subsection">
        <h3>Tokens Semânticos</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Tokens semânticos mapeiam intenção (superfície, texto, borda, feedback) em vez de cor literal.
          Isso permite a troca automática entre Light e Dark sem alterar nenhum componente.
        </p>
        <div className="ds-dual">
          <div className="ds-panel light" ref={lightRef}>
            <div className="ds-mode-label">Light</div>
            <div className="light">
              {lightRef.current && (
                <>
                  <SemanticRow tokens={semanticSurfaces} label="Superfícies" rootEl={lightRef.current} />
                  <SemanticRow tokens={semanticText} label="Texto" rootEl={lightRef.current} />
                  <SemanticRow tokens={semanticBorders} label="Bordas" rootEl={lightRef.current} />
                  <SemanticRow tokens={semanticInteractive} label="Interativos" rootEl={lightRef.current} />
                  <SemanticRow tokens={semanticFeedback} label="Feedback" rootEl={lightRef.current} />
                </>
              )}
            </div>
          </div>
          <div className="ds-panel dark" ref={darkRef}>
            <div className="ds-mode-label">Dark</div>
            <div className="dark">
              {darkRef.current && (
                <>
                  <SemanticRow tokens={semanticSurfaces} label="Superfícies" rootEl={darkRef.current} />
                  <SemanticRow tokens={semanticText} label="Texto" rootEl={darkRef.current} />
                  <SemanticRow tokens={semanticBorders} label="Bordas" rootEl={darkRef.current} />
                  <SemanticRow tokens={semanticInteractive} label="Interativos" rootEl={darkRef.current} />
                  <SemanticRow tokens={semanticFeedback} label="Feedback" rootEl={darkRef.current} />
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Domain Colors */}
      <div className="ds-subsection">
        <h3>Cores de Domínio</h3>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Cada domínio clínico possui cor própria com variantes de fundo (bg) e texto (text).
          Essas cores identificam visualmente a área do app em que o profissional está.
        </p>
        <p className="t-corpo-2 text-fg-2 mb-4">
          Nunca misture cores de domínio com cores de feedback para evitar ambiguidade clínica.
        </p>
        <div className="ds-dual">
          <div className="ds-panel light">
            <div className="ds-mode-label">Light</div>
            <div className="light">
              {domains.map(d => (
                <div key={d.name} className="mb-3">
                  <div className="t-texto-badge text-fg-2 mb-1">{d.name}</div>
                  <div className="ds-color-grid">
                    {d.keys.map(k => (
                      <div className="ds-swatch" key={k}>
                        <div className="color" style={{ background: `var(--${k})` }} />
                        <div className="name">--{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="ds-panel dark">
            <div className="ds-mode-label">Dark</div>
            <div className="dark">
              {domains.map(d => (
                <div key={d.name} className="mb-3">
                  <div className="t-texto-badge text-fg-2 mb-1">{d.name}</div>
                  <div className="ds-color-grid">
                    {d.keys.map(k => (
                      <div className="ds-swatch" key={k}>
                        <div className="color" style={{ background: `var(--${k})` }} />
                        <div className="name">--{k}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

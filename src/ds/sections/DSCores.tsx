import { useEffect, useState, useRef } from 'react'

interface Swatch { name: string; value: string }

const primitiveScales: { title: string; prefix: string; steps: string[] }[] = [
  { title: 'Teal (Primary Interactive)', prefix: 'teal', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Navy (Dark Surfaces)', prefix: 'navy', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Slate (Neutrals)', prefix: 'slate', steps: ['0','25','50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Emerald (Success)', prefix: 'emerald', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Red (Critical)', prefix: 'red', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Amber (Warning)', prefix: 'amber', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Blue (Diluicoes)', prefix: 'blue', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Purple (Protocolos)', prefix: 'purple', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Indigo (Conversores)', prefix: 'indigo', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
  { title: 'Rose (Urgencias)', prefix: 'rose', steps: ['50','100','200','300','400','500','600','700','800','900','950'] },
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
  { name: 'Urgencias', prefix: 'dom-urg', keys: ['dom-urg', 'dom-urg-bg', 'dom-urg-text'] },
  { name: 'Diluicoes', prefix: 'dom-dil', keys: ['dom-dil', 'dom-dil-bg', 'dom-dil-text'] },
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
    <div style={{ marginBottom: 16 }}>
      <div style={{ font: "600 12px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </div>
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
        152 primitivos organizados em 12 escalas. 50 semanticos por modo (Light/Dark).
        Dominios NUNCA usam cores de feedback. Cada escala vai de 50 (mais claro) a 950 (mais escuro).
      </p>

      {/* Brand */}
      <div className="ds-subsection">
        <h3>Brand</h3>
        <SwatchGrid swatches={brandSwatches} />
      </div>

      {/* Primitive Scales */}
      {primitiveScales.map(scale => (
        <div className="ds-subsection" key={scale.prefix}>
          <h3>{scale.title}</h3>
          <SwatchGrid swatches={colors[scale.prefix] ?? []} />
        </div>
      ))}

      {/* Semantic Tokens — Light/Dark */}
      <div className="ds-subsection">
        <h3>Tokens Semanticos</h3>
        <div className="ds-dual">
          <div className="ds-panel light" ref={lightRef}>
            <div className="ds-mode-label">Light</div>
            <div className="light">
              {lightRef.current && (
                <>
                  <SemanticRow tokens={semanticSurfaces} label="Superficies" rootEl={lightRef.current} />
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
                  <SemanticRow tokens={semanticSurfaces} label="Superficies" rootEl={darkRef.current} />
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
        <h3>Cores de Dominio</h3>
        <p style={{ font: "400 14px 'Inter'", color: 'var(--fg-2)', marginBottom: 16 }}>
          Cada dominio clinico possui cor propria, com variantes bg e text. Nunca misturar com cores de feedback.
        </p>
        <div className="ds-dual">
          <div className="ds-panel light">
            <div className="ds-mode-label">Light</div>
            <div className="light">
              {domains.map(d => (
                <div key={d.name} style={{ marginBottom: 12 }}>
                  <div style={{ font: "600 12px 'Inter'", color: 'var(--fg-2)', marginBottom: 6 }}>{d.name}</div>
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
                <div key={d.name} style={{ marginBottom: 12 }}>
                  <div style={{ font: "600 12px 'Inter'", color: 'var(--fg-2)', marginBottom: 6 }}>{d.name}</div>
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

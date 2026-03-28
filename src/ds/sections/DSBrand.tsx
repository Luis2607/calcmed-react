import DSPanel from '../DSPanel'

const brandColors = [
  { name: 'Brand Navy', token: '--brand-navy', hex: '#0d1b2a', desc: 'Fundo de telas de entrada e headers de destaque' },
  { name: 'Brand Navy Deep', token: '--brand-navy-deep', hex: '#060e18', desc: 'Fundo mais profundo para contraste extremo' },
  { name: 'Brand Red', token: '--brand-red', hex: '#dc2626', desc: 'SOMENTE para o ponto do Calc.Med — nunca em UI' },
  { name: 'Brand Teal', token: '--btn-primary', hex: '#007993', desc: 'Cor primária de interação (botões, links, CTAs)' },
]

const doRules = [
  'Brand red SOMENTE no ponto do Calc.Med — nunca em alertas ou UI',
  'Navy como fundo de telas de entrada e headers de destaque',
  'Sempre manter proporções do ícone (nunca distorcer)',
  'Manter área de proteção mínima ao redor do ícone',
]

const dontRules = [
  'Nunca usar brand red como cor de erro (use --danger)',
  'Nunca usar o ícone menor que 32px',
  'Nunca alterar as cores do ícone SVG',
  'Nunca remover ou modificar o ponto vermelho da marca',
]

const iconSizes = [96, 72, 48, 32] as const

export default function DSBrand() {
  return (
    <div>
      <h2 className="ds-section-title">Marca e Identidade</h2>
      <p className="ds-section-desc">
        A identidade visual do CalcMed comunica confiança clínica e urgência controlada.
        O navy transmite seriedade médica, o teal indica tecnologia e inovação, e o
        vermelho da marca sinaliza urgência sem alarme.
      </p>

      {/* ── Logo Principal ── */}
      <div className="ds-subsection">
        <h3>Logo Principal</h3>
        <p className="ds-subsection-desc">
          O ícone CalcMed em quatro tamanhos canônicos. Nunca usar abaixo de 32px.
        </p>

        <DSPanel title="Ícone em múltiplos tamanhos">
          <div className="flex items-end gap-6" style={{ flexWrap: 'wrap' }}>
            {iconSizes.map(size => (
              <div key={size} style={{ textAlign: 'center' }}>
                <img
                  src="/assets/Icone.svg"
                  alt={`Ícone CalcMed ${size}px`}
                  width={size}
                  height={size}
                  style={{ display: 'block', marginBottom: 8 }}
                />
                <span className="t-corpo-2 text-fg-2">{size}px</span>
              </div>
            ))}
          </div>
        </DSPanel>

        <div className="mb-6" />

        <DSPanel title="Wordmark">
          <div className="flex flex-col gap-3">
            <span className="t-marca" style={{ fontSize: 32 }}>
              Calc<span className="dot">.</span>Med
            </span>
            <span className="t-texto-badge text-fg-2" style={{ letterSpacing: 2 }}>
              URGÊNCIA E EMERGÊNCIA
            </span>
          </div>
        </DSPanel>
      </div>

      {/* ── Lockup Completo ── */}
      <div className="ds-subsection">
        <h3>Lockup Completo</h3>
        <p className="ds-subsection-desc">
          Composição vertical com ícone, wordmark e subtítulo. Versões para fundo claro e escuro.
        </p>

        <DSPanel title="Lockup vertical">
          <div className="flex flex-col items-center gap-3 p-6">
            <img src="/assets/Icone.svg" alt="Ícone CalcMed" width={72} height={72} />
            <span className="t-marca" style={{ fontSize: 28 }}>
              Calc<span className="dot">.</span>Med
            </span>
            <span className="t-texto-badge text-fg-2" style={{ letterSpacing: 2, fontSize: 10 }}>
              URGÊNCIA E EMERGÊNCIA
            </span>
          </div>
        </DSPanel>
      </div>

      {/* ── Aplicações da Logo ── */}
      <div className="ds-subsection">
        <h3>Aplicações da Logo</h3>
        <p className="ds-subsection-desc">
          Todas as combinações oficiais de ícone + texto. Cada versão tem variante para fundo claro e escuro.
          Use lockup horizontal em headers e barras de navegação. Use lockup vertical em splash screens, login e materiais impressos.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Horizontal claro */}
          <div className="rounded-xl p-6 flex items-center gap-4" style={{ background: 'var(--slate-50)', border: '1px solid var(--border)', minHeight: 100 }}>
            <img src="/assets/Icone.svg" alt="Ícone" width={48} height={48} />
            <div>
              <div style={{ font: "700 24px 'Outfit'", color: '#0f172a' }}>Calc<span style={{ color: '#dc2626' }}>.</span>Med</div>
              <div style={{ font: "600 9px 'Inter'", color: '#64748b', letterSpacing: 2, textTransform: 'uppercase' }}>Urgência e Emergência</div>
            </div>
          </div>
          {/* Horizontal escuro */}
          <div className="rounded-xl p-6 flex items-center gap-4" style={{ background: 'var(--brand-navy)', border: '1px solid var(--navy-700)', minHeight: 100 }}>
            <img src="/assets/Icone.svg" alt="Ícone" width={48} height={48} />
            <div>
              <div style={{ font: "700 24px 'Outfit'", color: '#ffffff' }}>Calc<span style={{ color: '#dc2626' }}>.</span>Med</div>
              <div style={{ font: "600 9px 'Inter'", color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase' }}>Urgência e Emergência</div>
            </div>
          </div>
          {/* Vertical claro */}
          <div className="rounded-xl p-8 flex flex-col items-center gap-3" style={{ background: 'var(--slate-50)', border: '1px solid var(--border)', minHeight: 180 }}>
            <img src="/assets/Icone.svg" alt="Ícone" width={64} height={64} />
            <div style={{ font: "700 28px 'Outfit'", color: '#0f172a' }}>Calc<span style={{ color: '#dc2626' }}>.</span>Med</div>
            <div style={{ font: "600 9px 'Inter'", color: '#64748b', letterSpacing: 2, textTransform: 'uppercase' }}>Urgência e Emergência</div>
          </div>
          {/* Vertical escuro */}
          <div className="rounded-xl p-8 flex flex-col items-center gap-3" style={{ background: 'var(--brand-navy)', border: '1px solid var(--navy-700)', minHeight: 180 }}>
            <img src="/assets/Icone.svg" alt="Ícone" width={64} height={64} />
            <div style={{ font: "700 28px 'Outfit'", color: '#ffffff' }}>Calc<span style={{ color: '#dc2626' }}>.</span>Med</div>
            <div style={{ font: "600 9px 'Inter'", color: '#94a3b8', letterSpacing: 2, textTransform: 'uppercase' }}>Urgência e Emergência</div>
          </div>
        </div>
      </div>

      {/* ── Cores da Marca ── */}
      <div className="ds-subsection">
        <h3>Cores da Marca</h3>
        <p className="ds-subsection-desc">
          Quatro cores definem a identidade CalcMed. Cada uma tem um papel específico e insubstituível.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
          {brandColors.map(c => (
            <div
              key={c.token}
              className="bg-surface rounded-xl"
              style={{
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: 80,
                  background: `var(${c.token}, ${c.hex})`,
                }}
              />
              <div className="p-4">
                <div className="t-corpo text-fg" style={{ fontWeight: 700, marginBottom: 4 }}>{c.name}</div>
                <code className="ds-token">{c.token}</code>
                <span className="t-corpo-2 text-fg-2" style={{ display: 'block', marginTop: 4 }}>{c.hex}</span>
                <p className="t-corpo-2 text-fg-2" style={{ margin: '8px 0 0' }}>{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quando usar / Quando não usar ── */}
      <div className="ds-subsection">
        <h3>Quando usar / Quando não usar</h3>
        <p className="ds-subsection-desc">
          Diretrizes para aplicação correta dos elementos de marca em produtos e materiais.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          <div className="ds-guideline do">
            <div className="ds-guideline-label">Quando usar</div>
            <p>Ícone em splash screen, header da home e materiais oficiais. Wordmark completo em apresentações e documentos do produto. Navy como fundo de telas de entrada (landing, login, onboarding).</p>
          </div>
          <div className="ds-guideline dont">
            <div className="ds-guideline-label">Quando não usar</div>
            <p>Brand red como cor de erro ou alerta na interface. Ícone abaixo de 32px ou fora da área de proteção. Navy em telas internas de conteúdo (use --bg ou --bg-surface). Wordmark sem o ponto vermelho.</p>
          </div>
        </div>
      </div>

      {/* ── Regras de Uso ── */}
      <div className="ds-subsection">
        <h3>Regras de Uso</h3>
        <p className="ds-subsection-desc">
          Diretrizes obrigatórias para aplicação correta da marca em qualquer contexto.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
          {/* DO */}
          <div
            className="bg-surface rounded-xl"
            style={{
              border: '1px solid var(--success-border)',
              padding: 24,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <i className="ph ph-check-circle" style={{ fontSize: 20, color: 'var(--success)' }} />
              <span className="t-corpo" style={{ fontWeight: 700, color: 'var(--success)' }}>Boas Práticas</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {doRules.map((rule, i) => (
                <li key={i} className="t-corpo-2 text-fg-2">{rule}</li>
              ))}
            </ul>
          </div>

          {/* DON'T */}
          <div
            className="bg-surface rounded-xl"
            style={{
              border: '1px solid var(--danger-border)',
              padding: 24,
            }}
          >
            <div className="flex items-center gap-2 mb-4">
              <i className="ph ph-x-circle" style={{ fontSize: 20, color: 'var(--danger)' }} />
              <span className="t-corpo" style={{ fontWeight: 700, color: 'var(--danger)' }}>Evitar</span>
            </div>
            <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dontRules.map((rule, i) => (
                <li key={i} className="t-corpo-2 text-fg-2">{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Área de Proteção ── */}
      <div className="ds-subsection">
        <h3>Área de Proteção</h3>
        <p className="ds-subsection-desc">
          O ícone precisa de espaço para respirar. A margem mínima ao redor do ícone deve ser
          equivalente a 25% do tamanho do ícone. Exemplo: ícone de 48px requer 12px de margem
          em todos os lados.
        </p>

        <div
          className="bg-surface rounded-xl"
          style={{
            border: '1px solid var(--border)',
            padding: 32,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              position: 'relative',
              padding: 24,
              border: '2px dashed var(--border-subtle)',
              borderRadius: 8,
            }}
          >
            <img src="/assets/Icone.svg" alt="Ícone CalcMed com área de proteção" width={96} height={96} />
            {/* Top annotation */}
            <div
              style={{
                position: 'absolute',
                top: 2,
                left: '50%',
                transform: 'translateX(-50%)',
                fontSize: 10,
                color: 'var(--fg-3)',
                fontFamily: 'var(--font-mono, JetBrains Mono, monospace)',
              }}
            >
              25%
            </div>
            {/* Left annotation */}
            <div
              style={{
                position: 'absolute',
                left: 4,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 10,
                color: 'var(--fg-3)',
                fontFamily: 'var(--font-mono, JetBrains Mono, monospace)',
              }}
            >
              25%
            </div>
          </div>
        </div>
      </div>

      {/* ── Downloads ── */}
      <div className="ds-subsection">
        <h3>Downloads</h3>
        <p className="ds-subsection-desc">
          Todos os assets oficiais da marca em SVG vetorial. Clique no botão para baixar.
          Use o ícone para favicons e app icons. Use as logos para headers, splashscreens e materiais.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {[
            { label: 'Ícone', desc: 'App icon, favicon, avatar', file: 'Icone.svg', darkBg: false },
            { label: 'Lockup Horizontal — Claro', desc: 'Ícone + texto. Headers, toolbars em fundo claro', file: 'lockup-horizontal-color.svg', darkBg: false },
            { label: 'Lockup Horizontal — Escuro', desc: 'Ícone + texto. Nav bar, fundo navy, dark mode', file: 'lockup-horizontal-white.svg', darkBg: true },
            { label: 'Lockup Vertical — Claro', desc: 'Ícone + texto empilhado. Splash, onboarding claro', file: 'lockup-vertical-color.svg', darkBg: false },
            { label: 'Lockup Vertical — Escuro', desc: 'Ícone + texto empilhado. Splash, hero dark, login', file: 'lockup-vertical-white.svg', darkBg: true },
          ].map(asset => (
            <div
              key={asset.file}
              className="bg-surface rounded-xl"
              style={{
                border: '1px solid var(--border)',
                overflow: 'hidden',
              }}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  height: 120,
                  background: asset.darkBg ? 'var(--brand-navy, #0d1b2a)' : 'var(--slate-50)',
                  borderBottom: '1px solid var(--border)',
                }}
              >
                <img
                  src={`/assets/${asset.file}`}
                  alt={asset.label}
                  style={{ maxHeight: 72, maxWidth: '80%' }}
                />
              </div>
              <div style={{ padding: 16 }}>
                <div className="t-corpo text-fg" style={{ fontWeight: 600 }}>{asset.label}</div>
                <div className="t-legenda text-fg-3 mb-3">{asset.desc}</div>
                <a
                  href={`/assets/${asset.file}`}
                  download={asset.file}
                  className="btn btn-sm btn-ghost w-full"
                  style={{ textDecoration: 'none', textAlign: 'center', display: 'flex', justifyContent: 'center', gap: 8 }}
                >
                  <i className="ph ph-download-simple" />
                  Baixar SVG
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

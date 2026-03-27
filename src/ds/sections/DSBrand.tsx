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
      <h2 className="t-titulo-secao mb-2">Marca e Identidade</h2>
      <p className="ds-section-desc mb-6">
        A identidade visual do CalcMed comunica confiança clínica e urgência controlada.
        O navy transmite seriedade médica, o teal indica tecnologia e inovação, e o
        vermelho da marca sinaliza urgência sem alarme.
      </p>

      {/* ── Logo Principal ── */}
      <h3 className="t-titulo-secao mb-4">Logo Principal</h3>
      <p className="ds-section-desc mb-4">
        O ícone CalcMed em quatro tamanhos canônicos. Nunca usar abaixo de 32px.
      </p>

      <DSPanel title="Ícone em múltiplos tamanhos">
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 24, flexWrap: 'wrap' }}>
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="t-marca" style={{ fontSize: 32 }}>
            Calc<span className="dot">.</span>Med
          </span>
          <span className="t-texto-badge" style={{ letterSpacing: 2 }}>
            URGÊNCIA E EMERGÊNCIA
          </span>
        </div>
      </DSPanel>

      <div className="mb-8" />

      {/* ── Lockup Completo ── */}
      <h3 className="t-titulo-secao mb-4">Lockup Completo</h3>
      <p className="ds-section-desc mb-4">
        Composição vertical com ícone, wordmark e subtítulo. Versões para fundo claro e escuro.
      </p>

      <DSPanel title="Lockup vertical">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: 32 }}>
          <img src="/assets/Icone.svg" alt="Ícone CalcMed" width={72} height={72} />
          <span className="t-marca" style={{ fontSize: 28 }}>
            Calc<span className="dot">.</span>Med
          </span>
          <span className="t-texto-badge" style={{ letterSpacing: 2, fontSize: 10 }}>
            URGÊNCIA E EMERGÊNCIA
          </span>
        </div>
      </DSPanel>

      <div className="mb-8" />

      {/* ── Cores da Marca ── */}
      <h3 className="t-titulo-secao mb-4">Cores da Marca</h3>
      <p className="ds-section-desc mb-4">
        Quatro cores definem a identidade CalcMed. Cada uma tem um papel específico e insubstituível.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 16 }}>
        {brandColors.map(c => (
          <div
            key={c.token}
            className="bg-surface"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl, 16px)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                height: 80,
                background: `var(${c.token}, ${c.hex})`,
              }}
            />
            <div style={{ padding: 16 }}>
              <div className="t-titulo-card" style={{ fontWeight: 700, marginBottom: 4 }}>{c.name}</div>
              <code className="ds-token" style={{ fontSize: 12 }}>{c.token}</code>
              <span className="t-corpo-2 text-fg-2" style={{ display: 'block', marginTop: 4 }}>{c.hex}</span>
              <p className="t-corpo-2 text-fg-2" style={{ margin: '8px 0 0' }}>{c.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mb-8" />

      {/* ── Regras de Uso ── */}
      <h3 className="t-titulo-secao mb-4">Regras de Uso</h3>
      <p className="ds-section-desc mb-4">
        Diretrizes obrigatórias para aplicação correta da marca em qualquer contexto.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {/* DO */}
        <div
          className="bg-surface"
          style={{
            border: '1px solid var(--success-border)',
            borderRadius: 'var(--radius-xl, 16px)',
            padding: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <i className="ph ph-check-circle" style={{ fontSize: 20, color: 'var(--success)' }} />
            <span className="t-titulo-card" style={{ fontWeight: 700, color: 'var(--success)' }}>Boas Práticas</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {doRules.map((rule, i) => (
              <li key={i} className="t-corpo-2">{rule}</li>
            ))}
          </ul>
        </div>

        {/* DON'T */}
        <div
          className="bg-surface"
          style={{
            border: '1px solid var(--danger-border)',
            borderRadius: 'var(--radius-xl, 16px)',
            padding: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <i className="ph ph-x-circle" style={{ fontSize: 20, color: 'var(--danger)' }} />
            <span className="t-titulo-card" style={{ fontWeight: 700, color: 'var(--danger)' }}>Evitar</span>
          </div>
          <ul style={{ margin: 0, paddingLeft: 20, display: 'flex', flexDirection: 'column', gap: 8 }}>
            {dontRules.map((rule, i) => (
              <li key={i} className="t-corpo-2">{rule}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mb-8" />

      {/* ── Área de Proteção ── */}
      <h3 className="t-titulo-secao mb-4">Área de Proteção</h3>
      <p className="ds-section-desc mb-4">
        O ícone precisa de espaço para respirar. A margem mínima ao redor do ícone deve ser
        equivalente a 25% do tamanho do ícone. Exemplo: ícone de 48px requer 12px de margem
        em todos os lados.
      </p>

      <div
        className="bg-surface"
        style={{
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-xl, 16px)',
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

      <div className="mb-8" />

      {/* ── Downloads ── */}
      <h3 className="t-titulo-secao mb-4">Downloads</h3>
      <p className="ds-section-desc mb-4">
        Arquivos de marca disponíveis para uso em materiais e implementações.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
        {[
          { label: 'Ícone SVG', file: 'Icone.svg' },
          { label: 'Logo colorida', file: 'logo-colorida.svg' },
          { label: 'Logo branca', file: 'logo-branca.svg' },
        ].map(asset => (
          <div
            key={asset.file}
            className="bg-surface"
            style={{
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-xl, 16px)',
              padding: 24,
              textAlign: 'center',
            }}
          >
            <div
              style={{
                height: 80,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
                background: asset.file === 'logo-branca.svg' ? 'var(--brand-navy, #0d1b2a)' : undefined,
                borderRadius: 8,
              }}
            >
              <img
                src={`/assets/${asset.file}`}
                alt={asset.label}
                style={{ maxHeight: 56, maxWidth: '80%' }}
              />
            </div>
            <div className="t-corpo-2" style={{ fontWeight: 600 }}>{asset.label}</div>
            <div className="t-corpo-2 text-fg-3" style={{ fontSize: 11 }}>{asset.file}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

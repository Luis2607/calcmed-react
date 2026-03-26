import { useState } from 'react'
import DSPanel from '../DSPanel'

function ButtonShowcase() {
  const [loading, setLoading] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Primary */}
      <div>
        <h4 style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Primary</h4>
        <div className="ds-demo-row">
          <button className="btn btn-lg btn-primary">Primary LG</button>
          <button className="btn btn-md btn-primary">Primary MD</button>
          <button className="btn btn-sm btn-primary">Primary SM</button>
          <button className="btn btn-md btn-primary disabled">Disabled</button>
        </div>
      </div>

      {/* Ghost / Outline */}
      <div>
        <h4 style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Ghost (Outline)</h4>
        <div className="ds-demo-row">
          <button className="btn btn-md btn-ghost">Ghost MD</button>
          <button className="btn btn-sm btn-ghost">Ghost SM</button>
          <button className="btn btn-md btn-outline">Outline MD</button>
        </div>
      </div>

      {/* Secondary */}
      <div>
        <h4 style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Secondary</h4>
        <div className="ds-demo-row">
          <button className="btn btn-md btn-secondary">Secondary</button>
          <button className="btn btn-md btn-secondary disabled">Disabled</button>
        </div>
      </div>

      {/* Text / Discrete */}
      <div>
        <h4 style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Text & Discrete</h4>
        <div className="ds-demo-row">
          <button className="btn-text">Text Link</button>
          <button className="btn-discrete">Discrete</button>
        </div>
      </div>

      {/* Danger */}
      <div>
        <h4 style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Danger</h4>
        <div className="ds-demo-row">
          <button className="btn btn-md btn-danger">Danger</button>
        </div>
      </div>

      {/* Social */}
      <div>
        <h4 style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Social</h4>
        <div className="ds-demo-row">
          <button className="btn btn-md btn-google"><span className="icon-google" /> Google</button>
          <button className="btn btn-md btn-apple"><span className="icon-apple" /> Apple</button>
        </div>
      </div>

      {/* Icon Only */}
      <div>
        <h4 style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Icon Only</h4>
        <div className="ds-demo-row">
          <button className="btn btn-icon-only btn-primary"><i className="ph ph-plus" /></button>
          <button className="btn btn-icon-only btn-sm btn-primary"><i className="ph ph-plus" /></button>
          <button className="btn btn-icon-only btn-secondary"><i className="ph ph-pencil-simple" /></button>
        </div>
      </div>

      {/* Loading */}
      <div>
        <h4 style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Loading</h4>
        <div className="ds-demo-row">
          <button
            className={`btn btn-md btn-primary${loading ? ' btn-loading' : ''}`}
            onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 2000) }}
          >
            {loading ? 'Carregando...' : 'Clique para loading'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function DSBotoes() {
  return (
    <div>
      <h2 className="ds-section-title">Botoes</h2>
      <p className="ds-section-desc">
        7 hierarquias visuais. 3 tamanhos (sm 36px, md 48px, lg 56px). Touch target minimo 48dp.
        Classe base .btn combinada com variante (.btn-primary, .btn-ghost, etc.) e tamanho (.btn-sm, .btn-md, .btn-lg).
      </p>

      <div className="ds-subsection">
        <h3>Todas as Variantes</h3>
        <DSPanel>
          <ButtonShowcase />
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Full Width</h3>
        <DSPanel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <button className="btn btn-lg btn-primary w-full">Confirmar</button>
            <button className="btn btn-lg btn-ghost w-full">Cancelar</button>
          </div>
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descricao</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.btn', desc: 'Base: inline-flex, gap 12px, font 600 16px, transitions' },
              { cls: '.btn-sm', desc: 'Height 36px, radius 8px, padding 0 16px, font 14px' },
              { cls: '.btn-md', desc: 'Height 48px, radius 12px, padding 0 24px' },
              { cls: '.btn-lg', desc: 'Min-height 56px, radius pill, padding 16px 24px' },
              { cls: '.btn-primary', desc: 'Fundo teal, texto branco' },
              { cls: '.btn-ghost', desc: 'Outline teal, sem fundo' },
              { cls: '.btn-outline', desc: 'Outline teal (sinonimo de ghost)' },
              { cls: '.btn-secondary', desc: 'Fundo elevated, borda' },
              { cls: '.btn-text', desc: 'Sem fundo/borda, cor link' },
              { cls: '.btn-discrete', desc: 'Sem fundo/borda, cor fg-3' },
              { cls: '.btn-danger', desc: 'Fundo vermelho' },
              { cls: '.btn-google', desc: 'Fundo card, borda, icone Google' },
              { cls: '.btn-apple', desc: 'Fundo preto, icone Apple' },
              { cls: '.btn-icon-only', desc: 'Circular 48x48, sem padding' },
              { cls: '.btn-loading', desc: 'Spinner animado, pointer-events none' },
              { cls: '.disabled', desc: 'Fundo disabled, cor disabled' },
              { cls: '.w-full', desc: 'Largura 100%' },
            ].map(r => (
              <tr key={r.cls}>
                <td><span className="ds-token">{r.cls}</span></td>
                <td style={{ color: 'var(--fg-2)' }}>{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

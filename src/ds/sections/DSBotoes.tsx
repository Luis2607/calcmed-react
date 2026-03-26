import { useState } from 'react'
import DSPanel from '../DSPanel'

function ButtonPlayground() {
  const [variant, setVariant] = useState('primary')
  const [size, setSize] = useState('md')
  const [disabled, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [label, setLabel] = useState('Calcular')
  const [withIcon, setWithIcon] = useState(false)

  const cls = `btn btn-${size} btn-${variant}${disabled ? ' disabled' : ''}${loading ? ' btn-loading' : ''}`

  return (
    <div className="ds-subsection">
      <h3>Playground</h3>
      <p className="ds-subsection-desc">Configure o bot{"\u00e3"}o abaixo e veja o resultado em tempo real. Copie as classes CSS para usar no seu c{"\u00f3"}digo.</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Controls */}
        <div className="flex flex-col gap-4">
          <div>
            <label className="t-legenda text-fg-2 mb-1">Variante</label>
            <div className="flex flex-wrap gap-2">
              {['primary','ghost','outline','secondary','text','danger','discrete'].map(v => (
                <button key={v} className={`chip ${v === variant ? 'active' : ''}`} onClick={() => setVariant(v)}>{v}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="t-legenda text-fg-2 mb-1">Tamanho</label>
            <div className="flex gap-2">
              {['sm','md','lg'].map(s => (
                <button key={s} className={`chip ${s === size ? 'active' : ''}`} onClick={() => setSize(s)}>{s}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={disabled} onChange={e => setDisabled(e.target.checked)} />
              <span className="t-corpo-2">Disabled</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={loading} onChange={e => setLoading(e.target.checked)} />
              <span className="t-corpo-2">Loading</span>
            </label>
            <label className="flex items-center gap-2">
              <input type="checkbox" checked={withIcon} onChange={e => setWithIcon(e.target.checked)} />
              <span className="t-corpo-2">Com {"\u00ed"}cone</span>
            </label>
          </div>
          <div>
            <label className="t-legenda text-fg-2 mb-1">Texto</label>
            <input className="input-field" value={label} onChange={e => setLabel(e.target.value)} />
          </div>
        </div>

        {/* Preview */}
        <div className="flex flex-col items-center justify-center gap-4 p-6 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)' }}>
          <button className={cls} disabled={disabled}>
            {withIcon && <i className="ph ph-calculator" />}
            {loading ? '' : label}
          </button>
          <code className="ds-token" style={{ fontSize: 11 }}>.{cls.trim().replace(/\s+/g, ' .')}</code>
        </div>
      </div>
    </div>
  )
}

function ButtonShowcase() {
  const [loading, setLoading] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* Primary */}
      <div>
        <div className="ds-demo-label">Primary</div>
        <div className="ds-demo-row">
          <button className="btn btn-lg btn-primary">Primary LG</button>
          <button className="btn btn-md btn-primary">Primary MD</button>
          <button className="btn btn-sm btn-primary">Primary SM</button>
          <button className="btn btn-md btn-primary disabled">Disabled</button>
        </div>
      </div>

      {/* Ghost / Outline */}
      <div>
        <div className="ds-demo-label">Ghost (Outline)</div>
        <div className="ds-demo-row">
          <button className="btn btn-md btn-ghost">Ghost MD</button>
          <button className="btn btn-sm btn-ghost">Ghost SM</button>
          <button className="btn btn-md btn-outline">Outline MD</button>
        </div>
      </div>

      {/* Secondary */}
      <div>
        <div className="ds-demo-label">Secondary</div>
        <div className="ds-demo-row">
          <button className="btn btn-md btn-secondary">Secondary</button>
          <button className="btn btn-md btn-secondary disabled">Disabled</button>
        </div>
      </div>

      {/* Text / Discrete */}
      <div>
        <div className="ds-demo-label">Text &amp; Discrete</div>
        <div className="ds-demo-row">
          <button className="btn-text">Text Link</button>
          <button className="btn-discrete">Discrete</button>
        </div>
      </div>

      {/* Danger */}
      <div>
        <div className="ds-demo-label">Danger</div>
        <div className="ds-demo-row">
          <button className="btn btn-md btn-danger">Danger</button>
        </div>
      </div>

      {/* Social */}
      <div>
        <div className="ds-demo-label">Social</div>
        <div className="ds-demo-row">
          <button className="btn btn-md btn-google"><span className="icon-google" /> Google</button>
          <button className="btn btn-md btn-apple"><span className="icon-apple" /> Apple</button>
        </div>
      </div>

      {/* Icon Only */}
      <div>
        <div className="ds-demo-label">Icon Only</div>
        <div className="ds-demo-row">
          <button className="btn btn-icon-only btn-primary"><i className="ph ph-plus" /></button>
          <button className="btn btn-icon-only btn-sm btn-primary"><i className="ph ph-plus" /></button>
          <button className="btn btn-icon-only btn-secondary"><i className="ph ph-pencil-simple" /></button>
        </div>
      </div>

      {/* Loading */}
      <div>
        <div className="ds-demo-label">Loading</div>
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
      <h2 className="ds-section-title">Bot{"\u00f5"}es</h2>
      <p className="ds-section-desc">
        Bot{"\u00f5"}es s{"\u00e3"}o o principal ponto de intera{"\u00e7\u00e3"}o do m{"\u00e9"}dico com o app. Em contexto de emerg{"\u00ea"}ncia,
        cada toque precisa ser certeiro — por isso usamos touch targets de 48dp (ampliados para 52dp
        em a{"\u00e7\u00f5"}es cr{"\u00ed"}ticas).
      </p>
      <p className="ds-section-desc">
        A hierarquia visual guia o olhar: Primary para a a{"\u00e7\u00e3"}o principal, Ghost
        para secund{"\u00e1"}ria, Text para terci{"\u00e1"}ria. S{"\u00e3"}o 7 hierarquias visuais em 3 tamanhos (SM 36px, MD 48px,
        LG 56px). A classe base <code>.btn</code> {"\u00e9"} combinada com a variante
        (<code>.btn-primary</code>, <code>.btn-ghost</code>, etc.) e o tamanho
        (<code>.btn-sm</code>, <code>.btn-md</code>, <code>.btn-lg</code>).
      </p>

      {/* Quando usar */}
      <div className="ds-subsection">
        <h3>Quando usar</h3>
        <div className="flex gap-8 mb-6">
          <div className="flex-1">
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Houver 1 a{"\u00e7\u00e3"}o principal na tela. Use Primary para ela</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Precisar de a{"\u00e7\u00f5"}es secund{"\u00e1"}rias. Use Ghost para complementar o Primary</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">A a{"\u00e7\u00e3"}o for destrutiva (deletar, cancelar assinatura). Use Danger exclusivamente</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>N{"\u00e3"}o use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">J{"\u00e1"} houver outro Primary na mesma tela. Nunca 2 bot{"\u00f5"}es Primary na mesma tela</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar Danger para avisos gen{"\u00e9"}ricos. Danger {"\u00e9"} exclusivo para a{"\u00e7\u00f5"}es destrutivas</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar btn-sm para a{"\u00e7\u00f5"}es cl{"\u00ed"}nicas cr{"\u00ed"}ticas. O toque sob press{"\u00e3"}o exige targets maiores</span></li>
            </ul>
          </div>
        </div>
      </div>

      <ButtonPlayground />

      <div className="ds-subsection">
        <h3>Todas as Variantes</h3>
        <p className="ds-subsection-desc">
          Cada variante tem um papel sem{"\u00e2"}ntico. Primary chama aten{"\u00e7\u00e3"}o para a a{"\u00e7\u00e3"}o principal da tela.
          Ghost e Outline s{"\u00e3"}o usados para a{"\u00e7\u00f5"}es secund{"\u00e1"}rias.
        </p>
        <p className="ds-subsection-desc">
          Secondary serve de apoio com menor destaque.
          Danger {"\u00e9"} reservado para a{"\u00e7\u00f5"}es destrutivas ou alertas de seguran{"\u00e7"}a. Social aparece apenas no login.
        </p>
        <DSPanel>
          <ButtonShowcase />
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Full Width</h3>
        <p className="ds-subsection-desc">
          Bot{"\u00f5"}es de largura total s{"\u00e3"}o usados em contextos de confirma{"\u00e7\u00e3"}o (ex: {"\u201c"}Calcular dose{"\u201d"},
          {"\u201c"}Confirmar assinatura{"\u201d"}) onde o bot{"\u00e3"}o precisa ocupar toda a {"\u00e1"}rea dispon{"\u00ed"}vel para refor{"\u00e7"}ar
          a a{"\u00e7\u00e3"}o principal. Aplicam a classe utilit{"\u00e1"}ria <code>.w-full</code>.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-3">
            <button className="btn btn-lg btn-primary w-full">Confirmar</button>
            <button className="btn btn-lg btn-ghost w-full">Cancelar</button>
          </div>
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Estados Interativos</h3>
        <p className="ds-subsection-desc">
          Todos os bot{"\u00f5"}es possuem 5 estados visuais: default, hover (escurece levemente o fundo),
          focus (anel de foco 2px teal para acessibilidade via teclado), disabled (opacidade 0.38,
          sem intera{"\u00e7\u00e3"}o) e loading (spinner animado, pointer-events desativado).
        </p>
        <p className="ds-subsection-desc">
          O estado hover {"\u00e9"} vis{"\u00ed"}vel ao passar o cursor; o focus aparece na navega{"\u00e7\u00e3"}o por teclado.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div>
              <div className="ds-demo-label">Default</div>
              <div className="ds-demo-row">
                <button className="btn btn-md btn-primary">Default</button>
              </div>
            </div>
            <div>
              <div className="ds-demo-label">Disabled (classe .disabled)</div>
              <div className="ds-demo-row">
                <button className="btn btn-md btn-primary disabled">Disabled</button>
                <button className="btn btn-md btn-ghost disabled">Disabled</button>
                <button className="btn btn-md btn-secondary disabled">Disabled</button>
              </div>
            </div>
            <div>
              <div className="ds-demo-label">Loading (classe .btn-loading)</div>
              <div className="ds-demo-row">
                <button className="btn btn-md btn-primary btn-loading">Carregando...</button>
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Boas Pr{"\u00e1"}ticas</h3>
        <p className="ds-subsection-desc">Um bot{"\u00e3"}o mal posicionado atrasa o m{"\u00e9"}dico. Siga estas regras para garantir que cada a{"\u00e7\u00e3"}o esteja no lugar e momento certos.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Fa{"\u00e7"}a</div>
            {[
              'Use apenas 1 bot\u00e3o Primary por tela',
              'Bot\u00e3o de emerg\u00eancia sempre btn-lg (52dp)',
              'Loading state em a\u00e7\u00f5es que demoram >500ms',
            ].map(d => (
              <div key={d} className="flex gap-2 items-start mb-2">
                <i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                <span className="t-corpo-2">{d}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>N{"\u00e3"}o fa{"\u00e7"}a</div>
            {[
              'Nunca 2 bot\u00f5es Primary lado a lado',
              'Nunca btn-sm para a\u00e7\u00f5es cl\u00ednicas cr\u00edticas',
              'Nunca bot\u00e3o sem feedback visual ao toque',
            ].map(d => (
              <div key={d} className="flex gap-2 items-start mb-2">
                <i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
                <span className="t-corpo-2">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <p className="ds-subsection-desc">
          Refer{"\u00ea"}ncia r{"\u00e1"}pida de todas as classes dispon{"\u00ed"}veis para composi{"\u00e7\u00e3"}o de bot{"\u00f5"}es.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descri{"\u00e7\u00e3"}o</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.btn', desc: 'Base: inline-flex, gap 12px, font 600 16px, transi\u00e7\u00f5es' },
              { cls: '.btn-sm', desc: 'Altura 36px, radius 8px, padding 0 16px, font 14px' },
              { cls: '.btn-md', desc: 'Altura 48px, radius 12px, padding 0 24px' },
              { cls: '.btn-lg', desc: 'Min-height 56px, radius pill, padding 16px 24px' },
              { cls: '.btn-primary', desc: 'Fundo teal, texto branco \u2014 a\u00e7\u00e3o principal' },
              { cls: '.btn-ghost', desc: 'Outline teal, sem fundo \u2014 a\u00e7\u00e3o secund\u00e1ria' },
              { cls: '.btn-outline', desc: 'Outline teal (sin\u00f4nimo de ghost)' },
              { cls: '.btn-secondary', desc: 'Fundo elevated, borda \u2014 apoio visual' },
              { cls: '.btn-text', desc: 'Sem fundo/borda, cor link \u2014 a\u00e7\u00e3o terci\u00e1ria' },
              { cls: '.btn-discrete', desc: 'Sem fundo/borda, cor fg-3 \u2014 a\u00e7\u00e3o discreta' },
              { cls: '.btn-danger', desc: 'Fundo vermelho \u2014 a\u00e7\u00f5es destrutivas ou alertas' },
              { cls: '.btn-google', desc: 'Fundo card, borda, \u00edcone Google \u2014 login social' },
              { cls: '.btn-apple', desc: 'Fundo preto, \u00edcone Apple \u2014 login social' },
              { cls: '.btn-icon-only', desc: 'Circular 48x48, sem padding \u2014 apenas \u00edcone' },
              { cls: '.btn-loading', desc: 'Spinner animado, pointer-events none' },
              { cls: '.disabled', desc: 'Fundo disabled, cor disabled, opacidade 0.38' },
              { cls: '.w-full', desc: 'Largura 100%' },
            ].map(r => (
              <tr key={r.cls}>
                <td><span className="ds-token">{r.cls}</span></td>
                <td className="text-fg-2">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

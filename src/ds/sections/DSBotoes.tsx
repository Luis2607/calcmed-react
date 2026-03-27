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
      <p className="ds-subsection-desc">Configure o botão abaixo e veja o resultado em tempo real. Copie as classes CSS para usar no seu código.</p>

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
              <span className="t-corpo-2">Com ícone</span>
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
      <h2 className="ds-section-title">Botões</h2>
      <p className="ds-section-desc">
        Botões são o principal ponto de interação do médico com o app. Em contexto de emergência,
        cada toque precisa ser certeiro — por isso usamos touch targets de 48dp (ampliados para 52dp
        em ações críticas).
      </p>
      <p className="ds-section-desc">
        A hierarquia visual guia o olhar: Primary para a ação principal, Ghost
        para secundária, Text para terciária. São 7 hierarquias visuais em 3 tamanhos (SM 36px, MD 48px,
        LG 56px). A classe base <code>.btn</code> é combinada com a variante
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
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Houver 1 ação principal na tela. Use Primary para ela</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Precisar de ações secundárias. Use Ghost para complementar o Primary</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">A ação for destrutiva (deletar, cancelar assinatura). Use Danger exclusivamente</span></li>
            </ul>
          </div>
          <div className="flex-1">
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não use quando</div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Já houver outro Primary na mesma tela. Nunca 2 botões Primary na mesma tela</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar Danger para avisos genéricos. Danger é exclusivo para ações destrutivas</span></li>
              <li className="flex gap-2 items-start mb-2"><i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} /><span className="t-corpo-2">Usar btn-sm para ações clínicas críticas. O toque sob pressão exige targets maiores</span></li>
            </ul>
          </div>
        </div>
      </div>

      <ButtonPlayground />

      <div className="ds-subsection">
        <h3>Todas as Variantes</h3>
        <p className="ds-subsection-desc">
          Cada variante tem um papel semântico. Primary chama atenção para a ação principal da tela.
          Ghost e Outline são usados para ações secundárias.
        </p>
        <p className="ds-subsection-desc">
          Secondary serve de apoio com menor destaque.
          Danger é reservado para ações destrutivas ou alertas de segurança. Social aparece apenas no login.
        </p>
        <DSPanel>
          <ButtonShowcase />
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Full Width</h3>
        <p className="ds-subsection-desc">
          Botões de largura total são usados em contextos de confirmação (ex: {"\u201c"}Calcular dose{"\u201d"},
          {"\u201c"}Confirmar assinatura{"\u201d"}) onde o botão precisa ocupar toda a área disponível para reforçar
          a ação principal. Aplicam a classe utilitária <code>.w-full</code>.
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
          Todos os botões possuem 5 estados visuais: default, hover (escurece levemente o fundo),
          focus (anel de foco 2px teal para acessibilidade via teclado), disabled (opacidade 0.38,
          sem interação) e loading (spinner animado, pointer-events desativado).
        </p>
        <p className="ds-subsection-desc">
          O estado hover é visível ao passar o cursor; o focus aparece na navegação por teclado.
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
        <h3>Boas Práticas</h3>
        <p className="ds-subsection-desc">Um botão mal posicionado atrasa o médico. Siga estas regras para garantir que cada ação esteja no lugar e momento certos.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Faça</div>
            {[
              'Use apenas 1 botão Primary por tela',
              'Botão de emergência sempre btn-lg (52dp)',
              'Loading state em ações que demoram >500ms',
            ].map(d => (
              <div key={d} className="flex gap-2 items-start mb-2">
                <i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
                <span className="t-corpo-2">{d}</span>
              </div>
            ))}
          </div>
          <div>
            <div className="t-texto-badge text-danger mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Não faça</div>
            {[
              'Nunca 2 botões Primary lado a lado',
              'Nunca btn-sm para ações clínicas críticas',
              'Nunca botão sem feedback visual ao toque',
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
          Referência rápida de todas as classes disponíveis para composição de botões.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descrição</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.btn', desc: 'Base: inline-flex, gap 12px, font 600 16px, transições' },
              { cls: '.btn-sm', desc: 'Altura 36px, radius 8px, padding 0 16px, font 14px' },
              { cls: '.btn-md', desc: 'Altura 48px, radius 12px, padding 0 24px' },
              { cls: '.btn-lg', desc: 'Min-height 56px, radius pill, padding 16px 24px' },
              { cls: '.btn-primary', desc: 'Fundo teal, texto branco \u2014 ação principal' },
              { cls: '.btn-ghost', desc: 'Outline teal, sem fundo \u2014 ação secundária' },
              { cls: '.btn-outline', desc: 'Outline teal (sinônimo de ghost)' },
              { cls: '.btn-secondary', desc: 'Fundo elevated, borda \u2014 apoio visual' },
              { cls: '.btn-text', desc: 'Sem fundo/borda, cor link \u2014 ação terciária' },
              { cls: '.btn-discrete', desc: 'Sem fundo/borda, cor fg-3 \u2014 ação discreta' },
              { cls: '.btn-danger', desc: 'Fundo vermelho \u2014 ações destrutivas ou alertas' },
              { cls: '.btn-google', desc: 'Fundo card, borda, ícone Google \u2014 login social' },
              { cls: '.btn-apple', desc: 'Fundo preto, ícone Apple \u2014 login social' },
              { cls: '.btn-icon-only', desc: 'Circular 48x48, sem padding \u2014 apenas ícone' },
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

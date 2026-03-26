import { useState } from 'react'
import DSPanel from '../DSPanel'

function InputShowcase() {
  const [showPass, setShowPass] = useState(false)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Default */}
      <div className="input-group">
        <label className="input-label">Nome completo</label>
        <input className="input-field" placeholder="Digite seu nome" />
      </div>

      {/* Focus state */}
      <div className="input-group">
        <label className="input-label">Email</label>
        <input className="input-field" defaultValue="medico@hospital.com" placeholder="email@exemplo.com" />
        <span className="input-helper">Clique no campo para ver estado focus</span>
      </div>

      {/* Error */}
      <div className="input-group error">
        <label className="input-label">Creatinina</label>
        <input className="input-field error" defaultValue="15.5" />
        <span className="input-error">Valor fora do range clinico (0.1 - 12.0 mg/dL)</span>
      </div>

      {/* Success */}
      <div className="input-group">
        <label className="input-label">Peso</label>
        <input className="input-field success" defaultValue="72" />
        <span className="input-helper" style={{ color: 'var(--success)' }}>Valor valido</span>
      </div>

      {/* Disabled */}
      <div className="input-group">
        <label className="input-label disabled">Campo desabilitado</label>
        <input className="input-field disabled" disabled defaultValue="Nao editavel" />
      </div>

      {/* With Unit */}
      <div className="input-group">
        <label className="input-label">Peso do paciente</label>
        <div className="input-with-unit">
          <input className="input-field" defaultValue="72" />
          <span className="input-unit">kg</span>
        </div>
      </div>

      {/* Password */}
      <div className="input-group">
        <label className="input-label">Senha</label>
        <div className="input-password">
          <input
            className="input-field"
            type={showPass ? 'text' : 'password'}
            defaultValue="minhasenha123"
          />
          <button className="eye-toggle" onClick={() => setShowPass(!showPass)}>
            <i className={`ph ph-${showPass ? 'eye-slash' : 'eye'}`} />
          </button>
        </div>
      </div>

      {/* Textarea */}
      <div className="input-group">
        <label className="input-label">Observacoes</label>
        <textarea className="textarea" placeholder="Digite suas observacoes..." rows={3} />
      </div>

      {/* Select */}
      <div className="input-group">
        <label className="input-label">Sexo</label>
        <div className="select" style={{ width: '100%' }}>
          <span className="select-value">Masculino</span>
          <i className="ph ph-caret-down select-arrow" />
        </div>
      </div>
    </div>
  )
}

export default function DSInputs() {
  return (
    <div>
      <h2 className="ds-section-title">Inputs</h2>
      <p className="ds-section-desc">
        Label SEMPRE visivel acima do campo. Height padrao 48px. Radius 12px.
        Estados: default, focus (borda 2px teal), error (borda 2px red), success (borda 2px green), disabled.
      </p>

      <div className="ds-subsection">
        <h3>Todos os Tipos</h3>
        <DSPanel>
          <InputShowcase />
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Controles Adicionais</h3>
        <DSPanel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Toggle Segmented */}
            <div>
              <div style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Toggle Segmentado</div>
              <div className="toggle-seg">
                <button className="tab active">Anual</button>
                <button className="tab">Mensal</button>
              </div>
            </div>

            {/* Checkbox */}
            <div>
              <div style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Checkbox</div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <div className="checkbox on">&#10003;</div>
                <span style={{ font: "400 14px 'Inter'" }}>Selecionado</span>
                <div className="checkbox off" style={{ marginLeft: 16 }} />
                <span style={{ font: "400 14px 'Inter'" }}>Nao selecionado</span>
              </div>
            </div>

            {/* Radio */}
            <div>
              <div style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Radio</div>
              <div className="radio-group">
                <div className="radio-row">
                  <div className="radio on" />
                  <span className="radio-label">Opcao selecionada</span>
                </div>
                <div className="radio-row">
                  <div className="radio off" />
                  <span className="radio-label">Opcao nao selecionada</span>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div>
              <div style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Stepper</div>
              <div className="stepper">
                <button className="stepper-btn"><i className="ph ph-minus" /></button>
                <div className="stepper-value">72<span className="stepper-unit">kg</span></div>
                <button className="stepper-btn"><i className="ph ph-plus" /></button>
              </div>
            </div>

            {/* Search Bar */}
            <div>
              <div style={{ font: "600 13px 'Inter'", color: 'inherit', opacity: 0.6, marginBottom: 8 }}>Search Bar</div>
              <div className="search-bar">
                <i className="ph ph-magnifying-glass" />
                <input className="search-input" placeholder="Buscar calculadora, droga..." />
              </div>
            </div>
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
              { cls: '.input-group', desc: 'Container: flex column, gap 8px' },
              { cls: '.input-label', desc: 'Label: 500 14px Inter, cor fg-2' },
              { cls: '.input-field', desc: 'Campo: h48, radius 12px, borda 1px' },
              { cls: '.input-field:focus', desc: 'Borda 2px teal (border-focus)' },
              { cls: '.input-field.error', desc: 'Borda 2px red (border-error)' },
              { cls: '.input-field.success', desc: 'Borda 2px green (success)' },
              { cls: '.input-field.disabled', desc: 'Fundo elevated, cor disabled' },
              { cls: '.input-error', desc: 'Texto erro: 12px red' },
              { cls: '.input-helper', desc: 'Texto auxiliar: 12px fg-3' },
              { cls: '.input-with-unit', desc: 'Container com unidade a direita' },
              { cls: '.input-password', desc: 'Container com toggle eye' },
              { cls: '.textarea', desc: 'Min-h 96px, resize vertical' },
              { cls: '.select', desc: 'Dropdown: h48, radius 12px' },
              { cls: '.stepper', desc: 'Incremento numerico: -, valor, +' },
              { cls: '.search-bar', desc: 'Pill search: h48, radius pill' },
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

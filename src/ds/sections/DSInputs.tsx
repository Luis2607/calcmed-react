import { useState } from 'react'
import DSPanel from '../DSPanel'

function InputShowcase() {
  const [showPass, setShowPass] = useState(false)

  return (
    <div className="flex flex-col gap-6">
      {/* Default */}
      <div className="input-group">
        <label className="input-label">Nome completo</label>
        <input className="input-field" placeholder="Digite seu nome" />
      </div>

      {/* Focus state */}
      <div className="input-group">
        <label className="input-label">Email</label>
        <input className="input-field" defaultValue="medico@hospital.com" placeholder="email@exemplo.com" />
        <span className="input-helper">Clique no campo para ver o estado focus</span>
      </div>

      {/* Error */}
      <div className="input-group error">
        <label className="input-label">Creatinina</label>
        <input className="input-field error" defaultValue="15.5" />
        <span className="input-error">Valor fora do range clínico (0.1 — 12.0 mg/dL)</span>
      </div>

      {/* Success */}
      <div className="input-group">
        <label className="input-label">Peso</label>
        <input className="input-field success" defaultValue="72" />
        <span className="input-helper text-success">Valor válido</span>
      </div>

      {/* Disabled */}
      <div className="input-group">
        <label className="input-label disabled">Campo desabilitado</label>
        <input className="input-field disabled" disabled defaultValue="Não editável" />
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
        <label className="input-label">Observações</label>
        <textarea className="textarea" placeholder="Digite suas observações..." rows={3} />
      </div>

      {/* Select */}
      <div className="input-group">
        <label className="input-label">Sexo</label>
        <div className="select w-full">
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
        Inputs são os campos onde o médico insere dados clínicos — peso, dose, creatinina, idade.
        Em emergência, erros de digitação podem custar vidas. Por isso, todo input numérico possui
        validação de range clínico com feedback imediato (borda vermelha + mensagem de erro).
        A label é SEMPRE visível acima do campo (nunca placeholder-only). Altura padrão de 48px
        garante touch target adequado. Radius de 12px mantém consistência visual.
        Estados: default, focus (borda 2px teal), error (borda 2px vermelho), success (borda 2px verde),
        disabled (fundo elevated, sem interação).
      </p>

      <div className="ds-subsection">
        <h3>Todos os Tipos</h3>
        <p className="ds-subsection-desc">
          Campos de texto, email, numérico com unidade, senha com toggle de visibilidade,
          textarea para observações e select para escolha única. Cada tipo atende a um cenário
          específico de entrada de dados médicos.
        </p>
        <DSPanel>
          <InputShowcase />
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Controles Adicionais</h3>
        <p className="ds-subsection-desc">
          Além dos inputs tradicionais, o sistema inclui controles especializados: toggle segmentado
          para alternância entre opções (ex: plano Anual/Mensal), checkbox e radio para seleções,
          stepper numérico para ajuste preciso de valores (ex: peso em kg) e barra de busca.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-5">
            {/* Toggle Segmented */}
            <div>
              <div className="ds-demo-label">Toggle Segmentado</div>
              <div className="toggle-seg">
                <button className="tab active">Anual</button>
                <button className="tab">Mensal</button>
              </div>
            </div>

            {/* Checkbox */}
            <div>
              <div className="ds-demo-label">Checkbox</div>
              <div className="flex items-center gap-3">
                <div className="checkbox on">&#10003;</div>
                <span className="t-corpo-2">Selecionado</span>
                <div className="checkbox off" style={{ marginLeft: 16 }} />
                <span className="t-corpo-2">Não selecionado</span>
              </div>
            </div>

            {/* Radio */}
            <div>
              <div className="ds-demo-label">Radio</div>
              <div className="radio-group">
                <div className="radio-row">
                  <div className="radio on" />
                  <span className="radio-label">Opção selecionada</span>
                </div>
                <div className="radio-row">
                  <div className="radio off" />
                  <span className="radio-label">Opção não selecionada</span>
                </div>
              </div>
            </div>

            {/* Stepper */}
            <div>
              <div className="ds-demo-label">Stepper</div>
              <div className="stepper">
                <button className="stepper-btn"><i className="ph ph-minus" /></button>
                <div className="stepper-value">72<span className="stepper-unit">kg</span></div>
                <button className="stepper-btn"><i className="ph ph-plus" /></button>
              </div>
            </div>

            {/* Search Bar */}
            <div>
              <div className="ds-demo-label">Search Bar</div>
              <div className="search-bar">
                <i className="ph ph-magnifying-glass" />
                <input className="search-input" placeholder="Buscar calculadora, droga..." />
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Input with Icon */}
      <div className="ds-subsection">
        <h3>Input com Ícone</h3>
        <p className="ds-subsection-desc">
          Campos com ícone à esquerda para reforço visual do contexto (ex: lupa para busca).
          O ícone é posicionado via <code>.input-with-icon</code> + <code>.input-icon-left</code>.
        </p>
        <DSPanel>
          <div className="flex flex-col gap-4">
            <div className="input-group">
              <label className="input-label">Buscar</label>
              <div className="input-with-icon">
                <i className="ph ph-magnifying-glass input-icon-left" />
                <input className="input-field" placeholder="Buscar calculadora, droga..." />
              </div>
            </div>
          </div>
        </DSPanel>
      </div>

      {/* Select Dropdown Open */}
      <div className="ds-subsection">
        <h3>Select Dropdown (aberto)</h3>
        <p className="ds-subsection-desc">
          Visualização do dropdown em estado aberto. As opções aparecem sobre o conteúdo
          com shadow e radius consistentes. A opção selecionada é destacada com cor primary e checkmark.
        </p>
        <DSPanel>
          <div className="select-open-demo">
            <div className="input-group">
              <label className="input-label">Sexo</label>
              <div className="select w-full">
                <span className="select-value">Masculino</span>
                <i className="ph ph-caret-up select-arrow" />
              </div>
            </div>
            <div className="select-options" style={{ position: 'relative', marginTop: 4 }}>
              <div className="select-option selected">Masculino</div>
              <div className="select-option">Feminino</div>
              <div className="select-option">Outro</div>
            </div>
          </div>
        </DSPanel>
      </div>

      <div className="ds-subsection">
        <h3>Boas Práticas</h3>
        <p className="ds-subsection-desc">Diretrizes para uso correto dos componentes em contexto clínico.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Faça</div>
            {[
              'Label SEMPRE visível acima do campo',
              'Teclado numérico automático para campos de dose',
              'Feedback de erro imediato, abaixo do campo',
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
              'Nunca usar placeholder como substituto de label',
              'Nunca aceitar valor fora da faixa clínica sem alerta',
              'Nunca campo de dose sem unidade visível (mg, mL, kg)',
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
          Referência de todas as classes de input, incluindo estados e variantes compostas.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descrição</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.input-group', desc: 'Container: flex column, gap 8px' },
              { cls: '.input-label', desc: 'Label: 500 14px Inter, cor fg-2 — sempre visível' },
              { cls: '.input-field', desc: 'Campo: altura 48px, radius 12px, borda 1px' },
              { cls: '.input-field:focus', desc: 'Borda 2px teal (border-focus) — estado ativo' },
              { cls: '.input-field.error', desc: 'Borda 2px vermelho (border-error) — validação falhou' },
              { cls: '.input-field.success', desc: 'Borda 2px verde (success) — valor válido' },
              { cls: '.input-field.disabled', desc: 'Fundo elevated, cor disabled — sem interação' },
              { cls: '.input-error', desc: 'Texto de erro: 12px vermelho' },
              { cls: '.input-helper', desc: 'Texto auxiliar: 12px fg-3' },
              { cls: '.input-with-unit', desc: 'Container com unidade à direita (ex: kg, mg/dL)' },
              { cls: '.input-password', desc: 'Container com toggle de visibilidade (eye)' },
              { cls: '.textarea', desc: 'Min-height 96px, resize vertical' },
              { cls: '.select', desc: 'Dropdown: altura 48px, radius 12px' },
              { cls: '.stepper', desc: 'Incremento numérico: botão -, valor, botão +' },
              { cls: '.search-bar', desc: 'Busca pill: altura 48px, radius pill' },
              { cls: '.input-with-icon', desc: 'Container relativo para ícone dentro do input' },
              { cls: '.input-icon-left', desc: 'Ícone posicionado à esquerda do campo' },
              { cls: '.select-options', desc: 'Dropdown aberto: fundo card, shadow-3, radius lg' },
              { cls: '.select-option', desc: 'Opção do dropdown: padding, hover bg-hover' },
              { cls: '.select-option.selected', desc: 'Selecionada: cor primary, font 600, checkmark' },
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

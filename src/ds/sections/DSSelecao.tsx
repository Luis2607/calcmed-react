import DSPanel from '../DSPanel'

function RadioDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div className="radio-group">
        <div className="radio-row">
          <div className="radio on" />
          <span className="radio-label">Sedação com Ketamina</span>
        </div>
        <div className="radio-row">
          <div className="radio off" />
          <span className="radio-label">Sedação com Propofol</span>
        </div>
        <div className="radio-row">
          <div className="radio off" />
          <span className="radio-label">Sedação com Midazolam</span>
        </div>
      </div>

      <div className="ds-demo-label">Disabled</div>
      <div className="radio-group">
        <div className="radio-row">
          <div className="radio on disabled" />
          <span className="radio-label disabled">Opção indisponível (selecionada)</span>
        </div>
        <div className="radio-row">
          <div className="radio off disabled" />
          <span className="radio-label disabled">Opção indisponível</span>
        </div>
      </div>
    </div>
  )
}

function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="checkbox on">&#10003;</div>
        <span className="t-corpo-2">Diabetes Mellitus (DM)</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="checkbox on">&#10003;</div>
        <span className="t-corpo-2">Hipertensão Arterial (HAS)</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="checkbox off" />
        <span className="t-corpo-2">Insuficiência Renal Crônica (IRC)</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="checkbox off disabled" />
        <span className="t-corpo-2 text-fg-3">DPOC (indisponível)</span>
      </div>
    </div>
  )
}

function ToggleDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="ds-demo-label">Alternância binária</div>
        <div className="toggle-seg">
          <button className="tab active">Adulto</button>
          <button className="tab">Pediatria</button>
        </div>
      </div>
    </div>
  )
}

function SegmentedDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="ds-demo-label">3 opções</div>
        <div className="toggle-seg">
          <button className="tab">Calendário</button>
          <button className="tab active">Histórico</button>
          <button className="tab">Hospitais</button>
        </div>
      </div>
    </div>
  )
}

function StepperDemo() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="ds-demo-label">FiO₂ (incremento de 5%)</div>
        <div className="stepper">
          <button className="stepper-btn"><i className="ph ph-minus" /></button>
          <div className="stepper-value">40<span className="stepper-unit">%</span></div>
          <button className="stepper-btn"><i className="ph ph-plus" /></button>
        </div>
      </div>
      <div>
        <div className="ds-demo-label">Glasgow Motor (1-6)</div>
        <div className="stepper">
          <button className="stepper-btn"><i className="ph ph-minus" /></button>
          <div className="stepper-value">4</div>
          <button className="stepper-btn"><i className="ph ph-plus" /></button>
        </div>
      </div>
    </div>
  )
}

export default function DSSelecao() {
  return (
    <div>
      <h2 className="ds-section-title">Controles de Seleção</h2>
      <p className="ds-section-desc">
        Componentes para escolher entre opções. A escolha do controle correto é crítica em
        contexto médico — usar radio quando deveria ser checkbox (ou vice-versa) pode levar
        a erros clínicos graves.
      </p>

      {/* Radio */}
      <div className="ds-subsection">
        <h3>Radio — Seleção Única</h3>
        <p className="ds-subsection-desc">
          Use quando o médico deve escolher EXATAMENTE uma opção entre várias.
          Exemplo: Sexo (Masculino/Feminino), Tipo de sedação, Classificação de Glasgow por critério.
        </p>
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex gap-2 items-start">
            <i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
            <span className="t-corpo-2"><strong>Quando usar:</strong> Opções mutuamente exclusivas. Selecionar uma desmarca a anterior.</span>
          </div>
          <div className="flex gap-2 items-start">
            <i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
            <span className="t-corpo-2"><strong>Quando NÃO usar:</strong> Se o médico pode selecionar múltiplas opções, use Checkbox.</span>
          </div>
        </div>
        <DSPanel>
          <RadioDemo />
        </DSPanel>
      </div>

      {/* Checkbox */}
      <div className="ds-subsection">
        <h3>Checkbox — Seleção Múltipla</h3>
        <p className="ds-subsection-desc">
          Use quando o médico pode selecionar ZERO ou MAIS opções.
          Exemplo: Comorbidades (DM, HAS, IRC, DPOC), Sintomas presentes, Medicações em uso.
        </p>
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex gap-2 items-start">
            <i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
            <span className="t-corpo-2"><strong>Quando usar:</strong> Opções independentes entre si. Cada uma pode ser ligada/desligada sem afetar as outras.</span>
          </div>
          <div className="flex gap-2 items-start">
            <i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
            <span className="t-corpo-2"><strong>Quando NÃO usar:</strong> Se apenas uma opção é permitida, use Radio.</span>
          </div>
        </div>
        <DSPanel>
          <CheckboxDemo />
        </DSPanel>
      </div>

      {/* Toggle */}
      <div className="ds-subsection">
        <h3>Toggle — Alternância Binária</h3>
        <p className="ds-subsection-desc">
          Use para alternar entre dois estados com efeito imediato.
          Exemplo: Adulto/Pediatria, Light/Dark mode, Notificações on/off.
        </p>
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex gap-2 items-start">
            <i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
            <span className="t-corpo-2"><strong>Quando usar:</strong> Apenas 2 estados. A mudança tem efeito imediato (não precisa de botão &lsquo;Salvar&rsquo;).</span>
          </div>
          <div className="flex gap-2 items-start">
            <i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
            <span className="t-corpo-2"><strong>Quando NÃO usar:</strong> Se há 3+ opções, use Controle Segmentado. Se a mudança precisa ser confirmada, use Radio + botão.</span>
          </div>
        </div>
        <DSPanel>
          <ToggleDemo />
        </DSPanel>
      </div>

      {/* Segmented Control */}
      <div className="ds-subsection">
        <h3>Controle Segmentado — 2 a 4 Opções</h3>
        <p className="ds-subsection-desc">
          Use para alternar entre 2-4 opções visíveis simultaneamente.
          Exemplo: Seq. Rápida/Manutenção, Calendário/Histórico/Hospitais.
        </p>
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex gap-2 items-start">
            <i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
            <span className="t-corpo-2"><strong>Quando usar:</strong> 2-4 opções igualmente importantes, visíveis simultaneamente.</span>
          </div>
          <div className="flex gap-2 items-start">
            <i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
            <span className="t-corpo-2"><strong>Quando NÃO usar:</strong> Se há 5+ opções, use Tabs ou Select.</span>
          </div>
        </div>
        <DSPanel>
          <SegmentedDemo />
        </DSPanel>
      </div>

      {/* Stepper */}
      <div className="ds-subsection">
        <h3>Stepper — Incremento Numérico</h3>
        <p className="ds-subsection-desc">
          Use para ajustar valores numéricos em incrementos pequenos e previsíveis.
          Exemplo: FiO₂ (incremento de 5%), Idade (incremento de 1), Nível de Glasgow.
        </p>
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex gap-2 items-start">
            <i className="ph ph-check-circle" style={{ color: 'var(--success)', flexShrink: 0, marginTop: 2 }} />
            <span className="t-corpo-2"><strong>Quando usar:</strong> Faixa pequena de valores (ex: 1-20). Incrementos regulares. O médico precisa de precisão.</span>
          </div>
          <div className="flex gap-2 items-start">
            <i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
            <span className="t-corpo-2"><strong>Quando NÃO usar:</strong> Se a faixa é grande (ex: peso 30-300kg), use Input numérico.</span>
          </div>
        </div>
        <DSPanel>
          <StepperDemo />
        </DSPanel>
      </div>

      {/* Boas Práticas */}
      <div className="ds-subsection">
        <h3>Boas Práticas</h3>
        <p className="ds-subsection-desc">Diretrizes para uso correto dos controles de seleção em contexto clínico.</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div>
            <div className="t-texto-badge text-success mb-3" style={{ textTransform: 'uppercase', letterSpacing: 1 }}>Faça</div>
            {[
              'Radio para seleção única, Checkbox para múltipla — nunca o contrário',
              'Toggle para mudanças imediatas, Radio + Salvar para mudanças que precisam confirmação',
              'Stepper quando precisão importa e a faixa é pequena',
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
              'Nunca usar checkbox quando apenas uma opção é permitida',
              'Nunca usar radio sem pré-selecionar uma opção (o médico pode esquecer)',
              'Nunca stepper para faixas grandes (peso, creatinina) — use input numérico',
            ].map(d => (
              <div key={d} className="flex gap-2 items-start mb-2">
                <i className="ph ph-x-circle" style={{ color: 'var(--danger)', flexShrink: 0, marginTop: 2 }} />
                <span className="t-corpo-2">{d}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Reference */}
      <div className="ds-subsection">
        <h3>Classes CSS</h3>
        <p className="ds-subsection-desc">
          Referência de todas as classes de controles de seleção.
        </p>
        <table className="ds-token-table">
          <thead>
            <tr><th>Classe</th><th>Descrição</th></tr>
          </thead>
          <tbody>
            {[
              { cls: '.radio-group', desc: 'Container vertical para grupo de radios' },
              { cls: '.radio-row', desc: 'Linha: radio circle + label, gap 8px' },
              { cls: '.radio.on', desc: 'Radio selecionado: borda primary, dot preenchido' },
              { cls: '.radio.off', desc: 'Radio não selecionado: borda border-default' },
              { cls: '.radio.disabled', desc: 'Radio desabilitado: opacidade reduzida, sem interação' },
              { cls: '.radio-label', desc: 'Label do radio: 14px Inter, cor fg-1' },
              { cls: '.checkbox.on', desc: 'Checkbox marcado: fundo primary, checkmark branco' },
              { cls: '.checkbox.off', desc: 'Checkbox desmarcado: borda border-default' },
              { cls: '.checkbox.disabled', desc: 'Checkbox desabilitado: opacidade reduzida' },
              { cls: '.toggle-seg', desc: 'Container segmentado: fundo elevated, radius pill' },
              { cls: '.toggle-seg .tab', desc: 'Opção do segmentado: padding 8px 16px' },
              { cls: '.toggle-seg .tab.active', desc: 'Opção ativa: fundo card, shadow-1, font 600' },
              { cls: '.stepper', desc: 'Container: botão -, valor central, botão +' },
              { cls: '.stepper-btn', desc: 'Botão +/-: 40px, radius 12px, fundo elevated' },
              { cls: '.stepper-value', desc: 'Valor central: JetBrains Mono 600, min-width 64px' },
              { cls: '.stepper-unit', desc: 'Unidade ao lado do valor: 12px fg-3' },
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

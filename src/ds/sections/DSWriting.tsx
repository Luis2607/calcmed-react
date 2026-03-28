import DSPanel from '../DSPanel'

const principios = [
  {
    icon: 'ph-crosshair',
    title: 'Direto ao ponto',
    desc: 'Frases curtas, máximo 15 palavras. O médico está sob pressão.',
  },
  {
    icon: 'ph-heartbeat',
    title: 'Clinicamente preciso',
    desc: 'Use terminologia médica correta. Não simplifique nomes de drogas ou unidades.',
  },
  {
    icon: 'ph-cursor-click',
    title: 'Ação clara',
    desc: 'Todo botão diz exatamente o que faz. "Calcular dose" não "Enviar" ou "OK".',
  },
  {
    icon: 'ph-shield-check',
    title: 'Sem alarme desnecessário',
    desc: 'Vermelho só para risco real. Não inflacione urgência.',
  },
]

const hierarquiaTexto = [
  {
    contexto: 'Título de tela',
    correto: 'Intubação',
    errado: 'Tela de Intubação Orotraqueal',
    porque: 'Médico já sabe o contexto',
  },
  {
    contexto: 'Label de input',
    correto: 'Peso (kg)',
    errado: 'Insira o peso do paciente em quilogramas',
    porque: 'Redundante',
  },
  {
    contexto: 'Botão primário',
    correto: 'Calcular',
    errado: 'Clique para calcular',
    porque: '"Clique" é redundante em touch',
  },
  {
    contexto: 'Erro de validação',
    correto: 'Peso: 30\u2013300 kg',
    errado: 'O valor inserido está fora da faixa permitida',
    porque: 'Range é mais útil que prosa',
  },
  {
    contexto: 'Alerta crítico',
    correto: 'Dose máxima excedida: 2mg/kg',
    errado: 'Atenção! A dose calculada ultrapassa o limite!',
    porque: 'Dados, não drama',
  },
  {
    contexto: 'Toast sucesso',
    correto: 'Plantão salvo',
    errado: 'Seu plantão foi salvo com sucesso!',
    porque: 'Sem exclamação, sem "seu"',
  },
]

const microcopy = [
  {
    componente: 'Botões',
    icon: 'ph-cursor-click',
    regra: 'Verbo no infinitivo. Máximo 3 palavras.',
    bom: '"Calcular", "Entrar", "Salvar"',
    ruim: '"Clique aqui para salvar", "Submeter formulário"',
  },
  {
    componente: 'Labels',
    icon: 'ph-tag',
    regra: 'Substantivo + unidade entre parênteses.',
    bom: '"Creatinina (mg/dL)"',
    ruim: '"Creatinina sérica do paciente"',
  },
  {
    componente: 'Placeholders',
    icon: 'ph-textbox',
    regra: 'Exemplo real, não instrução.',
    bom: '"Ex: 70"',
    ruim: '"Digite o peso aqui"',
  },
  {
    componente: 'Erros',
    icon: 'ph-warning',
    regra: 'Range numérico sempre.',
    bom: '"Idade: 18\u2013120 anos"',
    ruim: '"Idade inválida"',
  },
  {
    componente: 'Empty states',
    icon: 'ph-empty',
    regra: 'Ação primeiro.',
    bom: '"Adicione favoritos para acesso rápido"',
    ruim: '"Você ainda não tem favoritos"',
  },
  {
    componente: 'Toasts',
    icon: 'ph-check-circle',
    regra: 'Passado simples.',
    bom: '"Plantão salvo", "Dose calculada", "Link enviado"',
    ruim: '"Operação realizada com sucesso!"',
  },
  {
    componente: 'Modais',
    icon: 'ph-chat-circle',
    regra: 'Pergunta + consequência + ação.',
    bom: '"Cancelar assinatura? Você perderá acesso a todas as funcionalidades premium. Cancelar assinatura / Manter plano"',
    ruim: '"Tem certeza? Sim / Não"',
  },
]

const palavrasProibidas = [
  { proibida: '"Clique"', correta: '"Toque"', motivo: 'É mobile' },
  { proibida: '"Usuário"', correta: '"Médico" ou "Plantonista"', motivo: 'Humanizar' },
  { proibida: '"Erro" sozinho', correta: 'Sempre diga QUAL erro e como resolver', motivo: 'Acionável' },
  { proibida: '"!" em alertas', correta: 'Dados, não drama', motivo: 'Tom clínico' },
  { proibida: '"Obrigatório" em labels', correta: 'Asterisco (*) basta', motivo: 'Concisão' },
  { proibida: '"Sucesso!"', correta: 'Passado simples: "Salvo", "Enviado", "Calculado"', motivo: 'Objetividade' },
]

const boasPraticas = {
  fazer: [
    'Frases com no máximo 15 palavras',
    'Terminologia médica precisa (mg/kg, mL/min, mcg/kg/min)',
    'Números sempre com unidade visível',
  ],
  naoFazer: [
    'Frases longas com múltiplas orações subordinadas',
    'Simplificar termos médicos para leigos (o público é médico)',
    'Exclamações em contexto clínico',
  ],
}

export default function DSWriting() {
  return (
    <div>
      <h2 className="ds-section-title">Tom de Voz e Escrita</h2>
      <p className="ds-section-desc">
        Como escrevemos no CalcMed define a confiança que o médico sente ao usar o app. Cada palavra precisa ser precisa, direta e clinicamente segura. Em emergência, ambiguidade pode custar vidas.
      </p>

      {/* 1. Princípios de Escrita */}
      <div className="ds-subsection">
        <h3>Princípios de Escrita</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Quatro regras que guiam cada palavra escrita no CalcMed. Toda microcopy, label e mensagem de erro passa por estes filtros antes de entrar no produto.
        </p>
        <DSPanel title="Princípios">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
            {principios.map(p => (
              <div
                key={p.title}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-xl, 16px)',
                  padding: 20,
                  background: 'var(--bg-surface)',
                }}
              >
                <i
                  className={`ph ${p.icon}`}
                  style={{ fontSize: 24, color: 'var(--btn-primary)', display: 'block', marginBottom: 12 }}
                />
                <div className="t-corpo text-fg" style={{ fontWeight: 700, marginBottom: 8 }}>{p.title}</div>
                <p className="t-corpo-2 text-fg-2" style={{ margin: 0 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </DSPanel>
      </div>

      {/* 2. Hierarquia de Texto por Contexto */}
      <div className="ds-subsection">
        <h3>Hierarquia de Texto por Contexto</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Cada contexto de interface tem um padrão de escrita específico. A coluna "Por quê" justifica a decisão para que o time inteiro escreva com consistência.
        </p>
        <DSPanel title="Comparação de texto por contexto">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--fg)' }}>Contexto</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--success)' }}>Correto</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--danger)' }}>Errado</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--fg-2)' }}>Por quê</th>
                </tr>
              </thead>
              <tbody>
                {hierarquiaTexto.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', fontWeight: 500 }}>{row.contexto}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--success)' }}>{row.correto}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--danger)', textDecoration: 'line-through', opacity: 0.8 }}>{row.errado}</td>
                    <td className="text-fg-2" style={{ padding: '10px 12px', fontStyle: 'italic' }}>{row.porque}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DSPanel>
      </div>

      {/* 3. Microcopy por Componente */}
      <div className="ds-subsection">
        <h3>Microcopy por Componente</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Diretrizes específicas para cada tipo de elemento de interface. Siga estes padrões para manter consistência em todo o app.
        </p>
        <DSPanel title="Regras por componente">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {microcopy.map(m => (
              <div
                key={m.componente}
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--radius-lg, 12px)',
                  padding: 16,
                  background: 'var(--bg-surface)',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <i className={`ph ${m.icon}`} style={{ fontSize: 18, color: 'var(--btn-primary)' }} />
                  <span className="t-corpo text-fg" style={{ fontWeight: 700 }}>{m.componente}</span>
                </div>
                <p className="t-corpo-2 text-fg-2" style={{ margin: '0 0 8px' }}>{m.regra}</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, fontSize: 13 }}>
                  <span style={{ color: 'var(--success)' }}>
                    <i className="ph ph-check" style={{ marginRight: 4 }} />
                    {m.bom}
                  </span>
                  <span style={{ color: 'var(--danger)', textDecoration: 'line-through', opacity: 0.8 }}>
                    <i className="ph ph-x" style={{ marginRight: 4 }} />
                    {m.ruim}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </DSPanel>
      </div>

      {/* 4. Palavras Proibidas */}
      <div className="ds-subsection">
        <h3>Palavras Proibidas</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Termos que nunca devem aparecer na interface do CalcMed, com suas alternativas corretas.
        </p>
        <DSPanel title="Lista de substituições">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--danger)' }}>Proibido</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--success)' }}>Usar</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--fg-2)' }}>Motivo</th>
                </tr>
              </thead>
              <tbody>
                {palavrasProibidas.map((row, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '10px 12px', color: 'var(--danger)', fontWeight: 500 }}>{row.proibida}</td>
                    <td style={{ padding: '10px 12px', color: 'var(--success)' }}>{row.correta}</td>
                    <td className="text-fg-2" style={{ padding: '10px 12px', fontStyle: 'italic' }}>{row.motivo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DSPanel>
      </div>

      {/* 5. Boas Práticas */}
      <div className="ds-subsection">
        <h3>Boas Práticas</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Resumo visual para consulta rápida durante a produção de conteúdo.
        </p>
        <div className="ds-guideline do">
          <div className="ds-guideline-label">Fazer</div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {boasPraticas.fazer.map((item, i) => (
              <li key={i} className="t-corpo-2" style={{ marginBottom: 4 }}>{item}</li>
            ))}
          </ul>
        </div>
        <div className="ds-guideline dont">
          <div className="ds-guideline-label">Não Fazer</div>
          <ul style={{ margin: 0, paddingLeft: 20 }}>
            {boasPraticas.naoFazer.map((item, i) => (
              <li key={i} className="t-corpo-2" style={{ marginBottom: 4 }}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

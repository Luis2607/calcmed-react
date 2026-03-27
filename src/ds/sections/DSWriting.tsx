import DSPanel from '../DSPanel'

const principios = [
  {
    icon: 'ph-crosshair',
    title: 'Direto ao ponto',
    desc: 'Frases curtas, m\u00e1ximo 15 palavras. O m\u00e9dico est\u00e1 sob press\u00e3o.',
  },
  {
    icon: 'ph-heartbeat',
    title: 'Clinicamente preciso',
    desc: 'Use terminologia m\u00e9dica correta. N\u00e3o simplifique nomes de drogas ou unidades.',
  },
  {
    icon: 'ph-cursor-click',
    title: 'A\u00e7\u00e3o clara',
    desc: 'Todo bot\u00e3o diz exatamente o que faz. "Calcular dose" n\u00e3o "Enviar" ou "OK".',
  },
  {
    icon: 'ph-shield-check',
    title: 'Sem alarme desnecess\u00e1rio',
    desc: 'Vermelho s\u00f3 para risco real. N\u00e3o inflacione urg\u00eancia.',
  },
]

const hierarquiaTexto = [
  {
    contexto: 'T\u00edtulo de tela',
    correto: 'Intuba\u00e7\u00e3o',
    errado: 'Tela de Intuba\u00e7\u00e3o Orotraqueal',
    porque: 'M\u00e9dico j\u00e1 sabe o contexto',
  },
  {
    contexto: 'Label de input',
    correto: 'Peso (kg)',
    errado: 'Insira o peso do paciente em quilogramas',
    porque: 'Redundante',
  },
  {
    contexto: 'Bot\u00e3o prim\u00e1rio',
    correto: 'Calcular',
    errado: 'Clique para calcular',
    porque: '"Clique" \u00e9 redundante em touch',
  },
  {
    contexto: 'Erro de valida\u00e7\u00e3o',
    correto: 'Peso: 30\u2013300 kg',
    errado: 'O valor inserido est\u00e1 fora da faixa permitida',
    porque: 'Range \u00e9 mais \u00fatil que prosa',
  },
  {
    contexto: 'Alerta cr\u00edtico',
    correto: 'Dose m\u00e1xima excedida: 2mg/kg',
    errado: 'Aten\u00e7\u00e3o! A dose calculada ultrapassa o limite!',
    porque: 'Dados, n\u00e3o drama',
  },
  {
    contexto: 'Toast sucesso',
    correto: 'Plant\u00e3o salvo',
    errado: 'Seu plant\u00e3o foi salvo com sucesso!',
    porque: 'Sem exclama\u00e7\u00e3o, sem "seu"',
  },
]

const microcopy = [
  {
    componente: 'Bot\u00f5es',
    icon: 'ph-cursor-click',
    regra: 'Verbo no infinitivo. M\u00e1ximo 3 palavras.',
    bom: '"Calcular", "Entrar", "Salvar"',
    ruim: '"Clique aqui para salvar", "Submeter formul\u00e1rio"',
  },
  {
    componente: 'Labels',
    icon: 'ph-tag',
    regra: 'Substantivo + unidade entre par\u00eanteses.',
    bom: '"Creatinina (mg/dL)"',
    ruim: '"Creatinina s\u00e9rica do paciente"',
  },
  {
    componente: 'Placeholders',
    icon: 'ph-textbox',
    regra: 'Exemplo real, n\u00e3o instru\u00e7\u00e3o.',
    bom: '"Ex: 70"',
    ruim: '"Digite o peso aqui"',
  },
  {
    componente: 'Erros',
    icon: 'ph-warning',
    regra: 'Range num\u00e9rico sempre.',
    bom: '"Idade: 18\u2013120 anos"',
    ruim: '"Idade inv\u00e1lida"',
  },
  {
    componente: 'Empty states',
    icon: 'ph-empty',
    regra: 'A\u00e7\u00e3o primeiro.',
    bom: '"Adicione favoritos para acesso r\u00e1pido"',
    ruim: '"Voc\u00ea ainda n\u00e3o tem favoritos"',
  },
  {
    componente: 'Toasts',
    icon: 'ph-check-circle',
    regra: 'Passado simples.',
    bom: '"Plant\u00e3o salvo", "Dose calculada", "Link enviado"',
    ruim: '"Opera\u00e7\u00e3o realizada com sucesso!"',
  },
  {
    componente: 'Modais',
    icon: 'ph-chat-circle',
    regra: 'Pergunta + consequ\u00eancia + a\u00e7\u00e3o.',
    bom: '"Cancelar assinatura? Voc\u00ea perder\u00e1 acesso a todas as funcionalidades premium. Cancelar assinatura / Manter plano"',
    ruim: '"Tem certeza? Sim / N\u00e3o"',
  },
]

const palavrasProibidas = [
  { proibida: '"Clique"', correta: '"Toque"', motivo: '\u00c9 mobile' },
  { proibida: '"Usu\u00e1rio"', correta: '"M\u00e9dico" ou "Plantonista"', motivo: 'Humanizar' },
  { proibida: '"Erro" sozinho', correta: 'Sempre diga QUAL erro e como resolver', motivo: 'Acion\u00e1vel' },
  { proibida: '"!" em alertas', correta: 'Dados, n\u00e3o drama', motivo: 'Tom cl\u00ednico' },
  { proibida: '"Obrigat\u00f3rio" em labels', correta: 'Asterisco (*) basta', motivo: 'Concis\u00e3o' },
  { proibida: '"Sucesso!"', correta: 'Passado simples: "Salvo", "Enviado", "Calculado"', motivo: 'Objetividade' },
]

const boasPraticas = {
  fazer: [
    'Frases com no m\u00e1ximo 15 palavras',
    'Terminologia m\u00e9dica precisa (mg/kg, mL/min, mcg/kg/min)',
    'N\u00fameros sempre com unidade vis\u00edvel',
  ],
  naoFazer: [
    'Frases longas com m\u00faltiplas ora\u00e7\u00f5es subordinadas',
    'Simplificar termos m\u00e9dicos para leigos (o p\u00fablico \u00e9 m\u00e9dico)',
    'Exclama\u00e7\u00f5es em contexto cl\u00ednico',
  ],
}

export default function DSWriting() {
  return (
    <div>
      <h2 className="ds-section-title">Tom de Voz e Escrita</h2>
      <p className="ds-section-desc">
        Como escrevemos no CalcMed define a confian\u00e7a que o m\u00e9dico sente ao usar o app. Cada palavra precisa ser precisa, direta e clinicamente segura. Em emerg\u00eancia, ambiguidade pode custar vidas.
      </p>

      {/* 1. Princ\u00edpios de Escrita */}
      <div className="ds-subsection">
        <h3>Princ\u00edpios de Escrita</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Quatro regras que guiam cada palavra escrita no CalcMed. Toda microcopy, label e mensagem de erro passa por estes filtros antes de entrar no produto.
        </p>
        <DSPanel title="Princ\u00edpios">
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
                <div className="t-titulo-card" style={{ fontWeight: 700, marginBottom: 8 }}>{p.title}</div>
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
          Cada contexto de interface tem um padr\u00e3o de escrita espec\u00edfico. A coluna "Por qu\u00ea" justifica a decis\u00e3o para que o time inteiro escreva com consist\u00eancia.
        </p>
        <DSPanel title="Compara\u00e7\u00e3o de texto por contexto">
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--fg-1)' }}>Contexto</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--success)' }}>Correto</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--danger)' }}>Errado</th>
                  <th style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 600, color: 'var(--fg-2)' }}>Por qu\u00ea</th>
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
          Diretrizes espec\u00edficas para cada tipo de elemento de interface. Siga estes padr\u00f5es para manter consist\u00eancia em todo o app.
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
                  <span className="t-titulo-card" style={{ fontWeight: 700 }}>{m.componente}</span>
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
        <DSPanel title="Lista de substitui\u00e7\u00f5es">
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

      {/* 5. Boas Pr\u00e1ticas */}
      <div className="ds-subsection">
        <h3>Boas Pr\u00e1ticas</h3>
        <p className="t-corpo-2 text-fg-2 mb-3">
          Resumo visual para consulta r\u00e1pida durante a produ\u00e7\u00e3o de conte\u00fado.
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
          <div className="ds-guideline-label">N\u00e3o Fazer</div>
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

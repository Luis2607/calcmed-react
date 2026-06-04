import { Chip } from '../../shared/components/molecules/Chip';
import { AlertCard } from '../../shared/components/organisms/AlertCard';
import styles from './AiResponseSystemGallery.module.css';

/* ============================================================
   IA · Sistema de Respostas (AI Response System)
   Página de documentação viva DENTRO do Design System CalcMed.
   Aditiva: não altera tokens, componentes ou páginas existentes.
   Reusa os tokens do DS (--ds-, --esp-, --radius-) e os componentes
   Chip e AlertCard nos exemplos aplicados — sem visual paralelo.

   Estrutura macro (documentação de produto, taxonomia ANTES de componente):
   1 Overview · 2 Workflow · 3 Taxonomia · 4 Priorização · 5 Patterns
   6 Behavioral Rules · 7 Anatomy · 8 Visual Language · 9 Componentização
   10 Flows · 11 Applied Examples · 12 Handoff Dev
   ============================================================ */

// ---------- 2. Workflow ----------
const WORKFLOW = [
  ['Taxonomia de Intenções', 'Identificar o que o usuário está tentando fazer — não apenas o tema médico.'],
  ['Cenários de Uso', 'Emergência, plantão, estudo, documentação, dúvida rápida ou exploração.'],
  ['Priorização', 'Ordenar intenções por frequência, criticidade e impacto na experiência.'],
  ['Response Patterns', 'Definir o formato ideal de resposta para cada intenção.'],
  ['Behavioral Rules', 'Quando responder direto, pedir contexto, usar tabela, alerta ou chips.'],
  ['Response Anatomy', 'Quebrar a resposta em partes reutilizáveis: header, contexto, ação, blocos.'],
  ['Componentização', 'Transformar partes recorrentes em componentes de UI reutilizáveis.'],
  ['Conversation Flows', 'Montar fluxos reais combinando intenções + patterns + componentes.'],
  ['Applied Examples', 'Demonstrar como a IA deveria se comportar em casos concretos.'],
  ['Handoff Dev', 'Documentar que a IA retorna estrutura, não markdown solto.'],
];

// ---------- 3. Taxonomia ----------
const INTENTS = [
  { key: 'dose', label: 'Dose rápida', desc: 'Dose, preparo, cálculo ou intervalo de administração.' },
  { key: 'ambigua', label: 'Pergunta ambígua', desc: 'Falta contexto para responder com segurança.' },
  { key: 'operacional', label: 'Conduta operacional', desc: 'O usuário quer saber o que fazer agora.' },
  { key: 'exame', label: 'Interpretação de exame', desc: 'Gasometria, ECG, lactato, eletrólitos, scores.' },
  { key: 'comparacao', label: 'Comparação clínica', desc: 'Diferença entre drogas, diagnósticos, condutas, critérios.' },
  { key: 'protocolo', label: 'Protocolo guiado', desc: 'O usuário quer seguir um fluxo passo a passo.' },
  { key: 'aprendizado', label: 'Aprendizado', desc: 'Entender conceito, mecanismo ou raciocínio.' },
  { key: 'resumo', label: 'Resumo copiável', desc: 'Texto para prontuário, evolução, WhatsApp ou passagem.' },
  { key: 'triagem', label: 'Triagem contextual', desc: 'Input vago: “paciente ruim”, “hipotenso”, “dor torácica”.' },
  { key: 'critico', label: 'Alerta crítico', desc: 'Situação grave que exige priorização imediata.' },
];

const RISK = { baixo: 'Baixo', medio: 'Médio', alto: 'Alto' };

const TAXONOMY_ROWS = [
  ['dose de adrenalina na PCR', 'dose', 'Dose pronta para administrar', 'Emergência', 'alto', 'Compact Answer'],
  ['dose de adrenalina?', 'ambigua', 'Dose, mas sem indicação', 'Indefinido', 'alto', 'Context Selector'],
  ['quanto de noradrenalina pra 80kg?', 'dose', 'Cálculo por peso', 'Plantão', 'medio', 'Compact Answer (dose block)'],
  ['paciente hipotenso', 'triagem', 'Conduzir raciocínio', 'Beira-leito', 'alto', 'Guided Flow'],
  ['PAM 58 após volume', 'operacional', 'Próxima ação agora', 'Choque', 'alto', 'Operational Response'],
  ['lactato 5 e pressão baixa', 'operacional', 'Reconhecer hipoperfusão', 'Choque', 'alto', 'Operational Response'],
  ['interpreta essa gaso', 'exame', 'Leitura + próximo passo', 'Plantão', 'medio', 'Interpretation Result'],
  ['pH 7.28 pCO2 28 HCO3 14', 'exame', 'Classificar distúrbio', 'Plantão', 'medio', 'Interpretation Result'],
  ['noradrenalina vs dobutamina', 'comparacao', 'Escolher a droga certa', 'Decisão', 'medio', 'Comparison Table'],
  ['FA vs Flutter', 'comparacao', 'Diferenciar ritmos', 'Estudo/plantão', 'baixo', 'Comparison Table'],
  ['protocolo de PCR', 'protocolo', 'Seguir fluxo passo a passo', 'Emergência', 'alto', 'Protocol Stepper'],
  ['me guia em choque séptico', 'protocolo', 'Condução guiada', 'Plantão', 'alto', 'Protocol Stepper'],
  ['resume pra evolução', 'resumo', 'Texto pronto p/ prontuário', 'Documentação', 'baixo', 'Copyable Summary'],
  ['faz uma conduta pra prontuário', 'resumo', 'Conduta formatada', 'Documentação', 'baixo', 'Copyable Summary'],
  ['me explica sepse', 'aprendizado', 'Entender conceito', 'Estudo', 'baixo', 'Learning Layer'],
  ['K 7,1 com QRS largo', 'critico', 'Priorizar risco de PCR', 'Emergência', 'alto', 'Critical Alert'],
  ['dor torácica com sudorese', 'critico', 'Suspeitar SCA', 'Emergência', 'alto', 'Critical Alert'],
  ['dispneia saturando 82', 'critico', 'Insuficiência respiratória', 'Emergência', 'alto', 'Critical Alert'],
  ['qual antibiótico pra sepse?', 'operacional', 'Escolha empírica', 'Plantão', 'alto', 'Operational Response'],
  ['quando usar vasopressina?', 'aprendizado', 'Indicação/limite', 'Decisão', 'medio', 'Learning Layer'],
  ['como interpretar lactato?', 'aprendizado', 'Entender significado', 'Estudo', 'baixo', 'Learning Layer'],
  ['me ajuda com AVC', 'protocolo', 'Conduzir janela/NIHSS', 'Emergência', 'alto', 'Protocol Stepper'],
  ['última vez bem 2h atrás', 'operacional', 'Definir janela de trombólise', 'AVC', 'alto', 'Operational Response'],
  ['Glasgow 8', 'critico', 'Indicar via aérea', 'Emergência', 'alto', 'Critical Alert'],
  ['CAD, como conduzir?', 'protocolo', 'Conduzir protocolo CAD', 'Plantão', 'alto', 'Protocol Stepper'],
  ['qual fórmula de Winter?', 'dose', 'Fórmula objetiva', 'Cálculo', 'baixo', 'Compact Answer'],
  ['critério de trombólise', 'comparacao', 'Inclusão/exclusão', 'Decisão', 'alto', 'Comparison Table'],
  ['dose alteplase', 'dose', 'Dose por peso', 'AVC', 'alto', 'Compact Answer (dose block)'],
  ['choque cardiogênico ou séptico?', 'comparacao', 'Diferencial de choque', 'Decisão', 'alto', 'Comparison Table'],
  ['paciente rebaixado', 'triagem', 'Conduzir avaliação', 'Beira-leito', 'alto', 'Guided Flow'],
  ['ânion gap aumentado, e agora?', 'operacional', 'Próxima conduta', 'Plantão', 'medio', 'Operational Response'],
  ['o que é SOFA?', 'aprendizado', 'Definição de score', 'Estudo', 'baixo', 'Learning Layer'],
];

// ---------- 4. Priorização ----------
const PRIORITY = [
  {
    tier: 'Prioridade máxima', tone: 'critico',
    items: ['Conduta operacional', 'Dose rápida', 'Interpretação de exame', 'Pergunta ambígua / triagem', 'Alerta crítico'],
    rationale: 'Plantonistas precisam de velocidade e baixa carga cognitiva. Em situação crítica, assumir contexto errado é perigoso.',
  },
  {
    tier: 'Prioridade alta', tone: 'atencao',
    items: ['Comparação clínica', 'Protocolo guiado', 'Resumo copiável'],
    rationale: 'Comparações e protocolos ganham muito com tabela e steps; o resumo elimina retrabalho de documentação.',
  },
  {
    tier: 'Prioridade média', tone: 'info',
    items: ['Aprendizado', 'Exploração profunda', 'Explicação conceitual longa'],
    rationale: 'Estudo pode ser progressivo e menos urgente — entra como camada opcional, não como resposta inicial.',
  },
];

// ---------- 5. Response Patterns ----------
const PATTERNS = [
  {
    name: 'Compact Answer',
    when: 'Perguntas objetivas: dose, intervalo, fórmula, resposta direta.',
    goal: 'Entregar o dado essencial em destaque, sem ruído.',
    structure: ['Título', 'Resposta principal destacada', 'Observação curta', 'Chips úteis', 'Copiar (quando fizer sentido)'],
    inputEx: 'dose adrenalina PCR adulto',
    behavior: 'Título “Adrenalina na PCR”, dose em destaque, intervalo, observação breve e chips “Ver ACLS / Dose pediátrica / Copiar”.',
    avoid: ['Explicação longa', 'Fisiopatologia', 'Tabela desnecessária'],
  },
  {
    name: 'Context Selector',
    when: 'Pergunta ambígua em que a IA não deve assumir contexto.',
    goal: 'Resolver a ambiguidade antes de responde uma dose potencialmente errada.',
    structure: ['Pergunta de contexto curta', 'Chips de indicação', 'Renderiza Compact Answer após a escolha'],
    inputEx: 'dose de adrenalina?',
    behavior: 'Pergunta o contexto com chips: PCR, Anafilaxia, Broncoespasmo, Choque, Pediatria.',
    avoid: ['Responder dose sem saber a indicação', 'Listar todas as doses em texto longo'],
  },
  {
    name: 'Operational Response',
    when: 'O usuário quer saber o que fazer agora.',
    goal: 'Conduzir a próxima ação com meta terapêutica clara.',
    structure: ['Título com condição provável', 'Status resumido', 'Próxima ação principal', 'Meta terapêutica', 'Condutas paralelas', 'Alerta se necessário', 'Chips de continuidade'],
    inputEx: 'PAM 58 após volume, lactato 5',
    behavior: 'Abre pela condição provável e ação imediata, não por definição teórica.',
    avoid: ['Começar pela teoria', 'Excesso de texto', 'Vários alertas competindo'],
  },
  {
    name: 'Comparison Table',
    when: 'Comparação de drogas, diagnósticos, condutas, ritmos, scores ou critérios.',
    goal: 'Tornar a diferença escaneável em uma tabela limpa.',
    structure: ['Título', 'Tabela enxuta', 'Regra prática abaixo', 'Chips contextuais'],
    inputEx: 'noradrenalina vs dobutamina',
    behavior: 'Tabela com poucas colunas + uma regra prática de bolso.',
    avoid: ['Texto corrido longo', 'Colunas demais', 'Emoji em toda célula'],
  },
  {
    name: 'Interpretation Result',
    when: 'Interpretação de exames, scores, gasometria, ECG ou laboratório.',
    goal: 'Dado bruto + leitura + próxima etapa.',
    structure: ['Tabela de parâmetros', 'Interpretação principal', 'Próxima etapa sugerida', 'Chips de aprofundamento'],
    inputEx: 'pH 7.28 pCO2 28 HCO3 14 lactato 5',
    behavior: 'Mostra parâmetros, classifica o distúrbio e indica o próximo passo (Winter, ânion gap, sepse).',
    avoid: ['Só repetir valores', 'Não dizer o próximo passo', 'Misturar teoria avançada na resposta inicial'],
  },
  {
    name: 'Guided Flow',
    when: 'Caso vago que precisa ser conduzido.',
    goal: 'Transformar input vago em raciocínio guiado e adaptativo.',
    structure: ['Pergunta de cenário', 'Chips de hipótese', 'Perguntas curtas e adaptativas', 'Converge para Operational Response'],
    inputEx: 'paciente hipotenso',
    behavior: 'Pergunta “Qual cenário parece mais provável?” com chips Sepse / Sangramento / Cardiogênico / Anafilaxia / Não sei.',
    avoid: ['Resposta genérica enorme', 'Perguntar tudo de uma vez', 'Depender só de texto livre'],
  },
  {
    name: 'Protocol Stepper',
    when: 'Protocolos longos: PCR, sepse, AVC, CAD, IOT.',
    goal: 'Manter o usuário na etapa certa com progressive disclosure.',
    structure: ['Etapa atual', 'Próxima decisão', 'Ações curtas', 'Chips para ramificar', 'Disclosure por etapa'],
    inputEx: 'protocolo de PCR',
    behavior: 'Mostra a etapa atual e a próxima decisão, não o protocolo inteiro aberto.',
    avoid: ['Abrir o protocolo todo', 'Texto longo sem estado', 'Perder a etapa do usuário'],
  },
  {
    name: 'Copyable Summary',
    when: 'O usuário quer usar a resposta fora do chat.',
    goal: 'Entregar texto pronto para reaproveitar.',
    structure: ['Bloco copiável', 'Opção encurtar', 'Formato prontuário', 'Formato WhatsApp'],
    inputEx: 'resume pra evolução',
    behavior: 'Gera bloco copiável com variações de formato e tamanho.',
    avoid: ['Misturar explicação com o texto copiável', 'Texto muito longo sem controle'],
  },
  {
    name: 'Critical Alert',
    when: 'Situações de alto risco.',
    goal: 'Priorizar ação com o mínimo de decoração.',
    structure: ['Alerta sóbrio', 'Prioridade imediata', 'Próximos passos', 'Sem ornamento'],
    inputEx: 'K 7,1 com QRS largo',
    behavior: 'Alerta sóbrio + ação imediata; reduz elementos visuais concorrentes.',
    avoid: ['Humor', 'Emoji em excesso', 'Explicação longa antes da ação'],
  },
  {
    name: 'Learning Layer',
    when: 'O usuário quer aprender.',
    goal: 'Resumo curto agora, profundidade sob demanda.',
    structure: ['Resumo curto', 'Explicação simples', 'Camada avançada opcional', 'Caso prático', 'Chips de aprofundamento'],
    inputEx: 'me explica choque séptico',
    behavior: 'Entrega resumo curto e oferece aprofundamento, sem despejar aula longa de imediato.',
    avoid: ['Despejar aula longa', 'Misturar plantão com estudo', 'Não oferecer resumo'],
  },
];

// ---------- 6. Behavioral Rules ----------
const RULES = [
  ['Dose objetiva com contexto claro', 'Responder direto', 'Compact Answer', 'Pedir contexto desnecessário'],
  ['Dose sem contexto', 'Pedir indicação', 'Context Selector', 'Assumir uma indicação'],
  ['Instabilidade / urgência descrita', 'Conduzir ação', 'Operational Response / Critical Alert', 'Começar pela teoria'],
  ['Comparação de 2+ coisas', 'Estruturar diferença', 'Comparison Table', 'Texto corrido'],
  ['Exame ou valores enviados', 'Ler + indicar passo', 'Interpretation Result', 'Só repetir números'],
  ['Input vago', 'Triagem guiada', 'Guided Flow / Context Selector', 'Resposta genérica'],
  ['Protocolo longo', 'Conduzir por etapa', 'Protocol Stepper', 'Abrir tudo de uma vez'],
  ['Pedido de explicação', 'Resumo + camada', 'Learning Layer', 'Aula longa imediata'],
  ['Copiar / enviar / evoluir', 'Gerar bloco copiável', 'Copyable Summary', 'Misturar com explicação'],
  ['Risco alto', 'Reduzir UI, priorizar ação', 'Critical Alert', 'Decorar a resposta'],
];

const DENSITY = [
  ['Modo compacto', 'Plantão, emergência, dose, ação imediata.'],
  ['Modo padrão', 'Condutas, interpretação, comparação.'],
  ['Modo aprendizado', 'Explicações, estudo, aprofundamento.'],
];

// ---------- 7. Anatomy ----------
const ANATOMY = [
  ['Header', 'Nome do assunto ou condição.'],
  ['Context Line', 'Resumo da situação clínica.'],
  ['Primary Action', 'Conduta ou resposta principal.'],
  ['Supporting Info', 'Dose, observação, critérios ou dados complementares.'],
  ['Structured Block', 'Tabela, checklist, lista ou stepper.'],
  ['Critical Alert', 'Apenas quando houver risco real.'],
  ['Suggested Actions', 'Chips de continuidade.'],
  ['Copy Action', 'Copiar dose, resumo ou conduta.'],
  ['Limitations', 'Quando depende de protocolo local ou validação clínica.'],
];

// ---------- 9. Componentização ----------
const COMPONENTS = [
  ['Response Header', 'Título da condição/assunto + tag de intenção.', 'Topo de quase toda resposta.'],
  ['Context Line', 'Linha de contexto clínico resumido.', 'Logo abaixo do header em condutas.'],
  ['Primary Action Block', 'Destaque da ação principal.', 'Operational Response, protocolos.'],
  ['Compact Dose Block', 'Dose + unidade em mono, copiável.', 'Compact Answer de dose.'],
  ['Clinical Table', 'Tabela enxuta de comparação/parâmetros.', 'Comparison / Interpretation.'],
  ['Checklist Block', 'Itens de verificação acionáveis.', 'Condutas paralelas.'],
  ['Alert Block', 'Alerta semântico (info/atenção/crítico).', 'Risco real — reusa AlertCard.'],
  ['Suggestion Chips', 'Próximos passos e refinamentos.', 'Rodapé de quase toda resposta — reusa Chip.'],
  ['Copyable Block', 'Texto pronto p/ reaproveitar.', 'Copyable Summary.'],
  ['Stepper / Protocol Step', 'Etapa atual + próxima decisão.', 'Protocol Stepper.'],
  ['Context Selector', 'Pergunta de contexto + chips.', 'Pergunta ambígua.'],
  ['Interpretation Block', 'Parâmetros + leitura + passo.', 'Exames e scores.'],
  ['Limitation Note', 'Nota de segurança/validação.', 'Quando falta contexto ou protocolo local.'],
  ['Expandable Section', 'Progressive disclosure.', 'Learning Layer, detalhes opcionais.'],
];

// ---------- 10. Flows ----------
const FLOWS = [
  {
    title: 'Flow 1 — Dose ambígua',
    input: 'dose de adrenalina?',
    steps: [
      'IA não responde direto: reconhece ambiguidade.',
      'Mostra Context Selector com chips: PCR · Anafilaxia · Broncoespasmo · Choque · Pediatria.',
      'Após a escolha, renderiza o Compact Answer adequado.',
    ],
    rationale: 'Evita resposta potencialmente errada por falta de contexto.',
  },
  {
    title: 'Flow 2 — Paciente hipotenso',
    input: 'paciente hipotenso',
    steps: [
      'IA inicia triagem contextual.',
      'Pergunta “Qual cenário parece mais provável?” com chips Sepse · Sangramento · Cardiogênico · Anafilaxia · Não sei.',
      'Pergunta sobre volume, PAM, lactato e sinais de choque conforme o ramo.',
      'Converge para Operational Response.',
    ],
    rationale: 'Input vago precisa virar raciocínio guiado, não resposta genérica.',
  },
  {
    title: 'Flow 3 — Interpretação de gasometria',
    input: 'pH 7.28 pCO2 28 HCO3 14 lactato 5',
    steps: [
      'IA usa Interpretation Result.',
      'Tabela de parâmetros + interpretação principal (acidose metabólica com compensação).',
      'Próximo passo + chips: Calcular Winter · Ânion gap · Relacionar com sepse.',
    ],
    rationale: 'Exames precisam de dado bruto + leitura + próxima ação.',
  },
  {
    title: 'Flow 4 — Comparação clínica',
    input: 'noradrenalina vs dobutamina',
    steps: [
      'IA usa Comparison Table.',
      'Tabela enxuta (mecanismo, efeito, quando usar).',
      'Regra prática + chips contextuais.',
    ],
    rationale: 'Comparação ganha clareza com tabela + uma regra de bolso.',
  },
];

// ============================================================
//  Sub-componentes de apresentação
// ============================================================

function Section({ n, eyebrow, title, intro, children }) {
  return (
    <section className={styles.section} id={`sec-${n}`}>
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>{eyebrow}</span>
        <h2><span className={styles.secNum}>{String(n).padStart(2, '0')}</span> {title}</h2>
        {intro && <p>{intro}</p>}
      </div>
      {children}
    </section>
  );
}

function RiskTag({ level }) {
  return <span className={styles.riskTag} data-risk={level}>{RISK[level]}</span>;
}

function ResponseMock({ title, contextLine, children, footnote }) {
  return (
    <div className={styles.mock}>
      <div className={styles.mockBar}>
        <span className={styles.mockDot} /><span className={styles.mockDot} /><span className={styles.mockDot} />
        <span className={styles.mockBarLabel}>Resposta CalcMed IA</span>
      </div>
      <div className={styles.mockBody}>
        {title && <div className={styles.mockTitle}>{title}</div>}
        {contextLine && <div className={styles.mockContext}>{contextLine}</div>}
        {children}
        {footnote && <p className={styles.mockNote}>{footnote}</p>}
      </div>
    </div>
  );
}

const ILLUSTRATIVE = 'Exemplo ilustrativo. Conteúdo clínico final deve ser validado pelo time médico.';

// ============================================================
//  Página
// ============================================================

export function AiResponseSystemGallery() {
  return (
    <div className={styles.page}>
      {/* 1. Hero / Overview */}
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Design System · Camada de IA</span>
        <h1>IA — Sistema de Respostas</h1>
        <p className={styles.lead}>
          Sistema de padrões conversacionais para transformar respostas da IA do CalcMed em
          experiências clínicas estruturadas, escaneáveis e orientadas à ação.
        </p>
        <p className={styles.heroMsg}>
          A IA não deve apenas responder. Ela deve <strong>reconhecer a intenção</strong> do usuário,
          <strong> escolher o formato adequado</strong> e <strong>conduzir o próximo passo</strong> com
          segurança e clareza.
        </p>
        <div className={styles.heroFlow}>
          <span>input do usuário</span>
          <em>→</em><span>intenção identificada</span>
          <em>→</em><span>response pattern</span>
          <em>→</em><span>resposta estruturada</span>
          <em>→</em><span>próximos passos</span>
        </div>
        <p className={styles.sourceMeta}>
          Especificação inicial · documentação de produto · pensar “sistema operacional conversacional clínico”, não “chat bonito”.
        </p>
      </header>

      {/* 2. Workflow */}
      <Section
        n={2}
        eyebrow="Processo"
        title="Workflow de construção"
        intro="A ordem importa: taxonomia vem ANTES de componente. Não se começa por visual nem por card."
      >
        <ol className={styles.workflow}>
          {WORKFLOW.map(([t, d], i) => (
            <li key={t} className={styles.workflowStep}>
              <span className={styles.workflowNum}>{i + 1}</span>
              <div>
                <strong>{t}</strong>
                <p>{d}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className={styles.keyline}>Taxonomia vem antes de componente.</div>
      </Section>

      {/* 3. Taxonomia */}
      <Section
        n={3}
        eyebrow="Fundação"
        title="Taxonomia de Intenções"
        intro="A IA não classifica só por tema médico (cardiologia, sepse, ECG). Ela classifica por intenção comportamental — o tipo de resposta que o usuário espera."
      >
        <div className={styles.intentGrid}>
          {INTENTS.map((it) => (
            <div key={it.key} className={styles.intentCard}>
              <span className={styles.intentBadge} data-intent={it.key}>{it.label}</span>
              <p>{it.desc}</p>
            </div>
          ))}
        </div>

        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Input do usuário</th>
                <th>Intenção</th>
                <th>Objetivo real</th>
                <th>Contexto</th>
                <th>Risco</th>
                <th>Resposta ideal</th>
              </tr>
            </thead>
            <tbody>
              {TAXONOMY_ROWS.map((row, i) => {
                const intent = INTENTS.find((x) => x.key === row[1]);
                return (
                  <tr key={i}>
                    <td className={styles.tdInput}>“{row[0]}”</td>
                    <td><span className={styles.intentBadge} data-intent={row[1]}>{intent?.label ?? row[1]}</span></td>
                    <td>{row[2]}</td>
                    <td className={styles.tdMuted}>{row[3]}</td>
                    <td><RiskTag level={row[4]} /></td>
                    <td className={styles.tdStrong}>{row[5]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Section>

      {/* 4. Priorização */}
      <Section
        n={4}
        eyebrow="Estratégia"
        title="Priorização das Intenções"
        intro="O que o produto resolve primeiro. Plantonistas precisam de velocidade; situações críticas exigem baixa carga cognitiva."
      >
        <div className={styles.priorityGrid}>
          {PRIORITY.map((p) => (
            <div key={p.tier} className={styles.priorityCard} data-tone={p.tone}>
              <span className={styles.priorityTier}>{p.tier}</span>
              <ul>{p.items.map((it) => <li key={it}>{it}</li>)}</ul>
              <p className={styles.priorityRationale}>{p.rationale}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 5. Response Patterns */}
      <Section
        n={5}
        eyebrow="Catálogo"
        title="Response Patterns"
        intro="O formato ideal por intenção. Cada pattern tem quando usar, objetivo, estrutura, exemplo e o que evitar."
      >
        <div className={styles.patternGrid}>
          {PATTERNS.map((p) => (
            <article key={p.name} className={styles.patternCard}>
              <header className={styles.patternHead}>
                <h3>{p.name}</h3>
              </header>
              <dl className={styles.patternMeta}>
                <div><dt>Quando usar</dt><dd>{p.when}</dd></div>
                <div><dt>Objetivo</dt><dd>{p.goal}</dd></div>
              </dl>
              <div className={styles.patternStruct}>
                <span className={styles.miniLabel}>Estrutura</span>
                <ol>{p.structure.map((s) => <li key={s}>{s}</li>)}</ol>
              </div>
              <div className={styles.patternExample}>
                <span className={styles.miniLabel}>Exemplo</span>
                <code>“{p.inputEx}”</code>
                <p>{p.behavior}</p>
              </div>
              <div className={styles.patternAvoid}>
                <span className={styles.miniLabel}>Evitar</span>
                <ul>{p.avoid.map((a) => <li key={a}>{a}</li>)}</ul>
              </div>
            </article>
          ))}
        </div>
      </Section>

      {/* 6. Behavioral Rules */}
      <Section
        n={6}
        eyebrow="Comportamento"
        title="Behavioral Rules"
        intro="Como a IA decide o formato. A regra governa a escolha do pattern — não o tema clínico."
      >
        <div className={styles.tableScroll}>
          <table className={styles.table}>
            <thead>
              <tr><th>Situação</th><th>A IA deve</th><th>Pattern recomendado</th><th>Evitar</th></tr>
            </thead>
            <tbody>
              {RULES.map((r, i) => (
                <tr key={i}>
                  <td className={styles.tdStrong}>{r[0]}</td>
                  <td>{r[1]}</td>
                  <td className={styles.tdInput}>{r[2]}</td>
                  <td className={styles.tdMuted}>{r[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className={styles.densityRow}>
          {DENSITY.map(([t, d]) => (
            <div key={t} className={styles.densityCard}>
              <strong>{t}</strong>
              <p>{d}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* 7. Response Anatomy */}
      <Section
        n={7}
        eyebrow="Estrutura"
        title="Response Anatomy"
        intro="A anatomia de uma resposta ideal. As partes recorrentes viram componentes na seção 09."
      >
        <div className={styles.anatomyLayout}>
          <ResponseMock
            title="Choque séptico provável"
            contextLine="PAM 58 após volume · lactato 5 mmol/L"
            footnote={ILLUSTRATIVE}
          >
            <div className={styles.anaPrimary}>
              <span className={styles.miniLabel}>Próxima ação</span>
              Iniciar <strong>noradrenalina</strong> — meta PAM ≥ 65 mmHg
            </div>
            <ul className={styles.anaChecklist}>
              <li>Reavaliar perfusão e diurese</li>
              <li>Coletar culturas + iniciar ATB &lt; 1h</li>
              <li>Considerar acesso central</li>
            </ul>
            <AlertCard level="critical" title="Sinal de alerta">
              Lactato &gt; 4 indica hipoperfusão — reavaliar resposta em 1h.
            </AlertCard>
            <div className={styles.chipRow}>
              <Chip state="active">Calcular dose por peso</Chip>
              <Chip>Metas do protocolo</Chip>
              <Chip>Copiar conduta</Chip>
            </div>
          </ResponseMock>

          <ol className={styles.anatomyList}>
            {ANATOMY.map(([t, d], i) => (
              <li key={t}>
                <span className={styles.anatomyNum}>{i + 1}</span>
                <div><strong>{t}</strong><p>{d}</p></div>
              </li>
            ))}
          </ol>
        </div>
      </Section>

      {/* 8. Visual Language */}
      <Section
        n={8}
        eyebrow="Fundamentos"
        title="Visual Language"
        intro="Mesma base visual do DS. Regra central: todo elemento visual precisa ter função. Emoji/ícone só quando comunica criticidade, ação, contexto ou navegação."
      >
        <div className={styles.vlGrid}>
          <div className={styles.vlCard}>
            <h3>Tipografia</h3>
            <p>Título claro · contexto mais leve · ação principal com mais peso · observações regulares · alerta com destaque moderado.</p>
          </div>
          <div className={styles.vlCard}>
            <h3>Negrito</h3>
            <p>Para <strong>dose</strong>, <strong>ação</strong>, <strong>risco</strong>, <strong>decisão</strong> e termo-chave. Nunca em excesso.</p>
          </div>
          <div className={styles.vlCard}>
            <h3>Itálico</h3>
            <p>Raro — <em>nuance, observação ou nota secundária</em>.</p>
          </div>
          <div className={styles.vlCard}>
            <h3>Dividers</h3>
            <p>Separam blocos cognitivos, não decoram. Um divider por mudança de raciocínio.</p>
          </div>
          <div className={styles.vlCard}>
            <h3>Emojis / ícones</h3>
            <p>Apenas semânticos: ⚠️ alerta · ✅ conduta concluída. Preferir ícones do DS quando existirem. Nada decorativo por linha.</p>
          </div>
          <div className={styles.vlCard}>
            <h3>Tabelas</h3>
            <p>Comparação, exames, critérios, doses e diferenciais. Poucas colunas, alta legibilidade.</p>
          </div>
          <div className={styles.vlCard}>
            <h3>Chips</h3>
            <p>Próximo passo, refinamento, contexto e ações rápidas. Reusa o componente <code>Chip</code> do DS.</p>
            <div className={styles.chipRow}>
              <Chip state="active">Ver ACLS</Chip>
              <Chip>Dose pediátrica</Chip>
              <Chip>Copiar</Chip>
            </div>
          </div>
          <div className={styles.vlCard}>
            <h3>Copy</h3>
            <p>Quando a resposta puder ser reaproveitada: dose, conduta, resumo clínico, evolução, WhatsApp.</p>
          </div>
        </div>
      </Section>

      {/* 9. Componentização */}
      <Section
        n={9}
        eyebrow="UI"
        title="Componentização"
        intro="Depois da taxonomia e dos patterns. Componentes por FUNÇÃO, nunca por doença. Errado: “Card de Sepse”. Certo: “Operational Response”, “Dose Block”."
      >
        <div className={styles.compGrid}>
          {COMPONENTS.map(([name, fn, when]) => (
            <div key={name} className={styles.compCard}>
              <strong>{name}</strong>
              <p>{fn}</p>
              <span className={styles.compWhen}>{when}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* 10. Conversation Flows */}
      <Section
        n={10}
        eyebrow="Comportamento aplicado"
        title="Conversation Flows"
        intro="Fluxos reais combinando intenção + pattern + componentes. Comportamento adaptativo, não só resposta bonita."
      >
        <div className={styles.flowGrid}>
          {FLOWS.map((f) => (
            <article key={f.title} className={styles.flowCard}>
              <h3>{f.title}</h3>
              <div className={styles.flowInput}>Input: <code>“{f.input}”</code></div>
              <ol className={styles.flowSteps}>
                {f.steps.map((s, i) => <li key={i}>{s}</li>)}
              </ol>
              <p className={styles.flowRationale}><span className={styles.miniLabel}>Racional</span>{f.rationale}</p>
            </article>
          ))}
        </div>
      </Section>

      {/* 11. Applied Examples */}
      <Section
        n={11}
        eyebrow="Exemplos"
        title="Applied Examples"
        intro="Como a IA deveria se comportar usando os patterns — sóbrio, premium e funcional. Conteúdo apenas ilustrativo."
      >
        <div className={styles.exampleGrid}>
          {/* Compact Answer */}
          <div className={styles.example}>
            <span className={styles.exampleTag}>Compact Answer · Adrenalina na PCR</span>
            <ResponseMock title="Adrenalina na PCR" footnote={ILLUSTRATIVE}>
              <div className={styles.doseBlock}>
                <span className={styles.doseValue}>1 mg</span>
                <span className={styles.doseUnit}>IV/IO · a cada 3–5 min</span>
              </div>
              <p className={styles.exampleP}>Sem teto de dose na parada. Manter RCP de alta qualidade entre as doses.</p>
              <div className={styles.chipRow}>
                <Chip state="active">Ver ACLS</Chip>
                <Chip>Dose pediátrica</Chip>
                <Chip>Copiar</Chip>
              </div>
            </ResponseMock>
          </div>

          {/* Context Selector */}
          <div className={styles.example}>
            <span className={styles.exampleTag}>Context Selector · “Dose de adrenalina?”</span>
            <ResponseMock title="Em qual contexto?" footnote={ILLUSTRATIVE}>
              <p className={styles.exampleP}>A dose muda conforme a indicação. Selecione:</p>
              <div className={styles.chipRow}>
                <Chip>PCR</Chip>
                <Chip>Anafilaxia</Chip>
                <Chip>Broncoespasmo</Chip>
                <Chip>Choque</Chip>
                <Chip>Pediatria</Chip>
              </div>
            </ResponseMock>
          </div>

          {/* Operational Response */}
          <div className={styles.example}>
            <span className={styles.exampleTag}>Operational Response · Choque séptico</span>
            <ResponseMock title="Choque séptico provável" contextLine="PAM 58 após volume · lactato 5" footnote={ILLUSTRATIVE}>
              <div className={styles.anaPrimary}>
                <span className={styles.miniLabel}>Próxima ação</span>
                Iniciar <strong>noradrenalina</strong> — meta PAM ≥ 65
              </div>
              <ul className={styles.anaChecklist}>
                <li>ATB empírico &lt; 1h + culturas</li>
                <li>Reavaliar perfusão em 1h</li>
              </ul>
              <div className={styles.chipRow}>
                <Chip state="active">Calcular dose</Chip>
                <Chip>Copiar conduta</Chip>
              </div>
            </ResponseMock>
          </div>

          {/* Comparison Table */}
          <div className={styles.example}>
            <span className={styles.exampleTag}>Comparison Table · Nora vs Dobuta</span>
            <ResponseMock title="Noradrenalina × Dobutamina" footnote={ILLUSTRATIVE}>
              <div className={styles.tableScroll}>
                <table className={styles.miniTable}>
                  <thead><tr><th></th><th>Noradrenalina</th><th>Dobutamina</th></tr></thead>
                  <tbody>
                    <tr><td>Ação</td><td>Vasopressor (α)</td><td>Inotrópico (β1)</td></tr>
                    <tr><td>Efeito</td><td>↑ PA</td><td>↑ débito</td></tr>
                    <tr><td>Quando</td><td>Choque com PA baixa</td><td>Baixo débito</td></tr>
                  </tbody>
                </table>
              </div>
              <p className={styles.exampleP}><strong>Regra prática:</strong> PA baixa → nora primeiro; débito baixo com PA ok → dobuta.</p>
            </ResponseMock>
          </div>

          {/* Interpretation Result */}
          <div className={styles.example}>
            <span className={styles.exampleTag}>Interpretation Result · Gasometria</span>
            <ResponseMock title="Gasometria arterial" footnote={ILLUSTRATIVE}>
              <div className={styles.tableScroll}>
                <table className={styles.miniTable}>
                  <thead><tr><th>Parâmetro</th><th>Valor</th><th></th></tr></thead>
                  <tbody>
                    <tr><td>pH</td><td className="mono">7.28</td><td><RiskTag level="medio" /></td></tr>
                    <tr><td>pCO₂</td><td className="mono">28</td><td className={styles.tdMuted}>compensando</td></tr>
                    <tr><td>HCO₃</td><td className="mono">14</td><td><RiskTag level="alto" /></td></tr>
                  </tbody>
                </table>
              </div>
              <p className={styles.exampleP}><strong>Acidose metabólica</strong> com compensação respiratória parcial.</p>
              <div className={styles.chipRow}>
                <Chip state="active">Calcular Winter</Chip>
                <Chip>Ânion gap</Chip>
                <Chip>Relacionar com sepse</Chip>
              </div>
            </ResponseMock>
          </div>

          {/* Guided Flow */}
          <div className={styles.example}>
            <span className={styles.exampleTag}>Guided Flow · Paciente hipotenso</span>
            <ResponseMock title="Qual cenário parece mais provável?" footnote={ILLUSTRATIVE}>
              <div className={styles.chipRow}>
                <Chip>Sepse</Chip>
                <Chip>Sangramento</Chip>
                <Chip>Cardiogênico</Chip>
                <Chip>Anafilaxia</Chip>
                <Chip>Não sei</Chip>
              </div>
              <p className={styles.exampleP}>Depois: volume recebido? PAM? lactato? sinais de choque?</p>
            </ResponseMock>
          </div>

          {/* Copyable Summary */}
          <div className={styles.example}>
            <span className={styles.exampleTag}>Copyable Summary · Evolução</span>
            <ResponseMock title="Resumo para evolução" footnote={ILLUSTRATIVE}>
              <div className={styles.copyBlock}>
                <p>Paciente com choque séptico provável. PAM 58 após reposição volêmica, lactato 5. Iniciada noradrenalina com meta PAM ≥ 65 e ATB empírico.</p>
                <button type="button" className={styles.copyBtn}>Copiar</button>
              </div>
              <div className={styles.chipRow}>
                <Chip>Encurtar</Chip>
                <Chip>Formato prontuário</Chip>
                <Chip>WhatsApp</Chip>
              </div>
            </ResponseMock>
          </div>
        </div>
      </Section>

      {/* 12. Handoff Dev */}
      <Section
        n={12}
        eyebrow="Engenharia"
        title="Handoff Dev / Estrutura Técnica"
        intro="A IA não retorna texto livre: retorna estrutura. O DS controla visual, espaçamento, cor, chips, tabelas e alertas — markdown inconsistente deixa de existir."
      >
        <div className={styles.pipeline}>
          {['Usuário', 'Intent Detection', 'Response Type', 'Structured Blocks', 'UI Renderer (DS)', 'Interação / Follow-up'].map((s, i, arr) => (
            <span key={s} className={styles.pipelineNode}>
              {s}{i < arr.length - 1 && <em>→</em>}
            </span>
          ))}
        </div>

        <pre className={styles.code}>{`{
  "response_type": "operational_response",
  "intent": "conduta_operacional",
  "risk_level": "high",
  "title": "Choque séptico provável",
  "context": "PAM baixa após volume + lactato elevado",
  "blocks": [
    {
      "type": "primary_action",
      "title": "Iniciar noradrenalina",
      "content": "Dose inicial conforme protocolo institucional"
    },
    {
      "type": "checklist",
      "items": [
        "Reavaliar perfusão",
        "Monitorar diurese",
        "Considerar acesso central"
      ]
    }
  ],
  "actions": [
    { "label": "Calcular dose por peso", "type": "open_calculator" },
    { "label": "Copiar conduta", "type": "copy" }
  ]
}`}</pre>

        <ul className={styles.handoffList}>
          <li>A IA identifica a <strong>intenção</strong> e estrutura o conteúdo em <strong>blocks</strong>.</li>
          <li>O frontend renderiza o <strong>pattern</strong> a partir de <code>response_type</code>.</li>
          <li>O Design System controla visual, espaçamento, cor, chips, tabelas e alertas.</li>
          <li>Isso elimina markdown inconsistente e torna a experiência <strong>escalável</strong>.</li>
        </ul>

        <div className={styles.assumptions}>
          <span className={styles.miniLabel}>Assumptions</span>
          <ul>
            <li>Esta página é especificação inicial para discussão de produto/design/dev — não contrato final.</li>
            <li>Conteúdo clínico é ilustrativo; doses e condutas dependem de validação médica e protocolo local.</li>
            <li>Sem dependência de imagem, áudio ou arquivo nesta fase — evolução por estrutura e tipografia.</li>
            <li>Reusa tokens e componentes existentes (<code>Chip</code>, <code>AlertCard</code>); não cria identidade visual paralela.</li>
          </ul>
        </div>
      </Section>
    </div>
  );
}

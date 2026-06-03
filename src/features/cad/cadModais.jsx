import { SheetText } from '../../shared/components/molecules/sheet/SheetText';
import { SheetList } from '../../shared/components/molecules/sheet/SheetList';

/**
 * Conteúdo dos modais info/teoria da CAD — porte 1:1 do dict `modais` do golden cad.js.
 * Cada modal = { title, blocks:[{p}|{list}|{section}|{helper}] }. Render via CadModalBody.
 * Aberto pelo flow num InfoSheet (BottomSheet). Zero-loss: todo texto do golden preservado.
 * Os modais interativos (calcular-ag, inserir-medida, repor-k, relancar-k, edema-cerebral)
 * vivem no CADFlow como FormSheet/ConfirmSheet — não entram aqui.
 * Fonte clínica: SBD 2025, UpToDate, ISPAD (pediátrico).
 */
// eslint-disable-next-line react-refresh/only-export-components
export const CAD_MODAIS = {
  'o-que-e-reavaliacao': {
    title: 'Como funciona a reavaliação',
    blocks: [
      { p: <>A reavaliação roda em <strong>loop a cada 1 hora</strong> até a CAD resolver. Pode levar 4 a 12 horas.</> },
      { list: [
        <><strong>HGT anterior</strong> vem puxado do último registro · edite se foi diferente.</>,
        <><strong>HGT atual</strong> é o que você está lançando agora.</>,
        <><strong>Insulina rodando</strong> mostra a dose atual · edite se a enfermagem ajustou.</>,
        'Gasometria e eletrólitos a cada 2 a 4 horas.',
      ] },
      { helper: 'Cada lançamento vai pra linha do tempo. O CalcMed te avisa pela notificação quando der a hora de reavaliar.' },
    ],
  },
  'como-ajustar-insulina': {
    title: 'Como o ajuste é calculado',
    blocks: [
      { p: <>O CalcMed sugere a próxima dose com base na <strong>queda do HGT em 1 hora</strong>:</> },
      { list: [
        <><strong>Queda &lt; 50 mg/dL/h:</strong> resposta lenta · aumentar insulina ~30%.</>,
        <><strong>Queda 50-100 mg/dL/h:</strong> alvo · manter conduta.</>,
        <><strong>Queda &gt; 100 mg/dL/h:</strong> queda rápida · reduzir insulina ~30%.</>,
        <><strong>HGT subindo:</strong> revisar acesso, diluição da bomba e dose.</>,
        <><strong>HGT &lt; 200:</strong> reduzir para 0,02-0,05 U/kg/h e adicionar soro glicosado.</>,
        <><strong>HGT &lt; 100:</strong> suspender e administrar glicose 10%.</>,
        <><strong>HGT &lt; 70:</strong> suspender + bolus glicose 50% IV.</>,
      ] },
      { helper: 'Alerta crítico: se Potássio < 3,5, a infusão é suspensa automaticamente e você é levado para a reposição de KCl.' },
    ],
  },
  'o-que-e-hgt': {
    title: 'Glicemia capilar · HGT / Dextro',
    blocks: [
      { p: <><strong>HGT</strong> e <strong>Dextro</strong> são o mesmo exame · a glicemia medida no sangue do dedo, em segundos. O nome muda por região: no Sul usa-se mais HGT; em outras regiões, Dextro. Tecnicamente, "glicemia capilar".</> },
      { p: <>Para CAD, o critério diagnóstico é glicemia &ge; 200 mg/dL. Em geral o paciente chega com valores acima de 300.</> },
      { helper: 'Atenção: na CAD euglicêmica (uso de inibidores de SGLT2 ou gestação), a glicemia pode estar normal. Nesses casos, BOHB e pH fazem o diagnóstico.' },
    ],
  },
  'o-que-e-ph': {
    title: 'pH venoso',
    blocks: [
      { p: <>O pH mede a acidez do sangue. Pode ser colhido de via venosa periférica, sem precisar furar artéria.</> },
      { p: <>Para CAD, o critério é pH &lt; 7,30. Se a gasometria não estiver disponível, use o bicarbonato (HCO₃ &lt; 18 mEq/L) como equivalente.</> },
      { helper: 'Quanto mais baixo, mais grave: pH < 7,00 indica CAD severa, com risco maior de complicações.' },
    ],
  },
  'o-que-e-bohb': {
    title: 'Cetonemia (BOHB)',
    blocks: [
      { p: <>BOHB é o beta-hidroxibutirato, o principal corpo cetônico produzido na CAD. É medido no sangue, em mmol/L.</> },
      { p: <>Para CAD, o critério é BOHB &ge; 3 mmol/L. Se não estiver disponível, use cetonúria moderada ou alta (2+ ou mais) na fita urinária.</> },
      { helper: 'Acompanhar o BOHB nas reavaliações é o melhor jeito de medir resposta ao tratamento. A meta de resolução é BOHB < 0,6 mmol/L em adultos.' },
    ],
  },
  'por-que-k': {
    title: 'Por que conferir o potássio antes',
    blocks: [
      { p: <>A insulina puxa o potássio de fora para dentro da célula. Se o paciente já chega com K baixo, esse deslocamento pode levar a uma hipocalemia grave, com risco de arritmia e parada cardíaca.</> },
      { p: <>Por isso a SBD 2025 e o UpToDate exigem <strong>K &ge; 3,5 mEq/L</strong> antes de iniciar a infusão de insulina.</> },
      { helper: 'Iniciar insulina com K baixo é um dos erros mais graves na condução da CAD. O CalcMed bloqueia exatamente para impedir isso.' },
    ],
  },
  'por-que-sodio': {
    title: 'Por que o sódio entra aqui',
    blocks: [
      { p: <>O sódio define qual solução cristaloide você vai usar como manutenção depois da reposição inicial:</> },
      { list: [
        <><strong>Na corrigido normal ou baixo:</strong> manter NaCl 0,9%.</>,
        <><strong>Na corrigido elevado:</strong> trocar para NaCl 0,45% para evitar hipernatremia.</>,
      ] },
      { helper: 'É opcional na T2 porque o protocolo pode ser iniciado com NaCl 0,9% sem prejuízo. Mas é altamente recomendado conferir antes de fechar 24 horas de tratamento.' },
    ],
  },
  'o-que-e-dose': {
    title: 'Como a dose é calculada',
    blocks: [
      { p: <>A dose padrão de insulina na CAD é <strong>0,1 UI por kg de peso por hora</strong>, em infusão contínua endovenosa.</> },
      { p: <>Exemplo: paciente de 70 kg recebe 7 UI/h.</> },
      { helper: 'Quando a glicemia cair abaixo de 250 mg/dL, a dose é reduzida pela metade (0,05 UI/kg/h) e se adiciona soro glicosado, para evitar hipoglicemia. O CalcMed faz isso automaticamente.' },
    ],
  },
  'o-que-e-vazao': {
    title: 'O que é a vazão',
    blocks: [
      { p: <>Vazão é a velocidade que a bomba infunde o soro com insulina. É medida em mL por hora, e é o valor que você programa na bomba.</> },
      { p: <>Como a diluição padrão é <strong>100 UI em 100 mL</strong> (1 UI por mL), a vazão em mL/h é igual à dose em UI/h. Se a dose é 7 UI/h, a vazão é 7 mL/h.</> },
      { helper: 'Mantenha a diluição padrão sempre que possível. Mudar a concentração obriga a recalcular a vazão e aumenta risco de erro.' },
    ],
  },
  'o-que-e-bolus': {
    title: 'Dose de ataque (bolus)',
    blocks: [
      { p: <>Bolus é uma dose única de insulina (0,1 UI/kg) injetada antes da infusão contínua. A ideia é começar a baixar a glicemia mais rápido.</> },
      { p: <>O <strong>UpToDate não recomenda</strong>. A SBD permite, mas com evidência fraca. O padrão CalcMed é começar direto na infusão contínua, sem bolus.</> },
      { helper: 'Considere bolus apenas em acesso venoso difícil ou atraso maior que 30 minutos para iniciar a bomba. Nesses casos, 0,1 UI/kg IV ou IM funciona como resgate.' },
    ],
  },
  // ── TEORIA ──────────────────────────────────────────────────
  'teoria-criterios': {
    title: 'Critérios diagnósticos',
    blocks: [
      { helper: 'Fecha o diagnóstico de CAD com 2 dos 3 critérios. Em pediatria, todos os 3 são esperados.' },
      { section: 'Glicemia' },
      { p: <>Adulto: &ge; 200 mg/dL. Pediátrico: &ge; 200 mg/dL.</> },
      { helper: 'CAD euglicêmica (uso de SGLT2, gestação): glicemia pode estar normal. Use pH e BOHB.' },
      { section: 'Acidose' },
      { p: <>pH venoso &lt; 7,30. Ou bicarbonato &lt; 18 mEq/L.</> },
      { helper: 'Severidade: pH 7,2 a 7,3 leve. pH 7,0 a 7,2 moderada. pH < 7,0 severa.' },
      { section: 'Cetose' },
      { p: <>BOHB sérico &ge; 3 mmol/L. Ou cetonúria 2+ ou mais na fita urinária.</> },
      { helper: 'Cetonúria não serve para acompanhar resolução · acetona persiste até 36h depois da resolução clínica.' },
    ],
  },
  'teoria-doses': {
    title: 'Doses padrão',
    blocks: [
      { section: 'Insulina IV' },
      { p: <><strong>0,1 UI/kg/h</strong> em infusão contínua. Sem bolus de ataque (padrão).</> },
      { p: <>Diluição: 100 UI de insulina regular em 100 mL de NaCl 0,9% (1 UI/mL).</> },
      { helper: 'Quando glicemia < 250 mg/dL, reduzir para 0,05 UI/kg/h e iniciar soro glicosado.' },
      { section: 'Fluidos' },
      { p: <><strong>Primeira hora:</strong> NaCl 0,9% 15 a 20 mL/kg.</> },
      { p: <><strong>Manutenção:</strong> 250 a 500 mL/h conforme estado de hidratação.</> },
      { helper: 'Quando glicemia < 250 mg/dL, adicionar soro glicosado 5%.' },
      { section: 'Potássio' },
      { p: <><strong>K &lt; 3,5:</strong> não inicie insulina. Reponha KCl 10 a 20 mEq/h.</> },
      { p: <><strong>K 3,5 a 5,0:</strong> adicione 20 a 40 mEq de KCl em cada litro de soro.</> },
      { p: <><strong>K &gt; 5,5:</strong> não reponha. Monitore.</> },
      { section: 'Bicarbonato' },
      { p: <>NÃO usar de rotina. Considere apenas se pH &lt; 7,0 com risco hemodinâmico.</> },
      { helper: 'Em pediatria, bicarbonato está associado a maior risco de edema cerebral.' },
    ],
  },
  'teoria-edema': {
    title: 'Edema cerebral pediátrico',
    blocks: [
      { helper: 'Principal causa de morte na CAD pediátrica. Suspeite cedo, trate antes da imagem.' },
      { section: 'Sinais de alarme' },
      { list: [
        'Cefaleia que piora',
        'Alteração do nível de consciência (Glasgow caindo)',
        'Bradicardia ou hipertensão',
        'Vômitos persistentes',
        'Incontinência inesperada',
      ] },
      { section: 'Conduta imediata' },
      { p: <><strong>Manitol 20%</strong>, 0,5 a 1 g/kg IV em 15 minutos. Repetir em 30 minutos se não houver resposta.</> },
      { p: <>Ou <strong>salina 3%</strong>, 5 a 10 mL/kg em 30 minutos.</> },
      { helper: 'Não aguarde a tomografia para tratar. O tratamento é clínico.' },
      { section: 'Prevenção' },
      { p: <>Evite hidratação muito rápida e queda muito rápida da glicemia. Em &lt; 5 anos, GCS de hora em hora.</> },
    ],
  },
  'teoria-formulas': {
    title: 'Fórmulas úteis',
    blocks: [
      { section: 'Ânion gap' },
      { p: <><strong>AG = Na − (Cl + HCO₃)</strong></> },
      { helper: 'Valor normal: 8 a 12 mEq/L. Resolução de CAD: < 12.' },
      { section: 'Sódio corrigido' },
      { p: <>Se glicemia &lt; 400 mg/dL: <strong>Na corrigido = Na + 1,6 × [(glicemia − 100) ÷ 100]</strong></> },
      { p: <>Se glicemia &ge; 400 mg/dL: use fator 2,4.</> },
      { helper: 'Na corrigido normal ou baixo: mantenha NaCl 0,9%. Na corrigido alto: troque para 0,45%.' },
      { section: 'Osmolaridade efetiva' },
      { p: <><strong>Osm = 2 × Na + glicemia ÷ 18</strong></> },
      { helper: 'CAD pura raramente passa de 320 mOsm/L. Acima disso, considere estado hiperosmolar misto.' },
    ],
  },
  'teoria-resolucao': {
    title: 'Resolução e transição',
    blocks: [
      { section: 'Critérios de resolução' },
      { p: <>Os três precisam fechar juntos:</> },
      { list: [
        <>Glicemia &lt; 200 mg/dL</>,
        <>HCO₃ &gt; 15 mEq/L ou pH &ge; 7,30</>,
        <>Ânion gap &lt; 12 mEq/L</>,
      ] },
      { helper: 'BOHB < 0,6 mmol/L em adultos é alternativa moderna ao AG. Em pediatria, BOHB ≤ 1.' },
      { section: 'Transição para insulina SC' },
      { p: <>Aplique a primeira dose de insulina SC <strong>1 hora antes</strong> de parar a infusão IV.</> },
      { p: <>Mantenha a infusão até a SC começar a fazer efeito, para evitar rebote.</> },
      { helper: 'Paciente deve estar aceitando dieta oral. Se ainda em jejum, mantenha infusão.' },
    ],
  },
};

/** Render genérico do corpo do modal (blocks → SheetText/SheetList). Igual AvcModalBody. */
export function CadModalBody({ blocks = [] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.list) return <SheetList key={i} items={b.list} />;
        if (b.section != null) return <SheetText key={i}><strong>{b.section}</strong></SheetText>;
        if (b.helper != null) return <SheetText key={i} variant="auxiliary">{b.helper}</SheetText>;
        return <SheetText key={i}>{b.p}</SheetText>;
      })}
    </>
  );
}

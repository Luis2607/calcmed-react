import { SheetText } from '../../shared/components/molecules/sheet/SheetText';
import { SheetList } from '../../shared/components/molecules/sheet/SheetList';

/**
 * Conteúdo dos modais info/teoria do Sepse — porte 1:1 do dict `modais` do golden sepse.js.
 * Cada modal = { title, tone?, blocks:[{p}|{list}|{helper}] }. Render genérico via SepseModalBody.
 * Aberto pelo flow num InfoSheet (BottomSheet). Zero-loss: todo texto do golden preservado.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const SEPSE_MODAIS = {
  'o-que-e-pam': {
    title: 'O que é PAM',
    blocks: [
      { p: <><strong>PAM</strong> é a pressão arterial média. Reflete a pressão de perfusão que chega aos órgãos. Calcula-se com a fórmula:</> },
      { helper: <strong>PAM = PA diastólica + 1/3 × (PA sistólica − PA diastólica)</strong> },
      { p: <>Em sepse, o alvo é <strong>≥ 65 mmHg</strong>. Abaixo disso, os órgãos perdem perfusão e entram em sofrimento. Em pacientes com 65 anos ou mais, o alvo é permissivo (60 a 65 mmHg).</> },
    ],
  },
  'o-que-e-lactato': {
    title: 'O que é o lactato',
    blocks: [
      { p: <>O <strong>lactato</strong> é um marcador de hipoperfusão tecidual. Quando o tecido recebe pouco oxigênio, as células metabolizam glicose sem oxigênio e produzem lactato.</> },
      { list: [<><strong>&lt; 2 mmol/L:</strong> normal</>, <><strong>2 a 4 mmol/L:</strong> risco intermediário, reavalie em 2 h</>, <><strong>≥ 4 mmol/L:</strong> grave, choque provável</>] },
      { helper: 'Meta SSC 2026: clareamento de pelo menos 10% em 2 horas indica boa resposta à ressuscitação.' },
    ],
  },
  'o-que-e-sepse': {
    title: 'O que é sepse',
    blocks: [
      { p: <><strong>Sepse</strong> é uma disfunção orgânica aguda potencialmente fatal (SOFA ≥ 2), decorrente de uma resposta desregulada à infecção.</> },
      { helper: 'Definição Sepsis-3 (2016) confirmada pelo SSC 2026: infecção suspeita ou confirmada + aumento agudo de 2 ou mais pontos no SOFA caracteriza sepse.' },
    ],
  },
  'descritor-sirs': {
    title: 'SIRS · Síndrome da Resposta Inflamatória Sistêmica',
    blocks: [
      { p: <><strong>SIRS (SSC 2026):</strong> Sensibilidade superior a qSOFA. 2 critérios = positivo.</> },
      { p: 'Critérios (1 ponto cada):' },
      { list: ['Temperatura > 38°C ou < 36°C', 'FC > 90 bpm', 'FR > 20 irpm (ou PaCO₂ < 32)', 'Leucócitos > 12.000, < 4.000 ou bastões > 10%'] },
      { helper: 'Interpretação · 0-1: improvável | 2: presente | 3: resposta importante | 4: resposta intensa.' },
    ],
  },
  'descritor-news': {
    title: 'NEWS / NEWS2 · National Early Warning Score',
    blocks: [
      { p: <><strong>NEWS (SSC 2026):</strong> Padrão-ouro para screening. Score ≥ 5 = risco moderado/alto, avalie SOFA.</> },
      { p: 'Versões:' },
      { list: [<><strong>NEWS (original)</strong> · versão de 2012</>, <><strong>NEWS2 (2017 - recomendado)</strong> · adiciona escala 2 SpO₂ para hipoxemia crônica</>] },
      { helper: 'Interpretação · ≤4: baixo risco | 5-6: risco moderado | ≥7: risco alto de deterioração clínica. Se suspeita infecciosa, avaliar SOFA e considerar sepse.' },
    ],
  },
  'descritor-mews': {
    title: 'MEWS · Modified Early Warning Score',
    blocks: [
      { p: <><strong>MEWS:</strong> Escore intermediário de 5 parâmetros. Score ≥ 5 = risco aumentado.</> },
      { p: 'Parâmetros: PAS, FC, FR, Temperatura, Glasgow.' },
      { helper: 'Interpretação · ≤4: baixo risco | ≥5: risco ALTO de deterioração clínica. Se suspeita infecciosa, avaliar SOFA e considerar sepse.' },
    ],
  },
  'descritor-sofa': {
    title: 'SOFA · Sequential Organ Failure Assessment',
    blocks: [
      { p: <><strong>SOFA (Sepsis-3):</strong> Score ≥ 2 = disfunção orgânica aguda. Considere o ônus diagnóstico associado à infecção.</> },
      { p: 'Avalia 6 sistemas (respiração, coagulação, fígado, cardiovascular, neurológico, renal) · cada um 0 a 4 pontos.' },
      { helper: 'Cenários · SOFA < 2: ausência de disfunção orgânica, manter vigilância | SOFA ≥ 2: disfunção orgânica, iniciar Bundle 1 hora | SOFA ≥ 6: disfunção grave, iniciar Bundle e avaliar choque.' },
    ],
  },
  'o-que-e-avaliacao-clinica': {
    title: 'Avaliação clínica',
    blocks: [
      { p: <>Marcadores que <strong>complementam</strong> qualquer escore. Sepse é diagnóstico clínico · nenhum escore isolado decide.</> },
      { list: [<><strong>Foco infeccioso</strong> suspeito ou confirmado</>, <><strong>Hipotensão</strong> (PAM &lt; 65 mmHg) ou choque clínico</>, <><strong>Hipoperfusão</strong> (livedo, oligúria, confusão)</>, <><strong>Lactato ≥ 2 mmol/L</strong></>] },
      { helper: 'A combinação de sinais clínicos + escore positivo orienta a classificação de sepse.' },
    ],
  },
  'o-que-e-classificacao': {
    title: 'Classificação clínica de sepse',
    blocks: [
      { p: 'Decisão do médico após screening + avaliação clínica:' },
      { list: [
        <><strong>Sepse definida</strong> · diagnóstico alternativo muito improvável → ATB em até 1 hora</>,
        <><strong>Sepse provável</strong> · diagnóstico alternativo menos provável → ATB em até 1 hora</>,
        <><strong>Sepse possível</strong> · diagnóstico alternativo também possível → Se choque associado, ATB em ≤ 1h; demais, até 3h se suspeita persistir</>,
        <><strong>Sepse improvável</strong> · diagnóstico alternativo mais provável → Manter investigação</>,
      ] },
      { helper: 'A classificação é clínica e direciona a próxima conduta.' },
    ],
  },
  'o-que-e-sofa': {
    title: 'Score SOFA e critério Sepsis-3',
    blocks: [
      { p: <>O <strong>SOFA</strong> (Sequential Organ Failure Assessment) avalia disfunção em 6 sistemas: respiratório, coagulação, fígado, cardiovascular, neurológico e renal. Cada sistema pontua de 0 a 4.</> },
      { p: <><strong>Critério Sepsis-3:</strong> infecção suspeita ou confirmada mais aumento agudo do SOFA em 2 ou mais pontos.</> },
      { helper: 'Em pacientes sem SOFA basal, considere SOFA = 0 e qualquer pontuação ≥ 2 caracteriza sepse. Pontuação ≥ 6 indica disfunção grave, avalie choque séptico.' },
    ],
  },
  'o-que-e-primeira-hora': {
    title: '1ª LINHA · 4 ações em ≤ 1 hora',
    blocks: [
      { p: <>As 4 ações que <strong>precisam acontecer na primeira hora</strong> após o reconhecimento da sepse:</> },
      { list: [
        <><strong>Hemocultura × 2</strong> (aeróbio + anaeróbio) · antes do antibiótico</>,
        <><strong>Lactato sérico</strong> · marcador de hipoperfusão</>,
        <><strong>Antibiótico IV de amplo espectro</strong> · em ≤ 1 hora se choque séptico</>,
        <><strong>Cristaloide 30 mL/kg</strong> · se hipotensão ou Lactato ≥ 2</>,
      ] },
      { helper: 'Cada hora de atraso no antibiótico aumenta mortalidade em ~7% no choque séptico (SSC 2026).' },
    ],
  },
  'o-que-e-acompanhamento': {
    title: 'Acompanhamento',
    blocks: [
      { p: 'Ações de continuidade após a primeira hora:' },
      { list: [
        <><strong>Vasopressor para PAM ≥ 65</strong> · Noradrenalina é 1ª linha</>,
        <><strong>Reavaliar lactato em 2-4h</strong> · queda ≥ 10% indica resposta</>,
        <><strong>Procalcitonina (opcional)</strong> · pode guiar de-escalonamento</>,
        <><strong>Considerar cobertura anaeróbica</strong> · se foco abdominal/pele</>,
        <><strong>Identificar foco infeccioso</strong> · imagem, cultura, exploração</>,
      ] },
      { helper: 'Bundle completo em 6 horas reduz mortalidade hospitalar em 25%.' },
    ],
  },
  'o-que-e-atb': {
    title: 'Antibioticoterapia',
    blocks: [
      { p: 'O app sugere esquemas baseados em diretrizes atuais.' },
      { p: <><strong>Consulte a SCIH/CCIH do seu hospital.</strong> Cada hospital tem perfil de resistência próprio. A SCIH orienta ajustes baseados na epidemiologia local.</> },
      { p: <><strong>ATB ≤ 1h</strong> · Reavalie em 48-72h.</> },
      { p: 'A escolha inicial considera 3 dimensões:' },
      { list: [
        <><strong>Foco infeccioso</strong> · define o espectro de cobertura</>,
        <><strong>Risco MRSA</strong> · 2+ fatores adicionam Vancomicina</>,
        <><strong>Risco MDR</strong> · 2+ fatores adicionam Pip-tazobactam</>,
      ] },
      { helper: 'Antibiótico IV em ≤ 1 hora no choque séptico. Reavalie em 48-72h e de-escalone conforme culturas.' },
    ],
  },
  'o-que-e-mrsa': {
    title: 'MRSA · Staphylococcus aureus resistente',
    blocks: [
      { p: <><strong>Methicillin-Resistant Staphylococcus aureus</strong> resiste à maioria dos beta-lactâmicos.</> },
      { p: 'Adicione cobertura anti-MRSA quando houver fatores de risco:' },
      { list: ['Internação recente (< 90 dias)', 'Antibiótico IV recente (< 90 dias)', 'Hemodiálise', 'Colonização prévia conhecida', 'Dispositivo intravascular'] },
    ],
  },
  'o-que-e-mdr': {
    title: 'MDR · Multidrug-Resistant',
    blocks: [
      { p: <>Germes <strong>multirresistentes</strong>. Adicione cobertura quando houver fatores de risco:</> },
      { list: [
        <><strong>ESBL</strong> · Bactérias produtoras de beta-lactamase de espectro estendido</>,
        <><strong>KPC / CRE</strong> · Enterobactérias resistentes a carbapenêmicos</>,
        <><strong>VRE</strong> · Enterococcus resistente à vancomicina</>,
        <><strong>Pseudomonas MDR</strong> · Pseudomonas multirresistente</>,
      ] },
    ],
  },
  'o-que-e-pam-alvo': {
    title: 'PAM Alvo na sepse',
    blocks: [
      { p: 'Pressão Arterial Média alvo na ressuscitação:' },
      { list: [<><strong>≥ 65 mmHg</strong> · alvo padrão SSC 2026</>, <><strong>60-65 mmHg</strong> · alvo permissivo em ≥ 65 anos (evita lesão por sobrecarga)</>] },
      { helper: 'PAM = PA diastólica + 1/3 × (PA sistólica − PA diastólica). Abaixo do alvo: hipoperfusão e disfunção de órgãos.' },
    ],
  },
  'o-que-e-bundle': {
    title: 'Bundle de 1 hora',
    blocks: [
      { p: 'SSC 2026 reuniu em 1 hora todas as ações que provaram salvar vidas:' },
      { list: ['Coletar lactato e hemoculturas antes do antibiótico', 'Iniciar antibiótico IV de amplo espectro em até 1 hora', 'Cristaloide 30 mL/kg se hipotensão ou lactato ≥ 2', 'Vasopressor para PAM ≥ 65 se hipotenso após fluidos', 'Reavaliar lactato em 2 a 4 horas'] },
      { helper: 'No choque séptico, o antibiótico em 1 hora é obrigatório. Na sepse sem choque, há mais tempo (3 horas) para confirmar diagnóstico antes de iniciar.' },
    ],
  },
  'o-que-e-foco': {
    title: 'Por que o foco infeccioso importa',
    blocks: [
      { p: <>A escolha empírica do antibiótico depende fortemente do <strong>foco suspeito</strong>:</> },
      { list: ['Pulmonar (PAC) usa cobertura para germes comunitários', 'Hospitalar (PAV/PAH) precisa cobrir gram-negativos resistentes', 'Abdominal e pélvico exige cobertura anaeróbica', 'SNC exige drogas que atravessem barreira hematoencefálica', 'Pele e partes moles depende se há ou não supuração'] },
      { helper: 'Adicione cobertura para MRSA ou MDR conforme fatores de risco do paciente.' },
    ],
  },
  'o-que-e-ne': {
    title: 'Noradrenalina (NE)',
    blocks: [
      { p: <>A <strong>Noradrenalina</strong> é o vasopressor de primeira linha em sepse (SSC 2026).</> },
      { list: ['Inicie em veia periférica calibrosa', 'CVC em até 6 horas', 'Titule a dose até a PAM atingir o alvo', 'Ao atingir 0,25 mcg/kg/min, considere associar Vasopressina (não escalonar NE indefinidamente)'] },
      { helper: 'Dose usual: 0,05-3,3 mcg/kg/min. Ajuste a cada 5 a 15 minutos conforme a PAM.' },
    ],
  },
  'o-que-e-hidrocortisona': {
    title: 'Hidrocortisona em sepse',
    blocks: [
      { p: <>SSC 2026 sugere <strong>200 mg/dia de hidrocortisona IV</strong> quando o paciente precisa de noradrenalina ou adrenalina em dose ≥ 0,25 mcg/kg/min por mais de 4 horas.</> },
      { p: 'Pode ser administrada em infusão contínua (8 mg/h) ou em bolus a cada 6 horas (50 mg).' },
      { helper: 'Não é indicada para todo paciente com sepse · só naqueles com choque refratário à ressuscitação e ao vasopressor.' },
    ],
  },
  'o-que-e-metas': {
    title: 'Metas de ressuscitação',
    blocks: [
      { p: 'Avaliação dinâmica, não estática:' },
      { list: ['PAM ≥ 65 mmHg', 'Lactato em queda', 'Débito urinário ≥ 0,5 mL/kg/h', 'Enchimento capilar < 3 s', 'SpO₂ 92-96% · sem hiperóxia'] },
    ],
  },
  'o-que-e-checklist-icu': {
    title: 'Checklist ICU · cuidados intensivos',
    blocks: [
      { p: 'Bundle de cuidados de UTI para reduzir complicações secundárias:' },
      { list: [
        <><strong>Profilaxia TVP</strong> · HBPM ou HNF</>,
        <><strong>Profilaxia GI</strong> · IBP (se fatores de risco)</>,
        <><strong>Cabeceira 30°</strong> · previne PAV</>,
        <><strong>Sedação leve</strong> · RASS -1 a 0</>,
        <><strong>Mobilização precoce</strong> · reabilitação</>,
        <><strong>Glicemia &lt; 180 mg/dL</strong> · insulina se ≥ 180</>,
      ] },
      { helper: 'Itens simples com alto impacto em mortalidade e tempo de internação.' },
    ],
  },
  // ── Teoria ────────────────────────────────────────────────
  'teoria-sofa': {
    title: 'Score SOFA e critério Sepsis-3',
    blocks: [
      { p: 'O SOFA avalia disfunção orgânica em 6 sistemas (respiratório, coagulação, fígado, cardiovascular, neurológico, renal). Cada sistema pontua de 0 a 4.' },
      { p: 'Critério Sepsis-3: variação de 2 ou mais pontos no SOFA em paciente com infecção suspeita.' },
      { helper: 'Em pacientes sem SOFA basal, considere SOFA = 0 e qualquer pontuação ≥ 2 caracteriza sepse.' },
    ],
  },
  'teoria-bundle': {
    title: 'Bundle de 1 hora',
    blocks: [
      { p: 'SSC 2026 reuniu em 1 hora todas as ações que provaram salvar vidas:' },
      { list: ['Coletar lactato e hemoculturas antes do antibiótico', 'Iniciar antibiótico IV de amplo espectro em até 1 hora', 'Cristaloide 30 mL/kg se hipotensão ou lactato ≥ 2', 'Vasopressor para PAM ≥ 65 se hipotenso após fluidos', 'Reavaliar lactato em 2 a 4 horas'] },
      { helper: 'No choque séptico, o antibiótico em 1 hora é obrigatório.' },
    ],
  },
  'teoria-atb': {
    title: 'Antibioticoterapia empírica',
    blocks: [
      { p: 'A escolha empírica considera 3 dimensões:' },
      { list: [
        <><strong>Foco infeccioso</strong></>,
        <><strong>Risco MRSA</strong> (internação recente, ATB IV recente, colonização, diálise)</>,
        <><strong>Risco MDR</strong> (ATB amplo recente, UTI prolongada, colonização por germe resistente)</>,
      ] },
      { helper: 'Reavaliar em 48 a 72 horas e de-escalonar conforme culturas.' },
    ],
  },
  'teoria-vaso': {
    title: 'Escalonamento de vasopressores',
    blocks: [
      { p: 'Noradrenalina é o vasopressor de primeira linha (SSC 2026).' },
      { list: ['Inicie em veia periférica calibrosa; CVC em até 6 horas', 'Titule até 0,25 mcg/kg/min antes de associar segundo agente', 'Vasopressina (0,03 U/min, dose fixa) é o segundo agente', 'Adrenalina entra como terceiro agente', 'Dobutamina se hipoperfusão persistir com PAM adequada'] },
      { p: 'Hidrocortisona 200 mg/dia IV se NE ou Adrenalina ≥ 0,25 mcg/kg/min por mais de 4 horas.' },
    ],
  },
  'teoria-metas': {
    title: 'Metas de ressuscitação',
    blocks: [
      { p: 'Avaliação dinâmica, não estática:' },
      { list: ['PAM ≥ 65 mmHg (60 a 65 em ≥ 65 anos)', 'Clareamento de lactato ≥ 10% em 2 horas', 'Débito urinário ≥ 0,5 mL/kg/h', 'Enchimento capilar ≤ 3 segundos', 'Glicemia 140 a 180 mg/dL', 'SpO₂ ≥ 94% (evite hiperóxia)'] },
    ],
  },
};

/** Render genérico do corpo do modal (blocks → SheetText/SheetList). */
export function SepseModalBody({ blocks = [] }) {
  return (
    <>
      {blocks.map((b, i) => {
        if (b.list) return <SheetList key={i} items={b.list} />;
        if (b.helper != null) return <SheetText key={i} variant="auxiliary">{b.helper}</SheetText>;
        return <SheetText key={i}>{b.p}</SheetText>;
      })}
    </>
  );
}

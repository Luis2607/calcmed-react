/* ============================================================
   AVC · DADOS CLÍNICOS + cálculos puros
   Porte 1:1 do golden calcmed/src/protocolos/avc/avc.js
   Fontes: AHA/ASA Stroke Guideline 2026, cérebro avc/, estudo ELAN 2023.
   NUNCA aproximar — paridade clínica obrigatória (plano port-pcr §A7).
   ============================================================ */

// ============================================================
// HELPERS (1:1 avc.js)
// ============================================================
export function parseNum(str) {
  if (str == null) return NaN;
  return parseFloat(String(str).replace(',', '.'));
}

export function pad2(n) {
  return String(n).padStart(2, '0');
}

export function formatHora(ts) {
  const d = new Date(ts);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

export function diffMin(t1, t2) {
  return Math.floor((t2 - t1) / 60000);
}

// Aceita "HH:MM" ou "HHMM" → retorna ts (hoje). Igual ao golden parseHHMM.
export function parseHHMM(str) {
  if (!str) return null;
  const s = str.replace(/[^0-9:]/g, '');
  let h;
  let m;
  if (s.includes(':')) {
    const parts = s.split(':');
    h = parseInt(parts[0], 10);
    m = parseInt(parts[1], 10);
  } else if (s.length === 4) {
    h = parseInt(s.substring(0, 2), 10);
    m = parseInt(s.substring(2, 4), 10);
  } else {
    return null;
  }
  if (isNaN(h) || isNaN(m) || h > 23 || m > 59) return null;
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0).getTime();
}

// Auto-formatar HH:MM enquanto digita (golden onHorarioInput).
export function formatarHorario(raw) {
  let v = String(raw || '').replace(/[^0-9:]/g, '');
  if (v.length === 4 && !v.includes(':')) v = `${v.substring(0, 2)}:${v.substring(2)}`;
  return v;
}

// Janela em minutos a partir do horário informado (corrige p/ ontem se passou de hoje).
export function janelaMinDe(horarioStr) {
  const ts = parseHHMM(horarioStr);
  if (!ts) return null;
  let referenceTs = ts;
  if (ts > Date.now()) referenceTs = ts - 24 * 3600 * 1000;
  return diffMin(referenceTs, Date.now());
}

// Texto + faixa da janela (golden atualizarJanelaHelper).
export function janelaInfo(min) {
  if (min == null) return { texto: 'Janela: —', fora: false };
  const h = Math.floor(min / 60);
  const m = min % 60;
  let faixa = '';
  if (min < 270) faixa = ' · janela padrão (< 4.5h)';
  else if (min < 540) faixa = ' · janela estendida (4.5-9h · perfusão)';
  else if (min < 1440) faixa = ' · só trombectomia (avaliar)';
  else faixa = ' · fora de janela aguda (>24h)';
  return { texto: `Janela: ${h}h ${pad2(m)}min${faixa}`, fora: min > 1440 };
}

// ============================================================
// T1 · TRIAGEM
// ============================================================
export const SINTOMAS_OPCOES = [
  { value: 'sim', label: 'Sim, sintoma presenciado' },
  { value: 'nao', label: 'Não · paciente acordou assim (wake-up) ou foi encontrado' },
];

export const CINCINNATI_ITENS = [
  {
    key: 'face',
    titulo: 'Paralisia facial',
    helper: 'Peça para o paciente sorrir ou mostrar os dentes. Observe assimetria do sulco nasolabial.',
  },
  {
    key: 'braco',
    titulo: 'Queda do braço',
    helper: 'Peça para fechar os olhos e estender os braços por 10 segundos. Observe queda ou deriva.',
  },
  {
    key: 'fala',
    titulo: 'Alteração da fala',
    helper: 'Peça para repetir "O Brasil é o país do futebol". Observe disartria, afasia ou troca de palavras.',
  },
];

export const CINCINNATI_OPCOES = [
  { value: 'normal', label: 'Normal' },
  { value: 'alterado', label: 'Alterado' },
];

// 4 gates do bypass dose direta (Dra. Ana P0 · checkboxes obrigatórios).
export const BYPASS_GATES = [
  { value: 'doac', label: 'Sem DOAC nas últimas 48h (ou exames normais / reversor disponível).' },
  { value: 'sangramento', label: 'Sem sangramento ativo ou diátese hemorrágica grave.' },
  { value: 'pa', label: 'PA atual ≤ 185/110 mmHg.' },
  { value: 'hgt', label: 'Glicemia capilar > 50 mg/dL ou corrigida.' },
];

// ============================================================
// T2 · NIHSS · 11 domínios (15 itens com 1a/1b/1c, 5a/5b, 6a/6b)
// Porte 1:1 do golden NIHSS_DOMINIOS.
// ============================================================
export const NIHSS_DOMINIOS = [
  { id: '1a', num: 1, titulo: 'Nível de consciência', helper: 'Responsividade ao estímulo verbal/físico.', opcoes: [
    { v: 0, l: 'Alerta · responde prontamente' },
    { v: 1, l: 'Sonolento · desperta com estímulo verbal' },
    { v: 2, l: 'Obnubilado · requer estímulo doloroso' },
    { v: 3, l: 'Comatoso · só reflexos ou sem resposta' },
  ] },
  { id: '1b', num: 2, titulo: 'Perguntas LOC (mês atual + idade)', helper: 'Pergunte o mês e a idade. Não dê dicas.', opcoes: [
    { v: 0, l: 'Responde ambas corretamente' },
    { v: 1, l: 'Apenas uma correta (ou afasia/intubado)' },
    { v: 2, l: 'Nenhuma correta' },
  ] },
  { id: '1c', num: 3, titulo: 'Comandos LOC (abrir/fechar olhos e mão)', helper: 'Demonstre se necessário. Tarefa simples.', opcoes: [
    { v: 0, l: 'Executa ambos corretamente' },
    { v: 1, l: 'Executa apenas um' },
    { v: 2, l: 'Não executa nenhum' },
  ] },
  { id: '2', num: 4, titulo: 'Olhar conjugado', helper: 'Movimentos oculares horizontais.', opcoes: [
    { v: 0, l: 'Normal' },
    { v: 1, l: 'Paralisia parcial · desvio corrigível' },
    { v: 2, l: 'Desvio forçado ou paralisia total' },
  ] },
  { id: '3', num: 5, titulo: 'Campos visuais', helper: 'Hemianopsia por quadrantes (confronto).', opcoes: [
    { v: 0, l: 'Sem perda visual' },
    { v: 1, l: 'Hemianopsia parcial' },
    { v: 2, l: 'Hemianopsia completa unilateral' },
    { v: 3, l: 'Hemianopsia bilateral · cegueira cortical' },
  ] },
  { id: '4', num: 6, titulo: 'Paralisia facial', helper: 'Mostrar dentes, levantar sobrancelhas, fechar olhos.', opcoes: [
    { v: 0, l: 'Movimentos simétricos normais' },
    { v: 1, l: 'Paralisia mínima · apagamento de sulco' },
    { v: 2, l: 'Paralisia parcial · porção inferior' },
    { v: 3, l: 'Paralisia completa unilateral' },
  ] },
  { id: '5a', num: 7, titulo: 'Motor braço esquerdo', helper: 'Sentado: 90°. Deitado: 45°. Por 10s.', opcoes: [
    { v: 0, l: 'Sem queda por 10s' },
    { v: 1, l: 'Queda leve · não toca a cama' },
    { v: 2, l: 'Algum esforço contra gravidade · cai antes' },
    { v: 3, l: 'Sem esforço · movimento mínimo' },
    { v: 4, l: 'Sem movimento algum' },
    { v: 0, l: 'UN · não testável (amputação/fusão)', un: true },
  ] },
  { id: '5b', num: 8, titulo: 'Motor braço direito', helper: 'Mesmos critérios de 5a.', opcoes: [
    { v: 0, l: 'Sem queda por 10s' },
    { v: 1, l: 'Queda leve · não toca a cama' },
    { v: 2, l: 'Algum esforço contra gravidade · cai antes' },
    { v: 3, l: 'Sem esforço · movimento mínimo' },
    { v: 4, l: 'Sem movimento algum' },
    { v: 0, l: 'UN · não testável (amputação/fusão)', un: true },
  ] },
  { id: '6a', num: 9, titulo: 'Motor perna esquerda', helper: 'Deitado: 30°. Por 5s.', opcoes: [
    { v: 0, l: 'Sem queda por 5s' },
    { v: 1, l: 'Queda leve · não toca a cama' },
    { v: 2, l: 'Algum esforço contra gravidade · cai antes' },
    { v: 3, l: 'Sem esforço · cai imediatamente' },
    { v: 4, l: 'Sem movimento algum' },
    { v: 0, l: 'UN · não testável', un: true },
  ] },
  { id: '6b', num: 10, titulo: 'Motor perna direita', helper: 'Mesmos critérios de 6a.', opcoes: [
    { v: 0, l: 'Sem queda por 5s' },
    { v: 1, l: 'Queda leve · não toca a cama' },
    { v: 2, l: 'Algum esforço contra gravidade · cai antes' },
    { v: 3, l: 'Sem esforço · cai imediatamente' },
    { v: 4, l: 'Sem movimento algum' },
    { v: 0, l: 'UN · não testável', un: true },
  ] },
  { id: '7', num: 11, titulo: 'Ataxia de membros', helper: 'Index-nariz e calcanhar-joelho.', opcoes: [
    { v: 0, l: 'Ausente' },
    { v: 1, l: 'Presente em um membro' },
    { v: 2, l: 'Presente em dois ou mais' },
  ] },
  { id: '8', num: 12, titulo: 'Sensibilidade', helper: 'Estímulo doloroso/tato bilateral.', opcoes: [
    { v: 0, l: 'Normal · sem perda' },
    { v: 1, l: 'Perda leve a moderada · sente menor' },
    { v: 2, l: 'Perda grave ou anestesia completa' },
  ] },
  { id: '9', num: 13, titulo: 'Linguagem', helper: 'Descrever figura, nomear objetos, ler frases.', opcoes: [
    { v: 0, l: 'Normal · sem afasia' },
    { v: 1, l: 'Afasia leve-moderada · comunicação possível' },
    { v: 2, l: 'Afasia grave · fragmentada' },
    { v: 3, l: 'Afasia global ou mutismo' },
  ] },
  { id: '10', num: 14, titulo: 'Disartria', helper: 'Ler palavras padronizadas.', opcoes: [
    { v: 0, l: 'Normal · fala clara' },
    { v: 1, l: 'Leve-moderada · arrasta palavras' },
    { v: 2, l: 'Grave · incompreensível ou mutismo por disartria' },
    { v: 0, l: 'UN · intubado/barreira física', un: true },
  ] },
  { id: '11', num: 15, titulo: 'Extinção / inatenção', helper: 'Estimulação simultânea bilateral.', opcoes: [
    { v: 0, l: 'Normal' },
    { v: 1, l: 'Inatenção parcial · extinção a um modo' },
    { v: 2, l: 'Inatenção grave · hemi-negligência' },
  ] },
];

export const NIHSS_TOTAL_PASSOS = NIHSS_DOMINIOS.length;

// scores = { [domainId]: idxSelecionado } → total = Σ niveis[idx].v.
// Usa índice (não valor) porque há opções com mesmo v (ex.: UN = 0) que precisam
// ser distinguíveis na seleção (golden usa data-idx).
export function nihssTotal(scoresByIdx = {}) {
  return NIHSS_DOMINIOS.reduce((acc, d) => {
    const idx = scoresByIdx[d.id];
    if (typeof idx === 'number' && d.opcoes[idx]) return acc + d.opcoes[idx].v;
    return acc;
  }, 0);
}

// Gravidade clínica NIHSS (teoria-nihss).
export function nihssGravidade(total) {
  if (total === 0) return 'sem déficit';
  if (total <= 4) return 'AVC leve (Minor)';
  if (total <= 15) return 'AVC moderado';
  if (total <= 20) return 'AVC moderadamente grave';
  return 'AVC grave';
}

// ============================================================
// T3 · ELEGIBILIDADE / CONTRAINDICAÇÕES
// Grupos extraídos do golden avc.html (sanfonas).
// ============================================================
export const CONTRA_ABSOLUTAS = [
  { key: 'doac', label: 'DOAC há menos de 48h · suspende trombólise IV.' },
  { key: 'doac-incerto', label: 'DOAC desconhecido · família não sabe · solicitar TTPa/TP/anti-Xa.' },
  { key: 'sangramento', label: 'Sangramento ativo · interno ou diátese grave.' },
  { key: 'hsa', label: 'Hemorragia subaracnoide ativa.' },
  { key: 'cirurgia-snc', label: 'Neurocirurgia / TCE grave < 3 meses.' },
  { key: 'hgt-baixa', label: 'Glicemia < 50 mg/dL não corrigida · mimetiza AVC.' },
];

export const CONTRA_PATOLOGIA = [
  { key: 'neoplasia', label: 'Neoplasia intracraniana.' },
  { key: 'aneurisma', label: 'Aneurisma cerebral conhecido.' },
  { key: 'mav', label: 'Malformação arteriovenosa (MAV).' },
  { key: 'hic-previa', label: 'Hemorragia intracraniana prévia (relativa).' },
  { key: 'aria', label: 'ARIA-E/ARIA-H (anti-amiloide Alzheimer).' },
];

export const CONTRA_RELATIVAS = [
  { key: 'cirurgia-14d', label: 'Cirurgia maior < 14 dias.' },
  { key: 'iam-3m', label: 'IAM < 3 meses.' },
  { key: 'gi-uri-21d', label: 'Sangramento GI/URI < 21 dias.' },
  { key: 'gestacao', label: 'Gestação ativa.' },
  { key: 'puncao-7d', label: 'Punção arterial não compressível < 7 dias.' },
];

// Avalia elegibilidade à trombólise IV (golden atualizarContras).
export function avaliarElegibilidade(contras = { absolutas: [], patologia: [], relativas: [] }) {
  const abs = contras.absolutas || [];
  const pat = contras.patologia || [];
  const doac = abs.includes('doac');
  const doacIncerto = abs.includes('doac-incerto');
  const sangramento = abs.includes('sangramento');
  const hsa = abs.includes('hsa');
  const cirurgiaSnc = abs.includes('cirurgia-snc');
  const hgtBaixa = abs.includes('hgt-baixa');
  const neoplasia = pat.includes('neoplasia');
  const aneurisma = pat.includes('aneurisma');
  const mav = pat.includes('mav');
  const aria = pat.includes('aria');

  const blocked = doac || sangramento || hsa || cirurgiaSnc || hgtBaixa || neoplasia || aneurisma || mav || aria;

  let motivo = 'Contraindicação absoluta detectada.';
  if (doac) motivo = 'DOAC há menos de 48h · trombólise IV suspensa.';
  else if (sangramento) motivo = 'Sangramento ativo · suspende trombólise.';
  else if (hsa) motivo = 'HSA · suspende trombólise.';
  else if (cirurgiaSnc) motivo = 'Neurocirurgia/TCE grave < 3 meses.';
  else if (hgtBaixa) motivo = 'Glicemia < 50 não corrigida · mimetiza AVC.';
  else if (neoplasia || aneurisma || mav) motivo = 'Patologia cerebral · contraindicação.';
  else if (aria) motivo = 'ARIA · contraindicação.';

  return { blocked, elegivel: !blocked, motivo: `${motivo} Avalie trombectomia mecânica.`, doacIncerto };
}

// PA acima do gate pré-trombólise (185/110).
export function paAcima(pas, pad) {
  return (pas != null && pas > 185) || (pad != null && pad > 110);
}

// ============================================================
// T4 · POSOLOGIA
// ============================================================
export const PESO_ESTIMATIVAS = [
  { peso: 60, biotipo: 'pequeno', label: 'Pequeno · 60 kg' },
  { peso: 75, biotipo: 'medio', label: 'Médio · 75 kg' },
  { peso: 95, biotipo: 'grande', label: 'Grande · 95 kg' },
];

export const TROMBOLITICO_OPCOES = [
  { value: 'tnk', label: 'Tenecteplase', description: 'TNK · preferencial 2026' },
  { value: 'alteplase', label: 'Alteplase', description: 'rt-PA · clássico' },
];

// Cálculo de dose (golden calcularDose). Retorna null se peso inválido.
export function calcularDose(peso, trombolitico) {
  if (peso == null || isNaN(peso)) return null;
  if (trombolitico === 'tnk') {
    let dose = +(peso * 0.25).toFixed(1);
    let capada = false;
    if (peso >= 100) { dose = 25; capada = true; }
    return {
      nome: 'Tenecteplase (TNK)',
      valorFmt: String(dose).replace('.', ','),
      doseTotal: dose,
      modo: 'Bolus único IV em 5 a 10 segundos.',
      detalhe: null,
      capada,
      badge: 'Dose máxima 25 mg (≥ 100 kg)',
    };
  }
  let dose = +(peso * 0.9).toFixed(1);
  let capada = false;
  if (peso >= 100) { dose = 90; capada = true; }
  const bolus = +(dose * 0.1).toFixed(2);
  const infusao = +(dose * 0.9).toFixed(2);
  return {
    nome: 'Alteplase (rt-PA)',
    valorFmt: String(dose).replace('.', ','),
    doseTotal: dose,
    modo: 'Bolus 10% em 1 min, depois infusão 90% em 60 min.',
    detalhe: [
      { label: 'Bolus (10%)', valor: `${String(bolus).replace('.', ',')} mg`, sufixo: 'em 1 min' },
      { label: 'Infusão contínua (90%)', valor: `${String(infusao).replace('.', ',')} mg`, sufixo: 'em 60 min' },
    ],
    capada,
    badge: 'Dose máxima 90 mg (≥ 100 kg)',
  };
}

export const PESO_MIN = 10;
export const PESO_MAX = 250;

// ============================================================
// T5 · MONITORAMENTO
// ============================================================
// Meta de PA dinâmica conforme cenário (golden sincronizarT5).
export function metaPA({ hemorragico, doseTotal, trombolitico }) {
  if (hemorragico) {
    return { valor: 'PAS 130 – 140 mmHg', modo: 'AVC hemorrágico · reduza a PA agressivamente nas primeiras horas.' };
  }
  if (doseTotal) {
    return {
      valor: '< 180/105 mmHg',
      modo: `Pós-${trombolitico === 'tnk' ? 'TNK' : 'Alteplase'} ${doseTotal} mg · monitore 15/15 min nas primeiras 2h.`,
    };
  }
  return { valor: '≤ 220/120 mmHg', modo: 'Sem reperfusão · trate a PA só acima de 220/120.' };
}

// Limite de PA pra colorir aferição no histórico (golden renderPAHistorico).
export function limitePA({ hemorragico, doseTotal }) {
  if (hemorragico) return { pas: 140, pad: 90 };
  if (doseTotal) return { pas: 180, pad: 105 };
  return { pas: 220, pad: 120 };
}

export const PA_MONITOR_RANGE = { pasMin: 60, pasMax: 260, padMin: 30, padMax: 160 };

// Glicemia capilar fora da meta (golden onGlicemiaMonitor).
export function avaliarGlicemia(v) {
  if (v == null || isNaN(v)) return null;
  if (v < 140) {
    return {
      nivel: 'baixa',
      titulo: 'Glicemia abaixo da meta',
      corpo: 'Glicemia abaixo de 140 mg/dL. Reavalie em 30 min. Se < 50, corrija imediatamente — pode mimetizar AVC.',
    };
  }
  if (v > 180) {
    return {
      nivel: 'alta',
      titulo: 'Glicemia acima da meta',
      corpo: 'Glicemia acima de 180 mg/dL. Inicie insulina regular conforme protocolo institucional.',
    };
  }
  return null;
}

export const DISFAGIA_OPCOES = [
  { value: 'aprovado', label: 'Aprovado · sem tosse, engasgo ou voz molhada.' },
  { value: 'falhou', label: 'Falhou · manter dieta zero · avaliar fono.' },
  { value: 'nao-feito', label: 'Ainda não testado.' },
];

// ============================================================
// T6 · TROMBECTOMIA
// ============================================================
export const TROMBEC_VASO_OPCOES = [
  { value: 'aci-m1', label: 'Carótida interna (ACI) ou M1 da ACM' },
  { value: 'm2', label: 'M2 dominante · até 6h' },
  { value: 'basilar', label: 'Basilar · até 24h' },
  { value: 'nao', label: 'Sem oclusão de grande vaso' },
];

export const TROMBEC_MRS_OPCOES = [
  { value: '0-1', label: 'mRS 0 ou 1 · funcional independente' },
  { value: '2+', label: 'mRS ≥ 2 · dependência prévia · risco/benefício' },
];

// Recomendação de trombectomia (golden avaliarTrombectomia). Retorna null se incompleto.
export function avaliarTrombectomia({ vaso, aspects, mrs, nihss }) {
  if (!vaso || aspects == null || !mrs) return null;
  if (vaso === 'nao') {
    return {
      titulo: 'Sem indicação',
      corpo: 'Sem oclusão de grande vaso identificada. Mantenha o tratamento clínico e considere trombólise se elegível.',
    };
  }
  if (mrs === '2+') {
    return {
      titulo: 'Avaliar risco-benefício',
      corpo: 'mRS prévio ≥ 2 · funcionalidade limitada antes do evento. Discuta com a família e neurologia.',
    };
  }
  if (nihss < 6 && vaso !== 'basilar') {
    return {
      titulo: 'NIHSS baixo',
      corpo: 'NIHSS < 6 fora de basilar · benefício de trombectomia é incerto. Avalie individualmente.',
    };
  }
  if (aspects < 6) {
    return {
      titulo: 'Critério expandido AHA/ASA 2026',
      corpo: `Trombectomia recomendada mesmo com ASPECTS ${aspects} (estudos SELECT2 e ANGEL-ASPECT). Encaminhe pra hemodinâmica.`,
    };
  }
  if (vaso === 'basilar') {
    return {
      titulo: 'Trombectomia de basilar',
      corpo: `Critérios atendidos para basilar até 24h: PC-ASPECTS ${aspects} · NIHSS ${nihss} · mRS prévio 0-1. Acione hemodinâmica de urgência.`,
    };
  }
  if (vaso === 'm2') {
    return {
      titulo: 'Trombectomia M2 dominante',
      corpo: `Indicada em até 6h · ASPECTS ${aspects} · NIHSS ${nihss}. Acione hemodinâmica.`,
    };
  }
  return {
    titulo: 'Trombectomia recomendada',
    corpo: `ACI/M1 · ASPECTS ${aspects} · NIHSS ${nihss} · mRS 0-1. Acione hemodinâmica.`,
  };
}

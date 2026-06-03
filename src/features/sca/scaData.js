/* ============================================================
   SCA · DADOS CLÍNICOS + cálculos puros
   Porte 1:1 do golden calcmed/src/protocolos/sca/sca.js
   Fontes: SBC 2025 (Diretriz SCA), Rao 2025 (ACC/AHA), Alencar 2025 (sinais OMI),
   ESC 2023 (algoritmo troponina 0/1h). NUNCA aproximar — paridade clínica obrigatória.
   ============================================================ */

// ============================================================
// HELPERS
// ============================================================
export function parseNum(raw) {
  if (raw == null) return NaN;
  const s = String(raw).replace(',', '.').trim();
  return s === '' ? NaN : parseFloat(s);
}

export function pad2(n) {
  return String(n).padStart(2, '0');
}

// MM:SS de um intervalo em ms (cronômetros porta-ECG, ECG seriado, porta-balão/agulha).
export function formatarMinSeg(ms) {
  if (ms == null || ms < 0) return '--:--';
  const min = Math.floor(ms / 60000);
  const seg = Math.floor((ms % 60000) / 1000);
  return `${pad2(min)}:${pad2(seg)}`;
}

// Cronômetro master H:MM / MM:SS (golden formatarHoraMin).
export function formatarHoraMin(ms) {
  if (ms == null || ms < 0) return '00:00';
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  if (h > 0) return `${h}h${pad2(m)}`;
  return `${pad2(m)}:${pad2(s)}`;
}

// Faixa de cor de um cronômetro com meta em min (golden tickPortaEcg/tickCrono):
// safe < meta · warning meta..meta*1.3 · critical ≥ meta*1.3 (porta-ECG usa 10/15 fixos).
export function faixaCrono(ms, metaMin, metaCriticaMin) {
  const min = ms / 60000;
  const critica = metaCriticaMin ?? metaMin * 1.3;
  if (min >= critica) return 'critical';
  if (min >= metaMin) return 'warning';
  return 'safe';
}

// ============================================================
// SETUP · REALIDADE DO SERVIÇO (golden LABELS_REALIDADE)
// ============================================================
export const SETUP_TROP_OPCOES = [
  { value: 'hs', label: 'hs-cTn (0/1h)', description: 'Troponina ultrassensível · algoritmo 0/1h.' },
  { value: 'conv', label: 'Convencional (0/3/6h)', description: 'Troponina convencional · janela 3-6h.' },
  { value: 'poct', label: 'POCT (≥40 ng/L)', description: 'Teste rápido à beira-leito · resultado 15-20 min.' },
  { value: 'ambos', label: 'Vários kits', description: 'Padrão hs-cTn 0/1h.' },
];

export const SETUP_ESCORE_OPCOES = [
  { value: 'heart', label: 'HEART', description: '5 itens · padrão para dor torácica.' },
  { value: 'timi', label: 'TIMI', description: '7 critérios · comum em UPA/SUS.' },
  { value: 'ambos', label: 'HEART + TIMI + HEAR', description: 'Todos os escores disponíveis.' },
];

// ============================================================
// TELA 1 · TRIAGEM
// ============================================================
export const OPCOES_QUEIXA = [
  { value: 'tipica', titulo: 'Dor torácica anginosa', sub: 'Aperto/peso, irradiação clássica · alta probabilidade isquêmica' },
  { value: 'atipica', titulo: 'Dor torácica não anginosa', sub: 'Sem padrão clássico, mas suspeita clínica mantida' },
  { value: 'dispneia', titulo: 'Dispneia', sub: 'Equivalente anginoso (idoso, DM, mulher)' },
  { value: 'sincope', titulo: 'Síncope', sub: 'Perda de consciência transitória' },
  { value: 'epigastrica', titulo: 'Dor epigástrica', sub: 'Idoso, DM ou DAC prévia · cuidado, mascara como dispepsia' },
  { value: 'diaforese-nausea', titulo: 'Sudorese e náusea isoladas', sub: 'Equivalentes sem dor torácica' },
  { value: 'outro', titulo: 'Outro', sub: 'Detalhar em anotação' },
];

export function labelQueixa(value) {
  return OPCOES_QUEIXA.find((o) => o.value === value)?.titulo || null;
}

// Flags de anamnese (checkboxes da triagem). Keys 1:1 do golden estadoPadrao.flags.
export const FLAGS_ANAMNESE = [
  { key: 'dor10min', label: 'Dor em repouso > 10 min' },
  { key: 'irradiacao', label: 'Irradiação típica (membro, mandíbula ou dorso)' },
  { key: 'autonomicos', label: 'Sintomas autonômicos (sudorese, náusea, vômito)' },
  { key: 'fatoresRisco', label: 'Fatores de risco cardiovascular' },
  { key: 'dacPrevia', label: 'DAC prévia conhecida' },
  { key: 'avcPrevio', label: 'AVC ou AIT prévio' },
  { key: 'pde5', label: 'Inibidor de PDE5 nas últimas 48h' },
  { key: 'saa', label: 'Suspeita de síndrome aórtica aguda' },
  { key: 'aco', label: 'Em uso de anticoagulante' },
  { key: 'gestante', label: 'Gestante' },
];

// Alertas reativos da triagem (golden atualizarAlertasTriagem · ordem = prioridade).
export function alertasTriagem({ flags = {}, idade, queixa }) {
  const alertas = [];
  if (flags.saa) alertas.push({
    key: 'saa', tipo: 'warning', titulo: 'Suspeita de dissecção aórtica (SAA)',
    corpo: 'Não administrar AAS empírico. Aplicar ADD-RS antes. O AAS fica bloqueado na conduta até a SAA ser descartada.',
  });
  if (flags.pde5) alertas.push({
    key: 'pde5', tipo: 'warning', titulo: 'PDE5 nas últimas 48h',
    corpo: 'Nitratos contraindicados nas próximas 24h (sildenafil) ou 48h (tadalafil). Bloqueio ativo na conduta.',
  });
  if (flags.gestante) alertas.push({
    key: 'gestante', tipo: 'warning', titulo: 'Gestante',
    corpo: 'HEART, TIMI e GRACE não estão validados em gestantes. Doses modificadas · acionar cardiologista.',
  });
  if (flags.avcPrevio) alertas.push({
    key: 'avcPrevio', tipo: 'info', titulo: 'AVC ou AIT prévio',
    corpo: 'Prasugrel será bloqueado (Classe 3 Harm · Rao 2025). Usar ticagrelor ou clopidogrel.',
  });
  if (flags.aco) alertas.push({
    key: 'aco', tipo: 'info', titulo: 'Em uso de anticoagulante',
    corpo: 'Manejo antitrombótico complexo (tripla terapia). Árvore de decisão adaptada na conduta.',
  });
  if (idade != null && idade >= 75) alertas.push({
    key: 'idoso', tipo: 'info', titulo: 'Paciente idoso (≥ 75a)',
    corpo: 'Doses ajustadas adiante · meia-dose de tenecteplase, enoxaparina sem bolus IV, prasugrel reduzido a 5 mg/dia.',
  });
  if (idade != null && idade < 50 && !flags.fatoresRisco && !flags.dacPrevia
      && (queixa === 'tipica' || queixa === 'atipica')) alertas.push({
    key: 'scad-takotsubo', tipo: 'info', titulo: 'Paciente jovem sem fatores de risco',
    corpo: 'Considerar diferenciais: SCAD (dissecção coronária espontânea), Takotsubo, miocardite, espasmo. Cuidado com antitrombóticos agressivos.',
  });
  return alertas;
}

// ============================================================
// TELA 2 · ECG
// ============================================================
export const ECG_CLASSES = [
  { value: 'stemi', titulo: 'STEMI clássico', meta: 'Supra persistente', tone: 'critical', sub: 'Ativar reperfusão imediata.' },
  { value: 'preocupante', titulo: 'ECG preocupante', meta: 'Sem critério claro', tone: 'warning', sub: 'Observação monitorizada e ECG seriado.' },
  { value: 'omi', titulo: 'Sem STEMI, checar OMI', meta: 'Detector IAM', tone: 'info', sub: 'Procurar sinais de oclusão aguda.' },
];

export const STEMI_LOCALIZACOES = [
  { value: 'anterior', label: 'Anterior (V1-V6)' },
  { value: 'inferior', label: 'Inferior (DII, DIII, aVF)' },
  { value: 'lateral', label: 'Lateral (DI, aVL, V5-V6)' },
  { value: 'posterior', label: 'Posterior (V7-V9)' },
];

// 8 sinais OMI (golden sinaisOmiData · SBC 2025 Tabela 7 + Alencar 2025).
export const SINAIS_OMI = [
  { id: 'tHiperaguda', nome: 'Onda T hiperaguda', criterio: 'T volumosa, larga na base, simétrica, desproporcional ao QRS. Sinal mais precoce · pode aparecer antes do supra.' },
  { id: 'deWinter', nome: 'Sinal de De Winter', criterio: 'Infra ST ≥ 1 mm no ponto J em V1-V6 + T altas, simétricas, pontiagudas. Equivale a oclusão proximal da DA.' },
  { id: 'wellens', nome: 'Síndrome de Wellens', criterio: 'Tipo A: T bifásica em V2-V3. Tipo B: T profundamente invertida e simétrica. Instabilidade da ADA.' },
  { id: 'aslanger', nome: 'Padrão de Aslanger', criterio: 'Supra ST isolado em DIII + infra em V4-V6 (sem supra em outras inferiores). 6,3% dos "IAMSSST" reais.' },
  { id: 'espelhoPosterior', nome: 'Infra V1-V3 (espelho posterior)', criterio: 'Não é "isquemia subendocárdica" · é espelho de supra posterior. Confirmar com V7-V8-V9 obrigatório.' },
  { id: 'sgarbossaSmith', nome: 'BRE/BRD com sinais isquêmicos', criterio: 'Critério Sgarbossa-Smith: razão ST/S ou ST/R ≥ 0,25 = OMI. Cronologia do BRE é irrelevante.' },
  { id: 'distorcaoQrsTerminal', nome: 'Distorção terminal do QRS', criterio: 'Ausência simultânea da onda S e da onda J em V2 e/ou V3. Especificidade 100% para IAM anterior (Smith).' },
  { id: 'istAvlIsolado', nome: 'IST em aVL isolado', criterio: 'Infra ST transitório em aVL (recíproco). Aparece em até 97% dos IAMs inferiores · sinal mais precoce (Alencar 2025).' },
];

export function algumSinalOmi(sinaisOmi = {}) {
  return Object.values(sinaisOmi).some(Boolean);
}

// Sgarbossa-Smith · razão ST/S (golden calcularSgarbossa). Positivo se ≥ 0,25.
export function sgarbossaRatio(st, s) {
  const stN = parseNum(st);
  const sN = parseNum(s);
  if (isNaN(stN) || isNaN(sN) || sN === 0) return null;
  return Math.abs(stN / sN);
}
export function sgarbossaPositivo(ratio) {
  return ratio != null && ratio >= 0.25;
}

// Validação da tela 2 (golden validarTela2).
export function tela2Valida({ ecgClasse, stemiLocalizacao, sinaisOmi, lockSoftOmiConfirmado }) {
  if (ecgClasse === 'stemi') return !!stemiLocalizacao;
  if (ecgClasse === 'preocupante') return true;
  if (ecgClasse === 'omi') return algumSinalOmi(sinaisOmi) || !!lockSoftOmiConfirmado;
  return false;
}

// ============================================================
// TELA 3 · ESTRATIFICAR · ESCORES (golden heartItems/timiItems/hearItems)
// ============================================================
export const HEART_ITEMS = [
  { id: 'history', label: 'História (anamnese)', opcoes: [{ val: 0, texto: 'Improvável' }, { val: 1, texto: 'Moderada' }, { val: 2, texto: 'Altamente suspeita' }] },
  { id: 'ecg', label: 'ECG', opcoes: [{ val: 0, texto: 'Normal' }, { val: 1, texto: 'Repolarização inespecífica' }, { val: 2, texto: 'Desvio significativo' }] },
  { id: 'age', label: 'Idade', opcoes: [{ val: 0, texto: '< 45a' }, { val: 1, texto: '45-64a' }, { val: 2, texto: '≥ 65a' }] },
  { id: 'risk', label: 'Fatores de risco', opcoes: [{ val: 0, texto: 'Nenhum' }, { val: 1, texto: '1-2 fatores' }, { val: 2, texto: '≥ 3 fatores ou DAC' }] },
  { id: 'troponin', label: 'Troponina', opcoes: [{ val: 0, texto: '≤ normal' }, { val: 1, texto: '1-3x normal' }, { val: 2, texto: '> 3x normal' }] },
];

export const TIMI_ITEMS = [
  { id: 'age65', label: 'Idade ≥ 65 anos' },
  { id: 'fr3', label: '≥ 3 fatores de risco para DAC' },
  { id: 'dac', label: 'DAC conhecida (estenose ≥ 50%)' },
  { id: 'aas', label: 'Uso de AAS nos últimos 7 dias' },
  { id: 'angina', label: '≥ 2 episódios anginosos nas últimas 24h' },
  { id: 'ecgSt', label: 'Desvio de ST ≥ 0,5 mm' },
  { id: 'troponina', label: 'Troponina positiva' },
];

export const HEAR_ITEMS = HEART_ITEMS.filter((i) => i.id !== 'troponin');

// Cálculo de escore (golden calcularEscore). categoria: 'baixo' | 'medio' | 'alto'.
export function calcularEscore({ tipo, heart = {}, timi = {}, hear = {} }) {
  let total = 0;
  let max = 10;
  let categoria = 'baixo';
  let preenchido = false;
  if (tipo === 'heart') {
    Object.values(heart).forEach((v) => { if (v != null) { total += v; preenchido = true; } });
    if (total >= 7) categoria = 'alto';
    else if (total >= 4) categoria = 'medio';
  } else if (tipo === 'timi') {
    Object.values(timi).forEach((v) => { if (v) total += 1; });
    preenchido = Object.values(timi).some(Boolean);
    max = 7;
    if (total >= 5) categoria = 'alto';
    else if (total >= 3) categoria = 'medio';
  } else if (tipo === 'hear') {
    Object.values(hear).forEach((v) => { if (v != null) { total += v; preenchido = true; } });
    max = 8;
    if (total >= 6) categoria = 'alto';
    else if (total >= 3) categoria = 'medio';
  }
  return { total, max, categoria, preenchido };
}

// ============================================================
// TROPONINA · algoritmo adaptativo por kit (golden interpretarTroponina)
// status: 'pulada' | 'pendente' | 'rule-out' | 'rule-in' | 'observacao'
// ============================================================
export function interpretarTroponina({ tropTipo = 'hs', tropInicial, tropSeriada, tropPulada, irc }) {
  if (tropPulada) return { status: 'pulada', texto: 'Troponina pulada · decisão preliminar' };
  if (tropInicial == null || isNaN(tropInicial)) return { status: 'pendente', texto: 'Pendente' };

  if (tropTipo === 'hs' || tropTipo === 'ambos') {
    // Algoritmo 0/1h ESC/Rao 2025 (cTnT hs · ng/L)
    if (tropInicial < 5) return { status: 'rule-out', texto: 'Descartado (rule-out) · hs-cTn < 5 ng/L · 1 dosagem suficiente' };
    if (tropSeriada == null || isNaN(tropSeriada)) {
      if (tropInicial >= 52) return { status: 'rule-in', texto: 'Confirmado (rule-in) · hs-cTn ≥ 52 ng/L · valor já diagnóstico' };
      return { status: 'pendente', texto: 'Aguardando 2ª dosagem (1h)' };
    }
    const delta = Math.abs(tropSeriada - tropInicial);
    if (delta < 3 && tropInicial < 14 && tropSeriada < 14) {
      return { status: 'rule-out', texto: `Descartado (rule-out) · delta ${delta.toFixed(1)} < 3 · ambos < 14 ng/L` };
    }
    if (delta >= 5 || tropSeriada >= 52) {
      return { status: 'rule-in', texto: `Confirmado (rule-in) · delta ${delta.toFixed(1)} ${delta >= 5 ? '≥ 5' : '< 5'} · 2ª ${tropSeriada} ng/L` };
    }
    return { status: 'observacao', texto: `Zona cinzenta (delta ${delta.toFixed(1)}) · repetir e observar` };
  }
  if (tropTipo === 'conv') {
    // Convencional 0/3/6h · ng/mL
    if (tropInicial < 0.04) {
      if (tropSeriada == null || isNaN(tropSeriada)) return { status: 'rule-out', texto: 'Descartado parcial (rule-out) · 1ª < 0,04 ng/mL · confirmar com 2ª em 3-6h' };
      if (tropSeriada < 0.04) return { status: 'rule-out', texto: 'Descartado (rule-out) · ambas < 0,04 ng/mL · janela 3-6h cumprida' };
    }
    if (tropInicial > 0.5) return { status: 'rule-in', texto: 'Confirmado (rule-in) · cTn convencional > 0,5 ng/mL · valor já diagnóstico' };
    if (tropSeriada != null && !isNaN(tropSeriada)) {
      const deltaPct = tropInicial > 0 ? Math.abs((tropSeriada - tropInicial) / tropInicial) * 100 : 0;
      if (deltaPct >= 20) return { status: 'rule-in', texto: `Confirmado (rule-in) · delta ${deltaPct.toFixed(0)}% ≥ 20% · padrão dinâmico` };
      if (tropSeriada > 0.5) return { status: 'rule-in', texto: 'Confirmado (rule-in) · 2ª > 0,5 ng/mL' };
    }
    return { status: 'observacao', texto: 'Em observação · refazer em 3-6h (não em 1-2h como na ultrassensível)' };
  }
  if (tropTipo === 'poct') {
    if (tropInicial < 40) return { status: 'rule-out', texto: `Descartado (rule-out) · POCT < 40 ng/L${irc ? ' · atenção em IRC' : ''}` };
    return { status: 'rule-in', texto: 'Confirmado (rule-in) · POCT ≥ 40 ng/L' };
  }
  return { status: 'pendente', texto: 'Pendente' };
}

// Decisão integrada da estratificação (golden atualizarDecisaoEstratif).
// Retorna { titulo, corpo, tipo: 'critico'|'atencao'|'info' }.
export function decisaoEstratificacao({ ecgClasse, escoreTipo, escoreTotal, escorePreenchido, trop, tropInicial, tropPulada }) {
  const escoreLabel = escoreTipo ? escoreTipo.toUpperCase() : '·';
  if (ecgClasse === 'stemi' || ecgClasse === 'omi') {
    return { tipo: 'critico', titulo: 'Internação CCU · Reperfusão urgente',
      corpo: 'ECG sugere IAM (STEMI ou equivalente OMI). Reperfusão é a próxima ação. A estratificação aqui é confirmatória · não atrasar o cateterismo/fibrinolítico.' };
  }
  if (trop.status === 'rule-in') {
    return { tipo: 'critico', titulo: 'Internação · SCA confirmado (NSTE-ACS)',
      corpo: `${trop.texto}${escorePreenchido ? ` · ${escoreLabel} ${escoreTotal}` : ''}. Iniciar antitrombóticos na próxima tela e estratificar a estratégia invasiva por GRACE e quadro clínico.` };
  }
  if (escoreTipo === 'heart' && trop.status === 'rule-out' && escoreTotal < 4 && escoreTotal > 0) {
    return { tipo: 'info', titulo: 'Alta segura · investigação ambulatorial',
      corpo: `HEART ${escoreTotal} (< 4) + troponina descartada + sem DAC conhecida = critério SBC. Encaminhar para investigação ambulatorial em 7 dias e teste funcional/anatômico em 30 dias.` };
  }
  if (escoreTipo === 'timi' && trop.status === 'rule-out' && escoreTotal <= 2 && escorePreenchido) {
    return { tipo: 'info', titulo: 'Baixo risco · investigação ambulatorial',
      corpo: `TIMI ${escoreTotal}/7 + troponina descartada. Alta com investigação ambulatorial em 7 dias (TIMI ≤ 2 · mortalidade 30 dias < 2,9%).` };
  }
  if (escoreTipo === 'timi' && escoreTotal >= 5) {
    return { tipo: 'critico', titulo: 'Alto risco · internação',
      corpo: `TIMI ${escoreTotal}/7 (≥ 5) · mortalidade em 30 dias de 19,9%. Internar com estratégia invasiva precoce.` };
  }
  if (escoreTipo === 'heart' && escoreTotal >= 7) {
    return { tipo: 'critico', titulo: 'Alto risco · internação em CCU',
      corpo: `HEART ${escoreTotal} (≥ 7) · MACE em 6 semanas de 50-65%. Internar e seguir estratégia invasiva precoce.` };
  }
  if (trop.status === 'observacao') {
    return { tipo: 'atencao', titulo: 'Observação · zona cinzenta',
      corpo: `${trop.texto}${escorePreenchido ? ` · ${escoreLabel} ${escoreTotal}` : ''}. Reavaliar com troponina seriada e ECG conforme a janela do kit.` };
  }
  if (trop.status === 'pulada') {
    return { tipo: 'atencao', titulo: 'Decisão preliminar · troponina pendente',
      corpo: `${escorePreenchido ? `${escoreLabel} ${escoreTotal} · ` : ''}troponina pulada. Reavaliar quando o resultado voltar${escoreTipo === 'hear' ? ' (HEAR cobre o intervalo pré-laboratorial)' : ''}.` };
  }
  if (!escorePreenchido && (tropInicial == null || isNaN(tropInicial)) && !tropPulada) {
    return { tipo: 'info', titulo: 'Pendente · escore + troponina',
      corpo: 'Preencha ao menos 1 escore e a troponina inicial para sugerir o destino. Você pode avançar mesmo assim · a defesa da decisão fica mais frágil.' };
  }
  return { tipo: 'info', titulo: 'Em construção · complete o que falta',
    corpo: `${escorePreenchido ? `${escoreLabel} ${escoreTotal}` : 'Sem escore'} · ${trop.status === 'pendente' ? 'aguardando troponina' : trop.texto}.` };
}

// ============================================================
// TELA 4 · CONDUZIR · DOSES (golden atualizarDoseTNK / anticoag)
// ============================================================
// Tenecteplase por faixa de peso · meia-dose se ≥ 75a.
export function doseTNK({ peso, idade }) {
  const p = parseNum(peso);
  if (isNaN(p)) return null;
  let dose;
  if (p < 60) dose = 30;
  else if (p < 70) dose = 35;
  else if (p < 80) dose = 40;
  else if (p < 90) dose = 45;
  else dose = 50;
  const meiaDose = idade != null && idade >= 75;
  if (meiaDose) dose = dose / 2;
  return { dose, meiaDose, detalhe: `Peso ${p} kg · ${meiaDose ? '½ DOSE (idade ≥ 75a)' : 'dose plena'}` };
}

// Anticoagulação por peso/idade (golden preencherTela4 anticoag-sub).
export function doseAnticoag({ peso, idade }) {
  const p = parseNum(peso);
  if (idade != null && idade >= 75) {
    return 'Enoxaparina 0,75 mg/kg SC (≥ 75a: sem bolus IV) ou UFH 60 UI/kg.';
  }
  if (!isNaN(p)) {
    return `Enoxaparina ${(p * 1).toFixed(0)} mg SC (1 mg/kg) ou UFH bolus 60-70 UI/kg (4000-5000 UI).`;
  }
  return 'Enoxaparina 1 mg/kg SC ou UFH bolus 60-70 UI/kg. Informe o peso para a dose.';
}

export const ONDE_REPERFUNDIR_OPCOES = [
  { value: 'cathlab-interno', titulo: 'Cathlab interno · disponível agora', sub: 'ICP primária no próprio hospital · meta ≤ 90 min do primeiro contato médico' },
  { value: 'transferencia-regional', titulo: 'Transferência para hemodinâmica regional', sub: 'ICP primária em outro serviço · meta ≤ 120 min · acionar transporte agora' },
  { value: 'fibrinolise-local', titulo: 'Fibrinólise local', sub: 'Sem hemodinâmica disponível · fibrinolisar e transferir em seguida (sempre)' },
];

// Árvore de reperfusão (golden decidirReperfusao). Retorna o estado da decisão.
export function reperfusaoDecisao({ ondeReperfundir, tempoPCI }) {
  if (!ondeReperfundir) {
    return { fase: 'escolher', tipo: 'info', titulo: 'Onde vai reperfundir?',
      corpo: 'A escolha define o fluxo · cathlab no hospital, transferência regional ou fibrinólise local.', reperfusaoTipo: null, mostraPpci: false, mostraFib: false };
  }
  if (ondeReperfundir === 'transferencia-regional' && (tempoPCI == null || isNaN(tempoPCI))) {
    return { fase: 'pede-tempo', tipo: 'info', titulo: 'Informe o tempo estimado até o cathlab regional',
      corpo: 'Se ≤ 120 min · ICP primária por transferência. Se > 120 min · fibrinolisar local.', reperfusaoTipo: null, mostraPpci: false, mostraFib: false };
  }
  if (ondeReperfundir === 'fibrinolise-local') {
    return { fase: 'decidido', tipo: 'atencao', titulo: 'Fibrinólise local + transferência',
      corpo: 'Sem hemodinâmica disponível agora. Fibrinolisar e transferir em seguida (obrigatório · sempre).', reperfusaoTipo: 'fibrinolise', mostraPpci: false, mostraFib: true };
  }
  if (ondeReperfundir === 'cathlab-interno') {
    return { fase: 'decidido', tipo: 'sucesso', titulo: 'ICP primária no hospital',
      corpo: `Cathlab interno disponível.${tempoPCI != null && !isNaN(tempoPCI) ? ` Tempo estimado ${tempoPCI} min.` : ''} Ativar cathlab.`, reperfusaoTipo: 'ppci', mostraPpci: true, mostraFib: false };
  }
  // transferencia-regional com tempoPCI definido
  if (tempoPCI <= 120) {
    return { fase: 'decidido', tipo: 'sucesso', titulo: 'Transferência regional para ICP primária',
      corpo: `Tempo até cathlab regional ${tempoPCI} min ≤ 120 min. Acionar transporte imediatamente.`, reperfusaoTipo: 'ppci', mostraPpci: true, mostraFib: false };
  }
  return { fase: 'decidido', tipo: 'atencao', titulo: 'Tempo de transferência > 120 min · fibrinolisar localmente',
    corpo: `PCI demoraria ${tempoPCI} min. Fibrinolisar e transferir em seguida (obrigatório).`, reperfusaoTipo: 'fibrinolise', mostraPpci: false, mostraFib: true };
}

// Sugestão de P2Y12 (golden renderP2Y12Decisao). Filtros: AVC/AIT bloqueia prasugrel;
// idade ≥ 75 ou peso < 60 kg = dose reduzida.
export function p2y12Sugestao({ reperfusaoTipo, ecgClasse, avcPrevio, idade, peso }) {
  const bloqPrasugrel = !!avcPrevio;
  const doseRed = (idade != null && idade >= 75) || (peso != null && !isNaN(parseNum(peso)) && parseNum(peso) < 60);
  const ppci = reperfusaoTipo === 'ppci' || (!reperfusaoTipo && (ecgClasse === 'stemi' || ecgClasse === 'omi'));

  let sugestao;
  if (ppci) {
    if (bloqPrasugrel) {
      sugestao = { tipo: 'info', titulo: 'Ticagrelor 180 mg VO (ataque)', corpo: 'Prasugrel bloqueado por AVC/AIT prévio. Manutenção 90 mg 2x/dia.' };
    } else if (doseRed) {
      sugestao = { tipo: 'atencao', titulo: 'Ticagrelor preferencial · ou prasugrel em dose reduzida', corpo: 'Idade ≥ 75a ou peso < 60 kg · prasugrel manutenção 5 mg/dia (não 10 mg). Ticagrelor é alternativa mais segura.' };
    } else {
      sugestao = { tipo: 'sucesso', titulo: 'Prasugrel 60 mg VO ou ticagrelor 180 mg VO', corpo: 'Preferenciais em PCI. Prasugrel manutenção 10 mg/dia · ticagrelor 90 mg 2x/dia.' };
    }
  } else if (reperfusaoTipo === 'fibrinolise') {
    sugestao = { tipo: 'info', titulo: 'Clopidogrel 300 mg VO (ataque)', corpo: 'Obrigatório com fibrinolítico. Em idade ≥ 75a · sem dose de ataque (75 mg/dia direto).' };
  } else {
    sugestao = { tipo: 'info', titulo: 'Ticagrelor 180 mg VO (NSTE-ACS conservador)', corpo: 'Preferencial em NSTE-ACS na estratégia conservadora.' };
  }
  return { ...sugestao, bloqPrasugrel, doseRed };
}

export const P2Y12_OPCOES = [
  { value: 'prasugrel', label: 'Prasugrel' },
  { value: 'ticagrelor', label: 'Ticagrelor' },
  { value: 'clopidogrel', label: 'Clopidogrel' },
];

// Contraindicações ao fibrinolítico (absolutas bloqueiam).
export const CONTRA_FIBRINOLITICO = [
  { key: 'avc-hemorragico', label: 'AVC hemorrágico prévio (qualquer época)', tipo: 'absoluta' },
  { key: 'avc-isquemico-3m', label: 'AVC isquêmico nos últimos 3 meses', tipo: 'absoluta' },
  { key: 'neoplasia-snc', label: 'Neoplasia ou malformação vascular do SNC', tipo: 'absoluta' },
  { key: 'sangramento-ativo', label: 'Sangramento ativo ou diátese hemorrágica', tipo: 'absoluta' },
  { key: 'dissecao', label: 'Suspeita de dissecção de aorta', tipo: 'absoluta' },
  { key: 'tce-3m', label: 'TCE grave ou cirurgia craniana < 3 meses', tipo: 'absoluta' },
  { key: 'hipertensao-grave', label: 'PA não controlada (> 180/110)', tipo: 'relativa' },
  { key: 'cirurgia-3sem', label: 'Cirurgia maior < 3 semanas', tipo: 'relativa' },
];

export function fibrinoliticoBloqueado(contraindicacoes = {}) {
  return CONTRA_FIBRINOLITICO.some((c) => c.tipo === 'absoluta' && contraindicacoes[c.key]);
}

// ============================================================
// TELA 5 · REAVALIAR · TIPO DE IAM + CONDUTA (golden detectarTipoIam / condutas)
// ============================================================
// Retorna 'stemi' | 'nstemi-omi' | 'zona-cinzenta' | null.
export function detectarTipoIam({ ecgClasse, sinaisOmi, trop }) {
  if (ecgClasse === 'stemi') return 'stemi';
  if (ecgClasse === 'omi' && algumSinalOmi(sinaisOmi)) return 'stemi'; // OMI = STEMI equivalente
  if (trop?.status === 'rule-in') return 'nstemi-omi';
  if (ecgClasse === 'preocupante' || trop?.status === 'observacao') return 'zona-cinzenta';
  return null;
}

export const CONDUTAS_INTERNACAO = {
  stemi: {
    classe: 'critical', tag: 'STEMI / OMI', titulo: 'Internação CCU/UTI · paciente reperfundido',
    linhas: [
      'Destino: CCU/UTI (pós-ICP primária ou pós-fibrinólise + transferência).',
      'DAPT 12 meses: AAS 100 mg/dia + ticagrelor 90 mg 2x/dia OU prasugrel 10 mg/dia.',
      'Tempo de internação: 3-5 dias se não complicado.',
      'Cateterismo: já realizado (ICP primária) ou pós-fibrinólise (rescue/rotineiro em 2-24h).',
      'Alta planejada: checklist completo (estatina, BB, IECA, espironolactona se FEVE ≤ 40%, reabilitação).',
    ],
  },
  'nstemi-omi': {
    classe: 'warning', tag: 'NSTEMI / OMI', titulo: 'Internação · troponina rule-in confirmou SCA',
    linhas: [
      'Destino: enfermaria se estável · CCU se instabilidade hemodinâmica.',
      'DAPT 12 meses (mesma combinação do STEMI).',
      'Tempo de internação: 2-4 dias.',
      'Cateterismo invasivo: ≤ 24h se alto risco (GRACE ≥ 140) · ≤ 72h se risco intermediário.',
      'Reavaliação: ECG seriado + troponina conforme o algoritmo do kit.',
    ],
  },
  'zona-cinzenta': {
    classe: 'info', tag: 'Zona cinzenta', titulo: 'Observação 24h · diagnóstico em construção',
    linhas: [
      'Destino: observação clínica monitorizada por 24h.',
      'ECG seriado a cada 10-20 min e troponina seriada conforme o kit.',
      'Eco à beira-leito se disponível.',
      'Reclassificar assim que houver dado novo (supra, rule-in ou rule-out claro).',
    ],
  },
};

// ============================================================
// HISTÓRICO · status + filtros (regra Rafael · ≥ 2 categorias)
// ============================================================
export function statusCaso(tipoIam) {
  return tipoIam === 'zona-cinzenta' || tipoIam == null ? 'Observação' : 'Internado';
}

export const HISTORICO_FILTROS = [
  { value: 'todas', label: 'Todos' },
  { value: 'Internado', label: 'Internado' },
  { value: 'Observação', label: 'Observação' },
];

// Texto de passe estruturado (golden copyHandoff).
export function montarPasse({ iniciais, idade, peso, ecgClasse, territorio, escoreTipo, escoreTotal, trop, condutaTitulo, saa, pde5 }) {
  const ecgTxt = ecgClasse === 'stemi' ? 'STEMI' : ecgClasse === 'omi' ? 'OMI' : ecgClasse === 'preocupante' ? 'preocupante' : '—';
  return [
    `SCA/IAM — ${iniciais || '-'}, ${idade || '-'}a, ${peso || '-'}kg.`,
    `ECG: ${ecgTxt}${territorio ? ` (${territorio})` : ''}.`,
    escoreTipo ? `${escoreTipo.toUpperCase()} ${escoreTotal}.` : null,
    trop?.texto ? `Troponina: ${trop.texto}.` : null,
    condutaTitulo ? `Conduta: ${condutaTitulo}.` : null,
    `Locks: AAS ${saa ? 'bloqueado por SAA' : 'liberado'}, nitrato ${pde5 ? 'bloqueado por PDE5' : 'considerar'}.`,
  ].filter(Boolean).join(' ');
}

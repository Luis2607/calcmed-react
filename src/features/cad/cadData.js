/* ============================================================
   CAD · DADOS CLÍNICOS + cálculos puros
   Porte 1:1 do golden calcmed/src/protocolos/cad/cad.js + pediatrico.js
   Fontes: SBD 2025, UpToDate, ISPAD (pediátrico), cérebro cetoacidose/.
   NUNCA aproximar — paridade clínica obrigatória.
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

export function formatHora(ts) {
  const d = new Date(ts);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
}

// Número PT-BR (vírgula decimal). Golden faz toFixed(1).replace('.', ',').
export function fmtNum(n, dec = 1) {
  if (n == null || isNaN(n)) return '-';
  return Number(n).toFixed(dec).replace('.', ',');
}

// Duração legível "Xh YYmin" / "Y min" a partir de ms.
export function fmtDuracao(ms) {
  const safe = Math.max(0, ms || 0);
  const h = Math.floor(safe / 3600000);
  const m = Math.floor((safe % 3600000) / 60000);
  return h > 0 ? `${h}h ${pad2(m)}min` : `${m} min`;
}

// Cronômetro mestre M:SS / H:MM (golden atualizarHeader).
export function fmtCronometro(ms) {
  const safe = Math.max(0, ms || 0);
  const h = Math.floor(safe / 3600000);
  const m = Math.floor((safe % 3600000) / 60000);
  const s = Math.floor((safe % 60000) / 1000);
  return h > 0 ? `${h}h${pad2(m)}` : `${pad2(m)}:${pad2(s)}`;
}

// MM:SS de um contador em segundos (cronômetro de reavaliação).
export function fmtMMSS(totalSec) {
  const safe = Math.max(0, totalSec || 0);
  return `${pad2(Math.floor(safe / 60))}:${pad2(safe % 60)}`;
}

// HH:MM:SS (aguardo KCl 2h).
export function fmtHMS(totalSec) {
  const safe = Math.max(0, totalSec || 0);
  const h = Math.floor(safe / 3600);
  const m = Math.floor((safe % 3600) / 60);
  const s = safe % 60;
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

// ============================================================
// MODO POR IDADE (D22)
// ============================================================
export function inferirModo(idade) {
  if (idade == null || isNaN(idade)) return null;
  if (idade < 5) return 'pediatrico-extra';
  if (idade < 18) return 'pediatrico';
  return 'adulto';
}

export function labelModo(modo) {
  if (modo === 'pediatrico-extra') return 'Pediátrico < 5a';
  if (modo === 'pediatrico') return 'Pediátrico';
  if (modo === 'adulto') return 'Adulto';
  return '';
}

export function isPediatrico(modo) {
  return modo === 'pediatrico' || modo === 'pediatrico-extra';
}

export function isCriticoPediatrico(modo) {
  return modo === 'pediatrico-extra';
}

// ============================================================
// SANITY RANGES (hard reject implausível · golden SANITY)
// ============================================================
export const SANITY = {
  glicemia: { min: 10, max: 2000 },
  ph: { min: 6.8, max: 7.8 },
  bohb: { min: 0, max: 15 },
  sodio: { min: 100, max: 180 },
};

export function dentroSanity(campo, v) {
  if (v == null || isNaN(v)) return true;
  return v >= SANITY[campo].min && v <= SANITY[campo].max;
}

export const IDADE_MAX = 120;
export const PESO_MAX = 300;

// ============================================================
// T1 · CRITÉRIOS DIAGNÓSTICOS
// 2 de 3 fecham (glicemia > 200 · acidose · cetose).
// ============================================================
export function contarCriterios({ glicemia, acidoseConfirmada, cetoseConfirmada }) {
  const g = parseNum(glicemia);
  let n = 0;
  if (!isNaN(g) && g > 200 && dentroSanity('glicemia', g)) n += 1;
  if (acidoseConfirmada) n += 1;
  if (cetoseConfirmada) n += 1;
  return n;
}

export function diagnosticoConfirmado({ idade, peso, glicemia, acidoseConfirmada, cetoseConfirmada }) {
  const i = parseNum(idade);
  const p = parseNum(peso);
  const g = parseNum(glicemia);
  const temIdade = !isNaN(i) && i > 0 && i <= IDADE_MAX;
  const temPeso = !isNaN(p) && p > 0 && p <= PESO_MAX;
  // todosSanity (golden validarTela1): valor implausível bloqueia o avanço.
  const glicemiaSane = isNaN(g) || dentroSanity('glicemia', g);
  return temIdade && temPeso && glicemiaSane && contarCriterios({ glicemia, acidoseConfirmada, cetoseConfirmada }) >= 2;
}

// Manejo inicial · ramo dinâmico por HGT (golden atualizarSoroInicial).
export function soroInicial(glicemia) {
  const hgt = parseNum(glicemia);
  if (!isNaN(hgt) && hgt < 250) {
    return {
      titulo: 'SG 5% 1 L + NaCl 20% 40 mL EV',
      detalhe: 'HGT abaixo de 250 mg/dL · evita hipoglicemia durante a insulina.',
    };
  }
  return {
    titulo: 'SF 0,9% · 15 a 20 mL/kg EV',
    detalhe: `Volume entre 1 e 1,5 L na 1ª hora${!isNaN(hgt) ? ` · HGT ${hgt} mg/dL` : ''}.`,
  };
}

// ============================================================
// T2 · SÓDIO CORRIGIDO + GATE K
// ============================================================
// Sódio corrigido · fator 1,6 padrão · 2,4 se glicemia ≥ 400 (SBD 2025/UpToDate).
export function sodioCorrigido(sodio, glicemia) {
  const na = parseNum(sodio);
  const g = parseNum(glicemia);
  if (isNaN(na)) return null;
  const fator = !isNaN(g) && g >= 400 ? 2.4 : 1.6;
  const naCorr = na + (!isNaN(g) ? fator * ((g - 100) / 100) : 0);
  let conduta;
  if (naCorr < 135) conduta = 'Mantenha NaCl 0,9%.';
  else if (naCorr < 150) conduta = 'Troque para NaCl 0,45%.';
  else conduta = 'Use NaCl 0,45% e monitore.';
  return { valor: naCorr, valorFmt: naCorr.toFixed(1), conduta };
}

// Faixas de potássio (golden modal relancar-k · 4 faixas).
export const POTASSIO_OPCOES = [
  { value: 'baixo', label: '< 3,5 mEq/L', description: 'NÃO INICIE INSULINA · repor KCl 10-20 mEq/h', critico: true },
  { value: 'normal', label: '3,5 a 5 mEq/L', description: 'Faixa segura · adicione 20-40 mEq KCl por litro de soro' },
  { value: 'alto', label: '5 a 6,5 mEq/L', description: 'Liberado · monitore K seriado' },
  { value: 'muito-alto', label: '> 6,5 mEq/L', description: 'Não reponha K · monitore · trate hipercalemia se ECG alterado' },
];

export function labelPotassio(value) {
  const o = POTASSIO_OPCOES.find((x) => x.value === value);
  return o ? o.label : '';
}

// Gate K · só 'baixo' bloqueia insulina (golden avaliarGateK).
export function gateK(potassio) {
  if (potassio === 'baixo') {
    return {
      bloqueado: true,
      titulo: 'NÃO INICIE INSULINA',
      corpo: 'O potássio sérico está abaixo de 3,5 mEq/L. Iniciar insulina agora pode causar hipocalemia grave e arritmias fatais. Inicie a reposição de KCl.',
      helper: 'Bloqueio de segurança: potássio abaixo de 3,5 mEq/L.',
    };
  }
  if (potassio) {
    return {
      bloqueado: false,
      titulo: 'Potássio Seguro',
      corpo: 'Potássio sérico na faixa segura. Liberado para iniciar a infusão de insulina.',
      helper: 'Potássio dentro da faixa segura para iniciar insulina.',
    };
  }
  return { bloqueado: false, titulo: null, corpo: null, helper: 'Escolha a faixa para liberar a insulina.' };
}

export const AGUARDO_K_SEGUNDOS = 2 * 60 * 60; // 2h de reposição KCl

// ============================================================
// T3 · INSULINA IV
// ============================================================
// Dose padrão 0,1 UI/kg/h (golden preencherTela3).
export function doseInsulina(peso) {
  const p = parseNum(peso);
  if (isNaN(p) || p <= 0) return null;
  return (p * 0.1).toFixed(1);
}

// Meta de glicemia pediátrica na T3 (golden ajustarDoseT3Pediatrico).
export function metaGlicemiaPediatrica(modo) {
  if (modo === 'pediatrico-extra') return { min: 150, max: 180 };
  if (modo === 'pediatrico') return { min: 100, max: 150 };
  return null;
}

export const BLOQUEIO_PEDIATRICO_SEGUNDOS = 60 * 60; // 1h pós-fluidos
export const REAVAL_SEGUNDOS = 60 * 60; // loop de reavaliação horária

// ============================================================
// T4 · REAVALIAÇÃO HORÁRIA · recomendação por HGT/delta/K
// Porte 1:1 do golden onReavalHGTInput + acao do modal inserir-medida.
// Retorna { nivel:'critico'|'atencao'|'normal', titulo, corpo,
//           suspendeInsulina, abreResolucao }.
// ============================================================
export function recomendacaoReaval({ hgt, hgtAnterior, velAtual }) {
  const v = parseNum(hgt);
  if (isNaN(v) || v < 20 || v > 2000) return null;
  const vel = parseNum(velAtual);

  if (v < 70) {
    return {
      nivel: 'critico',
      titulo: 'Hipoglicemia grave',
      corpo: 'Suspenda a infusão de insulina agora. Bolus de glicose 50% 30-50 mL IV e reavalie em 15 minutos.',
      suspendeInsulina: true,
      abreResolucao: false,
    };
  }
  if (v < 100) {
    return {
      nivel: 'critico',
      titulo: 'Hipoglicemia',
      corpo: 'Suspenda a insulina. Adicione soro glicosado 10% e reavalie em 30 minutos.',
      suspendeInsulina: true,
      abreResolucao: false,
    };
  }
  if (v < 200) {
    return {
      nivel: 'normal',
      titulo: 'Critério de resolução atingido',
      corpo: 'Glicemia abaixo de 200. Confirme HCO₃ e ânion gap para fechar o protocolo. Considere reduzir insulina para 0,02-0,05 U/kg/h e adicionar soro glicosado.',
      suspendeInsulina: false,
      abreResolucao: true,
    };
  }
  if (v < 250) {
    const novaVel = !isNaN(vel) ? `${fmtNum(Math.max(vel * 0.5, 1))} U/h` : '0,05 U/kg/h';
    return {
      nivel: 'atencao',
      titulo: 'HGT em descida · ajustar conduta',
      corpo: `Adicione soro glicosado e reduza insulina para ${novaVel}.`,
      suspendeInsulina: false,
      abreResolucao: false,
    };
  }

  // HGT ≥ 250 · usa delta da medida anterior, se houver
  const ant = parseNum(hgtAnterior);
  if (!isNaN(ant)) {
    const delta = ant - v;
    if (delta < 0) {
      return {
        nivel: 'critico',
        titulo: `HGT subiu · de ${ant} para ${v}`,
        corpo: 'Considere revisar diluição e acesso. Combine com a enfermagem e considere aumentar a dose após checagens.',
        suspendeInsulina: false,
        abreResolucao: false,
      };
    }
    if (delta < 50) {
      const sugerida = !isNaN(vel) ? fmtNum(vel * 1.3) : '-';
      return {
        nivel: 'atencao',
        titulo: `Queda lenta · ${delta} mg/dL em 1h`,
        corpo: `Aumente insulina para ${sugerida} U/h. Revise acesso e diluição da bomba.`,
        suspendeInsulina: false,
        abreResolucao: false,
      };
    }
    if (delta > 100) {
      const sugerida = !isNaN(vel) ? fmtNum(vel * 0.7) : '-';
      return {
        nivel: 'atencao',
        titulo: `Queda rápida · ${delta} mg/dL em 1h`,
        corpo: `Risco de queda muito rápida. Considere reduzir insulina para ${sugerida} U/h.`,
        suspendeInsulina: false,
        abreResolucao: false,
      };
    }
    return {
      nivel: 'normal',
      titulo: `Queda de ${delta} mg/dL em 1h · manter conduta`,
      corpo: 'Resposta dentro do alvo (50-100 mg/dL por hora). Manter insulina e reavaliar na próxima hora.',
      suspendeInsulina: false,
      abreResolucao: false,
    };
  }

  return {
    nivel: 'normal',
    titulo: `HGT ${v} mg/dL`,
    corpo: 'Manter conduta. Próxima reavaliação em 1 hora.',
    suspendeInsulina: false,
    abreResolucao: false,
  };
}

// K reavaliado < 3,5 suspende insulina (golden onReavalKInput).
export function recomendacaoKReaval(k) {
  const kv = parseNum(k);
  if (isNaN(kv) || kv >= 3.5) return null;
  return {
    nivel: 'critico',
    titulo: `K ${fmtNum(kv)} mEq/L · interromper insulina`,
    corpo: 'Ao salvar, a infusão de insulina será suspensa e o CalcMed leva você para reposição de KCl.',
  };
}

export const HGT_REAVAL_MIN = 20;
export const HGT_REAVAL_MAX = 2000;

// ============================================================
// ÂNION GAP
// ============================================================
export function anionGap(na, cl, hco3) {
  const n = parseNum(na);
  const c = parseNum(cl);
  const h = parseNum(hco3);
  if (isNaN(n) || isNaN(c) || isNaN(h)) return null;
  return n - (c + h);
}

export function avaliarAG(ag) {
  if (ag == null) return { texto: 'Critério de resolução: AG < 12 mEq/L.', atende: false };
  if (ag < 12) return { texto: 'Critério de resolução atendido (AG < 12 mEq/L).', atende: true };
  return { texto: 'Ainda acima do alvo (AG < 12 mEq/L para fechar resolução).', atende: false };
}

// ============================================================
// T5 · CRITÉRIOS DE RESOLUÇÃO
// Auto-avaliados das últimas medidas da T4 (golden preencherTela5).
// HGT < 200 · (HCO₃ ≥ 18 ou pH ≥ 7,30) · AG < 12.
// ============================================================
function ultimaComCampo(medidas, campo) {
  return (medidas || []).filter((m) => m[campo] != null).slice(-1)[0] || null;
}

export function avaliarResolucao(medidas) {
  const ultHgt = ultimaComCampo(medidas, 'hgt');
  const ultPh = ultimaComCampo(medidas, 'ph');
  const ultHco3 = ultimaComCampo(medidas, 'hco3');
  const ultAg = ultimaComCampo(medidas, 'ag');

  const hgtAtende = !!ultHgt && ultHgt.hgt < 200;
  const hco3Atende = (!!ultHco3 && ultHco3.hco3 >= 18) || (!!ultPh && ultPh.ph >= 7.3);
  const agAtende = !!ultAg && ultAg.ag < 12;

  return {
    hgt: { atende: hgtAtende, ult: ultHgt },
    hco3: { atende: hco3Atende, ultHco3, ultPh },
    ag: { atende: agAtende, ult: ultAg },
    todos: hgtAtende && hco3Atende && agAtende,
  };
}

export function subtituloResolucaoHgt(ult) {
  if (!ult) return 'Sem leitura ainda. Lance um HGT na reavaliação.';
  return ult.hgt < 200
    ? `Última leitura: ${ult.hgt} mg/dL. Critério atendido.`
    : `Última leitura: ${ult.hgt} mg/dL. Aguardando ficar abaixo de 200.`;
}

export function subtituloResolucaoHco3(ultHco3, ultPh) {
  const partes = [];
  if (ultHco3) partes.push(`HCO₃ ${ultHco3.hco3} mEq/L`);
  if (ultPh) partes.push(`pH ${ultPh.ph}`);
  if (!partes.length) return 'Sem gasometria ainda. Lance na próxima reavaliação.';
  const atende = (ultHco3 && ultHco3.hco3 >= 18) || (ultPh && ultPh.ph >= 7.3);
  return atende
    ? `Última gasometria: ${partes.join(' · ')}. Critério atendido.`
    : `Última gasometria: ${partes.join(' · ')}. Ainda não atende.`;
}

export function subtituloResolucaoAg(ult) {
  if (!ult) return 'Sem cálculo ainda. Toque para calcular o ânion gap.';
  return ult.ag < 12
    ? `Calculado: AG ${ult.ag.toFixed(0)} mEq/L. Critério atendido.`
    : `Calculado: AG ${ult.ag.toFixed(0)} mEq/L. Ainda acima do alvo.`;
}

// ============================================================
// PEDIÁTRICO · EDEMA CEREBRAL (ISPAD · golden pediatrico.js)
// ============================================================
export const EDEMA_DIAGNOSTICOS = [
  { key: 'motor', label: 'Resposta motora ou verbal anormal' },
  { key: 'postura', label: 'Postura de decorticação ou descerebração' },
  { key: 'pupilas', label: 'Pupilas anormais (paralisia de III, IV ou VI)' },
];

export const EDEMA_MAIORES = [
  { key: 'consciencia', label: 'Alteração da consciência (Glasgow caindo)' },
  { key: 'bradicardia', label: 'Bradicardia > 20 bpm sem causa' },
  { key: 'incontinencia', label: 'Incontinência inapropriada para a idade' },
];

export const EDEMA_MENORES = [
  { key: 'cefaleia', label: 'Cefaleia que piora ou persiste' },
  { key: 'vomitos', label: 'Vômitos persistentes durante o tratamento' },
  { key: 'letargia', label: 'Letargia ou irritabilidade' },
  { key: 'pad', label: 'PA diastólica > 90 mmHg' },
];

// Gatilho de tratamento (golden avaliarEdema).
export function avaliarEdema(marcados, critico) {
  const diag = EDEMA_DIAGNOSTICOS.filter((c) => marcados.includes(c.key)).length;
  const maior = EDEMA_MAIORES.filter((c) => marcados.includes(c.key)).length;
  const menor = EDEMA_MENORES.filter((c) => marcados.includes(c.key)).length;
  return (
    diag >= 1 ||
    maior >= 2 ||
    (maior >= 1 && menor >= 2) ||
    (critico && maior >= 1 && menor >= 1)
  );
}

// ============================================================
// HISTÓRICO · descrição curta do caso
// ============================================================
export function metaCaso(caso) {
  return labelModo(caso.modo);
}

/**
 * pcrData.js — constantes clínicas e fórmulas puras PCR.
 *
 * ⚠️ PARIDADE EXATA com golden pcr.js (ACLS/AHA 2025). Validado clinicamente
 *    por Gustavo. NUNCA aproximar dose, energia, ciclo, peso predito.
 *
 * Mudanças pós-captura (pcr-comentarios-2026-05-28-pm.md):
 *  - B4/B7: removido auto-cicle 15s buffer (timers só resetam por ação).
 *  - B6: janela adrenalina EXATA no tempo (não [m-1, m+1]).
 */

// ============================================================
// CONSTANTES
// ============================================================
export const STORAGE_KEY_ATUAL = 'pcr_protocolo_atual';
export const STORAGE_KEY_HISTORICO = 'pcr_historico';
export const CICLO_MS = 2 * 60 * 1000; // 2 minutos exatos
export const ANTI_DOUBLE_TAP_ADREN_MS = 30 * 1000; // 30s

// ============================================================
// RITMOS
// ============================================================
export const RITMOS = [
  { value: 'fv', label: 'FV', longLabel: 'Fibrilação Ventricular', categoria: 'chocavel' },
  { value: 'tv', label: 'TV s.p', longLabel: 'TV sem pulso', categoria: 'chocavel' },
  { value: 'aesp', label: 'AESP', longLabel: 'Atividade Elétrica Sem Pulso', categoria: 'nao-chocavel' },
  { value: 'assistolia', label: 'Assistolia', longLabel: 'Assistolia', categoria: 'nao-chocavel' },
  { value: 'na', label: 'NA', longLabel: 'Não avaliado', categoria: 'na' },
];

export function isChocavel(ritmo) {
  return ritmo === 'fv' || ritmo === 'tv';
}

export function isNaoChocavel(ritmo) {
  return ritmo === 'aesp' || ritmo === 'assistolia';
}

export function getRitmoLabel(ritmo) {
  return RITMOS.find((r) => r.value === ritmo)?.label || 'Não avaliado';
}

export function getRitmoLongLabel(ritmo) {
  return RITMOS.find((r) => r.value === ritmo)?.longLabel || 'Não avaliado';
}

// ============================================================
// DESFECHOS
// ============================================================
export const DESFECHOS = [
  { value: 'revertida', label: 'Revertida' },
  { value: 'nao-revertida', label: 'Não revertida' },
  { value: 'obito', label: 'Óbito' },
  { value: 'suspensa', label: 'Suspensa' },
];

export function getDesfechoLabel(value) {
  return DESFECHOS.find((d) => d.value === value)?.label || value;
}

// ============================================================
// BPM (cadência compressões)
// ============================================================
export const BPM_OPCOES = [100, 110, 120]; // T2 inline (3 opções)
export const BPM_OPCOES_MODAL = [100, 105, 110, 120]; // modal metronomo (4 opções)

// ============================================================
// INTERVALOS ADRENALINA (D35 Onda 2.5)
// ============================================================
export const INTERVALO_ADREN_OPCOES = [3, 4, 5]; // minutos

// ============================================================
// ⚠️ B6 (Gustavo) · Janela adrenalina EXATA no tempo (mudança pós-captura)
// Antes (golden): [m-1, m+1]. Agora: [m, m+1].
// Tolerância overdue: 1 min após m.
// ============================================================
export function getAdrenalinaJanela(intervaloMin) {
  const m = intervaloMin || 3;
  return {
    inicioMs: m * 60 * 1000, // EXATO no tempo selecionado
    fimMs: (m + 1) * 60 * 1000, // overdue após +1 min de tolerância
    labelInicio: `${m} min`,
    labelFim: `${m + 1} min`,
  };
}

// ============================================================
// CÁLCULOS PEDIÁTRICOS (paridade ⚠️ exata com golden pcr.js)
// ============================================================

/** Doses pediátricas conforme peso. NUNCA aproximar arredondamento. */
export function calcDosesPediatricas(peso) {
  if (!peso || isNaN(peso)) return null;
  return {
    adrenaMg: (peso * 0.01).toFixed(2), // string com 2 decimais
    amioMg: Math.round(peso * 5),
    lidoMg: peso, // 1 mg/kg = peso mg
  };
}

/** Cargas pediátricas (2/4/10 J/kg). */
export function calcCargasPediatricas(peso) {
  if (!peso || isNaN(peso)) return null;
  return {
    primeiro: Math.round(peso * 2),
    segundo: Math.round(peso * 4),
    maximo: Math.round(peso * 10),
  };
}

/** Lidocaína adulto · max 3 mg/kg total. */
export function calcLidocainaAdulto(peso) {
  if (!peso || isNaN(peso)) return null;
  return {
    d1: Math.round(peso * 1),
    d2: Math.round(peso * 1.5),
    dmax: Math.round(peso * 3),
  };
}

/** Peso predito ARDSnet (Devine) — VCV adulto. */
export function calcPesoPreditoARDSnet(altura, sexo) {
  if (!altura || isNaN(altura)) return null;
  const isFem = sexo === 'fem' || sexo === 'f';
  const base = isFem ? 45.5 : 50;
  return Math.round(base + 0.91 * (altura - 152.4));
}

/** TET profundidade — 3 fórmulas pediátricas. */
export function calcTETProfundidade({ diametro, altura, peso }) {
  return {
    porTubo: diametro ? (diametro * 3).toFixed(1) : null,
    porAltura: altura ? (altura / 10 + 5).toFixed(1) : null,
    porPeso: peso ? (6 + peso).toFixed(0) : null,
  };
}

/** Carga de desfibrilação · adulto vs pediátrico. */
export function getCargaInicial(idade, peso) {
  if (idade != null && idade < 18 && peso) {
    const cargas = calcCargasPediatricas(peso);
    return cargas ? `${cargas.primeiro} J · 2 J/kg` : '2-4 J/kg';
  }
  return '200 J · bifásico';
}

/** Dose adrenalina exibida · adulto vs pediátrico. */
export function getDoseAdrenalina(idade, peso) {
  if (idade != null && idade < 18 && peso) {
    const doses = calcDosesPediatricas(peso);
    return doses ? `${doses.adrenaMg} mg IV/IO` : '0,01 mg/kg IV/IO';
  }
  return '1 mg IV/IO';
}

// ============================================================
// TABELA VENT_PEDIATRIA (golden pcr.js linha 728-735)
// ============================================================
export const VENT_PEDIATRIA = {
  'pre-termo': { label: 'Neonatos Pré-termo', vc: '4-6 mL/kg', fr: '40-60 irpm', peep: '5-6 cmH₂O', pico: '15-20 cmH₂O', ie: '1:2' },
  'termo': { label: 'Neonatos a Termo', vc: '4-6 mL/kg', fr: '30-40 irpm', peep: '5 cmH₂O', pico: '15-20 cmH₂O', ie: '1:2' },
  'lactente': { label: 'Lactente (1-12 meses)', vc: '5-7 mL/kg', fr: '25-30 irpm', peep: '5 cmH₂O', pico: '15-20 cmH₂O', ie: '1:2' },
  'pre-escolar': { label: 'Pré-escolar (1-5 anos)', vc: '6-8 mL/kg', fr: '20-25 irpm', peep: '5 cmH₂O', pico: '18-22 cmH₂O', ie: '1:2' },
  'escolar': { label: 'Escolar (6-11 anos)', vc: '6-8 mL/kg', fr: '18-22 irpm', peep: '5 cmH₂O', pico: '18-22 cmH₂O', ie: '1:2' },
  'adolescente': { label: 'Adolescente (12-18 anos)', vc: '6-8 mL/kg', fr: '12-16 irpm', peep: '5 cmH₂O', pico: '20-25 cmH₂O', ie: '1:2' },
};

// ============================================================
// PARSE/FORMAT helpers
// ============================================================
export function parseNumber(v) {
  if (v == null || v === '') return NaN;
  return Number(String(v).replace(',', '.'));
}

export function formatHora(ts) {
  if (!ts) return '00:00:00';
  const d = new Date(ts);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`;
}

export function formatDuracao(ms) {
  if (!ms || ms < 0) return '00:00';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  if (h > 0) return `${h}h${String(m).padStart(2, '0')}`;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function formatOffset(ts, tStart) {
  if (!tStart || !ts) return formatHora(ts);
  const diffMin = Math.floor((ts - tStart) / 60000);
  if (diffMin < 60) return `T+${diffMin}min`;
  return `T+${Math.floor(diffMin / 60)}h${String(diffMin % 60).padStart(2, '0')}`;
}

/**
 * Schema canônico do ESCORE — espelha o contrato REAL do banco do Gui (scores-v2.json).
 *
 * ATENÇÃO — typos load-bearing (manter EXATAMENTE como o backend espera):
 *   - `aditionalTexts`  (sem o 2º "d")
 *   - `biggerThen`      (limiar inferior; o app mostra a faixa quando score >= valor)
 *
 * Forma:
 *   ScoresCollection = { [id]: Score }    // map por UUID, NÃO array
 *   Score {
 *     id, name, description, category (UUID | ""),
 *     aditionalTexts?: [{ id, title, description }],
 *     questions: [{ id, name, type: "single-choice"|"multiple-choice",
 *                   options: [{ id, name, points:number }] }],   // points pode ser negativo/zero
 *     result?: { meaningTitle, variations: [{ id, biggerThen:number, title, meaning }] }
 *   }
 *
 * Este módulo é JS puro (zero React) p/ portar 1:1 pra classes Dart depois.
 */

export const QUESTION_TYPES = {
  single: 'single-choice',
  multiple: 'multiple-choice',
};

/** Gera UUID v4 (nativo do browser em contexto seguro/localhost). */
export const uuid = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  // Fallback simples (não-cripto) — só p/ ambientes sem crypto.randomUUID.
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.floor(performance.now() * 1000) + Math.floor(Math.random() * 16)) % 16;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/** Formata pontos p/ exibição: 1 -> "+1", 0 -> "0", -5 -> "-5". */
export const formatPoints = (p) => {
  const n = Number(p);
  if (!Number.isFinite(n)) return String(p);
  return n > 0 ? `+${n}` : `${n}`;
};

/** Escore vazio p/ "Adicionar Escore" (já com 1 pergunta e 1 opção de partida). */
export const emptyScore = () => ({
  id: uuid(),
  name: '',
  description: '',
  category: '',
  aditionalTexts: [],
  questions: [
    {
      id: uuid(),
      name: '',
      type: QUESTION_TYPES.single,
      options: [{ id: uuid(), name: '', points: 0 }],
    },
  ],
  result: { meaningTitle: 'Resultado', variations: [] },
});

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

/**
 * Normaliza um objeto cru (de JSON.parse) p/ a forma canônica:
 * garante ids, coage pontos/limiares pra número, garante arrays. Preserva os typos.
 * NÃO inventa dados — só preenche estrutura faltante.
 */
export const normalizeScore = (raw, fallbackId) => {
  const r = raw && typeof raw === 'object' ? raw : {};
  const out = {
    id: r.id || fallbackId || uuid(),
    name: typeof r.name === 'string' ? r.name : '',
    description: typeof r.description === 'string' ? r.description : '',
    category: typeof r.category === 'string' ? r.category : '',
    aditionalTexts: Array.isArray(r.aditionalTexts)
      ? r.aditionalTexts.map((t) => ({
          id: t?.id || uuid(),
          title: typeof t?.title === 'string' ? t.title : '',
          description: typeof t?.description === 'string' ? t.description : '',
        }))
      : [],
    questions: Array.isArray(r.questions)
      ? r.questions.map((q) => ({
          id: q?.id || uuid(),
          name: typeof q?.name === 'string' ? q.name : '',
          type: q?.type === QUESTION_TYPES.multiple ? QUESTION_TYPES.multiple : QUESTION_TYPES.single,
          options: Array.isArray(q?.options)
            ? q.options.map((o) => ({
                id: o?.id || uuid(),
                name: typeof o?.name === 'string' ? o.name : '',
                points: num(o?.points),
              }))
            : [],
        }))
      : [],
  };
  if (r.result && typeof r.result === 'object') {
    out.result = {
      meaningTitle: typeof r.result.meaningTitle === 'string' ? r.result.meaningTitle : 'Resultado',
      variations: Array.isArray(r.result.variations)
        ? r.result.variations.map((v) => ({
            id: v?.id || uuid(),
            biggerThen: num(v?.biggerThen),
            title: typeof v?.title === 'string' ? v.title : '',
            meaning: typeof v?.meaning === 'string' ? v.meaning : '',
          }))
        : [],
    };
  }
  return out;
};

const looksLikeTest = (name) => /^\s*teste?\s*$/i.test(name || '');

/**
 * Valida um objeto cru (antes de normalizar, p/ pegar pontos não-numéricos).
 * Retorna { errors:[], warnings:[] }. errors bloqueiam salvar; warnings só sinalizam.
 */
export const validateScore = (raw) => {
  const errors = [];
  const warnings = [];
  const s = raw && typeof raw === 'object' ? raw : {};

  if (!s.name || !String(s.name).trim()) errors.push('O escore precisa de um nome.');

  const questions = Array.isArray(s.questions) ? s.questions : [];
  if (questions.length === 0) errors.push('Adicione ao menos uma pergunta.');

  questions.forEach((q, qi) => {
    const qLabel = q?.name?.trim() ? `"${q.name.trim()}"` : `#${qi + 1}`;
    const options = Array.isArray(q?.options) ? q.options : [];
    if (options.length === 0) {
      errors.push(`A pergunta ${qLabel} precisa de ao menos uma opção.`);
    }
    if (q?.type && q.type !== QUESTION_TYPES.single && q.type !== QUESTION_TYPES.multiple) {
      warnings.push(`Tipo "${q.type}" desconhecido na pergunta ${qLabel} (esperado single-choice ou multiple-choice).`);
    }
    const seen = new Set();
    options.forEach((o, oi) => {
      if (!Number.isFinite(Number(o?.points))) {
        errors.push(`Pontos inválidos na opção #${oi + 1} da pergunta ${qLabel} (use um número).`);
      }
      const key = (o?.name || '').trim().toLowerCase();
      if (key && seen.has(key)) warnings.push(`Opção duplicada "${o.name}" na pergunta ${qLabel}.`);
      seen.add(key);
    });
  });

  if (!s.category) warnings.push('Sem categoria — selecione uma antes de publicar.');
  if (!s.result || !Array.isArray(s.result.variations) || s.result.variations.length === 0) {
    warnings.push('Sem faixas de resultado (campo "result").');
  }
  if (looksLikeTest(s.name)) warnings.push('Esse nome parece um escore de teste.');

  return { errors, warnings };
};

export const isValid = (raw) => validateScore(raw).errors.length === 0;

/**
 * Interpreta texto colado/arquivo. Auto-detecta a forma:
 *  - { questions, name } no topo            -> { kind:'single', scores:[normalized] }
 *  - { uuid: {questions...}, ... }          -> { kind:'map', scores:[normalized...] }
 *  - inválido                               -> { kind:'error', error }
 */
export const parseImport = (text) => {
  let data;
  try {
    data = JSON.parse(text);
  } catch (e) {
    return { kind: 'error', error: `JSON inválido: ${e.message}` };
  }
  if (!data || typeof data !== 'object') {
    return { kind: 'error', error: 'JSON não reconhecido — esperava um escore ou um conjunto de escores.' };
  }

  // Escore único: tem "questions" no topo.
  if (Array.isArray(data.questions) || typeof data.name === 'string') {
    const norm = normalizeScore(data);
    return { kind: 'single', scores: [norm], reports: [{ score: norm, ...validateScore(data) }] };
  }

  // Map por UUID: valores que parecem escores.
  const entries = Object.entries(data).filter(
    ([, v]) => v && typeof v === 'object' && (Array.isArray(v.questions) || typeof v.name === 'string'),
  );
  if (entries.length === 0) {
    return { kind: 'error', error: 'JSON não reconhecido — esperava um escore ou um mapa de escores por UUID.' };
  }
  const scores = entries.map(([id, v]) => normalizeScore(v, id));
  const reports = entries.map(([id, v], i) => ({ score: scores[i], ...validateScore(v) }));
  return { kind: 'map', scores, reports };
};

/** Serializa 1 escore (indent 2) — sai com os typos preservados. */
export const serializeScore = (score) => JSON.stringify(score, null, 2);

/** Serializa o mapa completo { [id]: Score } p/ reimportar no backend. */
export const serializeMap = (list) => {
  const map = {};
  list.forEach((s) => {
    map[s.id] = s;
  });
  return JSON.stringify(map, null, 2);
};

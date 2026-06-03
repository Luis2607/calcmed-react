import { useSyncExternalStore } from 'react';
import { normalizeScore, uuid } from './scoreSchema';
import { SAMPLE_SCORES } from './sampleScores';

/**
 * Store do admin de escores. Estado = lista de escores (ordem de exibição).
 * Persiste no localStorage como MAP { [id]: Score } (mesma forma do backend),
 * pra reload não perder trabalho. Equivalente Flutter: ChangeNotifier + arquivo.
 */
const STORAGE_KEY = 'calcmed_admin_scores_v1';

const listeners = new Set();
let state = load();

function load() {
  try {
    const raw = typeof localStorage !== 'undefined' && localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const map = JSON.parse(raw);
      return Object.entries(map).map(([id, v]) => normalizeScore(v, id));
    }
  } catch {
    /* cai no seed */
  }
  return SAMPLE_SCORES.map((s) => normalizeScore(s));
}

function persist() {
  try {
    const map = {};
    state.forEach((s) => {
      map[s.id] = s;
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* sem persistência (modo privado etc.) — segue em memória */
  }
}

function emit() {
  persist();
  listeners.forEach((l) => l());
}

/** Clona um escore com ids novos em todos os níveis (cópia independente). */
function cloneWithNewIds(score) {
  return {
    ...score,
    id: uuid(),
    aditionalTexts: (score.aditionalTexts || []).map((t) => ({ ...t, id: uuid() })),
    questions: (score.questions || []).map((q) => ({
      ...q,
      id: uuid(),
      options: (q.options || []).map((o) => ({ ...o, id: uuid() })),
    })),
    result: score.result
      ? {
          ...score.result,
          variations: (score.result.variations || []).map((v) => ({ ...v, id: uuid() })),
        }
      : undefined,
  };
}

export const scoresStore = {
  subscribe(l) {
    listeners.add(l);
    return () => listeners.delete(l);
  },
  getSnapshot() {
    return state;
  },
  list() {
    return state;
  },
  getById(id) {
    return state.find((s) => s.id === id);
  },
  /** Insere (no topo) ou atualiza in-place pelo id. Retorna o escore normalizado. */
  upsert(score) {
    const norm = normalizeScore(score);
    const i = state.findIndex((s) => s.id === norm.id);
    state = i >= 0 ? state.map((s, idx) => (idx === i ? norm : s)) : [norm, ...state];
    emit();
    return norm;
  },
  remove(id) {
    state = state.filter((s) => s.id !== id);
    emit();
  },
  duplicate(id) {
    const orig = state.find((s) => s.id === id);
    if (!orig) return null;
    const copy = normalizeScore(cloneWithNewIds({ ...orig, name: `${orig.name} (cópia)` }));
    state = [copy, ...state];
    emit();
    return copy;
  },
  /** Importa em massa. merge (default) faz upsert por id; replace troca tudo. */
  importScores(scores, { replace = false } = {}) {
    const incoming = scores.map((s) => normalizeScore(s));
    if (replace) {
      state = incoming;
    } else {
      const byId = new Map(state.map((s) => [s.id, s]));
      incoming.forEach((s) => byId.set(s.id, s));
      state = Array.from(byId.values());
    }
    emit();
    return incoming.length;
  },
  /** Volta ao seed (botão de dev). */
  reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      /* noop */
    }
    state = load();
    emit();
  },
};

/** Hook React — re-renderiza ao mudar o store. */
export const useScores = () =>
  useSyncExternalStore(scoresStore.subscribe, scoresStore.getSnapshot, scoresStore.getSnapshot);
